export function detectAnomalies(logs: any[]): any[] {
  const anomalies: any[] = []

  const recentLogs = logs.filter(log => {
    const logTime = new Date(log.timestamp).getTime()
    const now = Date.now()
    return now - logTime < 3600000
  })

  const ipMap = new Map<string, number>()
  recentLogs.forEach(log => {
    const count = ipMap.get(log.ipAddress) || 0
    ipMap.set(log.ipAddress, count + 1)
  })

  ipMap.forEach((count, ip) => {
    if (count > 10) {
      anomalies.push({
        type: 'rate_limit',
        severity: 'high',
        message: `Unusual activity detected from IP ${ip}: ${count} requests in 1 hour`,
        ipAddress: ip,
      })
    }
  })

  const failedLogins = recentLogs.filter(log => 
    log.action === 'login' && log.status === 'failed'
  )

  const failedByUser = new Map<string, number>()
  failedLogins.forEach(log => {
    const count = failedByUser.get(log.userId) || 0
    failedByUser.set(log.userId, count + 1)
  })

  failedByUser.forEach((count, userId) => {
    if (count >= 5) {
      anomalies.push({
        type: 'failed_login',
        severity: 'critical',
        message: `Multiple failed login attempts detected for user ${userId}: ${count} attempts`,
        userId,
      })
    }
  })

  const locationChanges = recentLogs.filter(log => log.location)
  const userLocations = new Map<string, Set<string>>()
  
  locationChanges.forEach(log => {
    if (!userLocations.has(log.userId)) {
      userLocations.set(log.userId, new Set())
    }
    userLocations.get(log.userId)!.add(log.location)
  })

  userLocations.forEach((locations, userId) => {
    if (locations.size > 3) {
      anomalies.push({
        type: 'unusual_location',
        severity: 'medium',
        message: `User ${userId} accessed from ${locations.size} different locations in 1 hour`,
        userId,
      })
    }
  })

  return anomalies
}

export function calculateRiskScore(log: any): number {
  let score = 0

  if (log.status === 'failed') score += 30
  if (log.status === 'suspicious') score += 50

  const actionRisks: Record<string, number> = {
    login: 10,
    password_change: 20,
    account_deletion: 40,
    data_export: 30,
    admin_action: 25,
  }
  score += actionRisks[log.action] || 0

  const now = Date.now()
  const logTime = new Date(log.timestamp).getTime()
  const hoursSince = (now - logTime) / (1000 * 60 * 60)
  
  if (hoursSince < 1) score += 20
  else if (hoursSince < 6) score += 10

  return Math.min(100, score)
}

export function shouldTriggerAlert(anomaly: any): boolean {
  return anomaly.severity === 'critical' || anomaly.severity === 'high'
}
