'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, Heart, User } from 'lucide-react'
import clsx from 'clsx'
import useCurrentUser from '@/hooks/useCurrentUser'
import { useState } from 'react'
import MobileMenu from "@/components/MobileMenu"

function NavBarBottom() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useCurrentUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path
  // Account is active if menu is open or if we are on any account-related page
  const isAccountActive = isMenuOpen || pathname?.startsWith('/account') || pathname?.startsWith('/rents') || pathname?.startsWith('/property/all')

  const handleAccountClick = (e: React.MouseEvent) => {
    if (isAuthenticated) {
      e.preventDefault()
      setIsMenuOpen(true)
    } else {
      // Allow default navigation to /auth
    }
  }

  return (
    <>
      <nav className={clsx([
        'fixed z-50',
        'block md:hidden',
        'bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-bottom'
      ])}>
        <ul className="flex items-center justify-around py-3 px-4">
          <li>
            <Link
              href='/'
              className="flex flex-col items-center space-y-1 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search
                size={24}
                className={`transition-colors duration-200 ${isActive('/')
                    ? 'text-teal-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              />
              <span
                className={`text-xs font-medium transition-colors duration-200 ${isActive('/')
                    ? 'text-teal-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              >
                Explore
              </span>
            </Link>
          </li>
          <li>
            <Link
              href='/wishlist'
              className="flex flex-col items-center space-y-1 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart
                size={24}
                className={`transition-colors duration-200 ${isActive('/wishlist')
                    ? 'text-teal-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              />
              <span
                className={`text-xs font-medium transition-colors duration-200 ${isActive('/wishlist')
                    ? 'text-teal-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              >
                Wishlists
              </span>
            </Link>
          </li>
          <li>
            <Link
              href={isAuthenticated ? '#' : '/auth'}
              onClick={handleAccountClick}
              className="flex flex-col items-center space-y-1 group cursor-pointer"
            >
              <User
                size={24}
                className={`transition-colors duration-200 ${(isAuthenticated ? isAccountActive : isActive('/auth'))
                    ? 'text-teal-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              />
              <span
                className={`text-xs font-medium transition-colors duration-200 ${(isAuthenticated ? isAccountActive : isActive('/auth'))
                    ? 'text-teal-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              >
                {isAuthenticated ? 'Menu' : 'Log in'}
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  )
}

export default NavBarBottom