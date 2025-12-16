'use client'

import { Filter, X } from 'lucide-react'

interface LogFiltersProps {
  filters: {
    status: string
    action: string
    riskLevel: string
    dateFrom: string
    dateTo: string
    searchTerm?: string
  }
  onFilterChange: (filters: any) => void
}

export default function LogFilters({ filters, onFilterChange }: LogFiltersProps) {
  const handleChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const applyPreset = (preset: 'lastHour' | 'today' | 'thisWeek' | 'critical') => {
    const now = new Date()
    const newFilters = { ...filters, status: '', action: '', riskLevel: '', dateFrom: '', dateTo: '', searchTerm: '' }

    switch (preset) {
      case 'lastHour':
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
        newFilters.dateFrom = oneHourAgo.toISOString().split('T')[0]
        newFilters.dateTo = now.toISOString().split('T')[0]
        break
      case 'today':
        newFilters.dateFrom = now.toISOString().split('T')[0]
        newFilters.dateTo = now.toISOString().split('T')[0]
        break
      case 'thisWeek':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        newFilters.dateFrom = weekAgo.toISOString().split('T')[0]
        newFilters.dateTo = now.toISOString().split('T')[0]
        break
      case 'critical':
        newFilters.riskLevel = 'high'
        newFilters.status = 'failed'
        break
    }

    onFilterChange(newFilters)
  }

  return (
    <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-slate-600" />
        <h3 className="font-semibold text-slate-900">Filters</h3>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => applyPreset('lastHour')}
          className="px-3 py-1 text-sm bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Last Hour
        </button>
        <button
          onClick={() => applyPreset('today')}
          className="px-3 py-1 text-sm bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Today
        </button>
        <button
          onClick={() => applyPreset('thisWeek')}
          className="px-3 py-1 text-sm bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          This Week
        </button>
        <button
          onClick={() => applyPreset('critical')}
          className="px-3 py-1 text-sm bg-red-100 border border-red-300 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Critical Only
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="User or IP..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleChange('searchTerm', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">All</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="suspicious">Suspicious</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Action</label>
          <select
            value={filters.action}
            onChange={(e) => handleChange('action', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">All</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="password_change">Password Change</option>
            <option value="data_access">Data Access</option>
            <option value="admin_action">Admin Action</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Risk Level</label>
          <select
            value={filters.riskLevel}
            onChange={(e) => handleChange('riskLevel', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleChange('dateFrom', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleChange('dateTo', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        {(filters.status || filters.action || filters.riskLevel || filters.dateFrom || filters.dateTo || filters.searchTerm) && (
          <div className="flex items-center gap-2 mr-auto">
            <span className="text-sm text-slate-600">Active filters:</span>
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">
                Status: {filters.status}
                <button onClick={() => handleChange('status', '')} className="hover:text-teal-900">
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.action && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">
                Action: {filters.action}
                <button onClick={() => handleChange('action', '')} className="hover:text-teal-900">
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.riskLevel && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">
                Risk: {filters.riskLevel}
                <button onClick={() => handleChange('riskLevel', '')} className="hover:text-teal-900">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
        <button
          onClick={() => onFilterChange({ status: '', action: '', riskLevel: '', dateFrom: '', dateTo: '', searchTerm: '' })}
          className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}
