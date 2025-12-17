'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Search,
    Calendar,
    Heart,
    Home,
    FileText,
    Shield,
    User,
    Settings,
    LogOut,
    X
} from 'lucide-react'
import useAuthStore from '@/stores/authStore'
import useCurrentUser from '@/hooks/useCurrentUser'

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
}

function MobileMenu({ isOpen, onClose }: Readonly<MobileMenuProps>) {
    const { user } = useCurrentUser()
    const { logout } = useAuthStore()
    const router = useRouter()

    if (!isOpen) return null

    const handleLogout = () => {
        onClose()
        logout()
        router.push('/')
    }

    // Generate initials from first and last name
    const getInitials = (firstName: string, lastName: string): string => {
        const firstInitial = firstName?.charAt(0)?.toUpperCase() || ''
        const lastInitial = lastName?.charAt(0)?.toUpperCase() || ''
        if (firstInitial && lastInitial) return firstInitial + lastInitial
        if (firstInitial) return firstInitial
        if (lastInitial) return lastInitial
        return user?.email?.charAt(0)?.toUpperCase() || 'U'
    }

    const getFullName = (): string => {
        if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`
        if (user?.name) return user.name
        if (user?.firstName) return user.firstName
        if (user?.lastName) return user.lastName
        return 'User'
    }

    const initials = getInitials(user?.firstName || '', user?.lastName || '')
    const fullName = getFullName()

    const isAdmin = user?.role?.toLowerCase() === 'admin' ||
        user?.role === 'ADMIN' ||
        user?.email === 'admin@rentverse.com'

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
                onClick={onClose}
            />

            <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl shadow-xl overflow-hidden max-h-[85vh] overflow-y-auto animate-slide-up pb-safe">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-semibold flex items-center justify-center text-base">
                            {initials}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{fullName}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[150px]">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="py-2 pb-8">
                    {/* Customer Mode */}
                    <div className="px-6 py-2 mt-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Mode</p>
                    </div>

                    <Link
                        href="/property"
                        onClick={onClose}
                        className="flex items-center px-6 py-3.5 text-slate-700 active:bg-slate-50"
                    >
                        <Search size={20} className="mr-4 text-slate-400" />
                        <span className="font-medium text-base">Search Property</span>
                    </Link>

                    <Link
                        href="/rents"
                        onClick={onClose}
                        className="flex items-center px-6 py-3.5 text-slate-700 active:bg-slate-50"
                    >
                        <Calendar size={20} className="mr-4 text-slate-400" />
                        <span className="font-medium text-base">My Rents</span>
                    </Link>

                    <Link
                        href="/wishlist"
                        onClick={onClose}
                        className="flex items-center px-6 py-3.5 text-slate-700 active:bg-slate-50"
                    >
                        <Heart size={20} className="mr-4 text-slate-400" />
                        <span className="font-medium text-base">My Wishlists</span>
                    </Link>

                    {/* Seller Mode */}
                    <div className="px-6 py-2 mt-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seller Mode</p>
                    </div>

                    <Link
                        href="/property/all"
                        onClick={onClose}
                        className="flex items-center px-6 py-3.5 text-slate-700 active:bg-slate-50"
                    >
                        <Home size={20} className="mr-4 text-slate-400" />
                        <span className="font-medium text-base">My Listings</span>
                    </Link>

                    <Link
                        href="/my-agreements?view=landlord"
                        onClick={onClose}
                        className="flex items-center px-6 py-3.5 text-slate-700 active:bg-slate-50"
                    >
                        <FileText size={20} className="mr-4 text-slate-400" />
                        <span className="font-medium text-base">My Agreements</span>
                    </Link>

                    {/* Admin Mode */}
                    {isAdmin && (
                        <>
                            <div className="px-6 py-2 mt-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Portal</p>
                            </div>
                            <Link
                                href="/admin"
                                onClick={onClose}
                                className="flex items-center px-6 py-3.5 text-slate-700 active:bg-slate-50"
                            >
                                <Shield size={20} className="mr-4 text-slate-400" />
                                <span className="font-medium text-base">Admin Dashboard</span>
                            </Link>
                        </>
                    )}

                    {/* Settings & Account */}
                    <div className="border-t border-slate-100 my-4 mx-6"></div>

                    <Link
                        href="/account"
                        onClick={onClose}
                        className="flex items-center px-6 py-3.5 text-slate-700 active:bg-slate-50"
                    >
                        <User size={20} className="mr-4 text-slate-400" />
                        <span className="font-medium text-base">Account Profile</span>
                    </Link>

                    <Link
                        href="/account/settings"
                        onClick={onClose}
                        className="flex items-center px-6 py-3.5 text-slate-700 active:bg-slate-50"
                    >
                        <Settings size={20} className="mr-4 text-slate-400" />
                        <span className="font-medium text-base">Settings</span>
                    </Link>

                    {/* Logout */}
                    <div className="border-t border-slate-100 mt-4 mb-2 mx-6"></div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-6 py-3.5 text-red-600 active:bg-red-50"
                    >
                        <LogOut size={20} className="mr-4 text-red-500" />
                        <span className="font-medium text-base">Log out</span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default MobileMenu
