import { NextRequest, NextResponse } from 'next/server'
import { forwardRequest, getAuthHeader, createErrorResponse } from '@/utils/apiForwarder'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.email && !body.phone) {
      return NextResponse.json(
        { success: false, message: 'Email or phone is required' },
        { status: 400 }
      )
    }

    const response = await forwardRequest('/api/auth/send-otp', {
      method: 'POST',
      headers: {
        ...getAuthHeader(request),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      timeout: 30000,
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      createErrorResponse('Failed to send OTP', error as Error),
      { status: 500 }
    )
  }
}
