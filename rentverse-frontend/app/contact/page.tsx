import ContentWrapper from '@/components/ContentWrapper'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  return (
    <ContentWrapper>
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">Contact Us</h1>
        
        <p className="text-lg text-slate-700 mb-12 text-center max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Get in Touch</h2>
            
            <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200">
              <Mail className="w-6 h-6 text-teal-600 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900">Email</h3>
                <p className="text-slate-600">support@rentverse.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200">
              <Phone className="w-6 h-6 text-teal-600 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900">Phone</h3>
                <p className="text-slate-600">+60 12-345 6789</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200">
              <MapPin className="w-6 h-6 text-teal-600 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900">Office</h3>
                <p className="text-slate-600">
                  Jalan Universiti, Skudai<br />
                  Johor Bahru, Johor 81310<br />
                  Malaysia
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h3 className="font-semibold text-slate-900 mb-2">Business Hours</h3>
              <p className="text-slate-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-slate-700">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-slate-700">Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Send us a Message</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </ContentWrapper>
  )
}
