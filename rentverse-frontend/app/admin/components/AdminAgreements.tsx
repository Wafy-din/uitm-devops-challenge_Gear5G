'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Filter, Calendar, User, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface AdminAgreement {
    id: string
    status: string
    generatedAt: string
    lease: {
        id: string
        startDate: string
        endDate: string
        rentAmount: string
        property: {
            id: string
            title: string
            address: string
            city: string
            images: string[]
        }
        landlord: {
            id: string
            name: string
            email: string
        }
        tenant: {
            id: string
            name: string
            email: string
        }
    }
    landlordSigned: boolean
    tenantSigned: boolean
}

interface AgreementsResponse {
    success: boolean
    data: {
        agreements: AdminAgreement[]
        pagination: {
            total: number
            pages: number
            page: number
            limit: number
        }
    }
}

export default function AdminAgreements() {
    const [agreements, setAgreements] = useState<AdminAgreement[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filters
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchAgreements()
    }, [page, statusFilter])

    const fetchAgreements = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('authToken')

            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                ...(statusFilter !== 'all' && { status: statusFilter }),
                ...(search && { search })
            })

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/agreements?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) throw new Error('Failed to fetch agreements')

            const data: AgreementsResponse = await response.json()
            if (data.success) {
                setAgreements(data.data.agreements)
                setTotalPages(data.data.pagination.pages)
            }
        } catch (err) {
            setError('Failed to load agreements')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchAgreements()
    }

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A'
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return 'Invalid Date'
            return date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        } catch (e) {
            return 'Error'
        }
    }

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by property, landlord, tenant..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                </form>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'draft', label: 'Draft' },
                        { id: 'pending_landlord', label: 'Pending Landlord' },
                        { id: 'pending_tenant', label: 'Pending Tenant' },
                        { id: 'active', label: 'Active' },
                        { id: 'completed', label: 'Completed' },
                        { id: 'expired', label: 'Expired' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${statusFilter === tab.id
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="text-center py-20 text-slate-500">Loading agreements...</div>
            ) : agreements.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No agreements found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {agreements.map(agreement => (
                        <div key={agreement.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col md:flex-row">
                            {/* Image Section */}
                            <div className="relative w-full md:w-64 h-40 md:h-auto shrink-0 bg-slate-100">
                                <Image
                                    src={agreement.lease.property.images?.[0] || '/placeholder-property.jpg'}
                                    alt={agreement.lease.property.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                    <StatusBadge status={agreement.status} />
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="flex-1 p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{agreement.lease.property.title}</h3>
                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                <Filter size={12} /> {agreement.lease.property.address}, {agreement.lease.property.city}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">Created</p>
                                            <p className="text-sm font-medium text-slate-700">{formatDate(agreement.generatedAt)}</p>
                                        </div>
                                    </div>

                                    {/* Parties Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${agreement.landlordSigned ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                {agreement.landlordSigned ? <CheckCircle size={16} /> : <Clock size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold">Landlord</p>
                                                <p className="text-sm font-medium text-slate-900">{agreement.lease.landlord.name}</p>
                                                <p className="text-xs text-slate-400">{agreement.lease.landlord.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${agreement.tenantSigned ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                {agreement.tenantSigned ? <CheckCircle size={16} /> : <Clock size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold">Tenant</p>
                                                <p className="text-sm font-medium text-slate-900">{agreement.lease.tenant.name}</p>
                                                <p className="text-xs text-slate-400">{agreement.lease.tenant.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar size={14} />
                                        {formatDate(agreement.lease.startDate)} - {formatDate(agreement.lease.endDate)}
                                    </div>
                                    <Link
                                        href={`/my-agreements/${agreement.lease.id}`}
                                        className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
                                    >
                                        View Contract
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 text-sm bg-white border border-slate-200 rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-slate-600 flex items-center">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 text-sm bg-white border border-slate-200 rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        COMPLETED: 'bg-green-100 text-green-700 border-green-200',
        ACTIVE: 'bg-green-100 text-green-700 border-green-200',
        PENDING_LANDLORD: 'bg-orange-50 text-orange-700 border-orange-200',
        PENDING_TENANT: 'bg-blue-50 text-blue-700 border-blue-200',
        DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
        EXPIRED: 'bg-red-50 text-red-700 border-red-200',
        CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    }

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[status as keyof typeof styles] || styles.DRAFT} flex items-center gap-1 shadow-sm`}>
            {status === 'PENDING_LANDLORD' || status === 'PENDING_TENANT' ? <Clock size={10} /> : null}
            {status.replace('_', ' ')}
        </span>
    )
}
