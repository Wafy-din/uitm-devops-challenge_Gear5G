import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('[VERIFY MFA] Request body:', JSON.stringify(body, null, 2))

    if (!body.sessionToken || !body.otp) {
      return NextResponse.json(
        { success: false, message: 'Session token and OTP are required' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
    
    console.log('[VERIFY MFA] Sending to backend:', backendUrl)
    
    const response = await fetch(`${backendUrl}/api/auth/mfa/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('[VERIFY MFA] Backend status:', response.status)
    
    const data = await response.json()
    
    console.log('[VERIFY MFA] Backend response:', JSON.stringify(data, null, 2))
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('MFA verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to verify MFA' },
      { status: 500 }
    )
  }
}
