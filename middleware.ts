import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get client IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  // Store IP in response headers (will be set in client via localStorage)
  const response = NextResponse.next()
  response.headers.set('x-client-ip', ip)

  // Protect admin panel
  if (pathname === '/lighttvadminvin') {
    const adminSecret = process.env.ADMIN_SECRET
    const auth = request.headers.get('authorization')

    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const token = auth.substring(7)
    if (token !== adminSecret) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect dashboard - must be logged in
  if (pathname === '/dashboard') {
    const sessionCookie = request.cookies.get('lightTVSession')
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/lighttvadminvin', '/dashboard', '/pending', '/rejected'],
}
