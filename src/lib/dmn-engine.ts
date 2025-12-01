/**
 * CircuitOS DMN Decision Engine
 * Implements Decision Model and Notation for intelligent routing
 */

export type TaskClassification =
  | 'lead_qualification'
  | 'customer_support'
  | 'sales_inquiry'
  | 'data_enrichment'
  | 'outreach_campaign'
  | 'ml_scoring'
  | 'unknown';

export type SecurityLevel = 'MAXIMUM' | 'ELEVATED' | 'STANDARD' | 'LOW';

export interface DMNInput {
  context: string;
  taskType?: string;
  urgency?: 'high' | 'medium' | 'low';
  dataType?: 'sensitive' | 'public' | 'internal';
  source?: string;
}

export interface DMNOutput {
  classification: TaskClassification;
  securityLevel: SecurityLevel;
  recommendedModel: string;
  routingPath: string[];
  confidence: number;
  reasoning: string;
}

// DMN Table 1: Task Classification (Priority Hit Policy)
const taskClassificationRules = [
  { keywords: ['lead', 'qualify', 'score', 'prospect'], classification: 'lead_qualification' as TaskClassification, priority: 1 },
  { keywords: ['support', 'help', 'issue', 'problem', 'ticket'], classification: 'customer_support' as TaskClassification, priority: 2 },
  { keywords: ['buy', 'purchase', 'pricing', 'demo', 'sales'], classification: 'sales_inquiry' as TaskClassification, priority: 3 },
  { keywords: ['enrich', 'apollo', 'data', 'company info'], classification: 'data_enrichment' as TaskClassification, priority: 4 },
  { keywords: ['email', 'outreach', 'campaign', 'instantly'], classification: 'outreach_campaign' as TaskClassification, priority: 5 },
  { keywords: ['predict', 'model', 'ml', 'score', 'analyze'], classification: 'ml_scoring' as TaskClassification, priority: 6 },
];

// DMN Table 2: Security Level Assignment (First Hit Policy)
const securityRules = [
  { condition: (input: DMNInput) => input.dataType === 'sensitive', level: 'MAXIMUM' as SecurityLevel },
  { condition: (input: DMNInput) => input.context.toLowerCase().includes('api key') || input.context.toLowerCase().includes('password'), level: 'MAXIMUM' as SecurityLevel },
  { condition: (input: DMNInput) => input.dataType === 'internal', level: 'ELEVATED' as SecurityLevel },
  { condition: (input: DMNInput) => input.urgency === 'high', level: 'ELEVATED' as SecurityLevel },
  { condition: (input: DMNInput) => true, level: 'STANDARD' as SecurityLevel },
];

// DMN Table 4: Model Selection (First Hit Policy)
const modelSelectionRules = [
  { classification: 'lead_qualification', model: 'claude-sonnet-4-20250514', reason: 'Complex lead analysis' },
  { classification: 'customer_support', model: 'claude-sonnet-4-20250514', reason: 'Conversational support' },
  { classification: 'sales_inquiry', model: 'claude-sonnet-4-20250514', reason: 'Sales qualification' },
  { classification: 'data_enrichment', model: 'claude-haiku-4-20250514', reason: 'Fast data processing' },
  { classification: 'outreach_campaign', model: 'claude-sonnet-4-20250514', reason: 'Creative copywriting' },
  { classification: 'ml_scoring', model: 'claude-haiku-4-20250514', reason: 'Efficient scoring' },
  { classification: 'unknown', model: 'claude-sonnet-4-20250514', reason: 'General purpose' },
];

// DMN Table: Routing Path Selection
const routingRules: Record<TaskClassification, string[]> = {
  lead_qualification: ['intake', 'enrichment', 'scoring', 'routing'],
  customer_support: ['triage', 'context_retrieval', 'response_generation'],
  sales_inquiry: ['qualification', 'crm_lookup', 'response'],
  data_enrichment: ['apollo_lookup', 'company_match', 'field_mapping'],
  outreach_campaign: ['segment', 'personalize', 'sequence', 'send'],
  ml_scoring: ['feature_extraction', 'model_inference', 'score_output'],
  unknown: ['classification', 'manual_review'],
};

export function evaluateDMN(input: DMNInput): DMNOutput {
  const contextLower = input.context.toLowerCase();

  // Table 1: Classify task
  let classification: TaskClassification = 'unknown';
  let highestPriority = Infinity;
  let matchedKeywords: string[] = [];

  for (const rule of taskClassificationRules) {
    const matches = rule.keywords.filter(kw => contextLower.includes(kw));
    if (matches.length > 0 && rule.priority < highestPriority) {
      classification = rule.classification;
      highestPriority = rule.priority;
      matchedKeywords = matches;
    }
  }

  // Table 2: Determine security level
  let securityLevel: SecurityLevel = 'STANDARD';
  for (const rule of securityRules) {
    if (rule.condition(input)) {
      securityLevel = rule.level;
      break;
    }
  }

  // Table 4: Select model
  const modelRule = modelSelectionRules.find(r => r.classification === classification)
    || modelSelectionRules[modelSelectionRules.length - 1];

  // Get routing path
  const routingPath = routingRules[classification];

  // Calculate confidence based on keyword matches
  const confidence = matchedKeywords.length > 0
    ? Math.min(0.95, 0.6 + (matchedKeywords.length * 0.1))
    : 0.3;

  return {
    classification,
    securityLevel,
    recommendedModel: modelRule.model,
    routingPath,
    confidence,
    reasoning: matchedKeywords.length > 0
      ? `Matched keywords: ${matchedKeywords.join(', ')}. ${modelRule.reason}.`
      : 'No specific keywords matched. Using general classification.',
  };
}

// Lead scoring DMN rules
export interface LeadScoringInput {
  company?: string;
  title?: string;
  email?: string;
  industry?: string;
  companySize?: string;
  budget?: string;
  timeline?: string;
  source?: string;
}

export interface LeadScore {
  totalScore: number;
  tier: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: {
    fitScore: number;
    intentScore: number;
    timingScore: number;
  };
  recommendation: string;
}

export function scoreLeadDMN(lead: LeadScoringInput): LeadScore {
  let fitScore = 0;
  let intentScore = 0;
  let timingScore = 0;

  // Fit scoring (0-40 points)
  if (lead.title) {
    const titleLower = lead.title.toLowerCase();
    if (titleLower.includes('ceo') || titleLower.includes('founder') || titleLower.includes('owner')) {
      fitScore += 15;
    } else if (titleLower.includes('vp') || titleLower.includes('director') || titleLower.includes('head')) {
      fitScore += 12;
    } else if (titleLower.includes('manager') || titleLower.includes('lead')) {
      fitScore += 8;
    } else {
      fitScore += 3;
    }
  }

  if (lead.companySize) {
    const size = lead.companySize.toLowerCase();
    if (size.includes('enterprise') || size.includes('1000+') || size.includes('500+')) {
      fitScore += 15;
    } else if (size.includes('mid') || size.includes('100') || size.includes('200')) {
      fitScore += 10;
    } else if (size.includes('small') || size.includes('50') || size.includes('startup')) {
      fitScore += 5;
    }
  }

  if (lead.industry) {
    const industryLower = lead.industry.toLowerCase();
    const highValueIndustries = ['technology', 'finance', 'healthcare', 'saas', 'enterprise'];
    if (highValueIndustries.some(i => industryLower.includes(i))) {
      fitScore += 10;
    } else {
      fitScore += 5;
    }
  }

  // Intent scoring (0-35 points)
  if (lead.budget) {
    const budgetLower = lead.budget.toLowerCase();
    if (budgetLower.includes('100k') || budgetLower.includes('enterprise') || budgetLower.includes('unlimited')) {
      intentScore += 15;
    } else if (budgetLower.includes('50k') || budgetLower.includes('significant')) {
      intentScore += 10;
    } else if (budgetLower.includes('10k') || budgetLower.includes('moderate')) {
      intentScore += 5;
    }
  }

  if (lead.source) {
    const sourceLower = lead.source.toLowerCase();
    if (sourceLower.includes('demo') || sourceLower.includes('pricing') || sourceLower.includes('trial')) {
      intentScore += 15;
    } else if (sourceLower.includes('content') || sourceLower.includes('webinar')) {
      intentScore += 8;
    } else if (sourceLower.includes('referral')) {
      intentScore += 12;
    } else {
      intentScore += 3;
    }
  }

  // Timing scoring (0-25 points)
  if (lead.timeline) {
    const timelineLower = lead.timeline.toLowerCase();
    if (timelineLower.includes('immediate') || timelineLower.includes('asap') || timelineLower.includes('this week')) {
      timingScore += 25;
    } else if (timelineLower.includes('month') || timelineLower.includes('q1') || timelineLower.includes('soon')) {
      timingScore += 15;
    } else if (timelineLower.includes('quarter') || timelineLower.includes('evaluating')) {
      timingScore += 8;
    } else {
      timingScore += 3;
    }
  }

  const totalScore = fitScore + intentScore + timingScore;

  // Tier assignment
  let tier: 'A' | 'B' | 'C' | 'D' | 'F';
  let recommendation: string;

  if (totalScore >= 80) {
    tier = 'A';
    recommendation = 'Hot lead - immediate outreach recommended. Schedule demo within 24 hours.';
  } else if (totalScore >= 60) {
    tier = 'B';
    recommendation = 'Warm lead - prioritize for follow-up. Add to high-touch nurture sequence.';
  } else if (totalScore >= 40) {
    tier = 'C';
    recommendation = 'Qualified lead - add to standard nurture sequence. Monitor engagement.';
  } else if (totalScore >= 20) {
    tier = 'D';
    recommendation = 'Low priority - add to long-term nurture. Consider for content marketing.';
  } else {
    tier = 'F';
    recommendation = 'Unqualified - minimal resources. Auto-nurture only.';
  }

  return {
    totalScore,
    tier,
    breakdown: {
      fitScore,
      intentScore,
      timingScore,
    },
    recommendation,
  };
}
