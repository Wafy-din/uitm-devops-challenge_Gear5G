'use client'

import { useState, useEffect } from 'react'
import OTPInput from './OTPInput'
import ButtonFilled from './ButtonFilled'
import { Shield, Mail, Clock, Loader2 } from 'lucide-react'
import { showToast } from '@/utils/toast'

interface MFAVerificationProps {
  email: string
  onVerified: () => void
  onCancel: () => void
}

export default function MFAVerification({ email, onVerified, onCancel }: MFAVerificationProps) {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    sendOTP()
  }, [])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const sendOTP = async () => {
    setIsLoading(true)
    setError(null)
    const toastId = showToast.loading('Sending verification code...')
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Failed to send OTP')
        showToast.dismiss(toastId)
        showToast.error('Failed to send verification code')
      } else {
        showToast.dismiss(toastId)
        showToast.success('Verification code sent to your email!')
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
      showToast.dismiss(toastId)
      showToast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    setResendTimer(60)
    setCanResend(false)
    sendOTP()
  }

  const handleOTPComplete = async (otpValue: string) => {
    setOtp(otpValue)
    setIsLoading(true)
    setError(null)
    const toastId = showToast.loading('Verifying code...')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          otp: otpValue, 
          identifier: email 
        }),
      })

      const data = await response.json()

      if (data.success) {
        showToast.dismiss(toastId)
        showToast.success('Verification successful!')
        onVerified()
      } else {
        setError(data.message || 'Invalid OTP. Please try again.')
        showToast.dismiss(toastId)
        showToast.error('Invalid verification code')
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
      showToast.dismiss(toastId)
      showToast.error('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-slate-600 text-sm">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-6">
          <Mail className="w-4 h-4" />
          <span>{email}</span>
        </div>

        <OTPInput
          length={6}
          onComplete={handleOTPComplete}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Resend Code
                </button>
              ) : (
                <span>Resend code in {resendTimer}s</span>
              )}
            </>
          )}
        </div>

        <button
          onClick={onCancel}
          className="w-full px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
