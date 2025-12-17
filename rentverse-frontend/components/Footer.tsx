import Link from 'next/link'
import { Globe } from 'lucide-react'
import { FaXTwitter } from 'react-icons/fa6'
import { FaInstagram, FaFacebook } from 'react-icons/fa'
import FooterWrapper from '@/components/FooterWrapper'

function Footer() {
  return (
    <FooterWrapper>
      <footer className="w-full bg-neutral-900 text-neutral-400 pt-16 pb-8 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* RentVerse Section */}
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-xl font-serif font-bold text-white mb-6">
                RentVerse
              </h3>
              <p className="text-sm leading-relaxed mb-6">
                Reimagining the rental experience in Malaysia with trust, transparency, and technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-neutral-800 rounded-full hover:bg-brand-600 hover:text-white transition-all">
                  <FaFacebook size={18} />
                </a>
                <a href="#" className="p-2 bg-neutral-800 rounded-full hover:bg-brand-600 hover:text-white transition-all">
                  <FaXTwitter size={18} />
                </a>
                <a href="#" className="p-2 bg-neutral-800 rounded-full hover:bg-brand-600 hover:text-white transition-all">
                  <FaInstagram size={18} />
                </a>
              </div>
            </div>

            {/* Explore Section */}
            <div>
              <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider mb-6">
                Explore
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/property/result" className="text-sm hover:text-brand-400 transition-colors duration-200">
                    All Properties
                  </Link>
                </li>
                <li>
                  <Link href="/#popular-locations" className="text-sm hover:text-brand-400 transition-colors duration-200">
                    Popular Locations
                  </Link>
                </li>
                <li>
                  <Link href="/property/new" className="text-sm hover:text-brand-400 transition-colors duration-200">
                    List Your Property
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider mb-6">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm hover:text-brand-400 transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm hover:text-brand-400 transition-colors duration-200">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm hover:text-brand-400 transition-colors duration-200">
                    Contact Cards
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider mb-6">
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/help" className="text-sm hover:text-brand-400 transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm hover:text-brand-400 transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm hover:text-brand-400 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-800">
            {/* Copyright */}
            <div className="mb-4 md:mb-0">
              <span className="text-neutral-500 text-sm">
                © {new Date().getFullYear()} Metaairflow Sdn. Bhd. All rights reserved.
              </span>
            </div>

            {/* Language & Currency */}
            <div className="flex items-center space-x-6">
              <div
                className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer">
                <Globe size={16} />
                <span className="text-sm font-medium">English (US)</span>
              </div>

              <div
                className="flex items-center space-x-1 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer">
                <span className="text-sm font-medium">RM</span>
                <span className="text-sm">MYR</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </FooterWrapper>
  )
}

export default Footer
