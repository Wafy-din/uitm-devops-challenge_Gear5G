import { NextRequest, NextResponse } from 'next/server'
import { forwardRequest, getAuthHeader, createErrorResponse } from '@/utils/apiForwarder'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    const endpoint = queryString ? `/api/properties/my-properties?${queryString}` : '/api/properties/my-properties'

    const response = await forwardRequest(endpoint, {
      method: 'GET',
      headers: {
        ...getAuthHeader(request),
        'Content-Type': 'application/json',
      },
      timeout: 60000,
      retries: 2,
    })

    const contentType = response.headers.get('Content-Type') || ''
    if (!contentType.includes('application/json')) {
      return new Response(await response.text(), {
        status: response.status,
        headers: response.headers,
      })
    }

    const data = await response.json()
    return NextResponse.json(data, {
      status: response.status,
    })

  } catch (error) {
    console.error('My Properties API forwarding error:', error)
    
    return NextResponse.json(
      createErrorResponse(
        'Failed to fetch my properties',
        error instanceof Error ? error : undefined,
        500
      ),
      { status: 500 }
    )
  }
}
