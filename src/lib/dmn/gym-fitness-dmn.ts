/**
 * CircuitOS DMN Engine - Gym/Fitness Business Module
 *
 * Configurable Decision Model Notation engine for:
 * - Licensee/Franchisee Qualification Scoring
 * - Membership Tier Assignment
 * - Trainer Allocation
 * - Lead Routing & Prioritization
 *
 * Based on research from:
 * - FranchiseHelp.com qualification criteria
 * - Mariana Tek fitness franchise metrics
 * - MetroFlex 50-feature scoring system
 */

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface DMNRule {
  id: string;
  description: string;
  conditions: Record<string, DMNCondition>;
  outputs: Record<string, unknown>;
  priority: number;
}

export interface DMNCondition {
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'between' | 'contains';
  value: unknown;
  value2?: unknown; // For 'between' operator
}

export interface DMNDecisionTable {
  id: string;
  name: string;
  description: string;
  hitPolicy: 'First' | 'Unique' | 'Priority' | 'Collect' | 'Any';
  inputs: string[];
  outputs: string[];
  rules: DMNRule[];
}

export interface DMNContext {
  [key: string]: unknown;
}

export interface DMNResult {
  tableId: string;
  tableName: string;
  matchedRules: DMNRule[];
  outputs: Record<string, unknown>;
  confidence: number;
  reasoning: string[];
}

// ============================================================
// DECISION TABLE: LICENSEE QUALIFICATION
// Based on MetroFlex 50-feature system
// ============================================================

export const LICENSEE_QUALIFICATION_TABLE: DMNDecisionTable = {
  id: 'licensee-qualification',
  name: 'Licensee Qualification Scoring',
  description: 'Evaluates potential gym licensees/franchisees using 4-category weighted scoring',
  hitPolicy: 'Collect', // Collect all matching rules and aggregate
  inputs: [
    'net_worth',
    'liquid_capital',
    'credit_score',
    'years_training',
    'business_experience',
    'management_experience',
    'brand_alignment',
    'market_population',
    'competitor_density'
  ],
  outputs: ['tier', 'score', 'recommendation', 'next_steps'],
  rules: [
    // Elite Licensee (90-100)
    {
      id: 'LQ-001',
      description: 'Elite Licensee - Immediate Approval',
      conditions: {
        net_worth: { operator: 'gte', value: 1000000 },
        liquid_capital: { operator: 'gte', value: 300000 },
        credit_score: { operator: 'gte', value: 780 },
        years_training: { operator: 'gte', value: 10 },
        business_experience: { operator: 'gte', value: 5 },
        brand_alignment: { operator: 'gte', value: 90 }
      },
      outputs: {
        tier: 'Elite',
        score_range: [90, 100],
        recommendation: 'Immediate Approval - Fast-Track Onboarding',
        next_steps: ['Schedule founder call', 'Send franchise agreement', 'Begin site selection']
      },
      priority: 1
    },
    // License Ready (85-89)
    {
      id: 'LQ-002',
      description: 'License Ready - Standard Approval',
      conditions: {
        net_worth: { operator: 'gte', value: 750000 },
        liquid_capital: { operator: 'gte', value: 200000 },
        credit_score: { operator: 'gte', value: 750 },
        years_training: { operator: 'gte', value: 7 },
        business_experience: { operator: 'gte', value: 3 }
      },
      outputs: {
        tier: 'License Ready',
        score_range: [85, 89],
        recommendation: 'Standard Approval Process',
        next_steps: ['Complete background check', 'Financial verification', 'Discovery day invitation']
      },
      priority: 2
    },
    // Strong Candidate (75-84)
    {
      id: 'LQ-003',
      description: 'Strong Candidate - Potential with Support',
      conditions: {
        net_worth: { operator: 'gte', value: 500000 },
        liquid_capital: { operator: 'gte', value: 150000 },
        credit_score: { operator: 'gte', value: 720 },
        years_training: { operator: 'gte', value: 5 }
      },
      outputs: {
        tier: 'Strong Candidate',
        score_range: [75, 84],
        recommendation: 'Proceed with Additional Vetting',
        next_steps: ['Extended interview process', 'Market analysis review', 'Mentorship matching']
      },
      priority: 3
    },
    // Marginal (65-74)
    {
      id: 'LQ-004',
      description: 'Marginal - Conditional Approval',
      conditions: {
        net_worth: { operator: 'gte', value: 300000 },
        liquid_capital: { operator: 'gte', value: 100000 },
        credit_score: { operator: 'gte', value: 680 }
      },
      outputs: {
        tier: 'Marginal',
        score_range: [65, 74],
        recommendation: 'Conditional Approval - Additional Support Required',
        next_steps: ['Business plan development', 'Financial coaching', 'Partner/investor identification']
      },
      priority: 4
    },
    // Not Ready (0-64)
    {
      id: 'LQ-005',
      description: 'Not Ready - Develop Further',
      conditions: {
        net_worth: { operator: 'lt', value: 300000 }
      },
      outputs: {
        tier: 'Not Ready',
        score_range: [0, 64],
        recommendation: 'Decline or Develop Further Before Reapplication',
        next_steps: ['Wealth building resources', 'Training program recommendations', '12-month check-in scheduled']
      },
      priority: 5
    }
  ]
};

// ============================================================
// DECISION TABLE: MEMBERSHIP TIER ASSIGNMENT
// ============================================================

export const MEMBERSHIP_TIER_TABLE: DMNDecisionTable = {
  id: 'membership-tier',
  name: 'Membership Tier Assignment',
  description: 'Routes new members to appropriate tier based on goals and commitment',
  hitPolicy: 'First',
  inputs: ['training_goal', 'experience_level', 'budget', 'commitment_hours', 'competition_interest'],
  outputs: ['tier', 'monthly_rate', 'benefits', 'trainer_access'],
  rules: [
    {
      id: 'MT-001',
      description: 'Elite/Competition Tier',
      conditions: {
        training_goal: { operator: 'in', value: ['competition', 'professional', 'elite'] },
        experience_level: { operator: 'gte', value: 5 },
        commitment_hours: { operator: 'gte', value: 15 },
        competition_interest: { operator: 'eq', value: true }
      },
      outputs: {
        tier: 'Elite',
        monthly_rate: 149,
        benefits: ['24/7 access', 'Competition prep', 'Nutrition planning', 'Priority equipment', 'Posing room'],
        trainer_access: 'dedicated'
      },
      priority: 1
    },
    {
      id: 'MT-002',
      description: 'Hardcore/Serious Tier',
      conditions: {
        training_goal: { operator: 'in', value: ['strength', 'bodybuilding', 'powerlifting'] },
        experience_level: { operator: 'gte', value: 2 },
        commitment_hours: { operator: 'gte', value: 8 }
      },
      outputs: {
        tier: 'Hardcore',
        monthly_rate: 89,
        benefits: ['Extended hours', 'Heavy equipment access', 'Chalk/belts allowed', 'No music restrictions'],
        trainer_access: 'scheduled'
      },
      priority: 2
    },
    {
      id: 'MT-003',
      description: 'Standard/Transformation Tier',
      conditions: {
        training_goal: { operator: 'in', value: ['weight_loss', 'fitness', 'health', 'transformation'] },
        commitment_hours: { operator: 'gte', value: 3 }
      },
      outputs: {
        tier: 'Standard',
        monthly_rate: 59,
        benefits: ['Peak hours access', 'Basic equipment', 'Group classes', 'Locker room'],
        trainer_access: 'optional_addon'
      },
      priority: 3
    },
    {
      id: 'MT-004',
      description: 'Basic/Entry Tier',
      conditions: {
        budget: { operator: 'lt', value: 50 }
      },
      outputs: {
        tier: 'Basic',
        monthly_rate: 29,
        benefits: ['Off-peak access', 'Cardio equipment', 'Basic machines'],
        trainer_access: 'none'
      },
      priority: 4
    }
  ]
};

// ============================================================
// DECISION TABLE: TRAINER ALLOCATION
// ============================================================

export const TRAINER_ALLOCATION_TABLE: DMNDecisionTable = {
  id: 'trainer-allocation',
  name: 'Trainer Allocation & Matching',
  description: 'Matches members with appropriate trainers based on goals and specialization',
  hitPolicy: 'Priority',
  inputs: ['member_goal', 'experience_level', 'preferred_style', 'schedule', 'budget_for_training'],
  outputs: ['trainer_type', 'sessions_per_week', 'specialization_required', 'rate_range'],
  rules: [
    {
      id: 'TA-001',
      description: 'Competition Prep Specialist',
      conditions: {
        member_goal: { operator: 'in', value: ['competition', 'show_prep', 'physique'] },
        budget_for_training: { operator: 'gte', value: 500 }
      },
      outputs: {
        trainer_type: 'Competition Specialist',
        sessions_per_week: 4,
        specialization_required: ['NPC/IFBB experience', 'Posing coach', 'Peak week expertise'],
        rate_range: [100, 200]
      },
      priority: 1
    },
    {
      id: 'TA-002',
      description: 'Strength & Powerlifting Coach',
      conditions: {
        member_goal: { operator: 'in', value: ['powerlifting', 'strength', 'strongman'] },
        budget_for_training: { operator: 'gte', value: 300 }
      },
      outputs: {
        trainer_type: 'Strength Coach',
        sessions_per_week: 3,
        specialization_required: ['USAPL/USPA certified', 'Periodization expert', 'Form specialist'],
        rate_range: [75, 150]
      },
      priority: 2
    },
    {
      id: 'TA-003',
      description: 'Bodybuilding & Hypertrophy',
      conditions: {
        member_goal: { operator: 'in', value: ['bodybuilding', 'hypertrophy', 'muscle_gain'] },
        budget_for_training: { operator: 'gte', value: 250 }
      },
      outputs: {
        trainer_type: 'Bodybuilding Coach',
        sessions_per_week: 3,
        specialization_required: ['Hypertrophy programming', 'Nutrition certification', 'Physique assessment'],
        rate_range: [65, 125]
      },
      priority: 3
    },
    {
      id: 'TA-004',
      description: 'Transformation & Weight Loss',
      conditions: {
        member_goal: { operator: 'in', value: ['weight_loss', 'transformation', 'fitness'] },
        budget_for_training: { operator: 'gte', value: 150 }
      },
      outputs: {
        trainer_type: 'Transformation Specialist',
        sessions_per_week: 2,
        specialization_required: ['NASM/ACE certified', 'Nutrition basics', 'Behavior change'],
        rate_range: [50, 85]
      },
      priority: 4
    },
    {
      id: 'TA-005',
      description: 'General Fitness - Entry Level',
      conditions: {
        member_goal: { operator: 'in', value: ['general_fitness', 'health', 'beginner'] }
      },
      outputs: {
        trainer_type: 'General Trainer',
        sessions_per_week: 1,
        specialization_required: ['Basic certification', 'Equipment orientation'],
        rate_range: [40, 60]
      },
      priority: 5
    }
  ]
};

// ============================================================
// DECISION TABLE: LEAD ROUTING & PRIORITIZATION
// ============================================================

export const LEAD_ROUTING_TABLE: DMNDecisionTable = {
  id: 'lead-routing',
  name: 'Lead Routing & Prioritization',
  description: 'Routes and prioritizes incoming leads for follow-up',
  hitPolicy: 'First',
  inputs: ['lead_source', 'budget_indicated', 'timeline', 'engagement_score', 'referral_source'],
  outputs: ['priority', 'route_to', 'follow_up_within', 'channel'],
  rules: [
    {
      id: 'LR-001',
      description: 'Hot Lead - Referral with Budget',
      conditions: {
        referral_source: { operator: 'neq', value: null },
        budget_indicated: { operator: 'gte', value: 100 },
        timeline: { operator: 'in', value: ['immediate', 'this_week'] }
      },
      outputs: {
        priority: 'P1-Hot',
        route_to: 'Senior Sales',
        follow_up_within: '2 hours',
        channel: 'phone_call'
      },
      priority: 1
    },
    {
      id: 'LR-002',
      description: 'Warm Lead - High Engagement',
      conditions: {
        engagement_score: { operator: 'gte', value: 70 },
        timeline: { operator: 'in', value: ['this_week', 'this_month'] }
      },
      outputs: {
        priority: 'P2-Warm',
        route_to: 'Sales Team',
        follow_up_within: '24 hours',
        channel: 'text_then_call'
      },
      priority: 2
    },
    {
      id: 'LR-003',
      description: 'Qualified Lead - Research Phase',
      conditions: {
        engagement_score: { operator: 'gte', value: 40 },
        budget_indicated: { operator: 'gte', value: 50 }
      },
      outputs: {
        priority: 'P3-Qualified',
        route_to: 'Inside Sales',
        follow_up_within: '48 hours',
        channel: 'email_sequence'
      },
      priority: 3
    },
    {
      id: 'LR-004',
      description: 'Nurture Lead - Long Timeline',
      conditions: {
        timeline: { operator: 'in', value: ['next_quarter', 'future'] }
      },
      outputs: {
        priority: 'P4-Nurture',
        route_to: 'Marketing Automation',
        follow_up_within: '1 week',
        channel: 'drip_campaign'
      },
      priority: 4
    },
    {
      id: 'LR-005',
      description: 'Cold Lead - Unqualified',
      conditions: {
        engagement_score: { operator: 'lt', value: 20 }
      },
      outputs: {
        priority: 'P5-Cold',
        route_to: 'Marketing List',
        follow_up_within: 'monthly_newsletter',
        channel: 'email_only'
      },
      priority: 5
    }
  ]
};

// ============================================================
// DMN ENGINE - EVALUATION FUNCTIONS
// ============================================================

function evaluateCondition(condition: DMNCondition, value: unknown): boolean {
  const { operator, value: expected, value2 } = condition;

  switch (operator) {
    case 'eq':
      return value === expected;
    case 'neq':
      return value !== expected;
    case 'gt':
      return typeof value === 'number' && typeof expected === 'number' && value > expected;
    case 'gte':
      return typeof value === 'number' && typeof expected === 'number' && value >= expected;
    case 'lt':
      return typeof value === 'number' && typeof expected === 'number' && value < expected;
    case 'lte':
      return typeof value === 'number' && typeof expected === 'number' && value <= expected;
    case 'in':
      return Array.isArray(expected) && expected.includes(value);
    case 'between':
      return typeof value === 'number' && typeof expected === 'number' && typeof value2 === 'number'
        && value >= expected && value <= value2;
    case 'contains':
      return typeof value === 'string' && typeof expected === 'string' && value.includes(expected);
    default:
      return false;
  }
}

function evaluateRule(rule: DMNRule, context: DMNContext): { matches: boolean; matchedConditions: number; totalConditions: number } {
  const conditions = Object.entries(rule.conditions);
  let matchedConditions = 0;

  for (const [inputName, condition] of conditions) {
    const contextValue = context[inputName];
    if (contextValue !== undefined && evaluateCondition(condition, contextValue)) {
      matchedConditions++;
    }
  }

  return {
    matches: matchedConditions === conditions.length,
    matchedConditions,
    totalConditions: conditions.length
  };
}

export function evaluateDecisionTable(table: DMNDecisionTable, context: DMNContext): DMNResult {
  const matchedRules: DMNRule[] = [];
  const reasoning: string[] = [];

  // Sort rules by priority
  const sortedRules = [...table.rules].sort((a, b) => a.priority - b.priority);

  for (const rule of sortedRules) {
    const evaluation = evaluateRule(rule, context);

    if (evaluation.matches) {
      matchedRules.push(rule);
      reasoning.push(`Rule ${rule.id} matched: ${rule.description}`);

      // For First/Unique hit policies, stop after first match
      if (table.hitPolicy === 'First' || table.hitPolicy === 'Unique') {
        break;
      }
    } else if (evaluation.matchedConditions > 0) {
      reasoning.push(`Rule ${rule.id} partially matched (${evaluation.matchedConditions}/${evaluation.totalConditions}): ${rule.description}`);
    }
  }

  // Calculate confidence based on rule match quality
  const confidence = matchedRules.length > 0
    ? Math.min(100, (matchedRules[0].priority === 1 ? 95 : 85 - (matchedRules[0].priority - 1) * 10))
    : 0;

  // Aggregate outputs based on hit policy
  let outputs: Record<string, unknown> = {};

  if (table.hitPolicy === 'Collect') {
    outputs = { results: matchedRules.map(r => r.outputs) };
  } else if (matchedRules.length > 0) {
    outputs = matchedRules[0].outputs;
  }

  return {
    tableId: table.id,
    tableName: table.name,
    matchedRules,
    outputs,
    confidence,
    reasoning
  };
}

// ============================================================
// MAIN EVALUATION FUNCTION
// ============================================================

export interface GymDMNEvaluation {
  licenseeQualification?: DMNResult;
  membershipTier?: DMNResult;
  trainerAllocation?: DMNResult;
  leadRouting?: DMNResult;
}

export function evaluateGymDMN(context: DMNContext, tables?: string[]): GymDMNEvaluation {
  const results: GymDMNEvaluation = {};
  const tablesToEvaluate = tables || ['all'];

  if (tablesToEvaluate.includes('all') || tablesToEvaluate.includes('licensee')) {
    results.licenseeQualification = evaluateDecisionTable(LICENSEE_QUALIFICATION_TABLE, context);
  }

  if (tablesToEvaluate.includes('all') || tablesToEvaluate.includes('membership')) {
    results.membershipTier = evaluateDecisionTable(MEMBERSHIP_TIER_TABLE, context);
  }

  if (tablesToEvaluate.includes('all') || tablesToEvaluate.includes('trainer')) {
    results.trainerAllocation = evaluateDecisionTable(TRAINER_ALLOCATION_TABLE, context);
  }

  if (tablesToEvaluate.includes('all') || tablesToEvaluate.includes('lead')) {
    results.leadRouting = evaluateDecisionTable(LEAD_ROUTING_TABLE, context);
  }

  return results;
}

// ============================================================
// FEATURE SCORING FUNCTIONS (Based on MetroFlex 50-Feature System)
// ============================================================

export interface LicenseeFeatures {
  // Demographics (15%)
  age?: number;
  net_worth?: number;
  liquid_capital?: number;
  credit_score?: number;
  household_income?: number;
  geographic_market?: string;

  // Psychographics (40%)
  years_training?: number;
  competition_count?: number;
  gym_ownership_experience?: boolean;
  business_experience?: number;
  management_experience?: number;
  sales_background?: number;
  grit_score?: number;
  brand_alignment?: number;
  coachability?: number;

  // Operational (25%)
  project_management?: number;
  hiring_experience?: number;
  financial_literacy?: number;
  marketing_capability?: number;
  tech_proficiency?: number;

  // Market (20%)
  market_population?: number;
  median_income?: number;
  competitor_density?: number;
  hardcore_gym_gap?: boolean;
  real_estate_cost?: number;
}

export function calculateLicenseeScore(features: LicenseeFeatures): {
  totalScore: number;
  categoryScores: Record<string, number>;
  tier: string;
  recommendation: string;
} {
  const categoryScores: Record<string, number> = {
    demographics: 0,
    psychographics: 0,
    operational: 0,
    market: 0
  };

  // Demographics (15% weight)
  if (features.net_worth) {
    categoryScores.demographics += features.net_worth >= 1000000 ? 10 :
      features.net_worth >= 500000 ? 7 : features.net_worth >= 300000 ? 4 : 1;
  }
  if (features.liquid_capital) {
    categoryScores.demographics += features.liquid_capital >= 300000 ? 10 :
      features.liquid_capital >= 150000 ? 7 : features.liquid_capital >= 100000 ? 4 : 1;
  }
  if (features.credit_score) {
    categoryScores.demographics += features.credit_score >= 780 ? 10 :
      features.credit_score >= 720 ? 7 : features.credit_score >= 680 ? 4 : 1;
  }

  // Psychographics (40% weight)
  if (features.years_training) {
    categoryScores.psychographics += features.years_training >= 10 ? 10 :
      features.years_training >= 5 ? 7 : features.years_training >= 2 ? 4 : 1;
  }
  if (features.business_experience) {
    categoryScores.psychographics += features.business_experience >= 5 ? 10 :
      features.business_experience >= 3 ? 7 : features.business_experience >= 1 ? 4 : 1;
  }
  if (features.brand_alignment) {
    categoryScores.psychographics += features.brand_alignment >= 90 ? 10 :
      features.brand_alignment >= 75 ? 7 : features.brand_alignment >= 60 ? 4 : 1;
  }
  if (features.grit_score) {
    categoryScores.psychographics += features.grit_score >= 8 ? 10 :
      features.grit_score >= 6 ? 7 : features.grit_score >= 4 ? 4 : 1;
  }

  // Operational (25% weight)
  if (features.financial_literacy) {
    categoryScores.operational += features.financial_literacy >= 80 ? 10 :
      features.financial_literacy >= 60 ? 7 : features.financial_literacy >= 40 ? 4 : 1;
  }
  if (features.management_experience) {
    categoryScores.operational += features.management_experience >= 5 ? 10 :
      features.management_experience >= 3 ? 7 : features.management_experience >= 1 ? 4 : 1;
  }

  // Market (20% weight)
  if (features.market_population) {
    categoryScores.market += features.market_population >= 100000 && features.market_population <= 500000 ? 10 :
      features.market_population >= 50000 ? 7 : 4;
  }
  if (features.hardcore_gym_gap) {
    categoryScores.market += 10;
  }
  if (features.competitor_density !== undefined) {
    categoryScores.market += features.competitor_density >= 3 && features.competitor_density <= 8 ? 10 :
      features.competitor_density < 3 ? 5 : 3;
  }

  // Weighted total (normalized to 100)
  const totalScore = Math.round(
    (categoryScores.demographics / 30 * 15) +
    (categoryScores.psychographics / 40 * 40) +
    (categoryScores.operational / 20 * 25) +
    (categoryScores.market / 30 * 20)
  );

  // Tier assignment
  let tier: string;
  let recommendation: string;

  if (totalScore >= 90) {
    tier = 'Elite';
    recommendation = 'Immediate Approval - Fast-Track Onboarding';
  } else if (totalScore >= 85) {
    tier = 'License Ready';
    recommendation = 'Standard Approval Process';
  } else if (totalScore >= 75) {
    tier = 'Strong Candidate';
    recommendation = 'Proceed with Additional Vetting';
  } else if (totalScore >= 65) {
    tier = 'Marginal';
    recommendation = 'Conditional Approval - Additional Support Required';
  } else {
    tier = 'Not Ready';
    recommendation = 'Decline or Develop Further Before Reapplication';
  }

  return { totalScore, categoryScores, tier, recommendation };
}

// Export all tables for admin UI
export const ALL_GYM_DMN_TABLES = {
  licenseeQualification: LICENSEE_QUALIFICATION_TABLE,
  membershipTier: MEMBERSHIP_TIER_TABLE,
  trainerAllocation: TRAINER_ALLOCATION_TABLE,
  leadRouting: LEAD_ROUTING_TABLE
};
