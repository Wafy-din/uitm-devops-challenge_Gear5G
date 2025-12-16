'use client'

import { useEffect } from 'react'
import { Bell, AlertTriangle, Shield, AlertCircle, X } from 'lucide-react'
import useSecurityStore from '@/stores/securityStore'
import clsx from 'clsx'
import { showToast } from '@/utils/toast'

export default function SecurityAlerts() {
  const { alerts, unreadAlerts, markAlertResolved, fetchAlerts } = useSecurityStore()

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const handleMarkResolved = async (alertId: string) => {
    try {
      await markAlertResolved(alertId)
      showToast.success('Alert marked as resolved')
    } catch (error) {
      showToast.error('Failed to resolve alert')
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case 'medium':
        return <Shield className="w-5 h-5 text-yellow-600" />
      default:
        return <Bell className="w-5 h-5 text-blue-600" />
    }
  }

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-900'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900'
    }
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">All Clear</h3>
        <p className="text-slate-600">No security alerts at this time</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={clsx(
            'p-4 rounded-lg border-2 flex items-start gap-3',
            getSeverityClass(alert.severity),
            alert.resolved && 'opacity-50'
          )}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getSeverityIcon(alert.severity)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-sm mb-1">
                  {alert.type.replace(/_/g, ' ').toUpperCase()}
                </h4>
                <p className="text-sm">{alert.message}</p>
                <p className="text-xs opacity-75 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              
              {!alert.resolved && (
                <button
                  onClick={() => handleMarkResolved(alert.id)}
                  className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
                  title="Mark as resolved"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
