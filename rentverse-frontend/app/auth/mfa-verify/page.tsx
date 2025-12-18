'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ContentWrapper from '@/components/ContentWrapper'
import OTPInput from '@/components/OTPInput'
import { setCookie } from '@/utils/cookies'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export default function MFAVerifyPage() {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const pendingEmail = localStorage.getItem('mfaPendingEmail')
    const sessionToken = localStorage.getItem('mfaSessionToken')

    if (!pendingEmail || !sessionToken) {
      toast.error('No MFA session found. Please log in again.')
      router.push('/auth')
      return
    }

    setEmail(pendingEmail)
  }, [router])

  const handleVerifyOTP = async (otpCode?: string) => {
    // If called from button click, otpCode is event object, so ignore it using type check or just use state
    // If called from onComplete, otpCode is the string
    const codeToVerify = typeof otpCode === 'string' ? otpCode : otp
    console.log('[MFA Page] handleVerifyOTP called with OTP:', codeToVerify, 'Length:', codeToVerify.length)

    if (codeToVerify.length !== 6) {
      console.log('[MFA Page] OTP length invalid:', codeToVerify.length)
      toast.error('Please enter a 6-digit OTP')
      return
    }

    console.log('[MFA Page] Starting verification...')
    setIsLoading(true)
    try {
      const sessionToken = localStorage.getItem('mfaSessionToken')

      console.log('[MFA Page] Session token:', sessionToken ? 'exists' : 'missing')
      console.log('[MFA Page] Sending request with OTP:', codeToVerify)

      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionToken,
          otp: codeToVerify,
        }),
      })

      console.log('[MFA Page] Response status:', response.status)

      const result = await response.json()

      console.log('[MFA Page] Response data:', result)

      if (response.ok && result.success) {
        console.log('[MFA Page] Verification successful!')
        const authToken = result.data.token
        localStorage.setItem('authToken', authToken)
        localStorage.setItem('authUser', JSON.stringify(result.data.user))
        setCookie('authToken', authToken, 7)

        localStorage.removeItem('mfaSessionToken')
        localStorage.removeItem('mfaPendingEmail')

        toast.success('Login successful!')
        window.location.href = '/'
      } else {
        console.log('[MFA Page] Verification failed:', result.message)
        toast.error(result.message || 'Invalid OTP')
      }
    } catch (error) {
      console.error('[MFA Page] Verification error:', error)
      toast.error('Failed to verify OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    try {
      const sessionToken = localStorage.getItem('mfaSessionToken')

      console.log('[MFA Page] Resending OTP with session token:', sessionToken ? 'exists' : 'missing')

      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken }),
      })

      console.log('[MFA Page] Resend response status:', response.status)

      const result = await response.json()

      console.log('[MFA Page] Resend response data:', result)

      if (response.ok && result.success) {
        toast.success('New OTP sent to your email')
      } else {
        toast.error(result.message || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error('[MFA Page] Resend OTP error:', error)
      toast.error('Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ContentWrapper>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Verify Your Identity
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We&apos;ve sent a 6-digit code to <strong>{email}</strong>
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter OTP Code
              </label>
              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
                onComplete={handleVerifyOTP}
              />
            </div>

            <button
              onClick={() => handleVerifyOTP()}
              disabled={isLoading || otp.length !== 6}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Verifying...
                </>
              ) : (
                'Verify and Login'
              )}
            </button>

            <div className="text-center">
              <button
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium disabled:opacity-50"
              >
                Didn&apos;t receive the code? Resend
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => router.push('/auth')}
                className="text-sm text-slate-600 hover:text-slate-700"
              >
                ← Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  )
}
