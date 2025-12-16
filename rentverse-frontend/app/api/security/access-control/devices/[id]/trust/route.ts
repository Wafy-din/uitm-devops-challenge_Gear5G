import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authToken = request.cookies.get('authToken')?.value

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
    
    const response = await fetch(`${backendUrl}/api/security/access-control/devices/${id}/trust`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Device trust API error:', error)
    return NextResponse.json(
      { error: 'Failed to update device trust' },
      { status: 500 }
    )
  }
}
