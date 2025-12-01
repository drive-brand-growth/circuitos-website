/**
 * CircuitOS Claude Agent
 * LLM integration for intelligent processing
 */

import Anthropic from '@anthropic-ai/sdk';
import { evaluateDMN, DMNOutput, scoreLeadDMN, LeadScoringInput, LeadScore } from './dmn-engine';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface AgentRequest {
  message: string;
  context?: Record<string, unknown>;
  leadData?: LeadScoringInput;
  mode?: 'chat' | 'qualify' | 'enrich' | 'analyze';
}

export interface AgentResponse {
  response: string;
  dmn: DMNOutput;
  leadScore?: LeadScore;
  enrichedData?: Record<string, unknown>;
  processingTime: number;
  model: string;
}

const SYSTEM_PROMPT = `You are CircuitOS, an enterprise AI agent specialized in lead qualification, business intelligence, and sales automation.

Your capabilities:
1. Lead Qualification: Analyze leads using FIT + INTENT + TIMING scoring model
2. Data Enrichment: Provide company and contact insights
3. Sales Intelligence: Offer strategic recommendations based on lead data
4. Conversation: Handle business inquiries professionally

Key principles:
- Be concise and action-oriented
- Provide specific, data-driven recommendations
- Use the FIT (company match) + INTENT (buying signals) + TIMING (urgency) framework
- Score leads on a 0-100 scale with tier assignments (A/B/C/D/F)

When analyzing leads, always provide:
1. Overall score and tier
2. Breakdown by FIT, INTENT, TIMING
3. Specific next action recommendation
4. Key insights or concerns`;

export async function processWithAgent(request: AgentRequest): Promise<AgentResponse> {
  const startTime = Date.now();

  // Run DMN evaluation
  const dmn = evaluateDMN({
    context: request.message,
    taskType: request.mode,
  });

  // Score lead if data provided
  let leadScore: LeadScore | undefined;
  if (request.leadData) {
    leadScore = scoreLeadDMN(request.leadData);
  }

  // Build the prompt based on mode
  let userPrompt = request.message;

  if (request.mode === 'qualify' && request.leadData) {
    userPrompt = `Analyze and qualify this lead:

Lead Data:
${JSON.stringify(request.leadData, null, 2)}

ML Pre-Score: ${leadScore?.totalScore || 'N/A'}/100 (Tier ${leadScore?.tier || 'N/A'})
- Fit Score: ${leadScore?.breakdown.fitScore || 0}/40
- Intent Score: ${leadScore?.breakdown.intentScore || 0}/35
- Timing Score: ${leadScore?.breakdown.timingScore || 0}/25

Provide:
1. Your analysis of this lead's potential
2. Any concerns or red flags
3. Specific next steps for sales team
4. Personalized outreach suggestion`;
  } else if (request.mode === 'enrich' && request.leadData) {
    userPrompt = `Enrich this company/contact data and provide insights:

Data:
${JSON.stringify(request.leadData, null, 2)}

Provide:
1. Industry analysis
2. Company size estimation if not provided
3. Potential pain points based on role/industry
4. Suggested value propositions
5. Competitors they likely use`;
  } else if (request.mode === 'analyze') {
    userPrompt = `Analyze this data and provide strategic insights:

${request.message}

${request.context ? `Additional context: ${JSON.stringify(request.context)}` : ''}

Provide actionable recommendations.`;
  }

  try {
    const completion = await anthropic.messages.create({
      model: dmn.recommendedModel,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const responseText = completion.content[0].type === 'text'
      ? completion.content[0].text
      : 'Unable to process response';

    return {
      response: responseText,
      dmn,
      leadScore,
      processingTime: Date.now() - startTime,
      model: dmn.recommendedModel,
    };
  } catch (error) {
    // Fallback response if API fails
    const fallbackResponse = leadScore
      ? `Lead Analysis (Offline Mode):

Score: ${leadScore.totalScore}/100 (Tier ${leadScore.tier})

Breakdown:
- Fit: ${leadScore.breakdown.fitScore}/40
- Intent: ${leadScore.breakdown.intentScore}/35
- Timing: ${leadScore.breakdown.timingScore}/25

Recommendation: ${leadScore.recommendation}

Note: Full AI analysis unavailable. Please check API configuration.`
      : `I apologize, but I'm currently operating in limited mode. The DMN engine classified your request as "${dmn.classification}" with ${(dmn.confidence * 100).toFixed(0)}% confidence.

Routing path: ${dmn.routingPath.join(' → ')}

Please ensure the ANTHROPIC_API_KEY is configured for full functionality.`;

    return {
      response: fallbackResponse,
      dmn,
      leadScore,
      processingTime: Date.now() - startTime,
      model: 'fallback',
    };
  }
}

// Batch processing for multiple leads
export async function batchProcessLeads(
  leads: LeadScoringInput[]
): Promise<Array<{ lead: LeadScoringInput; score: LeadScore }>> {
  return leads.map(lead => ({
    lead,
    score: scoreLeadDMN(lead),
  }));
}
