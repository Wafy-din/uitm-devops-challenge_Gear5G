import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/stores/authStore'
import { App } from '@capacitor/app'

function AuthInitializer(): null {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const router = useRouter()

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    initializeAuth()

    // Listen for deep links (Capacitor)
    const setupDeepLinks = async () => {
      try {
        await App.addListener('appUrlOpen', (data: any) => {
          console.log('App URL Open:', data.url)
          try {
            // rentverse://auth/callback?token=...
            // We can replace the scheme with http to use standard URL parser if needed, 
            // but URL() often handles custom schemes too.
            const urlStr = data.url.replace('rentverse://', 'http://rentverse.app/')
            const url = new URL(urlStr)

            // Check path
            if (url.pathname.includes('auth/callback')) {
              const token = url.searchParams.get('token')
              const provider = url.searchParams.get('provider')

              if (token) {
                console.log('Deep link auth token found, redirecting...')
                router.push(`/auth/callback?token=${token}&provider=${provider || 'google'}`)
              }
            }
          } catch (err) {
            console.error('Error parsing deep link:', err)
          }
        })
      } catch (err) {
        // Ignored in non-native environments usually or if plugin missing
        console.log('Deep link listener not initialized:', err)
      }
    }

    setupDeepLinks()
  }, [initializeAuth, router])

  // This component doesn't render anything
  return null
}

export default AuthInitializer