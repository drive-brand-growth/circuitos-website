const COS_API = () => process.env.COS_API_BASE_URL || 'https://api.drivebrandgrowth.com'
const CONSOLE_API = () => process.env.CONSOLE_API_URL || 'https://api.drivebrandgrowth.com/console'
const DASH_KEY = () => process.env.COS_DASHBOARD_KEY || ''

const VERTICALS = ['licensing', 'gym', 'events', 'apparel', 'dbg', 'circuitos']

async function fetchJson(url: string, headers?: Record<string, string>) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) })
  if (!res.ok) return null
  return res.json()
}

export async function handleStatus(action: string, params: Record<string, string>) {
  const vertical = params.vertical || 'licensing'

  switch (action) {
    case 'health':
      return healthCheck()
    case 'overview':
      return dashboardOverview(vertical)
    case 'governance':
      return governanceTelemetry(vertical)
    case 'system':
      return systemHealth(vertical)
    default:
      return healthCheck()
  }
}

async function healthCheck() {
  const results: { name: string; status: string }[] = []

  // Check console API
  try {
    const res = await fetch(`${CONSOLE_API()}/health`, { signal: AbortSignal.timeout(5000) })
    results.push({ name: 'Console API', status: res.ok ? 'UP' : `DOWN (${res.status})` })
  } catch {
    results.push({ name: 'Console API', status: 'DOWN (timeout)' })
  }

  // Check all verticals
  const checks = VERTICALS.map(async (v) => {
    try {
      const res = await fetch(`${COS_API()}/${v}/health`, { signal: AbortSignal.timeout(5000) })
      return { name: `COS ${v}`, status: res.ok ? 'UP' : `DOWN (${res.status})` }
    } catch {
      return { name: `COS ${v}`, status: 'DOWN (timeout)' }
    }
  })

  results.push(...(await Promise.all(checks)))

  const allUp = results.every(r => r.status === 'UP')
  const lines = results.map(r => `${r.status === 'UP' ? ':white_check_mark:' : ':x:'} *${r.name}*: ${r.status}`)

  return {
    text: allUp ? 'All systems operational' : 'Some systems have issues',
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: allUp ? 'All Systems Operational' : 'System Health Issues', emoji: true },
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: lines.join('\n') },
      },
      {
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `Checked at ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT` }],
      },
    ],
  }
}

async function dashboardOverview(vertical: string) {
  const data = await fetchJson(
    `${COS_API()}/${vertical}/api/v1/dashboard/overview`,
    { 'X-Dashboard-Key': DASH_KEY() },
  )

  if (!data) {
    return { text: `Could not fetch dashboard for ${vertical}`, blocks: [] }
  }

  const fields = [
    { type: 'mrkdwn', text: `*Total Prospects:*\n${data.total_prospects ?? 'N/A'}` },
    { type: 'mrkdwn', text: `*Scored:*\n${data.scored ?? 'N/A'}` },
    { type: 'mrkdwn', text: `*Avg Score:*\n${data.avg_score != null ? data.avg_score.toFixed(2) : 'N/A'}` },
    { type: 'mrkdwn', text: `*Emails Sent:*\n${data.emails_sent ?? 'N/A'}` },
    { type: 'mrkdwn', text: `*Active Engagements:*\n${data.active_engagements ?? 'N/A'}` },
    { type: 'mrkdwn', text: `*Conversion Rate:*\n${data.conversion_rate != null ? (data.conversion_rate * 100).toFixed(1) + '%' : 'N/A'}` },
  ]

  return {
    text: `Dashboard overview for ${vertical}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `Dashboard: ${vertical}`, emoji: true } },
      { type: 'section', fields },
      ...(data.tier_distribution
        ? [{
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Tier Distribution:* ${Object.entries(data.tier_distribution).map(([k, v]) => `${k}: ${v}`).join(' | ')}`,
            },
          }]
        : []),
    ],
  }
}

async function governanceTelemetry(vertical: string) {
  const data = await fetchJson(
    `${COS_API()}/${vertical}/api/v1/dashboard/governance`,
    { 'X-Dashboard-Key': DASH_KEY() },
  )

  if (!data) {
    return { text: `Could not fetch governance telemetry for ${vertical}`, blocks: [] }
  }

  return {
    text: `Governance telemetry for ${vertical}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `Governance: ${vertical}`, emoji: true } },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: '```' + JSON.stringify(data, null, 2).slice(0, 2800) + '```' },
      },
    ],
  }
}

async function systemHealth(vertical: string) {
  const data = await fetchJson(
    `${COS_API()}/${vertical}/api/v1/dashboard/system-health`,
    { 'X-Dashboard-Key': DASH_KEY() },
  )

  if (!data) {
    return { text: `Could not fetch system health for ${vertical}`, blocks: [] }
  }

  return {
    text: `System health for ${vertical}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `System Health: ${vertical}`, emoji: true } },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: '```' + JSON.stringify(data, null, 2).slice(0, 2800) + '```' },
      },
    ],
  }
}
