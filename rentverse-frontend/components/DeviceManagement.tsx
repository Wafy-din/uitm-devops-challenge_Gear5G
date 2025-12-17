'use client'

import { useState, useEffect } from 'react'
import { Monitor, Smartphone, Tablet, Shield, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { showToast } from '@/utils/toast'

interface Device {
  id: string
  name: string
  type: 'mobile' | 'desktop' | 'tablet'
  browser: string
  os: string
  lastSeen: string
  trustLevel: 'trusted' | 'unknown' | 'suspicious'
  loginCount: number
  firstSeen: string
  isCurrent: boolean
}

export default function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('/api/security/access-control/devices', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDevices(data.data.devices || [])
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrustDevice = async (deviceId: string) => {
    const toastId = showToast.loading('Trusting device...')
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/security/access-control/devices/${deviceId}/trust`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        showToast.dismiss(toastId)
        showToast.success('Device trusted successfully!')
        fetchDevices()
      } else {
        showToast.dismiss(toastId)
        showToast.error('Failed to trust device')
      }
    } catch (error) {
      console.error('Failed to trust device:', error)
      showToast.dismiss(toastId)
      showToast.error('An error occurred while trusting device')
    }
  }

  const handleRemoveDevice = async (deviceId: string) => {
    if (!confirm('Are you sure you want to remove this device?')) return

    const toastId = showToast.loading('Removing device...')
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/security/access-control/devices/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        showToast.dismiss(toastId)
        showToast.success('Device removed successfully!')
        fetchDevices()
      } else {
        showToast.dismiss(toastId)
        showToast.error('Failed to remove device')
      }
    } catch (error) {
      console.error('Failed to remove device:', error)
      showToast.dismiss(toastId)
      showToast.error('An error occurred while removing device')
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-8 h-8" />
      case 'tablet':
        return <Tablet className="w-8 h-8" />
      default:
        return <Monitor className="w-8 h-8" />
    }
  }

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'trusted':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'suspicious':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-teal-600" />
        <h3 className="text-lg font-semibold text-slate-900">Trusted Devices</h3>
      </div>

      {devices.length === 0 ? (
        <div className="text-center py-8">
          <Monitor className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">No devices found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className={clsx(
                'border-2 rounded-lg p-4',
                device.isCurrent ? 'border-teal-200 bg-teal-50' : 'border-slate-200'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={clsx('p-3 rounded-lg', getTrustLevelColor(device.trustLevel))}>
                    {getDeviceIcon(device.type)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900">{device.name}</h4>
                      {device.isCurrent && (
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                          Current
                        </span>
                      )}
                      <span className={clsx(
                        'px-2 py-1 text-xs font-medium rounded',
                        getTrustLevelColor(device.trustLevel)
                      )}>
                        {device.trustLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {device.browser} • {device.os}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>Last seen: {new Date(device.lastSeen).toLocaleString()}</span>
                      <span>•</span>
                      <span>{device.loginCount} logins</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {device.trustLevel === 'unknown' && !device.isCurrent && (
                    <button
                      onClick={() => handleTrustDevice(device.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Trust this device"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                  {device.trustLevel === 'suspicious' && (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  {!device.isCurrent && (
                    <button
                      onClick={() => handleRemoveDevice(device.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove device"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Security Tip:</strong> Remove any devices you don&apos;t recognize. Trusted devices can access your account without additional verification.
        </p>
      </div>
    </div>
  )
}
