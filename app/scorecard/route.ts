import { NextRequest, NextResponse } from 'next/server'

function toCausal(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/causal'
  url.search = ''
  return NextResponse.redirect(url, 308)
}

export function GET(request: NextRequest) {
  return toCausal(request)
}

export function HEAD(request: NextRequest) {
  return toCausal(request)
}
