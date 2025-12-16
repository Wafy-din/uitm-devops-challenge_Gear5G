'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearStoragePage() {
  const router = useRouter()
  const [status, setStatus] = useState('Clearing storage...')

  useEffect(() => {
    try {
      // Clear all storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear specific keys
      const keysToRemove = [
        'property-listing-storage',
        'auth-storage',
        'authToken',
        'properties-storage',
        'favorites-storage',
        'security-storage'
      ]
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })
      
      setStatus('✅ Storage cleared successfully! Redirecting...')
      
      setTimeout(() => {
        router.push('/property/new')
      }, 2000)
    } catch (error) {
      setStatus('❌ Error clearing storage: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Clear Browser Storage</h1>
        <p className="text-lg text-gray-700 mb-4">{status}</p>
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-sm text-blue-800">
            This page clears all localStorage and sessionStorage data to fix property type ID issues.
          </p>
        </div>
      </div>
    </div>
  )
}
