import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get client IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  // Store IP in response headers
  const response = NextResponse.next()
  response.headers.set('x-client-ip', ip)

  // Allow admin panel without auth - it's a secret URL
  if (pathname === '/lighttvadminvin') {
    return response
  }

  // Allow permanent bypass route
  if (pathname === '/permanentmoa') {
    return response
  }

  // Allow token-based user content URLs
  if (pathname.startsWith('/user/usermovies/')) {
    return response
  }

  // Protect dashboard - must be logged in and approved
  if (pathname === '/dashboard') {
    const sessionCookie = request.cookies.get('lightTVSession')
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/lighttvadminvin', '/dashboard', '/pending', '/rejected', '/permanentmoa', '/user/:path*'],
}
