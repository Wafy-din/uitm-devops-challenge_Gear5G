export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

export function validateJWT(token: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 3) return false
  
  try {
    const payload = JSON.parse(atob(parts[1]))
    const exp = payload.exp
    if (!exp) return false
    
    return Date.now() < exp * 1000
  } catch {
    return false
  }
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  
  const maskedLocal = local.length > 2
    ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
    : local
  
  return `${maskedLocal}@${domain}`
}

export function getIPAddress(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  const realIP = headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export function generateDeviceFingerprint(userAgent: string, language: string, encoding: string): string {
  const fingerprint = `${userAgent}|${language}|${encoding}`
  
  return btoa(fingerprint)
    .split('')
    .map(c => c.charCodeAt(0).toString(16))
    .join('')
}
