'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Shield, TrendingUp, AlertTriangle, Users, Activity, RefreshCw, Clock, ArrowLeft } from 'lucide-react'
import ContentWrapper from '@/components/ContentWrapper'
import LoginHistoryTable from '@/components/LoginHistoryTable'
import SecurityMetrics from '@/components/SecurityMetrics'
import ErrorBoundary from '@/components/ErrorBoundary'
import useSecurityStore from '@/stores/securityStore'
import clsx from 'clsx'

export default function SecurityLogsPage() {
  const { logs, fetchLogs } = useSecurityStore()
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0)

  const loadLogs = useCallback(async () => {
    setIsLoading(true)
    try {
      await fetchLogs({})
      setLastUpdated(new Date())
    } finally {
      setIsLoading(false)
    }
  }, [fetchLogs])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      loadLogs()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, loadLogs])

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
      setTimeSinceUpdate(seconds)
    }, 1000)

    return () => clearInterval(interval)
  }, [lastUpdated])

  const formatTimeSinceUpdate = () => {
    if (timeSinceUpdate < 60) return `${timeSinceUpdate}s ago`
    const minutes = Math.floor(timeSinceUpdate / 60)
    return `${minutes}m ${timeSinceUpdate % 60}s ago`
  }

  const stats = {
    totalLogs: logs.length,
    successRate: logs.filter(l => l.status === 'success').length / Math.max(logs.length, 1) * 100,
    failedLogins: logs.filter(l => l.action === 'login' && l.status === 'failed').length,
    suspiciousActivity: logs.filter(l => l.status === 'suspicious').length,
    highRiskEvents: logs.filter(l => l.riskLevel === 'high').length,
  }

  return (
    <ContentWrapper>
      <div className="py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Security Logs Dashboard</h1>
            <p className="text-slate-600">Monitor and analyze security events in real-time</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock size={16} />
              <span>Updated {formatTimeSinceUpdate()}</span>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                autoRefresh
                  ? 'bg-teal-100 text-teal-700 border-2 border-teal-300'
                  : 'bg-slate-100 text-slate-600 border-2 border-slate-300'
              )}
            >
              <RefreshCw size={16} className={autoRefresh ? 'animate-spin' : ''} />
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </button>
            <button
              onClick={loadLogs}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-slate-300 transition-colors"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">{stats.totalLogs}</span>
            </div>
            <p className="text-sm text-slate-600">Total Events</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-slate-900">{stats.successRate.toFixed(1)}%</span>
            </div>
            <p className="text-sm text-slate-600">Success Rate</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold text-slate-900">{stats.failedLogins}</span>
            </div>
            <p className="text-sm text-slate-600">Failed Logins</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-slate-900">{stats.suspiciousActivity}</span>
            </div>
            <p className="text-sm text-slate-600">Suspicious Activity</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-slate-900">{stats.highRiskEvents}</span>
            </div>
            <p className="text-sm text-slate-600">High Risk Events</p>
          </div>
        </div>

        <ErrorBoundary>
          <SecurityMetrics logs={logs} />
        </ErrorBoundary>

        <div className="mt-8">
          <ErrorBoundary>
            <LoginHistoryTable logs={logs} isLoading={isLoading} />
          </ErrorBoundary>
        </div>
      </div>
    </ContentWrapper>
  )
}
