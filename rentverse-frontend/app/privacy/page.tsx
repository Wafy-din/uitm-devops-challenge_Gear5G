import ContentWrapper from '@/components/ContentWrapper'

export default function PrivacyPage() {
  return (
    <ContentWrapper>
      <div className="py-12 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-8">
            Last updated: December 16, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
            <p className="text-slate-700 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Name, email address, and phone number</li>
              <li>Account credentials and profile information</li>
              <li>Property listing information</li>
              <li>Booking and payment information</li>
              <li>Communications with us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your bookings and transactions</li>
              <li>Send you confirmations, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Detect, prevent, and address technical issues and fraud</li>
              <li>Send you marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Information Sharing</h2>
            <p className="text-slate-700 mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>With Property Owners:</strong> When you make a booking, we share necessary information with the property owner</li>
              <li><strong>With Service Providers:</strong> We work with third-party service providers who perform services on our behalf</li>
              <li><strong>For Legal Reasons:</strong> If required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of our business</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Data Security</h2>
            <p className="text-slate-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Your Rights and Choices</h2>
            <p className="text-slate-700 mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your information</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Request a copy of your information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Cookies and Tracking</h2>
            <p className="text-slate-700 mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our service</li>
              <li>Improve our service and user experience</li>
              <li>Provide personalized content and advertisements</li>
            </ul>
            <p className="text-slate-700 mt-4">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Children's Privacy</h2>
            <p className="text-slate-700 mb-4">
              Our service is not intended for children under 18 years of age. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Data Retention</h2>
            <p className="text-slate-700 mb-4">
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations.
              When we no longer need your information, we will securely delete or anonymize it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-slate-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page
              and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Contact Us</h2>
            <p className="text-slate-700">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@rentverse.com" className="text-teal-600 hover:text-teal-700">
                privacy@rentverse.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </ContentWrapper>
  )
}
