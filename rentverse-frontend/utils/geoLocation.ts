export interface GeoLocation {
  ip: string
  country: string
  countryCode: string
  region: string
  city: string
  latitude: number
  longitude: number
  timezone: string
  isp: string
}

export interface GeoRestrictionRule {
  type: 'allow' | 'block'
  countries: string[]
  regions?: string[]
  reason?: string
}

export async function getLocationFromIP(ip: string): Promise<GeoLocation | null> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,lat,lon,timezone,isp`)
    
    if (!response.ok) return null
    
    const data = await response.json()
    
    if (data.status !== 'success') return null
    
    return {
      ip,
      country: data.country,
      countryCode: data.countryCode,
      region: data.region,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      isp: data.isp,
    }
  } catch (error) {
    console.error('Geolocation lookup failed:', error)
    return null
  }
}

export function isLocationAllowed(
  location: GeoLocation,
  rules: GeoRestrictionRule[]
): { allowed: boolean; reason?: string } {
  for (const rule of rules) {
    const countryMatch = rule.countries.includes(location.countryCode)
    const regionMatch = !rule.regions || rule.regions.includes(location.region)
    
    if (countryMatch && regionMatch) {
      if (rule.type === 'block') {
        return {
          allowed: false,
          reason: rule.reason || `Access blocked from ${location.country}`,
        }
      }
      if (rule.type === 'allow') {
        return { allowed: true }
      }
    }
  }
  
  return { allowed: true }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

export function detectImpossibleTravel(
  previousLocation: GeoLocation,
  currentLocation: GeoLocation,
  timeDiffMinutes: number
): { impossible: boolean; reason?: string } {
  const distance = calculateDistance(
    previousLocation.latitude,
    previousLocation.longitude,
    currentLocation.latitude,
    currentLocation.longitude
  )
  
  const maxSpeed = 900
  const maxDistance = (maxSpeed * timeDiffMinutes) / 60
  
  if (distance > maxDistance) {
    return {
      impossible: true,
      reason: `Impossible travel: ${distance.toFixed(0)}km in ${timeDiffMinutes} minutes (from ${previousLocation.city}, ${previousLocation.country} to ${currentLocation.city}, ${currentLocation.country})`,
    }
  }
  
  return { impossible: false }
}

export function isHighRiskCountry(countryCode: string): boolean {
  const highRiskCountries = [
    'KP',
    'IR', 
    'SY',
    'CU',
  ]
  
  return highRiskCountries.includes(countryCode)
}

export function isVPNOrProxy(isp: string): boolean {
  const vpnKeywords = [
    'vpn',
    'proxy',
    'datacenter',
    'hosting',
    'cloud',
    'virtual',
  ]
  
  const ispLower = isp.toLowerCase()
  return vpnKeywords.some(keyword => ispLower.includes(keyword))
}

export function calculateLocationRiskScore(location: GeoLocation): number {
  let score = 0
  
  if (isHighRiskCountry(location.countryCode)) score += 40
  
  if (isVPNOrProxy(location.isp)) score += 30
  
  const suspiciousCountries = ['RU', 'CN', 'VN', 'PK', 'NG']
  if (suspiciousCountries.includes(location.countryCode)) score += 20
  
  return Math.min(100, score)
}
