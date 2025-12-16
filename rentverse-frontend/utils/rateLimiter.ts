interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const rateLimitStore: RateLimitStore = {}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

export const defaultRateLimit: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 100,
}

export const strictRateLimit: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 10,
}

export const authRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = defaultRateLimit
): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const key = identifier

  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + config.windowMs,
    }
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: rateLimitStore[key].resetTime,
    }
  }

  rateLimitStore[key].count++

  const allowed = rateLimitStore[key].count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - rateLimitStore[key].count)

  return {
    allowed,
    remaining,
    resetTime: rateLimitStore[key].resetTime,
  }
}

export function cleanupRateLimitStore() {
  const now = Date.now()
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key]
    }
  })
}

setInterval(cleanupRateLimitStore, 60 * 1000)
