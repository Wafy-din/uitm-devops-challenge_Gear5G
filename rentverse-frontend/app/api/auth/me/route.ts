import { NextRequest, NextResponse } from 'next/server'
import { forwardRequest, getAuthHeader, createErrorResponse } from '@/utils/apiForwarder'

export async function GET(request: NextRequest) {
  try {
    // Check Authorization header first, then fall back to cookie
    let authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Try to get token from cookie
      const token = request.cookies.get('authToken')?.value
      console.log('[/api/auth/me] Token from cookie:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN')
      
      if (token) {
        authHeader = `Bearer ${token}`
      } else {
        return NextResponse.json(
          { success: false, message: 'Authorization token required' },
          { status: 401 }
        )
      }
    }
    
    console.log('[/api/auth/me] Sending to backend with Authorization:', authHeader.substring(0, 30) + '...')

    try {
      // Forward to backend's /me endpoint to get current user profile
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
      const url = `${backendUrl}/api/auth/me`
      
      console.log('[/api/auth/me] Backend URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      })
      
      console.log('[/api/auth/me] Backend response status:', response.status)

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const data = await response.json()
        console.log('[/api/auth/me] Backend response data:', data)
        return NextResponse.json(data, { status: response.status })
      } else {
        const text = await response.text()
        console.log('[/api/auth/me] Non-JSON response:', text)
        // If backend doesn't return JSON, create a generic error response
        return NextResponse.json(
          { success: false, message: 'Invalid response from backend' },
          { status: 502 }
        )
      }
    } catch (backendError) {
      console.error('Backend error during user profile fetch:', backendError)
      return NextResponse.json(
        createErrorResponse('Backend service unavailable', backendError as Error, 503),
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('Error during user profile fetch:', error)
    return NextResponse.json(
      createErrorResponse('Failed to fetch user profile', error as Error),
      { status: 500 }
    )
  }
}