'use client'

import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react'
import clsx from 'clsx'

interface OTPInputProps {
  length?: number
  value?: string
  onChange?: (otp: string) => void
  onComplete: (otp: string) => void
  isLoading?: boolean
  error?: string | null
}

export default function OTPInput({ 
  length = 6, 
  value = '',
  onChange,
  onComplete, 
  isLoading = false,
  error = null 
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    const otpString = newOtp.join('')
    console.log('[OTPInput] OTP changed:', otpString, 'Length:', otpString.length)
    
    // Call onChange if provided
    if (onChange) {
      onChange(otpString)
    }
    
    // Call onComplete when all digits are entered
    if (otpString.length === length) {
      console.log('[OTPInput] OTP complete, calling onComplete with:', otpString)
      onComplete(otpString)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').trim()
    
    console.log('[OTPInput] Paste detected:', pastedData)
    
    if (!/^\d+$/.test(pastedData)) return
    
    const pastedOtp = pastedData.slice(0, length).split('')
    const newOtp = [...otp]
    
    pastedOtp.forEach((digit, index) => {
      if (index < length) {
        newOtp[index] = digit
      }
    })
    
    setOtp(newOtp)
    
    const otpString = newOtp.join('')
    console.log('[OTPInput] After paste:', otpString, 'Length:', otpString.length)
    
    // Call onChange if provided
    if (onChange) {
      onChange(otpString)
    }
    
    if (pastedOtp.length === length) {
      console.log('[OTPInput] Paste complete, calling onComplete with:', otpString)
      onComplete(newOtp.join(''))
      inputRefs.current[length - 1]?.focus()
    } else {
      inputRefs.current[pastedOtp.length]?.focus()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center" role="group" aria-label="One-time password input">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isLoading}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'otp-error' : undefined}
            className={clsx(
              'w-12 h-14 text-center text-2xl font-semibold',
              'border-2 rounded-lg transition-all',
              'focus:outline-none focus:ring-2',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200',
              isLoading && 'bg-gray-100 cursor-not-allowed',
              digit && 'border-teal-500'
            )}
            autoComplete="off"
          />
        ))}
      </div>
      
      {error && (
        <p id="otp-error" className="text-red-600 text-sm text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
