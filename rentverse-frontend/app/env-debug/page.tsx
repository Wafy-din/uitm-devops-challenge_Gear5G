'use client'

import { useEffect } from 'react'

export default function EnvDebugPage() {
  useEffect(() => {
    console.log('=== Environment Variables Debug ===')
    console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
    console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
    console.log('NODE_ENV:', process.env.NODE_ENV)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
        
        <div className="space-y-2">
          <div className="border-b pb-2">
            <p className="text-sm text-gray-500">NEXT_PUBLIC_API_BASE_URL</p>
            <p className="font-mono text-sm">
              {process.env.NEXT_PUBLIC_API_BASE_URL || '(not set)'}
            </p>
          </div>
          
          <div className="border-b pb-2">
            <p className="text-sm text-gray-500">NEXT_PUBLIC_API_URL</p>
            <p className="font-mono text-sm">
              {process.env.NEXT_PUBLIC_API_URL || '(not set)'}
            </p>
          </div>
          
          <div className="border-b pb-2">
            <p className="text-sm text-gray-500">NODE_ENV</p>
            <p className="font-mono text-sm">
              {process.env.NODE_ENV || '(not set)'}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Expected:</strong> NEXT_PUBLIC_API_BASE_URL should be 
            "https://rentverse-backend-emqy.onrender.com"
          </p>
          <p className="text-sm text-yellow-800 mt-2">
            If not set correctly, restart the dev server after creating/updating .env.local
          </p>
        </div>

        <div className="mt-6">
          <a
            href="/debug-property-types"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 inline-block"
          >
            Go to Property Types Debug
          </a>
        </div>
      </div>
    </div>
  )
}
