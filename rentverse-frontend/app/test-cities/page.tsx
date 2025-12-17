'use client'

import { useEffect, useState } from 'react'
import ContentWrapper from '@/components/ContentWrapper'

export default function TestCitiesPage() {
  const [cities, setCities] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCities() {
      try {
        // Fetch properties and extract unique cities
        const response = await fetch('/api/properties?limit=100')
        const data = await response.json()
        
        if (data.success && data.data.properties) {
          interface Property {
            city: string
            [key: string]: unknown
          }
          const uniqueCities = [...new Set(data.data.properties.map((p: Property) => p.city))]
            .filter(Boolean)
            .sort()
          
          console.log('Unique cities in database:', uniqueCities)
          setCities(uniqueCities as string[])
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [])

  return (
    <ContentWrapper>
      <div className="py-12 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Database Cities Test</h1>
        
        {loading ? (
          <p>Loading cities from database...</p>
        ) : (
          <>
            <p className="text-slate-600 mb-4">
              Found {cities.length} unique cities in database:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cities.map((city, index) => (
                <div key={index} className="p-3 bg-white border border-slate-200 rounded-lg">
                  <p className="font-mono text-sm">{city}</p>
                  <a 
                    href={`/property/result?city=${encodeURIComponent(city)}`}
                    className="text-xs text-teal-600 hover:underline"
                  >
                    Search →
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ContentWrapper>
  )
}
