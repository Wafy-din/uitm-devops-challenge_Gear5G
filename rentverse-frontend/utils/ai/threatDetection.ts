import type { SecurityLog } from '@/types/security'

export interface ThreatPattern {
  type: string
  indicators: string[]
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
}

interface UserBehavior {
  userId: string
  actions: string[]
  timestamps: number[]
  locations: string[]
  devices: string[]
}

export function analyzeThreatPatterns(logs: SecurityLog[]): ThreatPattern[] {
  const threats: ThreatPattern[] = []

  const bruteForceAttacks = detectBruteForce(logs)
  if (bruteForceAttacks.length > 0) {
    threats.push({
      type: 'brute_force_attack',
      indicators: bruteForceAttacks,
      severity: 'critical',
      confidence: 0.95,
    })
  }

  const accountTakeover = detectAccountTakeover(logs)
  if (accountTakeover.length > 0) {
    threats.push({
      type: 'account_takeover',
      indicators: accountTakeover,
      severity: 'critical',
      confidence: 0.90,
    })
  }

  const dataExfiltration = detectDataExfiltration(logs)
  if (dataExfiltration.length > 0) {
    threats.push({
      type: 'data_exfiltration',
      indicators: dataExfiltration,
      severity: 'high',
      confidence: 0.85,
    })
  }

  const abnormalAccess = detectAbnormalAccess(logs)
  if (abnormalAccess.length > 0) {
    threats.push({
      type: 'abnormal_access_pattern',
      indicators: abnormalAccess,
      severity: 'medium',
      confidence: 0.75,
    })
  }

  return threats
}

function getUserLabel(log: SecurityLog): string {
  if (log.userName && log.userName.trim().length > 0) return `${log.userName} (${log.userEmail || ''})`
  if (log.userEmail && log.userEmail !== 'Unknown') return log.userEmail
  return `User ${log.userId.substring(0, 8)}...`
}

function detectBruteForce(logs: SecurityLog[]): string[] {
  const indicators: string[] = []
  const recentLogs = logs.filter(l => Date.now() - new Date(l.timestamp).getTime() < 300000)

  const ipAttempts = new Map<string, number>()
  recentLogs.forEach(log => {
    if (log.action === 'login' && log.status === 'failed') {
      ipAttempts.set(log.ipAddress, (ipAttempts.get(log.ipAddress) || 0) + 1)
    }
  })

  ipAttempts.forEach((count, ip) => {
    if (count >= 5) {
      indicators.push(`IP ${ip}: ${count} failed login attempts in 5 minutes`)
    }
  })

  return indicators
}

function detectAccountTakeover(logs: SecurityLog[]): string[] {
  const indicators: string[] = []
  const userBehaviors = new Map<string, UserBehavior & { label: string }>()

  logs.forEach(log => {
    if (!userBehaviors.has(log.userId)) {
      userBehaviors.set(log.userId, {
        userId: log.userId,
        label: getUserLabel(log),
        actions: [],
        timestamps: [],
        locations: [],
        devices: [],
      })
    }

    const behavior = userBehaviors.get(log.userId)!
    behavior.actions.push(log.action)
    behavior.timestamps.push(new Date(log.timestamp).getTime())
    if (log.location) behavior.locations.push(log.location)
    if (log.deviceInfo) behavior.devices.push(log.deviceInfo)

    // Update label if we get better info later in the stream
    if (!behavior.label.includes('@') && log.userEmail) {
      behavior.label = getUserLabel(log)
    }
  })

  userBehaviors.forEach((behavior, userId) => {
    const uniqueLocations = new Set(behavior.locations)
    const uniqueDevices = new Set(behavior.devices)

    if (uniqueLocations.size > 3 && behavior.timestamps.length > 0) {
      const timeRange = Math.max(...behavior.timestamps) - Math.min(...behavior.timestamps)
      if (timeRange < 3600000) {
        indicators.push(`${behavior.label}: ${uniqueLocations.size} locations in 1 hour (impossible travel)`)
      }
    }

    if (uniqueDevices.size > 2 && behavior.timestamps.length > 0) {
      const timeRange = Math.max(...behavior.timestamps) - Math.min(...behavior.timestamps)
      if (timeRange < 1800000) {
        indicators.push(`${behavior.label}: ${uniqueDevices.size} devices in 30 minutes`)
      }
    }
  })

  return indicators
}

function detectDataExfiltration(logs: SecurityLog[]): string[] {
  const indicators: string[] = []

  const userActivity = new Map<string, { count: number, label: string }>()
  logs.forEach(log => {
    if (log.action.includes('data_access') || log.action.includes('export')) {
      const current = userActivity.get(log.userId) || { count: 0, label: getUserLabel(log) }
      userActivity.set(log.userId, { count: current.count + 1, label: current.label })
    }
  })

  userActivity.forEach((data, userId) => {
    if (data.count > 20) {
      indicators.push(`${data.label}: ${data.count} data access operations (potential exfiltration)`)
    }
  })

  return indicators
}

function detectAbnormalAccess(logs: SecurityLog[]): string[] {
  const indicators: string[] = []

  const nightAccess = logs.filter(log => {
    const hour = new Date(log.timestamp).getHours()
    return hour >= 0 && hour < 6
  })

  const userNightAccess = new Map<string, { count: number, label: string }>()
  nightAccess.forEach(log => {
    const current = userNightAccess.get(log.userId) || { count: 0, label: getUserLabel(log) }
    userNightAccess.set(log.userId, { count: current.count + 1, label: current.label })
  })

  userNightAccess.forEach((data, userId) => {
    if (data.count > 5) {
      indicators.push(`${data.label}: ${data.count} access attempts during night hours (00:00-06:00)`)
    }
  })

  return indicators
}

export function calculateThreatScore(patterns: ThreatPattern[]): number {
  if (patterns.length === 0) return 0

  let totalScore = 0
  let totalWeight = 0

  patterns.forEach(pattern => {
    const severityWeight = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    }[pattern.severity]

    const score = severityWeight * pattern.confidence * 25
    totalScore += score
    totalWeight += severityWeight
  })

  return Math.min(100, totalScore / totalWeight)
}

export function generateThreatReport(logs: SecurityLog[]) {
  const patterns = analyzeThreatPatterns(logs)
  const threatScore = calculateThreatScore(patterns)

  return {
    timestamp: new Date().toISOString(),
    threatScore,
    patterns,
    recommendations: generateRecommendations(patterns),
  }
}

function generateRecommendations(patterns: ThreatPattern[]): string[] {
  const recommendations: string[] = []

  patterns.forEach(pattern => {
    switch (pattern.type) {
      case 'brute_force_attack':
        recommendations.push('Enable rate limiting and CAPTCHA for login endpoints')
        recommendations.push('Implement IP-based blocking for suspicious addresses')
        break
      case 'account_takeover':
        recommendations.push('Enforce multi-factor authentication (MFA)')
        recommendations.push('Alert users of suspicious login locations')
        break
      case 'data_exfiltration':
        recommendations.push('Review and restrict data export permissions')
        recommendations.push('Enable data loss prevention (DLP) monitoring')
        break
      case 'abnormal_access_pattern':
        recommendations.push('Implement time-based access controls')
        recommendations.push('Enable behavioral analytics')
        break
    }
  })

  return [...new Set(recommendations)]
}
