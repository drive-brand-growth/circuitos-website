/**
 * GoHighLevel API Integration
 *
 * Handles contact creation, pipeline management, and tag assignment
 * for the Drive Brand Growth Revenue Engine
 */

const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

interface GHLContact {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, string>;
  source?: string;
}

interface GHLOpportunity {
  id?: string;
  name: string;
  pipelineId: string;
  pipelineStageId: string;
  contactId: string;
  status: 'open' | 'won' | 'lost' | 'abandoned';
  monetaryValue?: number;
}

interface LeadData {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  // Lead qualification data
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  leadScore: number;
  technicalDepth: 'L1' | 'L2' | 'L3';
  useCase?: string;
  icp?: string;
  awarenessLevel: number;
  // Conversation context
  conversationId: string;
  conversationSummary?: string;
  messageCount: number;
}

// Pipeline stage mapping based on tier
const PIPELINE_STAGES: Record<string, { stageId: string; stageName: string }> = {
  'S': { stageId: 'tier-s-immediate', stageName: 'Tier S - Immediate (5min SLA)' },
  'A': { stageId: 'tier-a-high', stageName: 'Tier A - High Priority (1hr SLA)' },
  'B': { stageId: 'tier-b-standard', stageName: 'Tier B - Standard (4-8hr SLA)' },
  'C': { stageId: 'tier-c-nurture', stageName: 'Tier C - Nurture (1-2 day SLA)' },
  'D': { stageId: 'tier-d-long-term', stageName: 'Tier D - Long Term (7 day SLA)' },
};

// Tag generation based on lead data
function generateTags(lead: LeadData): string[] {
  const tags: string[] = [
    `tier-${lead.tier.toLowerCase()}`,
    `score-${Math.floor(lead.leadScore / 10) * 10}`, // Round to nearest 10
    `depth-${lead.technicalDepth.toLowerCase()}`,
    `awareness-${lead.awarenessLevel}`,
    'source-website-chat',
    'ai-qualified',
  ];

  if (lead.useCase) {
    tags.push(`usecase-${lead.useCase}`);
  }

  if (lead.icp) {
    tags.push(`icp-${lead.icp}`);
  }

  // Priority tags
  if (lead.tier === 'S' || lead.tier === 'A') {
    tags.push('high-priority');
  }

  if (lead.leadScore >= 80) {
    tags.push('hot-lead');
  }

  return tags;
}

// Custom field mapping
function generateCustomFields(lead: LeadData): { id: string; value: string }[] {
  return [
    { id: 'lead_score', value: lead.leadScore.toString() },
    { id: 'lead_tier', value: lead.tier },
    { id: 'technical_depth', value: lead.technicalDepth },
    { id: 'awareness_level', value: lead.awarenessLevel.toString() },
    { id: 'use_case', value: lead.useCase || 'Not specified' },
    { id: 'icp_segment', value: lead.icp || 'Not identified' },
    { id: 'conversation_id', value: lead.conversationId },
    { id: 'message_count', value: lead.messageCount.toString() },
    { id: 'qualification_source', value: 'AI Chat Widget' },
    { id: 'qualified_at', value: new Date().toISOString() },
  ];
}

class GHLClient {
  private apiKey: string;
  private locationId: string;
  private pipelineId: string;

  constructor() {
    this.apiKey = process.env.GHL_API_KEY || '';
    this.locationId = process.env.GHL_LOCATION_ID || '';
    this.pipelineId = process.env.GHL_PIPELINE_ID || '';

    if (!this.apiKey) {
      console.warn('[GHL] API key not configured');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${GHL_API_BASE}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Version': GHL_API_VERSION,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[GHL] API Error: ${response.status}`, error);
      throw new Error(`GHL API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Search for existing contact by email
   */
  async findContactByEmail(email: string): Promise<GHLContact | null> {
    try {
      const result = await this.request<{ contacts: GHLContact[] }>(
        `/contacts/search/duplicate?locationId=${this.locationId}&email=${encodeURIComponent(email)}`
      );
      return result.contacts?.[0] || null;
    } catch (error) {
      console.error('[GHL] Error finding contact:', error);
      return null;
    }
  }

  /**
   * Create a new contact in GHL
   */
  async createContact(contact: GHLContact): Promise<GHLContact> {
    const payload = {
      ...contact,
      locationId: this.locationId,
    };

    const result = await this.request<{ contact: GHLContact }>(
      '/contacts/',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    return result.contact;
  }

  /**
   * Update an existing contact
   */
  async updateContact(contactId: string, updates: Partial<GHLContact>): Promise<GHLContact> {
    const result = await this.request<{ contact: GHLContact }>(
      `/contacts/${contactId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );

    return result.contact;
  }

  /**
   * Add tags to a contact
   */
  async addTags(contactId: string, tags: string[]): Promise<void> {
    await this.request(
      `/contacts/${contactId}/tags`,
      {
        method: 'POST',
        body: JSON.stringify({ tags }),
      }
    );
  }

  /**
   * Create an opportunity (deal) in a pipeline
   */
  async createOpportunity(opportunity: Omit<GHLOpportunity, 'id'>): Promise<GHLOpportunity> {
    const result = await this.request<{ opportunity: GHLOpportunity }>(
      '/opportunities/',
      {
        method: 'POST',
        body: JSON.stringify({
          ...opportunity,
          locationId: this.locationId,
        }),
      }
    );

    return result.opportunity;
  }

  /**
   * Add a note to a contact
   */
  async addNote(contactId: string, body: string): Promise<void> {
    await this.request(
      `/contacts/${contactId}/notes`,
      {
        method: 'POST',
        body: JSON.stringify({ body }),
      }
    );
  }

  /**
   * Trigger a workflow for a contact
   */
  async triggerWorkflow(contactId: string, workflowId: string): Promise<void> {
    await this.request(
      `/contacts/${contactId}/workflow/${workflowId}`,
      {
        method: 'POST',
      }
    );
  }
}

/**
 * Main function to process a qualified lead
 */
export async function processLead(lead: LeadData): Promise<{
  success: boolean;
  contactId?: string;
  opportunityId?: string;
  error?: string;
}> {
  const client = new GHLClient();

  // Validate required fields
  if (!lead.email) {
    return { success: false, error: 'Email is required' };
  }

  try {
    // Parse name into first/last
    let firstName = lead.firstName || '';
    let lastName = lead.lastName || '';

    if (lead.name && !firstName) {
      const nameParts = lead.name.trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    // Generate tags and custom fields
    const tags = generateTags(lead);
    const customFields = generateCustomFields(lead);

    // Check if contact exists
    let contact = await client.findContactByEmail(lead.email);

    if (contact?.id) {
      // Update existing contact
      const contactId = contact.id;
      console.log(`[GHL] Updating existing contact: ${contactId}`);

      contact = await client.updateContact(contactId, {
        firstName: firstName || contact.firstName,
        lastName: lastName || contact.lastName,
        phone: lead.phone || contact.phone,
        tags: [...(contact.tags || []), ...tags],
      });

      // Add tags (in case update doesn't merge properly)
      await client.addTags(contactId, tags);
    } else {
      // Create new contact
      console.log(`[GHL] Creating new contact for: ${lead.email}`);

      contact = await client.createContact({
        email: lead.email,
        firstName,
        lastName,
        phone: lead.phone,
        tags,
        source: 'Website Chat - AI Qualified',
      });
    }

    if (!contact.id) {
      throw new Error('Failed to create/update contact');
    }

    // Add qualification note
    const noteBody = `
## AI Lead Qualification Summary

**Score:** ${lead.leadScore}/100 (Tier ${lead.tier})
**Technical Depth:** ${lead.technicalDepth === 'L3' ? 'Engineering/CTO' : lead.technicalDepth === 'L2' ? 'Technical Evaluator' : 'Business Buyer'}
**Awareness Level:** ${lead.awarenessLevel}/5 (${['Unaware', 'Problem Aware', 'Solution Aware', 'Product Aware', 'Most Aware'][lead.awarenessLevel - 1]})
**Use Case:** ${lead.useCase || 'Not specified'}
**ICP Segment:** ${lead.icp || 'Not identified'}

**Conversation:**
- ID: ${lead.conversationId}
- Messages: ${lead.messageCount}
${lead.conversationSummary ? `- Summary: ${lead.conversationSummary}` : ''}

**Qualified:** ${new Date().toLocaleString()}
**Source:** Website Chat Widget (AI-Powered)
    `.trim();

    await client.addNote(contact.id, noteBody);

    // Create opportunity in pipeline (for Tier S, A, B leads)
    let opportunityId: string | undefined;

    if (['S', 'A', 'B'].includes(lead.tier)) {
      const stage = PIPELINE_STAGES[lead.tier];

      // Estimate monetary value based on tier
      const monetaryValueMap: Record<string, number> = {
        'S': 75000,
        'A': 50000,
        'B': 25000,
      };
      const monetaryValue = monetaryValueMap[lead.tier] || 0;

      const opportunity = await client.createOpportunity({
        name: `${firstName || lead.email} - ${lead.useCase || 'Revenue Engine Inquiry'}`,
        pipelineId: process.env.GHL_PIPELINE_ID || '',
        pipelineStageId: stage.stageId,
        contactId: contact.id,
        status: 'open',
        monetaryValue,
      });

      opportunityId = opportunity.id;
      console.log(`[GHL] Created opportunity: ${opportunityId}`);
    }

    // Trigger appropriate workflow based on tier
    const workflowMapping: Record<string, string | undefined> = {
      'S': process.env.GHL_WORKFLOW_TIER_S,
      'A': process.env.GHL_WORKFLOW_TIER_A,
      'B': process.env.GHL_WORKFLOW_TIER_B,
      'C': process.env.GHL_WORKFLOW_TIER_C,
      'D': process.env.GHL_WORKFLOW_TIER_D,
    };

    const workflowId = workflowMapping[lead.tier];
    if (workflowId) {
      try {
        await client.triggerWorkflow(contact.id, workflowId);
        console.log(`[GHL] Triggered workflow for Tier ${lead.tier}`);
      } catch (error) {
        console.warn(`[GHL] Failed to trigger workflow:`, error);
        // Don't fail the whole process if workflow trigger fails
      }
    }

    console.log(`[GHL] Successfully processed lead: ${lead.email} (Tier ${lead.tier})`);

    return {
      success: true,
      contactId: contact.id,
      opportunityId,
    };
  } catch (error) {
    console.error('[GHL] Error processing lead:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Quick contact creation for email-only captures
 */
export async function captureEmail(
  email: string,
  source: string = 'Website Chat'
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const client = new GHLClient();

  try {
    let contact = await client.findContactByEmail(email);

    if (!contact?.id) {
      contact = await client.createContact({
        email,
        tags: ['email-capture', 'nurture-sequence', `source-${source.toLowerCase().replace(/\s+/g, '-')}`],
        source,
      });
    }

    return { success: true, contactId: contact.id };
  } catch (error) {
    console.error('[GHL] Error capturing email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export { GHLClient, generateTags, generateCustomFields };
export type { GHLContact, GHLOpportunity, LeadData };
