import { NextRequest, NextResponse } from 'next/server'
import { verifySlackRequest } from '@/lib/slack/verify'
import { postMessage, postThreadReply } from '@/lib/slack/client'
import { classifyIntent } from '@/lib/slack/router'
import { handleStatus } from '@/lib/slack/commands/status'
import { handleContent } from '@/lib/slack/commands/content'
import { handleLeads } from '@/lib/slack/commands/leads'
import { handleCampaigns } from '@/lib/slack/commands/campaigns'
import { handleHelp } from '@/lib/slack/commands/help'

// Rate limiting per user
const rateLimits = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60_000
const RATE_LIMIT_MAX = 30

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimits.get(userId)
  if (!entry || now > entry.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT_MAX
}

export async function POST(req: NextRequest) {
  let rawBody: string
  try {
    rawBody = await req.text()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  let body: Record<string, unknown>
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Handle Slack URL verification challenge FIRST (before sig check)
  // Slack sends this during app setup and it must respond with the challenge
  if (body.type === 'url_verification') {
    return NextResponse.json({ challenge: body.challenge })
  }

  // Verify Slack signature for all other requests
  const signingSecret = process.env.SLACK_SIGNING_SECRET
  if (signingSecret) {
    const timestamp = req.headers.get('x-slack-request-timestamp') || ''
    const signature = req.headers.get('x-slack-signature') || ''

    if (!verifySlackRequest(signingSecret, timestamp, rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  // Process event — fire and forget (don't await), return 200 immediately
  // Slack requires ack within 3 seconds. The promise runs in the background
  // on Vercel's serverless runtime until the function times out (default 10s).
  if (body.type === 'event_callback' && body.event) {
    const event = body.event as { type: string; text?: string; channel?: string; user?: string; bot_id?: string; thread_ts?: string; ts?: string }
    processEvent(event).catch(err => console.error('Slack event error:', err))
  }

  return NextResponse.json({ ok: true })
}

async function processEvent(event: {
  type: string
  text?: string
  channel?: string
  user?: string
  bot_id?: string
  thread_ts?: string
  ts?: string
}) {
  try {
    // Only handle messages and app_mentions
    if (event.type !== 'app_mention' && event.type !== 'message') return

    // Ignore bot messages (prevent loops)
    if (event.bot_id) return

    const text = event.text || ''
    const channel = event.channel || ''
    const userId = event.user || ''
    const threadTs = event.thread_ts || event.ts || ''

    if (!text.trim() || !channel) return

    // Rate limit
    if (!checkRateLimit(userId)) {
      await postThreadReply(channel, threadTs, 'Rate limited. Wait a moment before sending another command.')
      return
    }

    // Strip bot mention prefix (e.g., "<@U123ABC> status" → "status")
    const cleanText = text.replace(/<@[A-Z0-9]+>/g, '').trim()

    if (!cleanText) {
      await postThreadReply(channel, threadTs, 'What would you like to know? Try "help" for available commands.')
      return
    }

    // Classify intent
    const intent = await classifyIntent(cleanText)

    // Route to handler
    let result: { text: string; blocks?: Record<string, unknown>[] }

    switch (intent.intent) {
      case 'status':
        result = await handleStatus(intent.action, intent.params)
        break
      case 'content':
        result = await handleContent(intent.action, intent.params)
        break
      case 'leads':
        result = await handleLeads(intent.action, intent.params)
        break
      case 'campaigns':
        result = await handleCampaigns(intent.action, intent.params)
        break
      case 'help':
        result = await handleHelp()
        break
      default:
        result = {
          text: "I didn't catch that. Try asking about *status*, *content*, *leads*, *campaigns*, or say *help* for the full command list.",
        }
    }

    // Send response
    if (threadTs && threadTs !== event.ts) {
      // Reply in thread if we're already in one
      await postThreadReply(channel, threadTs, result.text, result.blocks)
    } else if (event.ts) {
      // Start a thread from the original message
      await postThreadReply(channel, event.ts, result.text, result.blocks)
    } else {
      await postMessage(channel, result.text, result.blocks)
    }
  } catch (err) {
    console.error('Slack event processing error:', err)
    if (event.channel && event.ts) {
      try {
        await postThreadReply(
          event.channel,
          event.ts,
          'Something went wrong processing that command. Check the API logs.',
        )
      } catch {
        // Best effort error reply
      }
    }
  }
}
