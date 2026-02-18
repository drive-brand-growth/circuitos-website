const COS_API = () => process.env.COS_API_BASE_URL || 'https://api.drivebrandgrowth.com'

async function fetchJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000), ...opts })
  if (!res.ok) return null
  try { return await res.json() } catch { return null }
}

export async function handleCampaigns(action: string, params: Record<string, string>) {
  const vertical = params.vertical || 'licensing'

  switch (action) {
    case 'list':
      return listCampaigns(vertical)
    case 'analytics':
      return campaignAnalytics(vertical, params.campaign_id)
    default:
      return { text: `Unknown campaigns action: ${action}`, blocks: [] }
  }
}

async function listCampaigns(vertical: string) {
  const data = await fetchJson(`${COS_API()}/${vertical}/api/v1/instantly/campaigns`)

  if (!data) {
    return { text: `Could not fetch campaigns for ${vertical}`, blocks: [] }
  }

  const campaigns = Array.isArray(data.campaigns || data)
    ? (data.campaigns || data)
    : []

  if (campaigns.length === 0) {
    return { text: 'No campaigns found', blocks: [] }
  }

  const lines = campaigns.slice(0, 10).map((c: { id?: string; name: string; status?: string; reply_rate?: number }) =>
    `- *${c.name}* (${c.status || 'unknown'})${c.reply_rate != null ? ` — ${(c.reply_rate * 100).toFixed(1)}% reply rate` : ''}${c.id ? ` \`${c.id}\`` : ''}`
  )

  return {
    text: `${campaigns.length} campaigns for ${vertical}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `Campaigns: ${vertical}`, emoji: true } },
      { type: 'section', text: { type: 'mrkdwn', text: lines.join('\n') } },
    ],
  }
}

async function campaignAnalytics(vertical: string, campaignId?: string) {
  if (!campaignId) {
    return { text: 'Missing campaign ID. Usage: "show analytics for campaign <id>"', blocks: [] }
  }

  const data = await fetchJson(
    `${COS_API()}/${vertical}/api/v1/instantly/campaigns/${campaignId}/analytics`,
  )

  if (!data) {
    return { text: `Could not fetch analytics for campaign ${campaignId}`, blocks: [] }
  }

  const fields = [
    { type: 'mrkdwn', text: `*Sent:*\n${data.sent ?? 'N/A'}` },
    { type: 'mrkdwn', text: `*Opens:*\n${data.opens ?? 'N/A'}` },
    { type: 'mrkdwn', text: `*Replies:*\n${data.replies ?? 'N/A'}` },
    { type: 'mrkdwn', text: `*Bounces:*\n${data.bounces ?? 'N/A'}` },
    { type: 'mrkdwn', text: `*Reply Rate:*\n${data.reply_rate != null ? (data.reply_rate * 100).toFixed(1) + '%' : 'N/A'}` },
    { type: 'mrkdwn', text: `*Open Rate:*\n${data.open_rate != null ? (data.open_rate * 100).toFixed(1) + '%' : 'N/A'}` },
  ]

  return {
    text: `Campaign ${campaignId} analytics`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'Campaign Analytics', emoji: true } },
      { type: 'section', fields },
    ],
  }
}
