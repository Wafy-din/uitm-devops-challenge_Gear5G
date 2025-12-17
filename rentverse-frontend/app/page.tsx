import Image from 'next/image'
import ContentWrapper from '@/components/ContentWrapper'
import SearchBoxProperty from '@/components/SearchBoxProperty'
import ListFeatured from '@/components/ListFeatured'
import ListPopularLocation from '@/components/ListPopularLocation'
import { ArrowRight, Shield, MapPin, Star, UserCheck } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-neutral-50 overflow-hidden">
      <ContentWrapper>
        {/* Modern Hero Section */}
        <section className="relative min-h-[600px] md:min-h-[85vh] flex flex-col items-center justify-center pt-20 pb-12 px-4 mb-16 overflow-visible">

          {/* Background Elements */}
          <div className="absolute inset-0 z-0 select-none">
            <Image
              src="https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758183708/rentverse-base/hero_bg_desktop_z8j6pg.png"
              alt="Hero Background"
              fill
              className="object-cover object-center hidden md:block"
              priority
            />
            <Image
              src="https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758183708/rentverse-base/hero_bg_mobile_s4xpxr.png"
              alt="Hero Background"
              fill
              className="object-cover object-center md:hidden"
              priority
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-neutral-50/90 backdrop-blur-[1px]"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-5xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-sm font-semibold shadow-sm animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Rental Platform in Malaysia
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-7xl min-[1400px]:text-8xl text-neutral-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up delay-100">
              The right <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600 italic">Home</span> <br className="hidden lg:block" />
              is waiting for you.
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up delay-200">
              Explore thousands of verified apartments, condominiums, and landed properties.
              The future of renting is transparent, secure, and purely digital.
            </p>

            <div className="animate-fade-in-up delay-300 w-full max-w-4xl mx-auto px-4 lg:px-0">
              <SearchBoxProperty className="transform transition-transform hover:scale-[1.01]" />
            </div>

            {/* Trending Tags */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in-up delay-500">
              <span className="text-sm text-neutral-500 font-medium">Trending:</span>
              {['Mont Kiara', 'Bangsar South', 'KLCC', 'Cyberjaya'].map((loc) => (
                <Link href={`/property/result?city=${loc}`} key={loc} className="px-3 py-1 bg-white/60 hover:bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-600 transition-colors shadow-sm">
                  {loc}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats / Trust Section */}
        <section className="py-20 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: Shield, label: 'Verified Owners', value: '10,000+', color: 'text-brand-600', bg: 'bg-brand-50' },
                { icon: MapPin, label: 'Prime Locations', value: '200+', color: 'text-accent-600', bg: 'bg-accent-50' },
                { icon: Star, label: 'Satisfaction', value: '4.9/5', color: 'text-amber-500', bg: 'bg-amber-50' },
                { icon: UserCheck, label: 'Active Tenants', value: '50k+', color: 'text-blue-500', bg: 'bg-blue-50' }
              ].map((stat, idx) => (
                <div key={idx} className="glass p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                  <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={28} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-neutral-900 tracking-tight">{stat.value}</h3>
                    <p className="text-sm text-neutral-500 font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-24 px-4 bg-white relative overflow-hidden">
          {/* Decorative blurred blobs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-100 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-100 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 opacity-60"></div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl md:text-5xl text-neutral-900 mb-6">Discover your booking with Gear5G</h2>
              <p className="text-lg text-neutral-600">
                Trusted by Thousands of Tenants and Property Owners
              </p>
            </div>

            <div className="relative group">
              {/* Glow effect behind dashboard */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-accent-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200/50 bg-neutral-900">
                <Image
                  src="https://res.cloudinary.com/dqhuvu22u/image/upload/f_webp/v1758186240/rentverse-base/sample-dashboard_h7ez5z.png"
                  alt="Rentverse Dashboard Interface"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Lists */}
        <div className="bg-neutral-50 pb-20">
          <ListFeatured />
          <ListPopularLocation />
        </div>

      </ContentWrapper>
    </div>
  )
}
