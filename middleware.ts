import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { oldHostRedirect } from '@/lib/redirects'

// Allowed origins for CORS (restrict API access to our own domains)
const ALLOWED_ORIGINS = new Set([
  'https://usecircuitos.com',
  'https://www.usecircuitos.com',
  'https://drivebrandgrowth.com',
  'https://www.drivebrandgrowth.com',
  'https://thecircuitmethod.com',
  'https://www.thecircuitmethod.com',
])

function getCorsOrigin(request: NextRequest): string {
  const origin = request.headers.get('origin') || ''
  // Allow listed origins, plus localhost for dev
  if (ALLOWED_ORIGINS.has(origin) || origin.startsWith('http://localhost')) {
    return origin
  }
  return ''  // Empty string = browser blocks the request
}

export function middleware(request: NextRequest) {
  // Old host: 301 to thecircuitmethod.com after the path map (docs/domain-switch.md)
  const moved = oldHostRedirect(request.nextUrl)
  if (moved) return NextResponse.redirect(moved, 301)

  const corsOrigin = getCorsOrigin(request)

  // Handle CORS preflight for API routes
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.startsWith('/api/')) {
    const preflight = new NextResponse(null, { status: 204 })
    if (corsOrigin) {
      preflight.headers.set('Access-Control-Allow-Origin', corsOrigin)
      preflight.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      preflight.headers.set('Access-Control-Allow-Headers', 'Content-Type')
      preflight.headers.set('Access-Control-Max-Age', '86400')
    }
    return preflight
  }

  const response = NextResponse.next()

  // Add CORS headers to API responses
  if (request.nextUrl.pathname.startsWith('/api/') && corsOrigin) {
    response.headers.set('Access-Control-Allow-Origin', corsOrigin)
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  }

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )
  const editor =
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/keystatic') ||
    request.nextUrl.pathname.startsWith('/api/keystatic')
  const connectSrc = editor
    ? "connect-src 'self' https://api.github.com https://github.com https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://api.drivebrandgrowth.com"
    : "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://api.drivebrandgrowth.com"
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ${connectSrc}; frame-ancestors 'none';`
  )

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|mark.svg|logo-lockup.svg|robots.txt|sitemap.xml|llms.txt|llms-full.txt).*)'],
}
