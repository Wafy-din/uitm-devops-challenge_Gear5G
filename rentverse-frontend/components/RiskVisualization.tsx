'use client'

import { useMemo } from 'react'
import { Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react'
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
      time: new Date(item.timestamp).toLocaleTimeString(),
      score: item.score,
    }))
  }, [historicalData])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-500' }
      case 'high':
        return { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-500' }
      case 'medium':
        return { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-500' }
      default:
        return { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500' }
    }
  }

  const colors = getRiskColor(riskAssessment.level)

  const getTrendIcon = () => {
    if (historicalData.length < 2) return <Minus className="w-5 h-5" />
    
    const lastTwo = historicalData.slice(-2)
    if (lastTwo[1].score > lastTwo[0].score) {
      return <TrendingUp className="w-5 h-5 text-red-600" />
    } else if (lastTwo[1].score < lastTwo[0].score) {
      return <TrendingDown className="w-5 h-5 text-green-600" />
    }
    return <Minus className="w-5 h-5 text-slate-400" />
  }

  return (
    <div className="space-y-6">
      <div className={clsx('border-4 rounded-2xl p-6', colors.border)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={clsx('p-3 rounded-full', colors.bg, 'bg-opacity-10')}>
              <Shield className={clsx('w-8 h-8', colors.text)} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{riskAssessment.overall}%</h3>
              <p className="text-sm text-slate-600">Overall Risk Score</p>
            </div>
          </div>
          
          <div className="text-right">
            <span className={clsx(
              'inline-block px-4 py-2 rounded-full text-sm font-bold uppercase',
              colors.bg,
              'text-white'
            )}>
              {riskAssessment.level}
            </span>
            <div className="flex items-center justify-end gap-1 mt-2">
              {getTrendIcon()}
              <span className="text-xs text-slate-600">Trend</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
          <div
            className={clsx('h-full transition-all duration-1000', colors.bg)}
            style={{ width: `${riskAssessment.overall}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Risk Factor Analysis</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Risk Score" dataKey="score" stroke="#0D9488" fill="#0D9488" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Risk Trend (Last Hour)</h4>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" fontSize={11} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-400">
              <p>No historical data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h4 className="text-lg font-semibold text-slate-900 mb-4">Risk Factors Breakdown</h4>
        <div className="space-y-3">
          {riskAssessment.factors.map((factor, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900">{factor.category}</span>
                <span className={clsx(
                  'px-3 py-1 rounded-full text-sm font-semibold',
                  factor.score >= 70 ? 'bg-red-100 text-red-800' :
                  factor.score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                )}>
                  {factor.score}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all',
                    factor.score >= 70 ? 'bg-red-500' :
                    factor.score >= 40 ? 'bg-yellow-500' :
                    'bg-green-500'
                  )}
                  style={{ width: `${factor.score}%` }}
                />
              </div>
              <div className="text-sm text-slate-600">
                {factor.indicators.map((indicator, i) => (
                  <p key={i}>• {indicator}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
