import { makeRouteHandler } from '@keystatic/next/route-handler'
import { NextResponse } from 'next/server'
import keystaticConfig from '../../../../keystatic.config'
import { editorReady } from '@/lib/editor'

export const dynamic = 'force-dynamic'

type Handler = (request: Request) => Promise<Response>

let cached: { GET: Handler; POST: Handler } | null = null

function handlers(): { GET: Handler; POST: Handler } | null {
  if (!editorReady()) return null
  if (!cached) cached = makeRouteHandler({ config: keystaticConfig })
  return cached
}

function unavailable() {
  return NextResponse.json(
    { error: 'The editor is not configured on this deployment.' },
    { status: 503 },
  )
}

export function GET(request: Request) {
  const route = handlers()
  if (!route) return unavailable()
  return route.GET(request)
}

export function POST(request: Request) {
  const route = handlers()
  if (!route) return unavailable()
  return route.POST(request)
}
