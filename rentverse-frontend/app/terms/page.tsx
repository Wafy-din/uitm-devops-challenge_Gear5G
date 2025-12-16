import ContentWrapper from '@/components/ContentWrapper'

export default function TermsPage() {
  return (
    <ContentWrapper>
      <div className="py-12 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Terms & Conditions</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-8">
            Last updated: December 16, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-700 mb-4">
              By accessing and using RentVerse, you accept and agree to be bound by the terms and provisions of this agreement.
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Use of Service</h2>
            <p className="text-slate-700 mb-4">
              RentVerse provides an online platform for property rental listings and bookings. You agree to use the service only for lawful purposes and in accordance with these Terms.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>You must be at least 18 years old to use this service</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree to provide accurate and current information</li>
              <li>You will not use the service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Property Listings</h2>
            <p className="text-slate-700 mb-4">
              Property owners and landlords who list properties on RentVerse must:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Provide accurate and truthful information about their properties</li>
              <li>Have legal authority to rent the property</li>
              <li>Comply with all applicable local laws and regulations</li>
              <li>Honor confirmed bookings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Bookings and Payments</h2>
            <p className="text-slate-700 mb-4">
              When making a booking through RentVerse:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>All bookings are subject to availability and confirmation</li>
              <li>Payment terms are specified at the time of booking</li>
              <li>Cancellation policies vary by property and are stated in the listing</li>
              <li>RentVerse may charge service fees for bookings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Prohibited Activities</h2>
            <p className="text-slate-700 mb-4">
              You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Post false, misleading, or fraudulent content</li>
              <li>Violate any laws or regulations</li>
              <li>Interfere with or disrupt the service</li>
              <li>Attempt to gain unauthorized access to the system</li>
              <li>Engage in any form of harassment or abusive behavior</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-slate-700 mb-4">
              RentVerse acts as a platform to connect property owners with renters. We are not responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>The accuracy of property listings</li>
              <li>The condition or quality of rental properties</li>
              <li>Disputes between property owners and renters</li>
              <li>Any damages or losses incurred during rental periods</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Modifications to Terms</h2>
            <p className="text-slate-700 mb-4">
              RentVerse reserves the right to modify these terms at any time. We will notify users of any material changes.
              Continued use of the service after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Contact Information</h2>
            <p className="text-slate-700">
              For questions about these Terms & Conditions, please contact us at{' '}
              <a href="mailto:legal@rentverse.com" className="text-teal-600 hover:text-teal-700">
                legal@rentverse.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </ContentWrapper>
  )
}
