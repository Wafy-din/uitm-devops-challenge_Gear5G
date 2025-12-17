'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Filter, MapPin, Building, User, LayoutGrid, List } from 'lucide-react'
import { createApiUrl } from '@/utils/apiConfig'

interface AdminProperty {
    id: string
    title: string
    address: string
    city: string
    price: string
    currencyCode: string
    isAvailable: boolean
    status: string
    createdAt: string
    images: string[]
    owner: {
        id: string
        name: string
        email: string
    }
    propertyType: {
        name: string
        icon: string
    }
}

interface PropertiesResponse {
    success: boolean
    data: {
        properties: AdminProperty[]
        pagination: {
            total: number
            pages: number
            page: number
            limit: number
        }
    }
}

export default function AdminProperties() {
    const [properties, setProperties] = useState<AdminProperty[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filters
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchProperties()
    }, [page, statusFilter]) // Search should ideally be debounced, but for now trigger on enter or separate button

    const fetchProperties = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('authToken')

            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                ...(statusFilter !== 'all' && { status: statusFilter }),
                ...(search && { search })
            })

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/properties?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) throw new Error('Failed to fetch properties')

            const data: PropertiesResponse = await response.json()
            if (data.success) {
                setProperties(data.data.properties)
                setTotalPages(data.data.pagination.pages)
            }
        } catch (err) {
            setError('Failed to load properties')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchProperties()
    }

    const formatPrice = (price: string, currency: string) => {
        return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: currency || 'MYR',
            minimumFractionDigits: 0
        }).format(parseFloat(price))
    }

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search properties, owners..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                </form>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setStatusFilter('approved')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'approved' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Approved
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'pending' ? 'bg-white text-yellow-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setStatusFilter('rejected')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'rejected' ? 'bg-white text-red-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Rejected
                        </button>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="text-center py-20 text-slate-500">Loading properties...</div>
            ) : properties.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No properties found matching your filters.</p>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {properties.map(property => (
                        <div
                            key={property.id}
                            className={`bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                        >
                            {/* Image */}
                            <div className={`relative bg-slate-100 ${viewMode === 'list' ? 'w-full md:w-64 h-48 md:h-auto shrink-0' : 'h-48 w-full'}`}>
                                <Image
                                    src={property.images[0] || '/placeholder-property.jpg'}
                                    alt={property.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <StatusBadge status={property.status} />
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900 line-clamp-1">{property.title}</h3>
                                        <span className="font-bold text-slate-900 whitespace-nowrap ml-4">
                                            {formatPrice(property.price, property.currencyCode)}<span className="text-xs font-normal text-slate-500">/mo</span>
                                        </span>
                                    </div>

                                    <div className="flex items-center text-slate-500 text-sm mb-4">
                                        <MapPin size={14} className="mr-1" />
                                        <span className="line-clamp-1">{property.address}, {property.city}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <User size={14} />
                                            <span className="font-medium text-slate-700">{property.owner.name}</span>
                                        </div>
                                        <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <Link
                                        href={`/property/${property.id}`}
                                        className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                    >
                                        View
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
        APPROVED: 'bg-green-100 text-green-700 border-green-200',
        PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        PENDING_REVIEW: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        REJECTED: 'bg-red-100 text-red-700 border-red-200',
        DELETED: 'bg-slate-100 text-slate-700 border-slate-200',
    }

    const label = status === 'PENDING_REVIEW' ? 'PENDING' : status

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[status as keyof typeof styles] || styles.DELETED}`}>
            {label}
        </span>
    )
}
