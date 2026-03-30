const COS_API = () => process.env.COS_API_BASE_URL || 'https://api.drivebrandgrowth.com'
const DASH_KEY = () => process.env.COS_DASHBOARD_KEY || ''

async function fetchJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000), ...opts })
  if (!res.ok) return null
  try { return await res.json() } catch { return null }
}

export async function handleLeads(action: string, params: Record<string, string>) {
  const vertical = params.vertical || 'licensing'

  switch (action) {
    case 'score':
      return scoreLead(vertical, params)
    case 'rescore':
      return rescoreLead(vertical, params.contact_id)
    case 'pipeline':
      return pipelineFunnel(vertical)
    case 'scoring_dist':
      return scoringDistribution(vertical)
    case 'engagement':
      return engagementMetrics(vertical)
    case 'enrichment':
      return enrichProspect(vertical, params)
    case 'monthly':
      return monthlyReport(vertical)
    default:
      return { text: `Unknown leads action: ${action}`, blocks: [] }
  }
}

async function scoreLead(vertical: string, params: Record<string, string>) {
  const { name, company, email, market } = params

  if (!name && !email) {
    return { text: 'Need at least a name or email. Usage: "score lead John Doe at Acme Corp"', blocks: [] }
  }

  const body: Record<string, string> = {}
  if (name) body.full_name = name
  if (company) body.company = company
  if (email) body.email = email
  if (market) body.market = market

  const data = await fetchJson(`${COS_API()}/${vertical}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!data) {
    return { text: 'Scoring failed. Check API logs.', blocks: [] }
  }

  const fields = [
    { type: 'mrkdwn', text: `*Score:*\n${data.score != null ? data.score.toFixed(3) : 'N/A'}` },
    { type: 'mrkdwn', text: `*Tier:*\n${data.tier || 'N/A'}` },
    { type: 'mrkdwn', text: `*Gate Decision:*\n${data.gate_decision || data.decision || 'N/A'}` },
    { type: 'mrkdwn', text: `*Vertical:*\n${vertical}` },
  ]

  return {
    text: `Scored: ${name || email} — ${data.tier || 'N/A'} (${data.score?.toFixed(3) || 'N/A'})`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'Lead Scoring Result', emoji: true } },
      { type: 'section', fields },
      ...(data.halo_boost ? [{
        type: 'section',
        text: { type: 'mrkdwn', text: `*Halo Boost:* ${data.halo_boost.toFixed(3)} | *Sprint:* ${data.sprint_detected ? 'YES' : 'No'}` },
      }] : []),
    ],
  }
}

async function rescoreLead(vertical: string, contactId?: string) {
  if (!contactId) {
    return { text: 'Missing contact ID. Usage: "rescore contact abc123"', blocks: [] }
  }

  const data = await fetchJson(`${COS_API()}/${vertical}/api/rescore/${contactId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })

  if (!data) {
    return { text: `Rescore failed for ${contactId}`, blocks: [] }
  }

  return {
    text: `Rescored ${contactId}: ${data.tier || 'N/A'} (${data.score?.toFixed(3) || 'N/A'})`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'Rescore Result', emoji: true } },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Contact:*\n\`${contactId}\`` },
          { type: 'mrkdwn', text: `*Score:*\n${data.score?.toFixed(3) || 'N/A'}` },
          { type: 'mrkdwn', text: `*Tier:*\n${data.tier || 'N/A'}` },
          { type: 'mrkdwn', text: `*Decision:*\n${data.gate_decision || 'N/A'}` },
        ],
      },
    ],
  }
}

async function pipelineFunnel(vertical: string) {
  const data = await fetchJson(
    `${COS_API()}/${vertical}/api/v1/dashboard/pipeline-funnel`,
    { headers: { 'X-Dashboard-Key': DASH_KEY() } },
  )

  if (!data) {
    return { text: `Could not fetch pipeline for ${vertical}`, blocks: [] }
  }

  const stages = Array.isArray(data.stages || data)
    ? (data.stages || data)
    : []

  const lines = stages.map((s: { name: string; count: number; conversion_rate?: number }) =>
    `*${s.name}*: ${s.count}${s.conversion_rate != null ? ` (${(s.conversion_rate * 100).toFixed(1)}%)` : ''}`
  )

  return {
    text: `Pipeline funnel for ${vertical}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `Pipeline: ${vertical}`, emoji: true } },
      { type: 'section', text: { type: 'mrkdwn', text: lines.join('\n') || 'No pipeline data' } },
    ],
  }
}

async function scoringDistribution(vertical: string) {
  const data = await fetchJson(
    `${COS_API()}/${vertical}/api/v1/dashboard/scoring-distribution`,
    { headers: { 'X-Dashboard-Key': DASH_KEY() } },
  )

  if (!data) {
    return { text: `Could not fetch scoring distribution for ${vertical}`, blocks: [] }
  }

  return {
    text: `Scoring distribution for ${vertical}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `Scoring Distribution: ${vertical}`, emoji: true } },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: '```' + JSON.stringify(data, null, 2).slice(0, 2800) + '```' },
      },
    ],
  }
}

async function engagementMetrics(vertical: string) {
  const data = await fetchJson(
    `${COS_API()}/${vertical}/api/v1/dashboard/engagement`,
    { headers: { 'X-Dashboard-Key': DASH_KEY() } },
  )

  if (!data) {
    return { text: `Could not fetch engagement for ${vertical}`, blocks: [] }
  }

  return {
    text: `Engagement metrics for ${vertical}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `Engagement: ${vertical}`, emoji: true } },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: '```' + JSON.stringify(data, null, 2).slice(0, 2800) + '```' },
      },
    ],
  }
}

async function enrichProspect(vertical: string, params: Record<string, string>) {
  const { name, company } = params
  if (!name) {
    return { text: 'Need a name. Usage: "enrich John Doe at Acme Corp"', blocks: [] }
  }

  const qs = new URLSearchParams({ name, ...(company ? { company } : {}) })
  const data = await fetchJson(
    `${COS_API()}/${vertical}/api/v1/enrichment/prospect?${qs}`,
  )

  if (!data) {
    return { text: `Enrichment failed for ${name}`, blocks: [] }
  }

  return {
    text: `Enrichment results for ${name}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `Enrichment: ${name}`, emoji: true } },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: '```' + JSON.stringify(data, null, 2).slice(0, 2800) + '```' },
      },
    ],
  }
}

async function monthlyReport(vertical: string) {
  const data = await fetchJson(`${COS_API()}/${vertical}/reports/monthly`)

  if (!data) {
    return { text: `Could not fetch monthly report for ${vertical}`, blocks: [] }
  }

  return {
    text: `Monthly report for ${vertical}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `Monthly Report: ${vertical}`, emoji: true } },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: typeof data.narrative === 'string'
            ? data.narrative.slice(0, 2800)
            : '```' + JSON.stringify(data, null, 2).slice(0, 2800) + '```',
        },
      },
    ],
  }
}
