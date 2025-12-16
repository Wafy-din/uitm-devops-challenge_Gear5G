import { create } from 'zustand'
import type { SecurityLog, ThreatAlert } from '@/types/security'

interface SecurityState {
  alerts: ThreatAlert[]
  logs: SecurityLog[]
  unreadAlerts: number
  isMonitoring: boolean
}

interface SecurityActions {
  addAlert: (alert: Omit<ThreatAlert, 'id' | 'timestamp'>) => void
  markAlertResolved: (id: string) => void
  clearAlerts: () => void
  addLog: (log: Omit<SecurityLog, 'id' | 'timestamp'>) => void
  fetchAlerts: () => Promise<void>
  fetchLogs: (filters?: any) => Promise<void>
  startMonitoring: () => void
  stopMonitoring: () => void
}

type SecurityStore = SecurityState & SecurityActions

const useSecurityStore = create<SecurityStore>((set, get) => ({
  alerts: [],
  logs: [],
  unreadAlerts: 0,
  isMonitoring: false,

  addAlert: (alert) => {
    const newAlert: ThreatAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
    }

    set((state) => ({
      alerts: [newAlert, ...state.alerts],
      unreadAlerts: state.unreadAlerts + 1,
    }))

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Security Alert', {
          body: newAlert.message,
          icon: '/alert-sign.png',
        })
      }
    }
  },

  markAlertResolved: (id) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, resolved: true } : alert
      ),
      unreadAlerts: Math.max(0, state.unreadAlerts - 1),
    }))
  },

  clearAlerts: () => {
    set({ alerts: [], unreadAlerts: 0 })
  },

  addLog: (log) => {
    const newLog: SecurityLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    set((state) => ({
      logs: [newLog, ...state.logs].slice(0, 1000),
    }))
  },

  fetchAlerts: async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      if (!token) return

      const response = await fetch('/api/security/alerts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          set({
            alerts: data.data.alerts,
            unreadAlerts: data.data.alerts.filter((a: ThreatAlert) => !a.resolved).length,
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  },

  fetchLogs: async (filters = {}) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      if (!token) {
        console.log('[SecurityStore] No auth token found')
        return
      }

      console.log('[SecurityStore] Fetching logs with filters:', filters)

      // Use admin security endpoint
      const response = await fetch('/api/admin/security/login-history?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log('[SecurityStore] Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('[SecurityStore] Response data:', data)
        
        if (data.success && data.data.logins) {
          // Transform login history to security logs format
          const transformedLogs = data.data.logins.map((login: any) => ({
            id: login.id,
            timestamp: login.createdAt,
            action: 'login',
            userId: login.userId,
            userEmail: login.user?.email || 'Unknown',
            userName: login.user ? `${login.user.firstName || ''} ${login.user.lastName || ''}`.trim() : null,
            userRole: login.user?.role || null,
            ipAddress: login.ipAddress || 'Unknown',
            status: login.success ? 'success' : 'failed',
            riskLevel: login.riskScore >= 50 ? 'high' : login.riskScore >= 30 ? 'medium' : 'low',
            deviceInfo: login.userAgent || 'Unknown',
            location: login.location || 'Unknown',
            details: {
              userAgent: login.userAgent,
              riskScore: login.riskScore,
              failReason: login.failReason,
              user: login.user,
            },
          }))
          
          console.log('[SecurityStore] Transformed logs:', transformedLogs.length)
          set({ logs: transformedLogs })
        } else {
          console.log('[SecurityStore] No logs data in response')
          set({ logs: [] })
        }
      } else {
        console.error('[SecurityStore] Failed to fetch logs, status:', response.status)
        set({ logs: [] })
      }
    } catch (error) {
      console.error('[SecurityStore] Failed to fetch logs:', error)
      set({ logs: [] })
    }
  },

  startMonitoring: () => {
    set({ isMonitoring: true })
    
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }

    const interval = setInterval(() => {
      get().fetchAlerts()
    }, 30000)

    if (typeof window !== 'undefined') {
      ;(window as any).__securityMonitorInterval = interval
    }
  },

  stopMonitoring: () => {
    set({ isMonitoring: false })
    
    if (typeof window !== 'undefined' && (window as any).__securityMonitorInterval) {
      clearInterval((window as any).__securityMonitorInterval)
    }
  },
}))

export default useSecurityStore
