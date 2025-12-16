'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowDownWideNarrow } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Scrollbar, Mousewheel } from 'swiper/modules'
import usePropertiesStore from '@/stores/propertiesStore'
import MapViewer from '@/components/MapViewer'
import Pagination from '@/components/Pagination'
import CardProperty from '@/components/CardProperty'
import ContentWrapper from '@/components/ContentWrapper'
import ButtonSecondary from '@/components/ButtonSecondary'
import ButtonMapViewSwitcher from '@/components/ButtonMapViewSwitcher'

function ResultsPage() {
  const searchParams = useSearchParams()
  const { properties, isLoading, loadProperties, mapData, pagination, changePage, searchFilters } = usePropertiesStore()
  const [isMapView, setIsMapView] = useState(false)
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'area-asc' | 'area-desc' | 'newest'>('newest')
  const [showSortMenu, setShowSortMenu] = useState(false)

  // Load properties based on URL parameters
  useEffect(() => {
    const city = searchParams.get('city')
    const type = searchParams.get('type')
    
    console.log('[ResultsPage] URL params - city:', city, 'type:', type)
    
    // Build filters from URL params
    const filters: any = {
      page: 1,
      limit: 10,
    }
    
    if (city) {
      filters.city = city
    }
    
    if (type) {
      filters.type = type
    }
    
    console.log('[ResultsPage] Loading properties with filters:', filters)
    loadProperties(filters)
  }, [searchParams, loadProperties])

  const handlePageChange = (page: number) => {
    changePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleView = () => {
    setIsMapView(!isMapView)
  }

  const handleSort = (type: typeof sortBy) => {
    setSortBy(type)
    setShowSortMenu(false)
  }

  // Sort properties based on selected option
  const sortedProperties = useMemo(() => {
    const sorted = [...properties]
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
      case 'price-desc':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
      case 'area-asc':
        return sorted.sort((a, b) => (a.areaSqm || a.area || 0) - (b.areaSqm || b.area || 0))
      case 'area-desc':
        return sorted.sort((a, b) => (b.areaSqm || b.area || 0) - (a.areaSqm || a.area || 0))
      case 'newest':
      default:
        return sorted // Assume backend returns newest first
    }
  }, [properties, sortBy])

  // Helper function to group properties based on screen size
  const getGroupedProperties = (itemsPerSlide: number) => {
    const grouped = []
    for (let i = 0; i < sortedProperties.length; i += itemsPerSlide) {
      grouped.push(sortedProperties.slice(i, i + itemsPerSlide))
    }
    return grouped
  }

  // Map configuration - use real data from backend if available (memoized)
  const mapCenter = useMemo(() => {
    console.log('Computing map center with mapData:', mapData)
    
    if (mapData?.latMean && mapData?.longMean) {
      console.log('Using API map center:', { lng: mapData.longMean, lat: mapData.latMean })
      return { lng: mapData.longMean, lat: mapData.latMean }
    }
    
    console.log('Using fallback map center')
    return { lng: -74.006, lat: 40.7128 } // Fallback to NYC center
  }, [mapData])
  
  const mapZoom = mapData?.depth || 12

  console.log('Map center result:', mapCenter)
  console.log('Map zoom:', mapZoom)

  // Create markers from properties data (memoized to prevent re-rendering)
  const propertyMarkers = useMemo(() => {
    return sortedProperties.map((property, index) => {
      let lng, lat
      
      if (property.longitude && property.latitude) {
        // Use real coordinates if available
        lng = property.longitude
        lat = property.latitude
      } else {
        // Fallback: distribute properties in a grid pattern around map center
        const gridSize = Math.ceil(Math.sqrt(sortedProperties.length))
        const gridX = index % gridSize
        const gridY = Math.floor(index / gridSize)
        const offsetRange = 0.02 // Roughly 2km range
        
        lng = mapCenter.lng + (gridX - gridSize / 2) * (offsetRange / gridSize) + (Math.random() - 0.5) * 0.005
        lat = mapCenter.lat + (gridY - gridSize / 2) * (offsetRange / gridSize) + (Math.random() - 0.5) * 0.005
      }

      return {
        lng,
        lat,
        popup: `
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-sm mb-1">${property.title}</h3>
            <p class="text-xs text-gray-600 mb-1">${property.address}</p>
            <p class="text-xs text-gray-600 mb-2">${property.city}, ${property.state}</p>
            <div class="flex justify-between items-center">
              <p class="text-sm font-bold text-teal-600">$${property.price}/month</p>
              <p class="text-xs text-gray-500">${property.bedrooms}br ${property.bathrooms}ba</p>
            </div>
            <p class="text-xs text-gray-500 mt-1">${property.areaSqm || property.area || 0} sq ft</p>
            <div class="mt-2">
              <a href="/property/${property.id}" class="text-xs text-teal-600 hover:text-teal-700 font-medium">
                View Details →
              </a>
            </div>
          </div>
        `,
        color: '#0D9488', // Teal color to match the theme
        propertyId: property.id, // Add property ID for potential click handling
      }
    })
  }, [sortedProperties, mapCenter])

  // Debug logging
  console.log('Properties count:', properties.length)
  console.log('Map center:', mapCenter)
  console.log('Property markers:', propertyMarkers)

  return (
    <ContentWrapper searchBoxType="compact">
      {/* Error State */}
      {!isLoading && properties.length === 0 && (
        <div className="w-full py-12 px-4">
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="text-red-600 text-lg font-medium">
              Unable to load properties
            </div>
            <p className="text-gray-600">
              The backend server may be starting up. This can take 30-60 seconds on first request.
            </p>
            <button
              onClick={() => loadProperties({ limit: 10, page: 1 })}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
            <p className="text-sm text-gray-500">
              If the issue persists, check if the backend is running at:<br />
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_API_BASE_URL}
              </code>
            </p>
          </div>
        </div>
      )}

      <div className="w-full py-4 px-2 sm:px-4 md:px-8 lg:px-12 flex justify-between items-start gap-x-5">
        {/* Property Card Results */}
        <div className={`w-full md:w-1/2 ${isMapView ? 'hidden' : 'block'}`}>
          {/* Header Result */}
          <div className="flex justify-between items-center mb-5">
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-xl text-teal-900">
                {pagination.total} homes{searchFilters.city ? ` in ${searchFilters.city}` : ' within map area'}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-base text-teal-800">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} – {Math.min(pagination.page * pagination.limit, pagination.total)}
                </p>
                {(searchFilters.city || searchFilters.type) && (
                  <div className="flex gap-2">
                    {searchFilters.city && (
                      <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-200">
                        📍 {searchFilters.city}
                      </span>
                    )}
                    {searchFilters.type && (
                      <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-200">
                        🏠 {searchFilters.type}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <ButtonSecondary
                iconLeft={<ArrowDownWideNarrow size={16} />}
                label="Sort"
                onClick={() => setShowSortMenu(!showSortMenu)}
              />
              
              {showSortMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSortMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                    <button
                      onClick={() => handleSort('newest')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${sortBy === 'newest' ? 'text-teal-600 font-medium' : 'text-slate-700'}`}
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => handleSort('price-asc')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${sortBy === 'price-asc' ? 'text-teal-600 font-medium' : 'text-slate-700'}`}
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => handleSort('price-desc')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${sortBy === 'price-desc' ? 'text-teal-600 font-medium' : 'text-slate-700'}`}
                    >
                      Price: High to Low
                    </button>
                    <button
                      onClick={() => handleSort('area-asc')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${sortBy === 'area-asc' ? 'text-teal-600 font-medium' : 'text-slate-700'}`}
                    >
                      Area: Small to Large
                    </button>
                    <button
                      onClick={() => handleSort('area-desc')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${sortBy === 'area-desc' ? 'text-teal-600 font-medium' : 'text-slate-700'}`}
                    >
                      Area: Large to Small
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Vertical Scrollable Results */}
          <div className="h-[70vh] overflow-hidden">
            {/* Mobile: 1 column */}
            <div className="block sm:hidden h-full">
              <Swiper
                direction="vertical"
                slidesPerView="auto"
                spaceBetween={16}
                scrollbar={{
                  hide: false,
                  draggable: true,
                }}
                mousewheel={{
                  enabled: true,
                  forceToAxis: true,
                }}
                modules={[Scrollbar, Mousewheel]}
                className="h-full"
                style={{ height: '100%' }}
              >
                {sortedProperties.map((property) => (
                  <SwiperSlide key={property.id} className="!h-auto">
                    <div className="pr-4 mb-4">
                      <CardProperty property={property} />
                    </div>
                  </SwiperSlide>
                ))}

                {/* Pagination as last slide */}
                <SwiperSlide className="!h-auto">
                  <div className="py-8 flex justify-center items-center pr-4">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>

            {/* Small screens: 2 columns */}
            <div className="hidden sm:block md:hidden h-full">
              <Swiper
                direction="vertical"
                slidesPerView="auto"
                spaceBetween={16}
                scrollbar={{
                  hide: false,
                  draggable: true,
                }}
                mousewheel={{
                  enabled: true,
                  forceToAxis: true,
                }}
                modules={[Scrollbar, Mousewheel]}
                className="h-full"
                style={{ height: '100%' }}
              >
                {getGroupedProperties(2).map((group, index) => (
                  <SwiperSlide key={index} className="!h-auto">
                    <div className="grid grid-cols-2 gap-4 pr-4 mb-4">
                      {group.map((property) => (
                        <CardProperty key={property.id} property={property} />
                      ))}
                    </div>
                  </SwiperSlide>
                ))}

                {/* Pagination as last slide */}
                <SwiperSlide className="!h-auto">
                  <div className="py-8 flex justify-center items-center pr-4 col-span-2">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>

            {/* Medium screens (tablets): 1 column */}
            <div className="hidden md:block lg:hidden h-full">
              <Swiper
                direction="vertical"
                slidesPerView="auto"
                spaceBetween={16}
                scrollbar={{
                  hide: false,
                  draggable: true,
                }}
                mousewheel={{
                  enabled: true,
                  forceToAxis: true,
                }}
                modules={[Scrollbar, Mousewheel]}
                className="h-full"
                style={{ height: '100%' }}
              >
                {sortedProperties.map((property) => (
                  <SwiperSlide key={property.id} className="!h-auto">
                    <div className="pr-4 mb-4">
                      <CardProperty property={property} />
                    </div>
                  </SwiperSlide>
                ))}

                {/* Pagination as last slide */}
                <SwiperSlide className="!h-auto">
                  <div className="py-8 flex justify-center items-center pr-4">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>

            {/* Large screens: 2 columns */}
            <div className="hidden lg:block h-full">
              <Swiper
                direction="vertical"
                slidesPerView="auto"
                spaceBetween={16}
                scrollbar={{
                  hide: false,
                  draggable: true,
                }}
                mousewheel={{
                  enabled: true,
                  forceToAxis: true,
                }}
                modules={[Scrollbar, Mousewheel]}
                className="h-full"
                style={{ height: '100%' }}
              >
                {getGroupedProperties(2).map((group, index) => (
                  <SwiperSlide key={index} className="!h-auto">
                    <div className="grid grid-cols-2 gap-4 pr-4 mb-4">
                      {group.map((property) => (
                        <CardProperty key={property.id} property={property} />
                      ))}
                    </div>
                  </SwiperSlide>
                ))}

                {/* Pagination as last slide */}
                <SwiperSlide className="!h-auto">
                  <div className="py-8 flex justify-center items-center pr-4 col-span-2">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>

        {/* Map Results */}
        <div className={`w-full md:w-1/2 ${isMapView ? 'block' : 'hidden md:block'}`}>
          {isLoading ? (
            <div className="w-full h-[80vh] bg-gray-100 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading properties...</p>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="w-full h-[80vh] bg-gray-100 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-2">No properties found</p>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            </div>
          ) : (
            // Only render MapViewer if we're not loading and have map data
            !isLoading ? (
              <MapViewer
                center={mapCenter}
                zoom={mapZoom}
                markers={propertyMarkers}
                onMapClick={(coords) => console.log('Clicked:', coords)}
                className="shadow-lg"
                height="80vh"
              />
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-600 text-lg mb-2">Loading map...</p>
                  <p className="text-gray-500">Fetching location data</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Map/List View Switcher Button - Mobile/Tablet Only */}
      <div className="md:hidden">
        <ButtonMapViewSwitcher
          onClick={toggleView}
          isMapView={isMapView}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
        />
      </div>
    </ContentWrapper>
  )
}

export default ResultsPage
