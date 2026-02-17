import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, email, company, vertical, message } = data

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const payload = {
      type: 'demo_request',
      name,
      email,
      company: company || 'Not provided',
      vertical: vertical || 'Not specified',
      message: message || 'No message',
      source: 'usecircuitos.com',
      submitted_at: new Date().toISOString(),
    }

    // Try n8n webhook
    const webhookUrl = process.env.DEMO_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } catch {
        console.error('Webhook notification failed')
      }
    }

    // Send push notification via ntfy.sh
    const ntfyTopic = process.env.NTFY_TOPIC
    if (ntfyTopic) {
      try {
        await fetch(`https://ntfy.sh/${ntfyTopic}`, {
          method: 'POST',
          headers: {
            'Title': `Demo Request: ${name}`,
            'Tags': 'incoming_envelope',
            'Priority': '4',
          },
          body: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Company: ${company || 'N/A'}`,
            `Vertical: ${vertical || 'N/A'}`,
            `Message: ${message || 'N/A'}`,
          ].join('\n'),
        })
      } catch {
        console.error('ntfy notification failed')
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
