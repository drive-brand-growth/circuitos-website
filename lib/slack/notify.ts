import { postMessage } from './client'

const CHANNEL = () => process.env.SLACK_CHANNEL_ID || ''

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
}) {
  const channel = CHANNEL()
  if (!channel) return

  const emoji = data.lead_tier === 'qualified' ? ':fire:' : ':eyes:'
  const priority = data.lead_tier === 'qualified' ? 'QUALIFIED' : 'HOT'

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${priority} Lead via Aria X`, emoji: true },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Tier:*\n${emoji} ${data.lead_tier}` },
        { type: 'mrkdwn', text: `*Messages:*\n${data.messageCount}` },
      ],
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: `*Last message:*\n>${data.lastMessage.slice(0, 300)}` },
    },
    { type: 'divider' },
    {
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT` },
      ],
    },
  ]

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
