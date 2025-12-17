import { NextRequest } from 'next/server'
import { generateDeviceFingerprint } from '@/utils/deviceFingerprint'
import { detectImpossibleTravel } from '@/utils/geoLocation'

export interface TrustScore {
  overall: number
  device: number
  location: number
  behavior: number
  timestamp: string
}

export interface ZeroTrustContext {
  userId: string
  deviceFingerprint: string
  ipAddress: string
  location: Record<string, unknown> | null
  trustScore: TrustScore
  action: string
  timestamp: string
}

export async function evaluateZeroTrust(
  request: NextRequest,
  userId: string,
  action: string
): Promise<{
  allowed: boolean
  trustScore: TrustScore
  reasons: string[]
  requireMFA: boolean
}> {
  const reasons: string[] = []
  let deviceScore = 50
  let locationScore = 50
  let behaviorScore = 50

  const deviceFingerprint = generateDeviceFingerprint(request)

  const knownDevices: Array<Record<string, unknown>> = []
  const isKnownDevice = knownDevices.some(d => (d.fingerprint as string) === deviceFingerprint)
  
  if (isKnownDevice) {
    deviceScore = 80
    reasons.push('Known device detected')
  } else {
    deviceScore = 30
    reasons.push('Unknown device - MFA required')
  }

  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
  
  if (ipAddress !== 'unknown') {
    const location = await getLocationFromIP(ipAddress)
    
    if (location) {
      const locationRisk = calculateLocationRiskScore(location)
      locationScore = 100 - locationRisk
      
      if (locationRisk > 50) {
        reasons.push(`High-risk location: ${location.country}`)
      }
      
      const previousLocations: Array<Record<string, unknown>> = []
      if (previousLocations.length > 0) {
        const lastLocation = previousLocations[previousLocations.length - 1]
        const timeDiff = 30
        
        const impossibleTravel = detectImpossibleTravel(
          lastLocation,
          location,
          timeDiff
        )
        
        if (impossibleTravel.impossible) {
          locationScore = 20
          reasons.push(impossibleTravel.reason!)
        }
      }
    }
  }

  const sensitiveActions = ['password_change', 'data_export', 'account_deletion', 'admin_action']
  if (sensitiveActions.includes(action)) {
    behaviorScore = 40
    reasons.push('Sensitive action requires additional verification')
  }

  const overallScore = (deviceScore * 0.4 + locationScore * 0.4 + behaviorScore * 0.2)

  const trustScore: TrustScore = {
    overall: overallScore,
    device: deviceScore,
    location: locationScore,
    behavior: behaviorScore,
    timestamp: new Date().toISOString(),
  }

  const requireMFA = overallScore < 60 || !isKnownDevice || sensitiveActions.includes(action)
  const allowed = overallScore >= 30

  return {
    allowed,
    trustScore,
    reasons,
    requireMFA,
  }
}

export function createAccessControlPolicy(): {
  minTrustScore: number
  requireMFAThreshold: number
  blockThreshold: number
  allowedCountries?: string[]
  blockedCountries?: string[]
} {
  return {
    minTrustScore: 30,
    requireMFAThreshold: 60,
    blockThreshold: 20,
    blockedCountries: ['KP', 'IR', 'SY', 'CU'],
  }
}

export function shouldAutoLogout(trustScore: TrustScore): boolean {
  return trustScore.overall < 30 || 
         trustScore.device < 20 || 
         trustScore.location < 20
}

export function generateSecurityRecommendations(trustScore: TrustScore): string[] {
  const recommendations: string[] = []

  if (trustScore.device < 50) {
    recommendations.push('Verify this device by checking your email')
    recommendations.push('Enable device fingerprinting')
  }

  if (trustScore.location < 50) {
    recommendations.push('Unusual location detected - verify your identity')
    recommendations.push('Consider using a trusted network')
  }

  if (trustScore.behavior < 50) {
    recommendations.push('Sensitive action detected - MFA required')
    recommendations.push('Review recent account activity')
  }

  if (trustScore.overall < 60) {
    recommendations.push('Enable multi-factor authentication')
    recommendations.push('Review trusted devices list')
  }

  return recommendations
}
