import { NextRequest, NextResponse } from 'next/server'
import { forwardRequest, getAuthHeader, createErrorResponse } from '@/utils/apiForwarder'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.otp || !body.identifier) {
      return NextResponse.json(
        { success: false, message: 'OTP and identifier are required' },
        { status: 400 }
      )
    }

    const response = await forwardRequest('/api/auth/verify-otp', {
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
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      createErrorResponse('Failed to verify OTP', error as Error),
      { status: 500 }
    )
  }
}
