import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('authToken')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '')

    console.log('[Admin Login History] Auth token:', authToken ? 'exists' : 'missing')

    if (!authToken) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
    const url = queryString 
      ? `${backendUrl}/api/admin/security/login-history?${queryString}`
      : `${backendUrl}/api/admin/security/login-history`

    console.log('[Admin Login History] Fetching from:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('[Admin Login History] Backend status:', response.status)

    if (!response.ok) {
      const error = await response.json()
      console.log('[Admin Login History] Backend error:', error)
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    console.log('[Admin Login History] Success, logs count:', data.data?.logins?.length || 0)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Admin Login History] API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch login history' 
      },
      { status: 500 }
    )
  }
}
