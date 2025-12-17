'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ContentWrapper from '@/components/ContentWrapper'
import useAuthStore from '@/stores/authStore'
import toast from 'react-hot-toast'
import {
  Bell,
  Mail,
  MessageSquare,
  Globe,
  Moon,
  Sun,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  Check,
  ChevronRight
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoggedIn, isLoading: authLoading, logout } = useAuthStore()

  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingUpdates: true,
    propertyRecommendations: true,
    marketingEmails: false,
    profileVisibility: 'public' as 'public' | 'private',
    showEmail: false,
    showPhone: false,
    language: 'en',
    currency: 'MYR',
    theme: 'light' as 'light' | 'dark',
  })

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/auth')
    }
  }, [isLoggedIn, authLoading, router])

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSelect = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings))
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Save settings error:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )
    if (!confirmed) return

    const doubleConfirm = window.confirm(
      'This will permanently delete all your data, bookings, and listings. Continue?'
    )
    if (!doubleConfirm) return

    const toastId = toast.loading('Deleting account...')

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account')
      }

      toast.dismiss(toastId)
      toast.success('Account deleted successfully')

      // Clear auth state and redirect
      logout()
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      router.push('/')

    } catch (error: any) {
      toast.dismiss(toastId)
      toast.error(error.message || 'Something went wrong')
      console.error('Delete account error:', error)
    }
  }

  if (authLoading || !user) {
    return (
      <ContentWrapper>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </ContentWrapper>
    )
  }

  return (
    <ContentWrapper>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your notifications, privacy, and preferences</p>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
              <p className="text-sm text-slate-500">Choose how you want to be notified</p>
            </div>
          </div>

          <div className="space-y-4">
            <SettingToggle
              icon={<Mail className="w-5 h-5 text-slate-400" />}
              label="Email Notifications"
              description="Receive notifications via email"
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
            <SettingToggle
              icon={<MessageSquare className="w-5 h-5 text-slate-400" />}
              label="SMS Notifications"
              description="Receive text messages for important updates"
              checked={settings.smsNotifications}
              onChange={() => handleToggle('smsNotifications')}
            />
            <SettingToggle
              icon={<Bell className="w-5 h-5 text-slate-400" />}
              label="Push Notifications"
              description="Receive push notifications in your browser"
              checked={settings.pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
            />

            <div className="border-t border-slate-200 pt-4 mt-4">
              <p className="text-sm font-medium text-slate-700 mb-3">Notification Types</p>
              <SettingToggle
                label="Booking Updates"
                description="Get notified about booking confirmations"
                checked={settings.bookingUpdates}
                onChange={() => handleToggle('bookingUpdates')}
                small
              />
              <SettingToggle
                label="Property Recommendations"
                description="Receive personalized property suggestions"
                checked={settings.propertyRecommendations}
                onChange={() => handleToggle('propertyRecommendations')}
                small
              />
              <SettingToggle
                label="Marketing Emails"
                description="Get updates about new features"
                checked={settings.marketingEmails}
                onChange={() => handleToggle('marketingEmails')}
                small
              />
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Privacy</h2>
              <p className="text-sm text-slate-500">Control your privacy settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Profile Visibility
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSelect('profileVisibility', 'public')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${settings.profileVisibility === 'public'
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-medium text-slate-900">Public</div>
                      <div className="text-xs text-slate-500">Everyone can see</div>
                    </div>
                    {settings.profileVisibility === 'public' && (
                      <Check className="w-5 h-5 text-teal-600" />
                    )}
                  </div>
                </button>
                <button
                  onClick={() => handleSelect('profileVisibility', 'private')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${settings.profileVisibility === 'private'
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-medium text-slate-900">Private</div>
                      <div className="text-xs text-slate-500">Only you can see</div>
                    </div>
                    {settings.profileVisibility === 'private' && (
                      <Check className="w-5 h-5 text-teal-600" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            <SettingToggle
              icon={settings.showEmail ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              label="Show Email Address"
              description="Display email on public profile"
              checked={settings.showEmail}
              onChange={() => handleToggle('showEmail')}
            />
            <SettingToggle
              icon={settings.showPhone ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              label="Show Phone Number"
              description="Display phone on public profile"
              checked={settings.showPhone}
              onChange={() => handleToggle('showPhone')}
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Preferences</h2>
              <p className="text-sm text-slate-500">Customize your experience</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSelect('language', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="en">English</option>
                <option value="ms">Bahasa Melayu</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleSelect('currency', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="MYR">MYR - Malaysian Ringgit</option>
                <option value="USD">USD - US Dollar</option>
                <option value="SGD">SGD - Singapore Dollar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSelect('theme', 'light')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${settings.theme === 'light' ? 'border-teal-600 bg-teal-50' : 'border-slate-200'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium">Light</span>
                    </div>
                    {settings.theme === 'light' && <Check className="w-5 h-5 text-teal-600" />}
                  </div>
                </button>
                <button
                  onClick={() => handleSelect('theme', 'dark')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${settings.theme === 'dark' ? 'border-teal-600 bg-teal-50' : 'border-slate-200'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="w-5 h-5" />
                      <span className="font-medium">Dark</span>
                    </div>
                    {settings.theme === 'dark' && <Check className="w-5 h-5 text-teal-600" />}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Links</h2>
          <button
            onClick={() => router.push('/account')}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-lg"
          >
            <span>Account Information</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h2>
          <p className="text-sm text-red-700 mb-4">
            Once you delete your account, there is no going back.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            'Save All Settings'
          )}
        </button>
      </div>
    </ContentWrapper>
  )
}

interface SettingToggleProps {
  icon?: React.ReactNode
  label: string
  description: string
  checked: boolean
  onChange: () => void
  small?: boolean
}

function SettingToggle({ icon, label, description, checked, onChange, small = false }: SettingToggleProps) {
  return (
    <div className={`flex items-center justify-between ${small ? 'py-2' : 'py-3'}`}>
      <div className="flex items-center gap-3 flex-1">
        {icon && <div className="text-slate-400">{icon}</div>}
        <div>
          <div className={`font-medium text-slate-900 ${small ? 'text-sm' : ''}`}>{label}</div>
          <div className={`text-slate-500 ${small ? 'text-xs' : 'text-sm'}`}>{description}</div>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-teal-600' : 'bg-slate-300'
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  )
}
