interface LocationType {
  icon: string
  name: string
  description: string
}

interface PropertyType {
  icon: string
  name: string
  description: string
}

type GetAllLocationsType = () => Array<LocationType>
type GetAllPropertyTypesType = () => Array<PropertyType>

const locations: Array<LocationType> = [
  {
    icon: '🏢',
    name: 'Kuala Lumpur',
    description: 'Malaysia\'s bustling capital city',
  },
  {
    icon: '🏛️',
    name: 'Penang',
    description: 'UNESCO World Heritage Site with rich culture',
  },
  {
    icon: '🌺',
    name: 'Johor',
    description: 'Modern developments near Singapore',
  },
  {
    icon: '🏢',
    name: 'Selangor',
    description: 'Most developed state in Malaysia',
  },
  {
    icon: '🏔️',
    name: 'Perak',
    description: 'Limestone caves and heritage buildings',
  },
  {
    icon: '🌴',
    name: 'Kedah',
    description: 'Rice bowl of Malaysia',
  },
  {
    icon: '🏰',
    name: 'Melaka',
    description: 'Historic city with colonial architecture',
  },
  {
    icon: '🏞️',
    name: 'Pahang',
    description: 'Largest state with natural attractions',
  },
  {
    icon: '🌊',
    name: 'Sarawak',
    description: 'Land of the Hornbills',
  },
  {
    icon: '🏖️',
    name: 'Sabah',
    description: 'Gateway to Borneo adventures',
  },
  {
    icon: '🕌',
    name: 'Putrajaya',
    description: 'Malaysia\'s administrative capital',
  },
  {
    icon: '🌊',
    name: 'Terengganu',
    description: 'Beautiful beaches and islands',
  },
  {
    icon: '🏛️',
    name: 'Kelantan',
    description: 'Cradle of Malay culture',
  },
  {
    icon: '🌳',
    name: 'Negeri Sembilan',
    description: 'Minangkabau heritage',
  },
  {
    icon: '🏝️',
    name: 'Labuan',
    description: 'Duty-free island',
  },
  {
    icon: '🌾',
    name: 'Perlis',
    description: 'Smallest state in Malaysia',
  },
]

const propertyTypes: Array<PropertyType> = [
  {
    icon: '🏢',
    name: 'Property',
    description: 'All types of properties',
  },
  {
    icon: '🏬',
    name: 'Condominium',
    description: 'Modern condo living',
  },
  {
    icon: '🏠',
    name: 'Apartment',
    description: 'Urban apartment units',
  },
  {
    icon: '🏡',
    name: 'House',
    description: 'Single family homes',
  },
  {
    icon: '🏘️',
    name: 'Townhouse',
    description: 'Multi-story attached homes',
  },
  {
    icon: '🏰',
    name: 'Villa',
    description: 'Luxury standalone villas',
  },
  {
    icon: '🏙️',
    name: 'Penthouse',
    description: 'Top-floor luxury units',
  },
]

export const getAllLocations: GetAllLocationsType = () => {
  return locations
}

export const getAllPropertyTypes: GetAllPropertyTypesType = () => {
  return propertyTypes
}

// Property types for listing creation (excludes generic "Property" option)
export const getPropertyTypesForListing: GetAllPropertyTypesType = () => {
  return propertyTypes.filter(type => type.name !== 'Property')
}
