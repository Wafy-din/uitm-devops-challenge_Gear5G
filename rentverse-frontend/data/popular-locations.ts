import { LocationBaseType } from '@/types/location'

type getPopularLocations = () => Array<LocationBaseType>

// City name mapping untuk search compatibility
// Maps display name → { city, state } for better search results
export const citySearchMapping: Record<string, { city: string; state?: string }> = {
  'Kuala Lumpur': { city: 'Kuala Lumpur', state: 'Kuala Lumpur' },
  'Petaling Jaya': { city: 'Petaling Jaya', state: 'Selangor' }, 
  'Subang Jaya': { city: 'Subang Jaya', state: 'Selangor' },
  'Penang Island': { city: 'Penang', state: 'Penang' },
  'Johor Bahru': { city: 'Johor Bahru', state: 'Johor' },
  'Shah Alam': { city: 'Shah Alam', state: 'Selangor' },
  'Putrajaya': { city: 'Putrajaya', state: 'Putrajaya' },
  'Georgetown, Penang': { city: 'George Town', state: 'Penang' },
  'Butterworth, Penang': { city: 'Butterworth', state: 'Penang' },
  'Bayan Lepas, Penang': { city: 'Bayan Lepas', state: 'Penang' },
  'Bukit Mertajam, Penang': { city: 'Bukit Mertajam', state: 'Penang' },
}

const popularLocations: Array<LocationBaseType> = [
  {
    name: 'Putrajaya',
    imageUrl: 'https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758027181/rentverse-locations/kuala-lumpur_zbmm3x.png',
    latitude: 2.9264,
    longitude: 101.6964,
  },
  {
    name: 'Petaling Jaya',
    imageUrl: 'https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758027174/rentverse-locations/petaling-jaya_vpzude.png',
    latitude: 3.1073,
    longitude: 101.6482,
  },
  {
    name: 'Subang Jaya',
    imageUrl: 'https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758027170/rentverse-locations/subang-jaya_xidmex.png',
    latitude: 3.1516,
    longitude: 101.5877,
  },
  {
    name: 'Penang Island',
    imageUrl: 'https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758027170/rentverse-locations/penang-island_axjqzm.png',
    latitude: 5.4164,
    longitude: 100.3327,
  },
  {
    name: 'Johor Bahru',
    imageUrl: 'https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758027166/rentverse-locations/johor-bahru_sij5vg.png',
    latitude: 1.4927,
    longitude: 103.7414,
  },
  {
    name: 'Shah Alam',
    imageUrl: 'https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758027182/rentverse-locations/shah-alam_swukrl.png',
    latitude: 3.0733,
    longitude: 101.5185,
  },
  // Additional Penang locations for better dropdown options
  {
    name: 'Georgetown, Penang',
    imageUrl: 'https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758027170/rentverse-locations/penang-island_axjqzm.png',
    latitude: 5.4141,
    longitude: 100.3288,
  },
  {
    name: 'Butterworth, Penang',
    imageUrl: 'https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758027170/rentverse-locations/penang-island_axjqzm.png',
    latitude: 5.4012,
    longitude: 100.3629,
  },
  {
    name: 'Bayan Lepas, Penang',
    imageUrl: 'https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758027170/rentverse-locations/penang-island_axjqzm.png',
    latitude: 5.2946,
    longitude: 100.2658,
  },
  {
    name: 'Bukit Mertajam, Penang',
    imageUrl: 'https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758027170/rentverse-locations/penang-island_axjqzm.png',
    latitude: 5.3619,
    longitude: 100.4689,
  },
]

export const getPopularLocations: getPopularLocations = () => {
  return popularLocations
}
