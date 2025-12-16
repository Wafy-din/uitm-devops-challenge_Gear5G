'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, MapPin, Monitor, Download, Search, Loader2 } from 'lucide-react'
import type { SecurityLog } from '@/types/security'
import clsx from 'clsx'

interface ActivityLogTableProps {
  logs: SecurityLog[]
  isLoading?: boolean
}

export default function ActivityLogTable({ logs, isLoading = false }: ActivityLogTableProps) {
  const [sortField, setSortField] = useState<keyof SecurityLog>('timestamp')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (sortedLogs.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedRowIndex(prev => Math.min(prev + 1, sortedLogs.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedRowIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        const selectedLog = sortedLogs[selectedRowIndex]
        if (selectedLog) {
          setExpandedRow(expandedRow === selectedLog.id ? null : selectedLog.id)
        }
        break
      case 'Escape':
        setExpandedRow(null)
        break
    }
  }

  const sortedLogs = [...logs]
    .filter(log => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return (
        log.userId?.toLowerCase().includes(search) ||
        log.action.toLowerCase().includes(search) ||
        log.ipAddress.toLowerCase().includes(search) ||
        log.deviceInfo?.toLowerCase().includes(search)
      )
    })
    .sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (field: keyof SecurityLog) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'suspicious': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Action', 'User ID', 'IP Address', 'Status', 'Risk Level', 'Device Info', 'Location']
    const rows = sortedLogs.map(log => [
      new Date(log.timestamp).toISOString(),
      log.action,
      log.userId || 'N/A',
      log.ipAddress,
      log.status,
      log.riskLevel,
      log.deviceInfo || 'N/A',
      log.location || 'N/A',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
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

  if (sortedLogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No logs found matching the filters</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex gap-3 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by user, action, or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>
      
      <div className="overflow-x-auto" tabIndex={0} onKeyDown={handleKeyDown}>
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100" onClick={() => handleSort('timestamp')}>
              <div className="flex items-center gap-1">
                Timestamp
                {sortField === 'timestamp' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100" onClick={() => handleSort('action')}>
              <div className="flex items-center gap-1">
                Action
                {sortField === 'action' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">User</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">IP Address</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100" onClick={() => handleSort('status')}>
              <div className="flex items-center gap-1">
                Status
                {sortField === 'status' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100" onClick={() => handleSort('riskLevel')}>
              <div className="flex items-center gap-1">
                Risk
                {sortField === 'riskLevel' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {sortedLogs.map((log, index) => (
            <React.Fragment key={log.id}>
              <tr 
                className={clsx(
                  'hover:bg-slate-50 transition-colors cursor-pointer',
                  selectedRowIndex === index && 'ring-2 ring-teal-500'
                )}
                onClick={() => setSelectedRowIndex(index)}
              >
                <td className="px-4 py-3 text-sm text-slate-900">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  {log.action.replace(/_/g, ' ').toUpperCase()}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {log.userId || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                  {log.ipAddress}
                </td>
                <td className="px-4 py-3">
                  <span className={clsx('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(log.status))}>
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={clsx('px-2 py-1 text-xs font-medium rounded-full', getRiskColor(log.riskLevel))}>
                    {log.riskLevel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                  >
                    {expandedRow === log.id ? 'Hide' : 'Show'}
                    <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
              {expandedRow === log.id && (
                <tr>
                  <td colSpan={7} className="px-4 py-4 bg-slate-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-slate-700 mb-1 flex items-center gap-2">
                          <Monitor size={16} />
                          Device Information
                        </p>
                        <p className="text-slate-600 font-mono text-xs">{log.deviceInfo}</p>
                      </div>
                      {log.location && (
                        <div>
                          <p className="font-medium text-slate-700 mb-1 flex items-center gap-2">
                            <MapPin size={16} />
                            Location
                          </p>
                          <p className="text-slate-600">{log.location}</p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
