'use client'

import React, { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import type { SecurityLog } from '@/types/security'
import clsx from 'clsx'

interface LoginHistoryTableProps {
  logs: SecurityLog[]
  isLoading?: boolean
}

export default function LoginHistoryTable({ logs, isLoading = false }: LoginHistoryTableProps) {
  const [showFailedOnly, setShowFailedOnly] = useState(false)

  const filteredLogs = showFailedOnly 
    ? logs.filter(log => log.status === 'failed')
    : logs

  const parseUserAgent = (ua: string) => {
    if (!ua || ua === 'Unknown') return { browser: 'unknown', os: 'unknown' }
    
    // Parse browser
    let browser = 'unknown'
    if (ua.includes('Chrome')) browser = 'Chrome'
    else if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Safari')) browser = 'Safari'
    else if (ua.includes('Edge')) browser = 'Edge'
    
    // Parse OS
    let os = 'unknown'
    if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Mac')) os = 'Mac'
    else if (ua.includes('Linux')) os = 'Linux'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iOS')) os = 'iOS'
    
    return { browser, os }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredLogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No login history found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Login History</h2>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showFailedOnly}
            onChange={(e) => setShowFailedOnly(e.target.checked)}
            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          Show failed only
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                IP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Device
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const { browser, os } = parseUserAgent(log.deviceInfo)
              const isSuccess = log.status === 'success'
              
              return (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {new Date(log.timestamp).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                      ,
                    </div>
                    <div className="text-sm text-slate-900">
                      {new Date(log.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">
                      {log.userEmail || 'Unknown'}
                    </div>
                    <div className="text-sm text-slate-500">
                      {log.userName || (log.userRole ? log.userRole.charAt(0).toUpperCase() + log.userRole.slice(1).toLowerCase() : 'User')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700 font-mono">
                      {log.ipAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {browser}
                    </div>
                    <div className="text-sm text-slate-500">
                      / {os}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={clsx(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium',
                      isSuccess 
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    )}>
                      {isSuccess ? (
                        <>
                          <CheckCircle size={16} />
                          Success
                        </>
                      ) : (
                        <>
                          <XCircle size={16} />
                          Failed
                          {log.details?.failReason && (
                            <div className="ml-1 text-xs">
                              {log.details.failReason}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          Showing {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>
    </div>
  )
}
