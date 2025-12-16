import { useState, useEffect } from 'react'
import type { PropertyTypeDetail } from '@/types/property'
import { PropertyTypesApiClient } from '@/utils/propertyTypesApiClient'

// Icon mapping for property types
const getPropertyTypeIcon = (code: string): string => {
  const iconMap: Record<string, string> = {
    'APARTMENT': '🏠',
    'CONDOMINIUM': '🏬',
    'HOUSE': '🏡',
    'TOWNHOUSE': '🏘️',
    'VILLA': '🏰',
    'PENTHOUSE': '🏙️',
    'STUDIO': '🏢',
  }
  return iconMap[code] || '🏢'
}

// Transform backend property type to frontend format
const transformPropertyType = (propertyType: PropertyTypeDetail) => ({
  icon: propertyType.icon || getPropertyTypeIcon(propertyType.code), // Use API icon or fallback
  name: propertyType.name,
  description: propertyType.description || '',
  id: propertyType.id,
  code: propertyType.code,
})

export const usePropertyTypes = () => {
  const [propertyTypes, setPropertyTypes] = useState<Array<{
    icon: string
    name: string
    description: string
    id: string
    code: string
  }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('Fetching property types from API...')
        const response = await PropertyTypesApiClient.getPropertyTypes()
        
        if (response.success && response.data) {
          const transformedTypes = response.data
            .filter((type: PropertyTypeDetail) => type.isActive !== false) // Only include active types
            .map(transformPropertyType)
          
          console.log('✅ Successfully loaded property types:', transformedTypes.length)
          console.log('Property types from API:', transformedTypes.map(t => ({
            name: t.name,
            id: t.id,
            code: t.code
          })))
          setPropertyTypes(transformedTypes)
        } else {
          throw new Error('Failed to fetch property types - invalid response format')
        }
      } catch (err) {
        console.error('❌ Error fetching property types:', err)
        let errorMessage = 'Unknown error'
        
        if (err instanceof Error) {
          errorMessage = err.message
          
          // Provide more helpful error messages
          if (err.message.includes('Failed to fetch') || err.message.includes('Unable to connect')) {
            errorMessage = 'Network error - check your internet connection'
          } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
            errorMessage = 'Authentication required - please log in'
          } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
            errorMessage = 'Access denied - insufficient permissions'
          } else if (err.message.includes('404')) {
            errorMessage = 'API endpoint not found - check backend configuration'
          } else if (err.message.includes('500')) {
            errorMessage = 'Server error - please try again later'
          }
        }
        
        setError(errorMessage)
        
        // DO NOT use fallback - this will cause FK constraint errors
        // Instead, keep propertyTypes empty and show error to user
        console.error('⚠️  Cannot load property types from API - property listing will not work')
        console.error('⚠️  Please ensure backend is running and property types are seeded')
        setPropertyTypes([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPropertyTypes()
  }, [])

  return { propertyTypes, isLoading, error }
}

// Hook for search components that includes "Property" option
export const usePropertyTypesForSearch = () => {
  const { propertyTypes, isLoading, error } = usePropertyTypes()
  
  const searchPropertyTypes = [
    { icon: '🏢', name: 'Property', description: 'All types of properties', id: 'all', code: 'ALL' },
    ...propertyTypes
  ]
  
  return { propertyTypes: searchPropertyTypes, isLoading, error }
}
