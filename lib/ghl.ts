/**
 * GoHighLevel Integration for Aria X Chat Leads
 *
 * Creates/updates contacts, assigns tags, adds conversation notes,
 * and triggers tier-based workflows when leads are captured.
 */

const GHL_API_BASE = 'https://services.leadconnectorhq.com'

interface AriaXLead {
  name: string
  email: string
  company?: string
  lead_tier: string
  transcript?: string
  page_url?: string
  referrer?: string
  source?: string
}

export async function syncLeadToGHL(lead: AriaXLead): Promise<{
  success: boolean
  contactId?: string
  error?: string
}> {
  const apiKey = process.env.GHL_API_KEY
  const locationId = process.env.GHL_LOCATION_ID
  if (!apiKey || !locationId) return { success: false, error: 'GHL not configured' }

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28',
  }

  const nameParts = lead.name.trim().split(' ')
  const firstName = nameParts[0] || lead.name
  const lastName = nameParts.slice(1).join(' ') || ''

  const tags = [
    `tier-${lead.lead_tier}`,
    'source-ai-chat',
    'aria-x-qualified',
  ]
  if (lead.lead_tier === 'qualified' || lead.lead_tier === 'hot') tags.push('high-priority')

  try {
    // Create or upsert contact
    const createRes = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        locationId,
        email: lead.email,
        firstName,
        lastName,
        tags,
        source: `Aria X Chat${lead.source ? ` — ${lead.source}` : ''}`,
      }),
      signal: AbortSignal.timeout(10000),
    })

    let contactId: string | null = null

    if (createRes.ok) {
      const data = await createRes.json()
      contactId = data?.contact?.id
    } else {
      // GHL returns 400 for duplicates with contactId in meta
      const errData = await createRes.json().catch(() => null)
      if (errData?.meta?.contactId) {
        contactId = errData.meta.contactId
        // Update existing contact with new tags
        await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ firstName, lastName, tags }),
          signal: AbortSignal.timeout(10000),
        }).catch(() => {})
      }
    }

    if (!contactId) return { success: false, error: 'Could not create/find contact' }

    // Add note with conversation transcript
    if (lead.transcript) {
      const noteBody = [
        `## Aria X Conversation (${lead.lead_tier.toUpperCase()})`,
        '',
        lead.transcript.slice(0, 3000),
        '',
        '---',
        `Source: ${lead.source || 'usecircuitos.com'}`,
        lead.page_url ? `Page: ${lead.page_url}` : null,
        lead.referrer ? `Referrer: ${lead.referrer}` : null,
        `Captured: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT`,
      ].filter(Boolean).join('\n')

      await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ body: noteBody }),
        signal: AbortSignal.timeout(10000),
      }).catch(() => {})
    }

    // Trigger workflow based on tier (if workflow IDs are configured)
    const workflowMap: Record<string, string | undefined> = {
      'qualified': process.env.GHL_WORKFLOW_QUALIFIED,
      'hot': process.env.GHL_WORKFLOW_HOT,
      'warm': process.env.GHL_WORKFLOW_WARM,
    }
    const workflowId = workflowMap[lead.lead_tier]
    if (workflowId) {
      await fetch(`${GHL_API_BASE}/contacts/${contactId}/workflow/${workflowId}`, {
        method: 'POST',
        headers,
        signal: AbortSignal.timeout(10000),
      }).catch(() => {})
    }

    console.log(`[GHL] Lead synced: ${lead.email} (${lead.lead_tier}), contact: ${contactId}`)
    return { success: true, contactId }
  } catch (err) {
    console.error('[GHL] Error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
