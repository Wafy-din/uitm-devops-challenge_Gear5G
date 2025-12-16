import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('[RESEND OTP] Request body:', JSON.stringify(body, null, 2))

    if (!body.sessionToken) {
      return NextResponse.json(
        { success: false, message: 'Session token is required' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
    
    console.log('[RESEND OTP] Sending to backend:', backendUrl)
    
    const response = await fetch(`${backendUrl}/api/auth/mfa/resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionToken: body.sessionToken }),
    })

    console.log('[RESEND OTP] Backend status:', response.status)

    const data = await response.json()
    
    console.log('[RESEND OTP] Backend response:', JSON.stringify(data, null, 2))
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[RESEND OTP] Error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to resend OTP' },
      { status: 500 }
    )
  }
}
