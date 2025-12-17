'use client'

import { useMemo } from 'react'
import { Shield, TrendingUp, TrendingDown, Minus, Activity, AlertTriangle } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import type { RiskAssessment } from '@/utils/riskCalculation'
import clsx from 'clsx'

interface RiskVisualizationProps {
  riskAssessment: RiskAssessment
  historicalData?: Array<{ timestamp: string; score: number }>
}

export default function RiskVisualization({ riskAssessment, historicalData = [] }: RiskVisualizationProps) {
  const radarData = useMemo(() => {
    return riskAssessment.factors.map(factor => ({
      category: factor.category,
      score: factor.score,
      fullMark: 100,
    }))
  }, [riskAssessment.factors])

  const trendData = useMemo(() => {
    return historicalData.map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: item.score,
    }))
  }, [historicalData])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-500', light: 'bg-red-50' }
      case 'high':
        return { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-500', light: 'bg-orange-50' }
      case 'medium':
        return { bg: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-500', light: 'bg-yellow-50' }
      default:
        return { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-500', light: 'bg-emerald-50' }
    }
  }

  const colors = getRiskColor(riskAssessment.level)

  const getTrendIcon = () => {
    if (historicalData.length < 2) return <Minus className="w-5 h-5 text-slate-400" />

    const last = historicalData[historicalData.length - 1].score
    const prev = historicalData[historicalData.length - 2].score

    if (last > prev) return <TrendingUp className="w-5 h-5 text-red-600" />
    if (last < prev) return <TrendingDown className="w-5 h-5 text-emerald-600" />
    return <Minus className="w-5 h-5 text-slate-400" />
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Overall Score */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={clsx('w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner', colors.light)}>
              <Shield className={clsx('w-8 h-8', colors.text)} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Security Health Score</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900">{100 - riskAssessment.overall}%</span>
                <span className="text-sm text-slate-400">/ 100</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 border-l border-slate-100 pl-8">
            <div>
              <p className="text-xs text-slate-500 mb-1">Risk Level</p>
              <span className={clsx('px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider', colors.bg, 'text-white shadow-sm')}>
                {riskAssessment.level}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Risk Trend</p>
              <div className="flex items-center gap-2">
                {getTrendIcon()}
                <span className="font-semibold text-slate-700">
                  {historicalData.length >= 2 ? Math.abs(historicalData[historicalData.length - 1].score - historicalData[historicalData.length - 2].score) + '%' : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Progress Bar Line */}
        <div className="h-1.5 w-full bg-slate-100">
          <div
            className={clsx('h-full transition-all duration-1000', colors.bg)}
            style={{ width: `${100 - riskAssessment.overall}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Activity size={18} className="text-slate-400" />
              Risk Distribution
            </h4>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar name="Risk Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-slate-400" />
              Risk Trend (Last Hour)
            </h4>
          </div>
          <div className="flex-1 min-h-[300px]">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="time"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                    minTickGap={30}
                  />
                  <YAxis
                    domain={[0, 100]}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
                <Activity size={32} className="mb-2 opacity-50" />
                <p>Awaiting data...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk Factors Breakdown - Grid Layout */}
      <h4 className="text-lg font-semibold text-slate-900">Risk Factors Breakdown</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskAssessment.factors.map((factor, index) => (
          <div key={index} className="bg-white border boundary-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {factor.score >= 50 ? (
                  <AlertTriangle className={clsx('w-5 h-5', factor.score >= 70 ? 'text-red-500' : 'text-amber-500')} />
                ) : (
                  <Shield className="w-5 h-5 text-emerald-500" />
                )}
                <span className="font-medium text-slate-900">{factor.category}</span>
              </div>
              <span className={clsx(
                'px-2.5 py-0.5 rounded-full text-xs font-bold',
                factor.score >= 70 ? 'bg-red-100 text-red-700' :
                  factor.score >= 40 ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
              )}>
                {factor.score} Risk
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
              <div
                className={clsx(
                  'h-full rounded-full transition-all duration-1000',
                  factor.score >= 70 ? 'bg-red-500' :
                    factor.score >= 40 ? 'bg-amber-500' :
                      'bg-emerald-500'
                )}
                style={{ width: `${factor.score}%` }}
              />
            </div>

            <div className="space-y-1">
              {factor.indicators.map((indicator, i) => (
                <p key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                  <span className="mt-0.5 bg-slate-300 w-1 h-1 rounded-full shrink-0" />
                  {indicator}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
