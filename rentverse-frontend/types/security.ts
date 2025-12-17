export interface OTPState {
  otpValue: string
  otpSent: boolean
  otpVerified: boolean
  otpExpiry: number | null
  otpAttempts: number
  isOTPLoading: boolean
  otpError: string | null
}

export interface MFASettings {
  enabled: boolean
  method: 'email' | 'sms' | 'authenticator'
  verified: boolean
  lastVerified: string | null
}

export interface SecurityLog {
  id: string
  userId: string
  userEmail?: string
  userName?: string | null
  userRole?: string | null
  action: string
  ipAddress: string
  deviceInfo: string
  location?: string
  timestamp: string
  status: 'success' | 'failed' | 'suspicious'
  riskLevel: 'low' | 'medium' | 'high'
  details?: Record<string, unknown>
}

export interface ThreatAlert {
  id: string
  type: 'failed_login' | 'unusual_location' | 'new_device' | 'rate_limit' | 'anomaly'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  resolved: boolean
  userId?: string
}
