import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
    const platform = request.nextUrl.searchParams.get('platform');

    let googleAuthUrl = `${backendUrl}/api/auth/google`
    if (platform) {
      googleAuthUrl += `?platform=${platform}`
    }

    return NextResponse.redirect(googleAuthUrl)
  } catch (error) {
    console.error('Google OAuth redirect error:', error)
    return NextResponse.redirect(
      new URL('/auth?error=oauth_failed', request.url)
    )
  }
}
