'use client'

import { useEffect, useState } from 'react'
import { Shield, AlertTriangle, TrendingUp, Activity, Target } from 'lucide-react'
import { analyzeThreatPatterns, calculateThreatScore } from '@/utils/ai/threatDetection'
import clsx from 'clsx'

interface ThreatIntelligenceProps {
  logs: any[]
}

export default function ThreatIntelligence({ logs }: ThreatIntelligenceProps) {
  const [threatData, setThreatData] = useState<any>(null)

  useEffect(() => {
    if (logs.length > 0) {
      const patterns = analyzeThreatPatterns(logs)
      const score = calculateThreatScore(patterns)
      setThreatData({ patterns, score })
    }
  }, [logs])

  if (!threatData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-teal-600" />
          <h3 className="text-lg font-semibold text-slate-900">Threat Intelligence</h3>
        </div>
        <p className="text-slate-600">Analyzing security logs...</p>
      </div>
    )
  }

  const getThreatLevel = (score: number) => {
    if (score >= 75) return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
    if (score >= 50) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
    if (score >= 25) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' }
    return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
  }

  const threat = getThreatLevel(threatData.score)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-teal-600" />
          <h3 className="text-lg font-semibold text-slate-900">Threat Intelligence</h3>
        </div>
        <Activity className="w-5 h-5 text-slate-400" />
      </div>

      <div className={clsx('p-6 rounded-lg border-2 mb-6', threat.bg, threat.border)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Overall Threat Level</span>
          <span className={clsx('text-2xl font-bold', threat.color)}>{threat.level}</span>
        </div>
        <div className="w-full bg-white rounded-full h-3 overflow-hidden">
          <div
            className={clsx('h-full transition-all duration-500', {
              'bg-red-500': threatData.score >= 75,
              'bg-orange-500': threatData.score >= 50 && threatData.score < 75,
              'bg-yellow-500': threatData.score >= 25 && threatData.score < 50,
              'bg-green-500': threatData.score < 25,
            })}
            style={{ width: `${threatData.score}%` }}
          />
        </div>
        <div className="mt-2 text-right">
          <span className={clsx('text-sm font-semibold', threat.color)}>
            {threatData.score.toFixed(1)}% Risk Score
          </span>
        </div>
      </div>

      {threatData.patterns.length > 0 ? (
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
            <Target size={18} />
            Detected Threats ({threatData.patterns.length})
          </h4>
          {threatData.patterns.map((pattern: any, index: number) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-slate-900">
                    {pattern.type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <span className={clsx('px-2 py-1 text-xs font-semibold rounded-full', {
                  'bg-red-100 text-red-800': pattern.severity === 'critical',
                  'bg-orange-100 text-orange-800': pattern.severity === 'high',
                  'bg-yellow-100 text-yellow-800': pattern.severity === 'medium',
                  'bg-blue-100 text-blue-800': pattern.severity === 'low',
                })}>
                  {pattern.severity.toUpperCase()}
                </span>
              </div>
              <div className="space-y-1">
                {pattern.indicators.map((indicator: string, i: number) => (
                  <p key={i} className="text-sm text-slate-600 pl-7">• {indicator}</p>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <TrendingUp size={14} />
                <span>Confidence: {(pattern.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-slate-600">No active threats detected</p>
          <p className="text-sm text-slate-500 mt-1">System is secure</p>
        </div>
      )}
    </div>
  )
}
