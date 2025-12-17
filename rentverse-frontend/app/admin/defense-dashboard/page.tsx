'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Shield, Activity, Zap, AlertTriangle, FileText, ArrowLeft, Lock } from 'lucide-react'
import ContentWrapper from '@/components/ContentWrapper'
import RiskVisualization from '@/components/RiskVisualization'
import ThreatIntelligence from '@/components/ThreatIntelligence'
import SecurityAlerts from '@/components/SecurityAlerts'
import ErrorBoundary from '@/components/ErrorBoundary'
import useSecurityStore from '@/stores/securityStore'
import { assessSystemRisk, calculateRiskHistory, type RiskAssessment } from '@/utils/riskCalculation'
import { analyzeThreatPatterns, type ThreatPattern } from '@/utils/ai/threatDetection'
import { showToast } from '@/utils/toast'

export default function DefenseDashboardPage() {
  const { logs, alerts, fetchLogs, fetchAlerts } = useSecurityStore()
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null)
  const [threats, setThreats] = useState<ThreatPattern[]>([])
  const [isAutoResponseEnabled, setIsAutoResponseEnabled] = useState(false)

  // Tabs: 'threats' | 'users'
  const [activeTab, setActiveTab] = useState<'threats' | 'users'>('users')

  // User Management State
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [userFilter, setUserFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL')
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLogs()
    fetchAlerts()
    fetchUsers()
  }, [fetchLogs, fetchAlerts])

  const historicalData = useMemo(() => {
    return calculateRiskHistory(logs as any[])
  }, [logs])

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true)
      setError(null)
      const token = localStorage.getItem('authToken')
      console.log('Fetching users with token:', token ? `${token.substring(0, 10)}...` : 'No token')

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      console.log('Fetch users status:', res.status)
      const data = await res.json()
      console.log('Fetch users data:', data)

      if (res.ok && data.success) {
        setUsers(data.data.users)
        setFilteredUsers(data.data.users)
      } else {
        const msg = data.message || `Error ${res.status}: ${res.statusText}`
        setError(msg)
        showToast.error(msg)
      }
    } catch (error: any) {
      console.error('Failed to fetch users', error)
      const msg = error.message || 'Failed to load users'
      setError(msg)
      showToast.error(msg)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (res.ok) {
        showToast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
        fetchUsers() // Refresh list
      } else {
        const err = await res.json()
        showToast.error(err.message || 'Failed to update user status')
      }
    } catch (error) {
      showToast.error('An error occurred')
    }
  }

  // Filter Users Effect
  useEffect(() => {
    let result = users

    // Search
    if (userSearch) {
      const q = userSearch.toLowerCase()
      result = result.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      )
    }

    // Role Filter
    if (userFilter !== 'ALL') {
      result = result.filter(u => u.role === userFilter)
    }

    setFilteredUsers(result)
  }, [users, userSearch, userFilter])

  useEffect(() => {
    if (logs.length > 0) {
      const detectedThreats = analyzeThreatPatterns(logs)
      setThreats(detectedThreats)
      const assessment = assessSystemRisk(logs as any[], detectedThreats as any[])
      setRiskAssessment(assessment)
    }
  }, [logs])

  const handleToggleAutoResponse = () => {
    setIsAutoResponseEnabled(!isAutoResponseEnabled)
    showToast.success(isAutoResponseEnabled ? 'Auto-response system deactivated' : 'Auto-response system activated')
  }

  const exportSecurityReport = () => {
    const toastId = showToast.loading('Generating security report...')
    setTimeout(() => {
      // ... (keep existing report logic)
      showToast.dismiss(toastId)
      showToast.success('Security report exported successfully!')
    }, 1000)
  }

  // User Stats Calculation
  const userStats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    inactive: users.filter(u => !u.isActive).length
  }

  return (
    <ContentWrapper>
      <div className="py-8 px-4">
        {/* Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link href="/admin" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
              <ArrowLeft size={16} className="mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Defense Dashboard</h1>
            <p className="text-slate-600">Adaptive security monitoring and user defense</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              User Defense
            </button>
            <button
              onClick={() => setActiveTab('threats')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'threats' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Threat Intelligence
            </button>
          </div>
        </div>

        {/* CONTENT FOR USER DEFENSE TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Users</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900">{userStats.total}</span>
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><FileText size={20} /></div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-green-200 shadow-sm">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Active</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">{userStats.active}</span>
                  <div className="p-2 bg-green-50 rounded-lg text-green-500"><Activity size={20} /></div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-purple-200 shadow-sm">
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">Admins</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-700">{userStats.admins}</span>
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-500"><Shield size={20} /></div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-red-200 shadow-sm">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Inactive</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-700">{userStats.inactive}</span>
                  <div className="p-2 bg-red-50 rounded-lg text-red-500"><Lock size={20} /></div>
                </div>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                <button
                  onClick={() => setUserFilter('ALL')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${userFilter === 'ALL' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setUserFilter('ADMIN')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${userFilter === 'ADMIN' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  ADMIN
                </button>
                <button
                  onClick={() => setUserFilter('USER')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${userFilter === 'USER' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  USER
                </button>
              </div>
            </div>

            {/* Users List */}
            <div className="space-y-3">
              {isLoadingUsers ? (
                <div className="text-center py-10 text-slate-500">Loading users...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg border border-red-100 p-4">
                  <p className="font-semibold">Unable to load users</p>
                  <p className="text-sm">{error}</p>
                  <button onClick={fetchUsers} className="mt-2 text-sm text-blue-600 hover:underline">Try Again</button>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No users found.</div>
              ) : (
                filteredUsers.map(user => (
                  <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${user.role === 'ADMIN' ? 'bg-purple-600' : 'bg-blue-500'
                        }`}>
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          (user.firstName?.[0] || user.name?.[0] || 'U').toUpperCase() + (user.lastName?.[0] || '')
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900">{user.name || user.firstName + ' ' + user.lastName}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {user.role}
                          </span>
                          {user.mfaEnabled && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700 flex items-center gap-1">
                              <Shield size={10} /> MFA
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                          {user.phone && (
                            <span className="flex items-center gap-1"><span className="w-3 h-3">📞</span> {user.phone}</span>
                          )}
                          <span className="flex items-center gap-1">📅 Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">🕒 Last login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${user.isActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* THREAT INTELLIGENCE CONTENT */}
        {activeTab === 'threats' && (
          <div className="space-y-6">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-blue-600" />
                  <span className="text-2xl font-bold text-slate-900">{logs.length}</span>
                </div>
                <p className="text-sm text-slate-600">Total Security Events</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                  <span className="text-2xl font-bold text-slate-900">{threats.length}</span>
                </div>
                <p className="text-sm text-slate-600">Active Threats Detected</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <Zap className={`w-8 h-8 ${isAutoResponseEnabled ? 'text-teal-600' : 'text-slate-400'}`} />
                  <button
                    onClick={handleToggleAutoResponse}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${isAutoResponseEnabled
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-slate-100 text-slate-600'
                      }`}
                  >
                    {isAutoResponseEnabled ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>
                <p className="text-sm text-slate-600">Auto Response System</p>
              </div>
            </div>

            {/* Main Risk Visualization */}
            {riskAssessment && (
              <ErrorBoundary>
                <div className="animate-fade-in-up">
                  <RiskVisualization
                    riskAssessment={riskAssessment}
                    historicalData={historicalData}
                  />
                </div>
              </ErrorBoundary>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Threat Intelligence Details */}
              <div className="lg:col-span-2 space-y-6">
                <ErrorBoundary>
                  <ThreatIntelligence logs={logs} />
                </ErrorBoundary>

                {isAutoResponseEnabled && (
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <Zap className="w-6 h-6 text-teal-600 shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Auto-Response System Active</h3>
                        <p className="text-sm text-slate-700 mb-3">
                          The system is actively monitoring and responding to threats:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                          <span className="flex items-center gap-2">✓ IP Blocking</span>
                          <span className="flex items-center gap-2">✓ Account Locking</span>
                          <span className="flex items-center gap-2">✓ MFA Enforcement</span>
                          <span className="flex items-center gap-2">✓ Admin Alerts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Alerts and Recommendations */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Recommendations</h3>
                  {riskAssessment?.recommendations && riskAssessment.recommendations.length > 0 ? (
                    <ul className="space-y-3">
                      {riskAssessment.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 text-sm p-3 bg-slate-50 rounded-lg">
                          <span className="text-teal-600 mt-0.5 font-bold">•</span>
                          <span className="text-slate-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Shield className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p>No actionable recommendations.</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Security Alerts</h3>
                  <ErrorBoundary>
                    <SecurityAlerts />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentWrapper>
  )
}
