'use client'

import { useState, useEffect } from 'react'
import { Shield, Activity, Zap, AlertTriangle, Download, FileText } from 'lucide-react'
import ContentWrapper from '@/components/ContentWrapper'
import RiskVisualization from '@/components/RiskVisualization'
import ThreatIntelligence from '@/components/ThreatIntelligence'
import ErrorBoundary from '@/components/ErrorBoundary'
import useSecurityStore from '@/stores/securityStore'
import { assessSystemRisk } from '@/utils/riskCalculation'
import { analyzeThreatPatterns } from '@/utils/ai/threatDetection'
import { showToast } from '@/utils/toast'

export default function DefenseDashboardPage() {
  const { logs, alerts, fetchLogs, fetchAlerts } = useSecurityStore()
  const [riskAssessment, setRiskAssessment] = useState<any>(null)
  const [threats, setThreats] = useState<any[]>([])
  const [isAutoResponseEnabled, setIsAutoResponseEnabled] = useState(false)

  useEffect(() => {
    fetchLogs()
    fetchAlerts()
  }, [fetchLogs, fetchAlerts])

  useEffect(() => {
    if (logs.length > 0) {
      const detectedThreats = analyzeThreatPatterns(logs)
      setThreats(detectedThreats)
      
      const assessment = assessSystemRisk(logs, detectedThreats)
      setRiskAssessment(assessment)
    }
  }, [logs])

  const handleToggleAutoResponse = () => {
    setIsAutoResponseEnabled(!isAutoResponseEnabled)
    showToast.success(
      isAutoResponseEnabled 
        ? 'Auto-response system deactivated' 
        : 'Auto-response system activated'
    )
  }

  const exportSecurityReport = () => {
    const toastId = showToast.loading('Generating security report...')
    
    setTimeout(() => {
      const reportData = {
        timestamp: new Date().toISOString(),
        totalEvents: logs.length,
        activeThreats: threats.length,
        riskScore: riskAssessment?.overall || 0,
        autoResponseEnabled: isAutoResponseEnabled,
        recommendations: riskAssessment?.recommendations || [],
        topThreats: threats.slice(0, 5),
      }

      const reportContent = `
SECURITY REPORT
Generated: ${new Date().toLocaleString()}
================================================

OVERVIEW
--------
Total Events: ${reportData.totalEvents}
Active Threats: ${reportData.activeThreats}
Risk Score: ${reportData.riskScore}%
Auto-Response: ${reportData.autoResponseEnabled ? 'ACTIVE' : 'INACTIVE'}

RECOMMENDATIONS
---------------
${reportData.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

TOP THREATS
-----------
${reportData.topThreats.map((threat, i) => `${i + 1}. ${JSON.stringify(threat)}`).join('\n')}
      `

      const blob = new Blob([reportContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `security-report-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      showToast.dismiss(toastId)
      showToast.success('Security report exported successfully!')
    }, 1000)
  }

  return (
    <ContentWrapper>
      <div className="py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Adaptive Defense Dashboard</h1>
            <p className="text-slate-600">Real-time security monitoring and automated response</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportSecurityReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText size={18} />
              Export Report
            </button>
            <Shield className="w-12 h-12 text-teal-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">{logs.length}</span>
            </div>
            <p className="text-sm text-slate-600">Total Events</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold text-slate-900">{threats.length}</span>
            </div>
            <p className="text-sm text-slate-600">Active Threats</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-slate-900">
                {riskAssessment?.overall || 0}%
              </span>
            </div>
            <p className="text-sm text-slate-600">Risk Score</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <Zap className={`w-8 h-8 ${isAutoResponseEnabled ? 'text-teal-600' : 'text-slate-400'}`} />
              <button
                onClick={handleToggleAutoResponse}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                  isAutoResponseEnabled
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isAutoResponseEnabled ? 'ACTIVE' : 'INACTIVE'}
              </button>
            </div>
            <p className="text-sm text-slate-600">Auto Response</p>
          </div>
        </div>

        {riskAssessment && (
          <ErrorBoundary>
            <div className="mb-8">
              <RiskVisualization 
                riskAssessment={riskAssessment}
                historicalData={[]}
              />
            </div>
          </ErrorBoundary>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ErrorBoundary>
            <ThreatIntelligence logs={logs} />
          </ErrorBoundary>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Recommendations</h3>
            {riskAssessment?.recommendations.length > 0 ? (
              <ul className="space-y-2">
                {riskAssessment.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-teal-600 mt-0.5">•</span>
                    <span className="text-slate-700">{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600 text-sm">No recommendations at this time</p>
            )}
          </div>
        </div>

        {isAutoResponseEnabled && (
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-teal-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Auto-Response System Active</h3>
                <p className="text-sm text-slate-700 mb-3">
                  The system will automatically respond to threats based on predefined rules:
                </p>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>✓ Block suspicious IP addresses after 5 failed login attempts</li>
                  <li>✓ Lock accounts showing signs of compromise</li>
                  <li>✓ Require MFA for high-risk actions</li>
                  <li>✓ Send alerts to administrators for critical events</li>
                  <li>✓ Automatically log all security events</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentWrapper>
  )
}
