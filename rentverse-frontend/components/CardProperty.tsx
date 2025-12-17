import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { RulerDimensionLine, Star } from 'lucide-react'
import type { Property, PropertyTypeBackend, PropertyType } from '@/types/property'
import IconPropertyType from '@/utils/IconPropertyType'
import { swapCasePropertyType, getLocaledPrice, getLocaledArea, getLocaledRating } from '@/utils/property'

// Convert backend property type to frontend property type
function convertPropertyType(backendType: PropertyTypeBackend): PropertyType {
  const typeMap: Record<PropertyTypeBackend, PropertyType> = {
    'APARTMENT': 'apartment',
    'HOUSE': 'house',
    'STUDIO': 'studio',
    'CONDO': 'condominium',
    'VILLA': 'villa',
    'ROOM': 'apartment', // fallback to apartment for room
  }
  return typeMap[backendType] || 'apartment'
}

function CardProperty({ property }: { readonly property: Property }) {
  // Use the first image or a fallback
  const imageUrl = property.images?.[0] || '/placeholder-property.jpg'
  const propertyType = convertPropertyType(property.type)

  return (
    <div className={clsx([
      'w-full max-w-320 bg-white rounded-2xl overflow-hidden border border-neutral-200/60',
      'card-hover group'
    ])}>
      <Link href={`/property/${property.id}`} className="block h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={`Image of ${property.title}`}
            width={500}
            height={300}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Property Type Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-neutral-700 shadow-sm">
            <IconPropertyType property_type={propertyType} size={14} />
            <span>{swapCasePropertyType(propertyType)}</span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 flex flex-col flex-1">
          {/* Location */}
          <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-2 line-clamp-1">{property.city}, {property.state}</span>

          {/* Title */}
          <h3 className="text-lg font-serif font-bold text-neutral-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-1">
            {property.title}
          </h3>

          {/* Price and Details Row */}
          <div className="mt-auto pt-4 border-t border-dashed border-neutral-200 flex items-center justify-between">
            {/* Price */}
            <span className="text-xl font-bold text-brand-600">{getLocaledPrice(Number(property.price))}</span>

            {/* Area and Rating */}
            <div className="flex items-center gap-4">
              {/* Area */}
              <div className="flex items-center gap-1.5 text-neutral-500" title="Area">
                <RulerDimensionLine size={16} />
                <span className="text-xs font-medium">{getLocaledArea(property.areaSqm || property.area || 0)}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-neutral-500" title="Rating">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium">{getLocaledRating(property.averageRating || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default CardProperty