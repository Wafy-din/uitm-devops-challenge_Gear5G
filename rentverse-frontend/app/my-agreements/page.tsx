'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ContentWrapper from '@/components/ContentWrapper'
import { Calendar, MapPin, User, FileText, CheckCircle, Clock } from 'lucide-react'
import useAuthStore from '@/stores/authStore'
import AgreementSignModal from '@/components/AgreementSignModal'
import { toast } from 'react-hot-toast'

interface Agreement {
  id: string
  status: string
  landlordSigned: boolean
  tenantSigned: boolean
  landlordSignedAt?: string
  tenantSignedAt?: string
}

interface Booking {
  id: string
  startDate: string
  endDate: string
  rentAmount: string
  currencyCode: string
  status: string
  notes: string
  createdAt: string
  property: {
    id: string
    title: string
    address: string
    city: string
    images: string[]
    price: string
    currencyCode: string
  }
  tenant?: {
    id: string
    email: string
    firstName: string
    lastName: string
    name: string
  }
  landlord?: {
    id: string
    name: string
    email?: string
    firstName?: string
    lastName?: string
  }
  agreement?: Agreement | null
  // Added for unified view
  role?: 'landlord' | 'tenant'
}

interface BookingsResponse {
  success: boolean
  data: {
    bookings: Booking[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

type TabType = 'all' | 'landlord' | 'tenant'

export default function MyAgreementsPage() {
  const router = useRouter()
  // viewMode is no longer driven by URL param for fetching, but we can default tab if needed
  // default to 'all'

  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const { isLoggedIn, user } = useAuthStore()

  // Signing state
  const [isSignModalOpen, setIsSignModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // Store signatures for BOTH roles
  const [localSignatures, setLocalSignatures] = useState<{
    landlord: Record<string, boolean>,
    tenant: Record<string, boolean>
  }>({ landlord: {}, tenant: {} })

  useEffect(() => {
    // Load signatures from LocalStorage
    const landlordData = localStorage.getItem('landlord_signatures')
    const tenantData = localStorage.getItem('tenant_signatures')

    setLocalSignatures({
      landlord: landlordData ? JSON.parse(landlordData) : {},
      tenant: tenantData ? JSON.parse(tenantData) : {}
    })
  }, [])

  const fetchAllBookings = async () => {
    if (!isLoggedIn) {
      setIsLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Authentication token not found')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      // Fetch both endpoints in parallel
      const [ownerRes, myRes] = await Promise.all([
        fetch('/api/bookings/owner-bookings', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/bookings/my-bookings', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        })
      ])

      const ownerData: BookingsResponse = await ownerRes.json()
      const myData: BookingsResponse = await myRes.json()

      let combinedBookings: Booking[] = []

      // Tag and add Owner bookings (As Landlord)
      if (ownerRes.ok && ownerData.success) {
        const taggedOwnerBookings = ownerData.data.bookings.map(b => ({ ...b, role: 'landlord' as const }))
        combinedBookings = [...combinedBookings, ...taggedOwnerBookings]
      }

      // Tag and add My bookings (As Tenant)
      if (myRes.ok && myData.success) {
        const taggedMyBookings = myData.data.bookings.map(b => ({ ...b, role: 'tenant' as const }))
        combinedBookings = [...combinedBookings, ...taggedMyBookings]
      }

      // Sort by recency (optional)
      combinedBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setBookings(combinedBookings)

    } catch (err) {
      console.error('Error fetching agreements:', err)
      setError(err instanceof Error ? err.message : 'Failed to load agreements')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllBookings()
  }, [isLoggedIn])

  const handleSignClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsSignModalOpen(true)
  }

  const handleSignComplete = (signature: string) => {
    if (selectedBooking && selectedBooking.role) {
      const isLandlord = selectedBooking.role === 'landlord'
      const storageKey = isLandlord ? 'landlord_signatures' : 'tenant_signatures'
      const currentRoleSignatures = isLandlord ? localSignatures.landlord : localSignatures.tenant
      const newRoleSignatures = { ...currentRoleSignatures, [selectedBooking.id]: true }

      // Update local state
      setLocalSignatures(prev => ({
        ...prev,
        [isLandlord ? 'landlord' : 'tenant']: newRoleSignatures
      }))

      // Persist to localStorage
      localStorage.setItem(storageKey, JSON.stringify(newRoleSignatures))

      toast.success('Agreement signed successfully!')
      setIsSignModalOpen(false)
      setSelectedBooking(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Determine filtering
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true
    return booking.role === activeTab
  })

  // Calculate counts for tabs
  const countAll = bookings.length
  const countLandlord = bookings.filter(b => b.role === 'landlord').length
  const countTenant = bookings.filter(b => b.role === 'tenant').length

  const getSignatureStatus = (bookingId: string, agreement: Agreement | null | undefined) => {
    const landlordLocallySigned = !!localSignatures.landlord[bookingId]
    const tenantLocallySigned = !!localSignatures.tenant[bookingId]

    return {
      landlordSigned: agreement?.landlordSigned || landlordLocallySigned,
      tenantSigned: agreement?.tenantSigned || tenantLocallySigned
    }
  }

  if (!isLoggedIn) {
    return (
      <ContentWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Please log in</h2>
          <Link href="/auth" className="px-6 py-3 bg-teal-600 text-white rounded-lg">Log In</Link>
        </div>
      </ContentWrapper>
    )
  }

  return (
    <ContentWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="text-purple-600" />
            My Agreements
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage and sign your rental agreements</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === 'all'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            All ({countAll})
          </button>
          <button
            onClick={() => setActiveTab('landlord')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2
                    ${activeTab === 'landlord'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            As Landlord ({countLandlord})
          </button>
          <button
            onClick={() => setActiveTab('tenant')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2
                    ${activeTab === 'tenant'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            As Tenant ({countTenant})
          </button>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
        ) : isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-purple-600 rounded-full border-t-transparent"></div></div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No agreements found in this view.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const { landlordSigned, tenantSigned } = getSignatureStatus(booking.id, booking.agreement)
              const isLandlordRole = booking.role === 'landlord'

              const canSign = (booking.status === 'APPROVED' || booking.status === 'ACTIVE')
                && (isLandlordRole ? !landlordSigned : (!tenantSigned && landlordSigned))

              const isFullySigned = landlordSigned && tenantSigned

              return (
                <div key={booking.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row group h-full md:h-[220px]">

                  {/* Left: Image (Fixed width 300px on desktop) */}
                  <div className="relative w-full md:w-[320px] h-48 md:h-auto shrink-0 bg-slate-200">
                    <Image
                      src={booking.property.images?.[0] || '/placeholder-property.jpg'}
                      alt={booking.property.title}
                      fill
                      className="object-cover"
                    />
                    {/* Badges on Image */}
                    {!isLandlordRole && (
                      <div className="absolute top-4 left-4 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-sm shadow-sm flex items-center gap-1">
                        <Clock size={12} /> My Rent
                      </div>
                    )}
                    {isLandlordRole && (
                      <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-sm shadow-sm flex items-center gap-1">
                        <User size={12} /> My Listing
                      </div>
                    )}
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between relative">
                    {/* Top Section */}
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-purple-600 transition-colors pr-20">
                          {booking.property.title}
                        </h3>
                        {/* Status Badge (Absolute Top Right of Card Content) */}
                        <div className="absolute top-6 right-6">
                          {isFullySigned && booking.status === 'APPROVED' ? (
                            <div className="flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div> Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200">
                              <Clock size={10} /> {booking.status === 'APPROVED' ? 'Draft' : booking.status}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-slate-500 flex items-center mb-3">
                        <MapPin size={14} className="mr-1" />
                        {booking.property.address}, {booking.property.city}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-slate-600 mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                        <User size={14} className="text-slate-400" />
                        {isLandlordRole ? (
                          <>Tenant: <span className="font-medium text-slate-900">{booking.tenant?.name || booking.tenant?.firstName || 'Unknown'}</span></>
                        ) : (
                          <>Landlord: <span className="font-medium text-slate-900">{booking.landlord?.name || 'Unknown'}</span></>
                        )}
                      </div>

                      {/* Sign Status Text */}
                      <div className="flex items-center gap-4 text-xs mt-2">
                        <div className={`flex items-center gap-1 ${landlordSigned ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                          {landlordSigned ? <CheckCircle size={12} /> : <Clock size={12} />}
                          Landlord: {landlordSigned ? 'Signed' : 'Pending'} {isLandlordRole && '(You)'}
                        </div>
                        <div className={`flex items-center gap-1 ${tenantSigned ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                          {tenantSigned ? <CheckCircle size={12} /> : <Clock size={12} />}
                          Tenant: {tenantSigned ? 'Signed' : 'Pending'} {!isLandlordRole && '(You)'}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between mt-4 md:mt-0 pt-4 md:pt-0">
                      <div className="text-xs text-slate-400">
                        Created: {formatDate(booking.createdAt)}
                      </div>
                      <div className="flex gap-2 items-center">
                        {!canSign && !isLandlordRole && !tenantSigned && !landlordSigned && (booking.status === 'APPROVED' || booking.status === 'ACTIVE') && (
                          <span className="text-amber-600 text-xs font-medium bg-amber-50 px-2 py-1 rounded border border-amber-100 mr-2">
                            Waiting for Landlord
                          </span>
                        )}
                        {canSign && (
                          <button
                            onClick={() => handleSignClick(booking)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Sign Now
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/my-agreements/${booking.id}`)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm shadow-indigo-200"
                        >
                          <FileText size={14} className="mr-2" /> View Agreement
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <AgreementSignModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onSign={handleSignComplete}
        bookingTitle={selectedBooking?.property.title || 'Property'}
        role={selectedBooking?.role || 'tenant'}
      />
    </ContentWrapper>
  )
}
