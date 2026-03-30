import { postMessage } from './client'

const CHANNEL = () => process.env.SLACK_CHANNEL_ID || ''

function simplifyUserAgent(ua: string): string {
  const mobile = /Mobile|iPhone|Android/i.test(ua)
  let browser = 'Unknown'
  if (/CriOS/i.test(ua)) browser = 'Chrome iOS'
  else if (/EdgA?\//.test(ua)) browser = 'Edge'
  else if (/Chrome\//.test(ua)) browser = 'Chrome'
  else if (/Firefox\//.test(ua)) browser = 'Firefox'
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = 'Safari'
  let os = 'Unknown'
  if (/iPhone|iPad/.test(ua)) os = 'iOS'
  else if (/Android/.test(ua)) os = 'Android'
  else if (/Mac OS X/.test(ua)) os = 'Mac'
  else if (/Windows/.test(ua)) os = 'Windows'
  else if (/Linux/.test(ua)) os = 'Linux'
  return `${browser} on ${os}${mobile ? ' (mobile)' : ''}`
}

export async function notifyDemoRequest(data: {
  name: string
  email: string
  company?: string
  vertical?: string
  message?: string
}) {
  const channel = CHANNEL()
  if (!channel) return

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: 'New Demo Request', emoji: true },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Name:*\n${data.name}` },
        { type: 'mrkdwn', text: `*Email:*\n${data.email}` },
        { type: 'mrkdwn', text: `*Company:*\n${data.company || 'N/A'}` },
        { type: 'mrkdwn', text: `*Vertical:*\n${data.vertical || 'N/A'}` },
      ],
    },
    ...(data.message
      ? [{ type: 'section', text: { type: 'mrkdwn', text: `*Message:*\n${data.message}` } }]
      : []),
    { type: 'divider' },
    {
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `Source: usecircuitos.com/demo | ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT` },
      ],
    },
  ]

  try {
    await postMessage(channel, `Demo request from ${data.name} (${data.email})`, blocks)
  } catch (err) {
    console.error('Slack demo notification failed:', err)
  }
}

export async function notifyHotLead(data: {
  lead_tier: string
  lastMessage: string
  messageCount: number
  name?: string
  email?: string
  company?: string
  page_url?: string
  referrer?: string
  user_agent?: string
  transcript?: string
}) {
  const channel = CHANNEL()
  if (!channel) return

  const emoji = data.lead_tier === 'qualified' ? ':fire:' : ':eyes:'
  const priority = data.lead_tier === 'qualified' ? 'QUALIFIED' : 'HOT'

  const fields: Array<{ type: 'mrkdwn'; text: string }> = [
    { type: 'mrkdwn', text: `*Tier:*\n${emoji} ${data.lead_tier}` },
    { type: 'mrkdwn', text: `*Messages:*\n${data.messageCount}` },
  ]

  if (data.name) {
    fields.push({ type: 'mrkdwn', text: `*Name:*\n${data.name}` })
  }
  if (data.email) {
    fields.push({ type: 'mrkdwn', text: `*Email:*\n${data.email}` })
  }
  if (data.company) {
    fields.push({ type: 'mrkdwn', text: `*Company:*\n${data.company}` })
  }

  const contextParts = [
    `${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT`,
  ]
  if (data.page_url) contextParts.push(`Page: ${data.page_url}`)
  if (data.referrer) contextParts.push(`Referrer: ${data.referrer}`)
  if (data.user_agent) contextParts.push(`Device: ${simplifyUserAgent(data.user_agent)}`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocks: any[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${priority} Lead via Aria X`, emoji: true },
    },
    {
      type: 'section',
      fields,
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: `*Last message:*\n>${data.lastMessage.slice(0, 300)}` },
    },
  ]

  // Add conversation transcript if available (Slack section text max ~3000 chars)
  if (data.transcript) {
    blocks.push(
      { type: 'divider' },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Conversation:*\n${data.transcript.slice(0, 2800)}` },
      },
    )
  }

  blocks.push(
    { type: 'divider' },
    {
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: contextParts.join('\n') },
      ],
    },
  )

  try {
    await postMessage(channel, `${priority} lead on Aria X: "${data.lastMessage.slice(0, 100)}"`, blocks)
  } catch (err) {
    console.error('Slack lead notification failed:', err)
  }
}

export async function notifySystemAlert(title: string, details: string) {
  const channel = CHANNEL()
  if (!channel) return

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `Alert: ${title}`, emoji: true },
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: details },
    },
    {
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT` },
      ],
    },
  ]

  try {
    await postMessage(channel, `Alert: ${title}`, blocks)
  } catch (err) {
    console.error('Slack alert notification failed:', err)
  }
}
