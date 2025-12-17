'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Home, Mail, User, Download, AlertCircle, CheckCircle, Clock, FileText, MapPin } from 'lucide-react'
import ContentWrapper from '@/components/ContentWrapper'
import useAuthStore from '@/stores/authStore'
import { createApiUrl } from '@/utils/apiConfig'
import { toast } from 'react-hot-toast'
import DigitalSignature from '@/components/DigitalSignature'

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
}

export default function AgreementDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { id } = params
    const { user, isLoggedIn } = useAuthStore()

    const [booking, setBooking] = useState<Booking | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [downloading, setDownloading] = useState(false)

    // New state for signing
    const [showSignModal, setShowSignModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Local signature state
    const [localSignatures, setLocalSignatures] = useState<{
        landlord: Record<string, boolean>,
        tenant: Record<string, boolean>
    }>({ landlord: {}, tenant: {} })

    useEffect(() => {
        // Load signatures from BOTH landlord and tenant storage separately
        const landlordData = localStorage.getItem('landlord_signatures')
        const tenantData = localStorage.getItem('tenant_signatures')

        setLocalSignatures({
            landlord: landlordData ? JSON.parse(landlordData) : {},
            tenant: tenantData ? JSON.parse(tenantData) : {}
        })
    }, [])

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!isLoggedIn || !id || !user) return

            try {
                const token = localStorage.getItem('authToken')
                if (!token) throw new Error('No auth token found')

                setIsLoading(true)

                // ADMIN Handling
                if (user.role === 'ADMIN') {
                    const res = await fetch(`/api/admin/agreements/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })

                    if (res.ok) {
                        const data = await res.json()
                        if (data.success && data.data) {
                            // Map RentalAgreement to Booking (Lease) structure
                            // The admin endpoint returns the RentalAgreement (data.data) which contains the lease (data.data.lease)
                            const rentalAgreement = data.data;
                            const lease = rentalAgreement.lease;

                            // Reconstruct the booking object as expected by the UI component
                            const mappedBooking: Booking = {
                                ...lease,
                                agreement: rentalAgreement // Attach the agreement object to the booking
                            };

                            setBooking(mappedBooking)
                            return;
                        }
                    }
                    // If fail, fall through to normal checks (though likely won't work for admin)
                }

                // Normal User Handling (Landlord/Tenant)
                const ownerRes = await fetch('/api/bookings/owner-bookings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const myRes = await fetch('/api/bookings/my-bookings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                let foundBooking: Booking | null = null;

                if (ownerRes.ok) {
                    const data = await ownerRes.json()
                    if (data.success) {
                        const b = data.data.bookings.find((b: Booking) => b.id === id)
                        if (b) foundBooking = b
                    }
                }

                if (!foundBooking && myRes.ok) {
                    const data = await myRes.json()
                    if (data.success) {
                        const b = data.data.bookings.find((b: Booking) => b.id === id)
                        if (b) foundBooking = b
                    }
                }

                if (foundBooking) {
                    setBooking(foundBooking)
                } else {
                    setError('Agreement not found')
                }

            } catch (err) {
                console.error('Error fetching booking:', err)
                setError('Failed to load agreement details')
            } finally {
                setIsLoading(false)
            }
        }

        fetchBookingDetails()
    }, [id, isLoggedIn, user])

    // Helper to check if current user is landlord or tenant
    const getUserRole = () => {
        if (!booking || !user) return null;
        if (booking.landlord?.id === user.id) return 'landlord';
        if (booking.tenant?.id === user.id) return 'tenant';
        // Fallback for demo/testing if IDs don't match perfectly but email does, or just rely on backend
        if (booking.landlord?.email === user.email) return 'landlord';
        if (booking.tenant?.email === user.email) return 'tenant';
        return null;
    }

    const userRole = getUserRole();

    const canUserSign = () => {
        if (!booking || !userRole) return false;

        const isCompleted = booking.status === 'COMPLETED' || booking.status === 'ACTIVE';
        if (isCompleted) return false;

        // Landlord Logic
        if (userRole === 'landlord') {
            const alreadySigned = isSigned('landlord');
            // Can sign if not signed yet AND status is appropriate
            return !alreadySigned && (booking.status === 'PENDING_LANDLORD' || booking.status === 'DRAFT' || booking.status === 'APPROVED');
        }

        // Tenant Logic
        if (userRole === 'tenant') {
            const alreadySigned = isSigned('tenant');
            const landlordSigned = isSigned('landlord');

            // Can ONLY sign if Landlord has ALREADY signed
            return !alreadySigned && landlordSigned;
        }

        return false;
    };

    const isSigned = (role: 'landlord' | 'tenant') => {
        if (!booking) return false;
        // Logic: Backend data OR LocalStorage data
        if (role === 'landlord') {
            return booking.agreement?.landlordSigned || localSignatures.landlord[booking.id]
        } else {
            return booking.agreement?.tenantSigned || localSignatures.tenant[booking.id]
        }
    }

    const handleSignatureSave = async (signatureDataUrl: string) => {
        if (!booking || !userRole) return;

        setIsSubmitting(true);
        const toastId = toast.loading('Saving signature...');

        try {
            const token = localStorage.getItem('authToken');
            const endpoint = `/api/agreements/${booking.id || id}/sign/${userRole}`;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    signature: signatureDataUrl,
                    confirmed: true
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Failed to sign agreement');
            }

            // Update local state to reflect change immediately
            if (booking.agreement) {
                const updatedAgreement = { ...booking.agreement };
                if (userRole === 'landlord') {
                    updatedAgreement.landlordSigned = true;
                    updatedAgreement.landlordSignedAt = new Date().toISOString();
                } else {
                    updatedAgreement.tenantSigned = true;
                    updatedAgreement.tenantSignedAt = new Date().toISOString();
                }
                setBooking({ ...booking, agreement: updatedAgreement, status: data.data?.status || booking.status });
            } else {
                window.location.reload();
            }

            toast.dismiss(toastId);
            toast.success('Agreement signed successfully!');
            setShowSignModal(false);

        } catch (error: any) {
            console.error('Signing error:', error);
            toast.dismiss(toastId);
            toast.error(error.message || 'Failed to sign');
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadAgreement = async () => {
        if (!booking) return
        try {
            setDownloading(true)
            const token = localStorage.getItem('authToken')

            const response = await fetch(createApiUrl(`bookings/${booking.id}/rental-agreement`), {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (!response.ok) throw new Error('Failed to fetch PDF')

            const data = await response.json()
            if (data.success && data.data.pdf) {
                window.open(data.data.pdf.url, '_blank')
            } else {
                toast.error('PDF not available')
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to download agreement')
        } finally {
            setDownloading(false)
        }
    }

    const cancelAgreement = async () => {
        if (!confirm('Are you sure you want to cancel this agreement? This action cannot be undone.')) return;
        toast.error('Cancellation feature coming soon')
    }

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    const formatMoney = (amount: string) => parseFloat(amount).toLocaleString('en-US')

    if (isLoading) {
        return (
            <ContentWrapper>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </ContentWrapper>
        )
    }

    if (error || !booking) {
        return (
            <ContentWrapper>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
                        <AlertCircle className="mr-2" />
                        {error || 'Agreement not found'}
                    </div>
                    <Link href={user?.role === 'ADMIN' ? "/admin" : "/my-agreements"} className="mt-4 inline-flex items-center text-slate-600 hover:text-slate-900">
                        <ArrowLeft size={16} className="mr-1" /> {user?.role === 'ADMIN' ? "Back to Admin Dashboard" : "Back to My Agreements"}
                    </Link>
                </div>
            </ContentWrapper>
        )
    }

    return (
        <ContentWrapper>
            <div className="max-w-4xl mx-auto px-4 py-8 relative">
                {/* Modal Overlay */}
                {showSignModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <DigitalSignature
                            onSave={handleSignatureSave}
                            onCancel={() => setShowSignModal(false)}
                        />
                    </div>
                )}

                {/* Top Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <Link href={user?.role === 'ADMIN' ? "/admin" : "/my-agreements"} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        <span className="font-medium">Back</span>
                    </Link>
                    <div className="flex items-center space-x-3">
                        <h1 className="text-xl font-bold text-slate-800 flex items-center">
                            <FileText className="mr-2 text-purple-600" />
                            Digital Agreement
                        </h1>
                    </div>
                    {(() => {
                        const landlordSigned = isSigned('landlord')
                        const tenantSigned = isSigned('tenant')
                        const isFullySigned = landlordSigned && tenantSigned

                        let badgeClass = 'bg-slate-100 text-slate-700'
                        let badgeText = booking.status || 'Pending'

                        if (booking.status === 'APPROVED' || booking.status === 'PENDING_LANDLORD' || booking.status === 'PENDING_TENANT') {
                            if (isFullySigned) {
                                badgeClass = 'bg-green-100 text-green-700'
                                badgeText = 'Active'
                            } else {
                                badgeClass = 'bg-blue-100 text-blue-700'
                                badgeText = 'Awaiting Signing'
                            }
                        } else if (booking.status === 'ACTIVE' || booking.status === 'COMPLETED') {
                            badgeClass = 'bg-green-100 text-green-700'
                            badgeText = 'Active'
                        } else if (booking.status === 'CANCELLED') {
                            badgeClass = 'bg-red-100 text-red-700'
                            badgeText = 'Cancelled'
                        }

                        return (
                            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${badgeClass}`}>
                                {badgeText}
                            </div>
                        )
                    })()}
                </div>

                {/* Hero Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                    <div className="relative h-48 w-full">
                        <Image
                            src={booking.property.images?.[0] || '/placeholder-property.jpg'}
                            alt={booking.property.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                            <h2 className="text-2xl font-bold text-white mb-1">{booking.property.title}</h2>
                            <div className="flex items-center text-white/90">
                                <MapPin size={16} className="mr-1.5" />
                                {booking.property.address}, {booking.property.city}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-t border-slate-100">
                        <div className="p-6 flex items-start space-x-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Lease Period</p>
                                <p className="font-semibold text-slate-900">
                                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 flex items-start space-x-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                                <Home size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Monthly Rent</p>
                                <p className="font-semibold text-slate-900 text-lg">
                                    {booking.currencyCode || 'RM'} {formatMoney(booking.rentAmount)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signing Parties */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Signing Parties</h3>

                    <div className="space-y-4">
                        {/* Landlord Card */}
                        <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border ${userRole === 'landlord' ? 'border-teal-200 bg-teal-50/30' : 'border-slate-100 bg-slate-50/50'}`}>
                            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                                    {booking.landlord?.name?.charAt(0) || 'L'}
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                                        Landlord {userRole === 'landlord' && '(You)'}
                                    </div>
                                    <div className="font-medium text-slate-900">{booking.landlord?.name || 'Unknown'}</div>
                                    <div className="text-sm text-slate-500">{booking.landlord?.email || 'No email'}</div>
                                </div>
                            </div>
                            <div>
                                {isSigned('landlord') ? (
                                    <div className="flex flex-col items-end">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white shadow-sm">
                                            <CheckCircle size={14} className="mr-1.5" /> Signed
                                        </span>
                                        {booking.agreement?.landlordSignedAt && (
                                            <span className="text-xs text-slate-400 mt-1">
                                                {new Date(booking.agreement.landlordSignedAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    userRole === 'landlord' && canUserSign() ? (
                                        <button
                                            onClick={() => setShowSignModal(true)}
                                            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                                        >
                                            Sign Now
                                        </button>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                                            <Clock size={14} className="mr-1.5" /> Pending Signature
                                        </span>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Tenant Card */}
                        <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border ${userRole === 'tenant' ? 'border-teal-200 bg-teal-50/30' : 'border-slate-100 bg-slate-50/50'}`}>
                            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                                    {booking.tenant?.name?.charAt(0) || 'T'}
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                                        Tenant {userRole === 'tenant' && '(You)'}
                                    </div>
                                    <div className="font-medium text-slate-900">{booking.tenant?.name || booking.tenant?.firstName || user?.name || 'Unknown'}</div>
                                    <div className="text-sm text-slate-500">{booking.tenant?.email || user?.email || 'No email'}</div>
                                </div>
                            </div>
                            <div>
                                {isSigned('tenant') ? (
                                    <div className="flex flex-col items-end">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white shadow-sm">
                                            <CheckCircle size={14} className="mr-1.5" /> Signed
                                        </span>
                                    </div>
                                ) : (
                                    userRole === 'tenant' ? (
                                        canUserSign() ? (
                                            <button
                                                onClick={() => setShowSignModal(true)}
                                                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                                            >
                                                Sign Now
                                            </button>
                                        ) : (
                                            !isSigned('landlord') ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-500" title="Landlord must sign first">
                                                    Waiting for Landlord
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-500 text-white shadow-sm">
                                                    Action Required
                                                </span>
                                            )
                                        )
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-500">
                                            Awaiting Tenant
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agreement Document */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Agreement Document</h3>
                    <button
                        onClick={downloadAgreement}
                        disabled={downloading}
                        className="w-full sm:w-auto flex items-center justify-center px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors"
                    >
                        {downloading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600 mr-2"></div>
                        ) : (
                            <Download size={18} className="mr-2 text-slate-500" />
                        )}
                        Download Full Agreement PDF
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="border border-red-100 bg-red-50 rounded-xl p-6">
                    <h3 className="text-red-800 font-semibold mb-2">Cancel Agreement</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-sm text-red-600">
                            This action cannot be undone. The agreement will be permanently cancelled.
                        </p>
                        <button
                            onClick={cancelAgreement}
                            className="whitespace-nowrap px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center"
                        >
                            <AlertCircle size={16} className="mr-2" />
                            Cancel Agreement
                        </button>
                    </div>
                </div>

            </div>
        </ContentWrapper>
    )
}
