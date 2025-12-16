import ContentWrapper from '@/components/ContentWrapper'
import { Briefcase, Code, Users, TrendingUp } from 'lucide-react'

export default function CareersPage() {
  const positions = [
    {
      title: 'Full Stack Developer',
      department: 'Engineering',
      location: 'Johor Bahru / Remote',
      type: 'Full-time',
    },
    {
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Johor Bahru',
      type: 'Full-time',
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Kuala Lumpur',
      type: 'Full-time',
    },
    {
      title: 'Customer Support Specialist',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
    },
  ]

  return (
    <ContentWrapper>
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">Careers at RentVerse</h1>
        
        <p className="text-lg text-slate-700 mb-12 text-center max-w-2xl mx-auto">
          Join our team and help shape the future of property rental in Malaysia.
        </p>

        {/* Why Join Us */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-white rounded-xl border border-slate-200">
            <Briefcase className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">Great Benefits</h3>
            <p className="text-sm text-slate-600">Competitive salary and comprehensive benefits package</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl border border-slate-200">
            <Code className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">Modern Tech</h3>
            <p className="text-sm text-slate-600">Work with latest technologies and tools</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl border border-slate-200">
            <Users className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">Great Team</h3>
            <p className="text-sm text-slate-600">Collaborative and supportive work environment</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl border border-slate-200">
            <TrendingUp className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">Growth</h3>
            <p className="text-sm text-slate-600">Opportunities for professional development</p>
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions</h2>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Briefcase size={16} />
                        {position.department}
                      </span>
                      <span>📍 {position.location}</span>
                      <span>⏰ {position.type}</span>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Info */}
        <div className="mt-12 p-8 bg-teal-50 rounded-xl border border-teal-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">How to Apply</h3>
          <p className="text-slate-700 mb-4">
            Send your resume and cover letter to <strong>careers@rentverse.com</strong> with the position title in the subject line.
          </p>
          <p className="text-slate-600 text-sm">
            We review all applications carefully and will contact qualified candidates within 2 weeks.
          </p>
        </div>
      </div>
    </ContentWrapper>
  )
}
