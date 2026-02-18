export interface SlackIntent {
  intent: 'status' | 'content' | 'leads' | 'campaigns' | 'help' | 'unknown'
  action: string
  params: Record<string, string>
}

const ROUTER_SYSTEM_PROMPT = `You are an intent classifier for CircuitOS operations. Given a Slack message from the operator, return JSON only.

Response format (no markdown, no explanation — raw JSON only):
{"intent":"<intent>","action":"<action>","params":{}}

## Intents and Actions

status:
- overview — KPI dashboard summary
- health — check system/container health
- governance — autonomy governance telemetry
- system — integration health (GHL, n8n, enrichment)

content:
- generate_blog — trigger AI blog generation
- blog_status — list recent blog posts
- social_queue — show social post queue/counts
- approve_post — approve a social post (params: id)
- push_post — push post to GHL (params: id)
- distribute — generate social posts from a blog (params: blog_id)
- linkedin_batch — trigger LinkedIn post batch
- content_perf — content performance metrics

leads:
- score — score a prospect (params: name, company, email, market)
- rescore — rescore existing contact (params: contact_id)
- pipeline — pipeline funnel metrics
- scoring_dist — scoring distribution
- engagement — engagement metrics
- enrichment — enrich a prospect (params: name, company)
- monthly — monthly performance report

campaigns:
- list — list Instantly campaigns
- analytics — campaign metrics (params: campaign_id)

help:
- commands — show available commands

unknown:
- fallback — could not classify

## Rules
- Extract IDs, names, emails from the message into params
- If the user asks "what can you do" or similar, intent=help action=commands
- Default vertical is "licensing" unless specified
- If ambiguous, choose the most likely intent`

export async function classifyIntent(message: string): Promise<SlackIntent> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { intent: 'unknown', action: 'fallback', params: {} }
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: ROUTER_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }],
      }),
    })

    if (!response.ok) {
      console.error('Intent classification failed:', response.status)
      return { intent: 'unknown', action: 'fallback', params: {} }
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { intent: 'unknown', action: 'fallback', params: {} }
    }

    const parsed = JSON.parse(jsonMatch[0])
    return {
      intent: parsed.intent || 'unknown',
      action: parsed.action || 'fallback',
      params: parsed.params || {},
    }
  } catch (err) {
    console.error('Intent classification error:', err)
    return { intent: 'unknown', action: 'fallback', params: {} }
  }
}
