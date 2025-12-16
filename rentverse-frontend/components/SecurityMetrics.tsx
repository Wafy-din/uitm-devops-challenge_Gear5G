'use client'

import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Download, Calendar } from 'lucide-react'
import type { SecurityLog } from '@/types/security'
import { showToast } from '@/utils/toast'

interface SecurityMetricsProps {
  logs: SecurityLog[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function SecurityMetrics({ logs }: SecurityMetricsProps) {
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'custom'>('24h')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  const getFilteredLogs = () => {
    const now = Date.now()
    let cutoffTime = now

    switch (dateRange) {
      case '24h':
        cutoffTime = now - 86400000
        break
      case '7d':
        cutoffTime = now - 7 * 86400000
        break
      case '30d':
        cutoffTime = now - 30 * 86400000
        break
      case 'custom':
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate).getTime()
          const end = new Date(customEndDate).getTime()
          return logs.filter(log => {
            const logTime = new Date(log.timestamp).getTime()
            return logTime >= start && logTime <= end
          })
        }
        return logs
    }

    return logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime()
      return logTime >= cutoffTime
    })
  }

  const filteredLogs = getFilteredLogs()

  const metrics = useMemo(() => {

    const actionCounts = filteredLogs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const actionData = Object.entries(actionCounts).map(([name, value]) => ({
      name: name.replace(/_/g, ' ').toUpperCase(),
      value,
    }))

    const statusCounts = filteredLogs.reduce((acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const statusData = Object.entries(statusCounts).map(([name, value]) => ({
      name: name.toUpperCase(),
      value,
    }))

    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date().getHours() - i
      const hourLogs = filteredLogs.filter(log => {
        const logHour = new Date(log.timestamp).getHours()
        return logHour === (hour < 0 ? 24 + hour : hour)
      })
      return {
        hour: `${hour < 0 ? 24 + hour : hour}:00`,
        events: hourLogs.length,
        failed: hourLogs.filter(l => l.status === 'failed').length,
      }
    }).reverse()

    const riskData = [
      { name: 'Low', value: filteredLogs.filter(l => l.riskLevel === 'low').length, color: '#3B82F6' },
      { name: 'Medium', value: filteredLogs.filter(l => l.riskLevel === 'medium').length, color: '#F59E0B' },
      { name: 'High', value: filteredLogs.filter(l => l.riskLevel === 'high').length, color: '#EF4444' },
    ]

    return { actionData, statusData, hourlyData, riskData }
  }, [filteredLogs])

  const exportMetrics = (chartName: string) => {
    showToast.success(`Exporting ${chartName} chart...`)
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-slate-600" />
          <h3 className="font-semibold text-slate-900">Date Range</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setDateRange('24h')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              dateRange === '24h'
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Last 24 Hours
          </button>
          <button
            onClick={() => setDateRange('7d')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              dateRange === '7d'
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateRange('30d')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              dateRange === '30d'
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateRange('custom')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              dateRange === 'custom'
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Custom Range
          </button>
        </div>

        {dateRange === 'custom' && (
          <div className="mt-4 flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Actions Distribution ({dateRange})</h3>
          <button
            onClick={() => exportMetrics('Actions Distribution')}
            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            title="Export chart"
          >
            <Download size={18} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metrics.actionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0D9488" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Status Overview ({dateRange})</h3>
          <button
            onClick={() => exportMetrics('Status Overview')}
            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            title="Export chart"
          >
            <Download size={18} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={metrics.statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {metrics.statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Hourly Activity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" fontSize={12} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="events" stroke="#0D9488" strokeWidth={2} name="Total Events" />
            <Line type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} name="Failed Events" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Risk Level Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={metrics.riskData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              dataKey="value"
            >
              {metrics.riskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  )
}
