export interface RiskFactor {
  category: string
  score: number
  weight: number
  indicators: string[]
}

export interface RiskAssessment {
  overall: number
  factors: RiskFactor[]
  level: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  recommendations: string[]
}

export function calculateOverallRisk(factors: RiskFactor[]): number {
  let totalScore = 0
  let totalWeight = 0

  factors.forEach(factor => {
    totalScore += factor.score * factor.weight
    totalWeight += factor.weight
  })

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0
}

export function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 75) return 'critical'
  if (score >= 50) return 'high'
  if (score >= 25) return 'medium'
  return 'low'
}

export function assessSystemRisk(logs: Array<Record<string, unknown>>, threats: Array<Record<string, unknown>>): RiskAssessment {
  const factors: RiskFactor[] = []

  const recentLogs = logs.filter(log => {
    const l = log as any
    return Date.now() - new Date(l.timestamp).getTime() < 3600000
  })

  const failedLogins = recentLogs.filter(log => {
    const l = log as any
    return l.action === 'login' && l.status === 'failed'
  }).length

  const failedLoginScore = Math.min(100, (failedLogins / 10) * 100)
  factors.push({
    category: 'Failed Login Attempts',
    score: failedLoginScore,
    weight: 3,
    indicators: [`${failedLogins} failed attempts in last hour`],
  })

  const suspiciousLogs = recentLogs.filter(log => (log as any).status === 'suspicious').length
  const suspiciousScore = Math.min(100, (suspiciousLogs / 5) * 100)
  factors.push({
    category: 'Suspicious Activity',
    score: suspiciousScore,
    weight: 4,
    indicators: [`${suspiciousLogs} suspicious events detected`],
  })

  const criticalThreats = threats.filter(t => t.severity === 'critical').length
  const highThreats = threats.filter(t => t.severity === 'high').length
  const threatScore = Math.min(100, (criticalThreats * 30 + highThreats * 15))
  factors.push({
    category: 'Active Threats',
    score: threatScore,
    weight: 5,
    indicators: [
      `${criticalThreats} critical threats`,
      `${highThreats} high severity threats`
    ],
  })

  const uniqueIPs = new Set(recentLogs.map(log => (log as any).ipAddress)).size
  const ipScore = uniqueIPs > 50 ? 60 : uniqueIPs > 20 ? 30 : 10
  factors.push({
    category: 'IP Distribution',
    score: ipScore,
    weight: 2,
    indicators: [`${uniqueIPs} unique IPs in last hour`],
  })

  const dataAccessCount = recentLogs.filter(log => {
    const l = log as any
    return (l.action && typeof l.action === 'string') ? (l.action.includes('data_access') || l.action.includes('export')) : false
  }).length
  const dataScore = Math.min(100, (dataAccessCount / 20) * 100)
  factors.push({
    category: 'Data Access Patterns',
    score: dataScore,
    weight: 3,
    indicators: [`${dataAccessCount} data access operations`],
  })

  const overall = calculateOverallRisk(factors)
  const level = getRiskLevel(overall)

  return {
    overall,
    factors,
    level,
    timestamp: new Date().toISOString(),
    recommendations: generateRiskRecommendations(factors, level),
  }
}

function generateRiskRecommendations(factors: RiskFactor[], level: string): string[] {
  const recommendations: string[] = []

  if (level === 'critical') {
    recommendations.push('🚨 IMMEDIATE ACTION REQUIRED')
    recommendations.push('Enable emergency lockdown mode')
    recommendations.push('Notify security team immediately')
  }

  if (level === 'high') {
    recommendations.push('⚠️ High risk detected - implement additional controls')
    recommendations.push('Review and restrict access permissions')
  }

  factors.forEach(factor => {
    if (factor.score >= 70) {
      switch (factor.category) {
        case 'Failed Login Attempts':
          recommendations.push('Enable rate limiting on authentication endpoints')
          recommendations.push('Implement CAPTCHA for login forms')
          break
        case 'Suspicious Activity':
          recommendations.push('Increase monitoring frequency')
          recommendations.push('Enable detailed audit logging')
          break
        case 'Active Threats':
          recommendations.push('Activate automated threat response')
          recommendations.push('Block identified malicious IPs')
          break
        case 'Data Access Patterns':
          recommendations.push('Review data export permissions')
          recommendations.push('Enable data loss prevention (DLP)')
          break
      }
    }
  })

  if (recommendations.length === 0) {
    recommendations.push('✅ System operating within normal parameters')
    recommendations.push('Continue routine monitoring')
  }

  return [...new Set(recommendations)]
}

export function calculateTrend(currentRisk: number, previousRisks: number[]): {
  direction: 'increasing' | 'decreasing' | 'stable'
  percentage: number
} {
  if (previousRisks.length === 0) {
    return { direction: 'stable', percentage: 0 }
  }

  const average = previousRisks.reduce((a, b) => a + b, 0) / previousRisks.length
  const diff = currentRisk - average
  const percentage = Math.abs((diff / average) * 100)

  if (diff > 5) return { direction: 'increasing', percentage }
  if (diff < -5) return { direction: 'decreasing', percentage }
  return { direction: 'stable', percentage: 0 }
}

export function calculateRiskHistory(logs: Array<Record<string, unknown>>): Array<{ timestamp: string; score: number }> {
  if (!logs.length) return []

  // Sort logs by timestamp ascending
  const sortedLogs = [...logs].sort((a, b) =>
    new Date(a.timestamp as string).getTime() - new Date(b.timestamp as string).getTime()
  )

  // Create 5-minute buckets for the last hour
  const now = Date.now()
  const oneHourAgo = now - 3600000
  const buckets: Record<string, number[]> = {}

  // Initialize buckets
  for (let i = 0; i < 12; i++) {
    const time = new Date(oneHourAgo + (i * 5 * 60000))
    const key = time.toISOString()
    buckets[key] = []
  }

  // Distribute logs into buckets
  sortedLogs.forEach(log => {
    const logTime = new Date(log.timestamp as string).getTime()
    if (logTime >= oneHourAgo) {
      // Find closest bucket
      const bucketTime = Math.floor((logTime - oneHourAgo) / (5 * 60000)) * (5 * 60000) + oneHourAgo
      const key = new Date(bucketTime).toISOString()

      // Handle case where riskScore might be in 'details' or direct property
      let score = 0
      if (typeof log.riskScore === 'number') {
        score = log.riskScore
      } else if (log.details && typeof (log.details as any).riskScore === 'number') {
        score = (log.details as any).riskScore
      }

      if (buckets[key]) buckets[key].push(score)
    }
  })

  // Calculate average for each bucket, carry forward previous if empty? No, 0 implies no activity/threats which is 0 risk? Or should it be previous?
  // Let's assume 0 risk if no logs.
  return Object.entries(buckets).map(([timestamp, scores]) => {
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0
    return { timestamp, score: avgScore }
  }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}
