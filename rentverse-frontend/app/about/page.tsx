import ContentWrapper from '@/components/ContentWrapper'
import { Building2, Users, Award, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <ContentWrapper>
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">About RentVerse</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-slate-700 mb-8 text-center">
            Your trusted partner in finding the perfect rental property across Malaysia.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <Building2 className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Our Mission</h3>
              <p className="text-slate-600">
                To simplify the rental process by connecting property seekers with quality listings, 
                making it easier for everyone to find their ideal home.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <Users className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Our Team</h3>
              <p className="text-slate-600">
                A dedicated group of professionals committed to providing the best rental experience 
                through innovative technology and exceptional customer service.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <Award className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Our Values</h3>
              <p className="text-slate-600">
                Transparency, integrity, and customer satisfaction are at the core of everything we do. 
                We believe in building trust through honest and reliable service.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <Heart className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Our Promise</h3>
              <p className="text-slate-600">
                We promise to provide a seamless, secure, and user-friendly platform that makes 
                property hunting stress-free and enjoyable.
              </p>
            </div>
          </div>

          <div className="bg-teal-50 p-8 rounded-xl border border-teal-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Choose RentVerse?</h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Extensive database of verified rental properties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Advanced search filters to find your perfect match</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Secure booking and payment system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>24/7 customer support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>AI-powered price predictions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ContentWrapper>
  )
}
