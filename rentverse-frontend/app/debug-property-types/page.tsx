'use client'

import { useEffect, useState } from 'react'
import { usePropertyTypes } from '@/hooks/usePropertyTypes'

import Link from 'next/link'

export default function DebugPropertyTypesPage() {
  const { propertyTypes, isLoading, error } = usePropertyTypes()
  const [storageData, setStorageData] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    // Check what's in localStorage
    const propertyListingData = localStorage.getItem('property-listing-storage')
    if (propertyListingData) {
      try {
        setStorageData(JSON.parse(propertyListingData))
      } catch {
        setStorageData({ error: 'Failed to parse' })
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Property Types Debug</h1>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Status</h2>
          {isLoading && <p className="text-blue-600">Loading...</p>}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-800 font-semibold">Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}
          {!isLoading && !error && (
            <p className="text-green-600">✓ Successfully loaded {propertyTypes.length} property types</p>
          )}
        </div>

        {/* Property Types from API */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Property Types from API</h2>
          {propertyTypes.length > 0 ? (
            <div className="space-y-2">
              {propertyTypes.map((type) => (
                <div key={type.id} className="border border-gray-200 rounded p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl mr-2">{type.icon}</span>
                      <span className="font-semibold">{type.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({type.code})</span>
                    </div>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{type.id}</code>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No property types loaded</p>
          )}
        </div>

        {/* localStorage Data */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">localStorage Data</h2>
          {storageData ? (
            <div className="bg-gray-50 rounded p-4 overflow-auto">
              <pre className="text-xs">{JSON.stringify(storageData, null, 2)}</pre>
            </div>
          ) : (
            <p className="text-gray-500">No property listing data in localStorage</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <a
            href="/clear-storage"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
          >
            Clear Storage
          </a>
          <Link
            href="/property/new"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700"
          >
            Go to Property Listing
          </Link>
        </div>
      </div>
    </div>
  )
}
