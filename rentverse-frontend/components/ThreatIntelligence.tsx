'use client'

import { useEffect, useState } from 'react'
import { Shield, AlertTriangle, TrendingUp, Activity, Target, CheckCircle } from 'lucide-react'
import { analyzeThreatPatterns, calculateThreatScore } from '@/utils/ai/threatDetection'
import type { SecurityLog } from '@/types/security'
import clsx from 'clsx'

interface ThreatIntelligenceProps {
  logs: SecurityLog[]
}

interface ThreatData {
  score: number
  patternCount: number
  severity: string
  patterns: any[]
}

export default function ThreatIntelligence({ logs }: ThreatIntelligenceProps) {
  const [threatData, setThreatData] = useState<ThreatData | null>(null)

  useEffect(() => {
    if (logs.length > 0) {
      const patterns = analyzeThreatPatterns(logs)
      const score = calculateThreatScore(patterns)
      setThreatData({ patterns, score, patternCount: patterns.length, severity: 'low' }) // Severity logic simplified for demo
    }
  }, [logs])

  if (!threatData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <Activity className="w-8 h-8 animate-pulse text-indigo-500" />
          <p>Analyzing security patterns...</p>
        </div>
      </div>
    )
  }

  const getThreatLevel = (score: number) => {
    if (score >= 75) return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
    if (score >= 50) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
    if (score >= 25) return { level: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
    return { level: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  }

  const threat = getThreatLevel(threatData.score)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Active Threat Intelligence
        </h3>
        <span className={clsx('px-3 py-1 rounded-full text-sm font-bold', threat.bg, threat.color)}>
          {threat.level} Threat Level
        </span>
      </div>

      {threatData.patterns.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {threatData.patterns.map((pattern: Record<string, unknown>, index: number) => (
            <div key={index} className="bg-white border-l-4 border-l-red-500 rounded-r-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{String(pattern.type).replace(/_/g, ' ').toUpperCase()}</h4>
                  <div className="flex flex-col gap-1 mt-1">
                    {Array.isArray(pattern.indicators) && pattern.indicators.slice(0, 2).map((indicator: string, i: number) => (
                      <span key={i} className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-slate-400" /> {indicator}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pl-12 md:pl-0">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Likelihood</p>
                  <p className="font-bold text-slate-700">{(Number(pattern.confidence) * 100).toFixed(0)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Severity</p>
                  <span className={clsx('px-2 py-0.5 rounded text-xs font-bold uppercase',
                    pattern.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      pattern.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                  )}>
                    {String(pattern.severity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-emerald-500">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-emerald-900 mb-2">No Active Threats Detected</h4>
          <p className="text-emerald-700/80 max-w-md mx-auto">
            Real-time monitoring is active. No suspicious patterns have been matched in the current log window.
          </p>
        </div>
      )}
    </div>
  )
}
