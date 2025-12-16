import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip auth redirect check - let client-side handle it
  // This prevents issues with stale cookies and allows proper auth flow

  // Only apply middleware to API routes that are being rewritten
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 })
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
      response.headers.set('Access-Control-Max-Age', '86400')
      return response
    }
    
    // Clone the request headers to ensure they're forwarded
    const requestHeaders = new Headers(request.headers)
    
    // Ensure authorization header is properly forwarded
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization')
    if (authHeader) {
      requestHeaders.set('Authorization', authHeader)
    }
    
    // For development, add debug logging similar to apiForwarder
    if (process.env.NODE_ENV === 'development') {
      console.log(`[REWRITE] ${request.method} ${request.nextUrl.pathname}${request.nextUrl.search}`)
      if (authHeader) {
        console.log(`[REWRITE] Auth header present: ${authHeader.substring(0, 20)}...`)
      }
    }
    
    // Create response that will be rewritten
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all API routes for rewriting and auth routes for redirect protection
     */
    '/api/:path*',
    '/auth/:path*',
  ],
}