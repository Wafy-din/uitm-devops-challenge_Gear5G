'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import clsx from 'clsx'
import { Capacitor } from '@capacitor/core'
import InputEmail from './InputEmail'
import ButtonFilled from './ButtonFilled'
import useAuthStore from '@/stores/authStore'

interface ModalEmailCheckProps {
  isModal?: boolean
}

function ModalEmailCheck({ isModal = true }: Readonly<ModalEmailCheckProps>) {
  const router = useRouter()
  const {
    email,
    isLoading,
    error,
    setEmail,
    validateEmail,
    submitEmailCheck,
  } = useAuthStore()

  const isEmailValid = validateEmail(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('[ModalEmailCheck] Starting email check for:', email)

    const data = (await submitEmailCheck()) as { exists?: boolean } | undefined

    console.log('[ModalEmailCheck] Email check result:', data)

    if (!data) {
      console.log('[ModalEmailCheck] No data returned from email check, aborting navigation')
      return
    }

    const exists = Boolean(data?.exists)
    const targetRoute = exists ? '/auth/login' : '/auth/signup'

    console.log('[ModalEmailCheck] Navigating to:', targetRoute)
    router.push(targetRoute)
  }

  const handleGoogleLogin = () => {
    const isMobile = Capacitor.isNativePlatform()

    // Redirect to Google OAuth endpoint
    window.location.href = `/api/auth/google${isMobile ? '?platform=mobile' : ''}`
  }

  const containerContent = (
    <div className={clsx([
      isModal ? 'shadow-xl' : 'border border-slate-400',
      'bg-white rounded-3xl max-w-md w-full p-8',
    ])}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Log in or sign up
        </h2>
        <div className="w-full h-px bg-slate-200 mt-4"></div>
      </div>

      {/* Content */}
      <div className="mb-8">
        <p className="text-lg text-slate-600 text-center mb-6">
          Welcome to Rentverse
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <InputEmail
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Continue Button */}
          <ButtonFilled
            type="submit"
            disabled={!isEmailValid || isLoading}
          >
            {isLoading ? 'Loading...' : 'Continue'}
          </ButtonFilled>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="px-3 text-sm text-slate-500">or</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors duration-200 font-medium"
        >
          <Image
            src="https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1759432485/rentverse-base/google_tsn5nt.png"
            alt="Google"
            width={20}
            height={20}
            className="mr-3"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  )

  if (isModal) {
    // Render as floating modal with backdrop
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        {containerContent}
      </div>
    )
  }

  // Render as regular container without backdrop
  return (
    <div className="flex items-center justify-center p-4">
      {containerContent}
    </div>
  )
}

export default ModalEmailCheck
