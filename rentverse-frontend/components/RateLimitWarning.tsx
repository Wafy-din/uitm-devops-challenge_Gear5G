'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Clock, XCircle } from 'lucide-react'
import clsx from 'clsx'

interface RateLimitWarningProps {
  currentRequests: number
  maxRequests: number
  resetTime?: Date
  windowMinutes?: number
}

export default function RateLimitWarning({ 
  currentRequests, 
  maxRequests, 
  resetTime,
  windowMinutes = 15
}: RateLimitWarningProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [isVisible, setIsVisible] = useState(true)

  const percentage = (currentRequests / maxRequests) * 100
  const isWarning = percentage >= 80
  const isCritical = percentage >= 95

  useEffect(() => {
    if (!resetTime) return

    const updateTimer = () => {
      const now = new Date().getTime()
      const reset = new Date(resetTime).getTime()
      const diff = reset - now

      if (diff <= 0) {
        setTimeRemaining('Resetting...')
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeRemaining(`${minutes}m ${seconds}s`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [resetTime])

  if (!isWarning || !isVisible) {
    return null
  }

  return (
    <div className={clsx(
      'mb-6 p-4 rounded-lg border-2 flex items-start gap-3 relative',
      isCritical 
        ? 'bg-red-50 border-red-300' 
        : 'bg-yellow-50 border-yellow-300'
    )}>
      <div className="flex-shrink-0 mt-0.5">
        {isCritical ? (
          <XCircle className="w-5 h-5 text-red-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-yellow-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={clsx(
          'font-semibold text-sm mb-1',
          isCritical ? 'text-red-900' : 'text-yellow-900'
        )}>
          {isCritical ? 'Rate Limit Nearly Reached' : 'Approaching Rate Limit'}
        </h4>
        
        <p className={clsx(
          'text-sm mb-3',
          isCritical ? 'text-red-800' : 'text-yellow-800'
        )}>
          You've made <strong>{currentRequests}</strong> of <strong>{maxRequests}</strong> allowed requests in the last {windowMinutes} minutes.
          {isCritical && ' Further requests may be blocked temporarily.'}
        </p>

        <div className="w-full bg-white rounded-full h-2 mb-2">
          <div
            className={clsx(
              'h-2 rounded-full transition-all duration-300',
              isCritical ? 'bg-red-600' : 'bg-yellow-600'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {resetTime && (
          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-4 h-4" />
            <span className={isCritical ? 'text-red-700' : 'text-yellow-700'}>
              Limit resets in: <strong>{timeRemaining}</strong>
            </span>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
        title="Dismiss warning"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  )
}
