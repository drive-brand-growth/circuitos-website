import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, email, company, vertical, message } = data

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Try n8n webhook first (circuitos vertical on the droplet)
    const webhookUrl = process.env.DEMO_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'demo_request',
            name,
            email,
            company: company || 'Not provided',
            vertical: vertical || 'Not specified',
            message: message || 'No message',
            source: 'usecircuitos.com',
            submitted_at: new Date().toISOString(),
          }),
        })
      } catch {
        // Webhook failed, continue — we'll still log it
        console.error('Webhook notification failed')
      }
    }

    // Always log to server console as backup
    console.log('=== DEMO REQUEST ===')
    console.log(`Name: ${name}`)
    console.log(`Email: ${email}`)
    console.log(`Company: ${company || 'N/A'}`)
    console.log(`Vertical: ${vertical || 'N/A'}`)
    console.log(`Message: ${message || 'N/A'}`)
    console.log(`Time: ${new Date().toISOString()}`)
    console.log('====================')

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
