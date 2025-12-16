'use client'

import type { LocationBaseType } from '@/types/location'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { citySearchMapping } from '@/data/popular-locations'

function CardPopularLocation({ location }: { location: LocationBaseType }) {
  // Get mapped city for search - just use city name, not state
  const searchData = citySearchMapping[location.name] || { city: location.name }
  
  // Use only city parameter - backend might not support state filter
  const searchUrl = `/property/result?city=${encodeURIComponent(searchData.city)}`
  
  console.log(`[CardPopularLocation] ${location.name} → Search city: ${searchData.city}`)
  console.log(`[CardPopularLocation] URL: ${searchUrl}`)
  
  return (
    <Link 
      href={searchUrl}
      className={clsx([
        'flex flex-col items-center justify-center gap-y-2 cursor-pointer',
        'hover:scale-105 transition-all duration-300',
      ])}
    >
      <Image
        src={location.imageUrl}
        alt={location.name}
        width={320}
        height={320}
        className='h-auto aspect-square object-cover rounded-3xl'
      />
      <h3 className='text-lg font-semibold text-slate-600'>{location.name}</h3>
    </Link>
  )
}

export default CardPopularLocation
