import { NextRequest } from 'next/server'
import crypto from 'crypto'

export interface DeviceFingerprint {
  id: string
  userAgent: string
  platform: string
  language: string
  timezone: number
  screenResolution: string
  colorDepth: number
  hardwareConcurrency: number
  deviceMemory?: number
  vendor: string
  canvasFingerprint?: string
  webglSupport: boolean
  touchSupport: boolean
  hash: string
}

export function generateDeviceFingerprint(request: NextRequest): string {
  const components = [
    request.headers.get('user-agent') || '',
    request.headers.get('accept-language') || '',
    request.headers.get('accept-encoding') || '',
    request.headers.get('sec-ch-ua-platform') || '',
    request.headers.get('sec-ch-ua') || '',
    request.headers.get('sec-ch-ua-mobile') || '',
  ]

  const fingerprintString = components.join('|')
  
  return crypto
    .createHash('sha256')
    .update(fingerprintString)
    .digest('hex')
}

export function generateClientFingerprint(): DeviceFingerprint {
  const nav = typeof navigator !== 'undefined' ? navigator : null
  const screen = typeof window !== 'undefined' ? window.screen : null
  
  const components = {
    userAgent: nav?.userAgent || '',
    platform: nav?.platform || '',
    language: nav?.language || '',
    timezone: new Date().getTimezoneOffset(),
    screenResolution: screen ? `${screen.width}x${screen.height}x${screen.colorDepth}` : '',
    colorDepth: screen?.colorDepth || 0,
    hardwareConcurrency: nav?.hardwareConcurrency || 0,
    deviceMemory: (nav as Navigator & { deviceMemory?: number })?.deviceMemory,
    vendor: nav?.vendor || '',
    webglSupport: detectWebGLSupport(),
    touchSupport: detectTouchSupport(),
    canvasFingerprint: generateCanvasFingerprint(),
  }

  const fingerprintString = Object.values(components).filter(Boolean).join('|')
  const hash = hashString(fingerprintString)

  return {
    id: hash,
    ...components,
    hash,
  }
}

function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

function detectTouchSupport(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

function generateCanvasFingerprint(): string {
  if (typeof window === 'undefined') return ''
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''
    
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('DeviceCheck', 2, 15)
    
    return canvas.toDataURL().substring(0, 50)
  } catch {
    return ''
  }
}

function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

export function parseDeviceInfo(userAgent: string): {
  browser: string
  os: string
  device: string
  isMobile: boolean
} {
  const ua = userAgent.toLowerCase()
  
  let browser = 'Unknown'
  if (ua.includes('chrome')) browser = 'Chrome'
  else if (ua.includes('firefox')) browser = 'Firefox'
  else if (ua.includes('safari')) browser = 'Safari'
  else if (ua.includes('edge')) browser = 'Edge'
  
  let os = 'Unknown'
  if (ua.includes('windows')) os = 'Windows'
  else if (ua.includes('mac')) os = 'macOS'
  else if (ua.includes('linux')) os = 'Linux'
  else if (ua.includes('android')) os = 'Android'
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS'
  
  const isMobile = /mobile|android|iphone|ipad|tablet/.test(ua)
  const device = isMobile ? 'Mobile' : 'Desktop'
  
  return { browser, os, device, isMobile }
}

export function isDeviceTrusted(
  deviceFingerprint: string,
  trustedDevices: string[]
): boolean {
  return trustedDevices.includes(deviceFingerprint)
}

export function shouldBlockDevice(
  deviceFingerprint: string,
  blacklistedDevices: string[]
): boolean {
  return blacklistedDevices.includes(deviceFingerprint)
}

export interface DeviceInfo {
  fingerprint: string
  name: string
  type: 'mobile' | 'desktop' | 'tablet'
  browser: string
  os: string
  lastSeen: string
  trustLevel: 'trusted' | 'unknown' | 'suspicious'
  loginCount: number
  firstSeen: string
}

export function createDeviceInfo(request: NextRequest): DeviceInfo {
  const fingerprint = generateDeviceFingerprint(request)
  const userAgent = request.headers.get('user-agent') || ''
  const deviceDetails = parseDeviceInfo(userAgent)
  
  return {
    fingerprint,
    name: `${deviceDetails.browser} on ${deviceDetails.os}`,
    type: deviceDetails.isMobile ? 'mobile' : 'desktop',
    browser: deviceDetails.browser,
    os: deviceDetails.os,
    lastSeen: new Date().toISOString(),
    trustLevel: 'unknown',
    loginCount: 1,
    firstSeen: new Date().toISOString(),
  }
}

export function calculateDeviceTrustScore(device: DeviceInfo): number {
  let score = 50

  const daysSinceFirstSeen = (Date.now() - new Date(device.firstSeen).getTime()) / (1000 * 60 * 60 * 24)
  if (daysSinceFirstSeen > 30) score += 20
  else if (daysSinceFirstSeen > 7) score += 10
  else if (daysSinceFirstSeen < 1) score -= 10

  if (device.loginCount > 50) score += 20
  else if (device.loginCount > 10) score += 10
  else if (device.loginCount === 1) score -= 5

  const daysSinceLastSeen = (Date.now() - new Date(device.lastSeen).getTime()) / (1000 * 60 * 60 * 24)
  if (daysSinceLastSeen < 1) score += 10
  else if (daysSinceLastSeen > 30) score -= 10

  if (device.trustLevel === 'trusted') score += 30
  else if (device.trustLevel === 'suspicious') score -= 40

  return Math.max(0, Math.min(100, score))
}
