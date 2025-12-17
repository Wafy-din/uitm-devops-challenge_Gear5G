import ContentWrapper from '@/components/ContentWrapper'
import { HelpCircle, Search, Book, MessageCircle } from 'lucide-react'

export default function HelpPage() {
  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I search for properties?',
          a: 'Use the search box on the homepage to enter your desired location, duration, and property type. Click search to view available properties.',
        },
        {
          q: 'Do I need an account to browse properties?',
          a: 'No, you can browse properties without an account. However, you need to create an account to book properties or save favorites.',
        },
      ],
    },
    {
      category: 'Booking',
      questions: [
        {
          q: 'How do I book a property?',
          a: 'Click on a property to view details, then click the "Book Now" button. Follow the steps to complete your booking.',
        },
        {
          q: 'Can I cancel my booking?',
          a: 'Yes, cancellation policies vary by property. Check the cancellation policy on the property page before booking.',
        },
        {
          q: 'How do I pay for my booking?',
          a: 'We accept various payment methods including credit cards, debit cards, and online banking.',
        },
      ],
    },
    {
      category: 'Account',
      questions: [
        {
          q: 'How do I reset my password?',
          a: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.',
        },
        {
          q: 'How do I update my profile?',
          a: 'Log in and click on your profile icon, then select "Account" to edit your information.',
        },
      ],
    },
    {
      category: 'Listing Properties',
      questions: [
        {
          q: 'How can I list my property?',
          a: 'Click "List your property" in the navigation bar and fill out the listing form with your property details.',
        },
        {
          q: 'Is there a fee for listing?',
          a: 'Basic listings are free. Premium features are available with our subscription plans.',
        },
      ],
    },
  ]

  return (
    <ContentWrapper>
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">Help Center (FAQ)</h1>
        
        <p className="text-lg text-slate-700 mb-12 text-center max-w-2xl mx-auto">
          Find answers to commonly asked questions about using RentVerse.
        </p>

        {/* Quick Links */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <Search className="w-8 h-8 text-teal-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Search</h3>
              <p className="text-xs text-slate-600">Find properties</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <Book className="w-8 h-8 text-teal-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Booking</h3>
              <p className="text-xs text-slate-600">Make a booking</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <HelpCircle className="w-8 h-8 text-teal-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Account</h3>
              <p className="text-xs text-slate-600">Manage account</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <MessageCircle className="w-8 h-8 text-teal-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Support</h3>
              <p className="text-xs text-slate-600">Contact us</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-8">
          {faqs.map((category, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <span className="font-semibold text-slate-900">{faq.q}</span>
                      <span className="text-teal-600 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-2 p-4 text-slate-600">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 p-8 bg-teal-50 rounded-xl border border-teal-200 text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Still need help?</h3>
          <p className="text-slate-700 mb-4">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </ContentWrapper>
  )
}
