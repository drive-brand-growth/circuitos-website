/**
 * Circuit Command Standard v2.0 - Drive Brand Growth Executive Edition
 *
 * INVESTOR-GRADE COMPLIANCE LAYER
 *
 * This is the flagship CCS implementation - the one investors and enterprise
 * prospects see. It demonstrates our own methodology in action:
 * "Eat your own dog food" - we use what we sell.
 *
 * 5-Layer DMN-Governed Operating System:
 * - Layer 1: SDI Framework (17-Part Strategic Decision Intelligence)
 * - Layer 2: Master Copywriting DMN (Schwartz + Hormozi + Brunson + StoryBrand)
 * - Layer 3: Conversion Engine (17-Factor DMN + 4-Gate Qualification)
 * - Layer 4: Attribution + Analytics (UTM, LTV/CAC, Revenue Intelligence)
 * - Layer 5: Fortune 100 Judgment (Amazon Type 1/2, Google 70/30, Apple Focus)
 *
 * @version 2.0.0-enterprise
 * @author Drive Brand Growth
 * @license Proprietary - Trade Secret
 */

// ============================================
// TYPES & INTERFACES
// ============================================

export interface UTMParams {
  source?: string;      // utm_source (google, linkedin, referral)
  medium?: string;      // utm_medium (cpc, organic, email)
  campaign?: string;    // utm_campaign (enterprise-q1, investor-demo)
  content?: string;     // utm_content (cta-hero, sidebar-form)
  term?: string;        // utm_term (ai consulting, revenue ops)
}

export interface InvestorProfile {
  firmType: 'vc' | 'pe' | 'angel' | 'strategic' | 'enterprise' | 'unknown';
  estimatedAUM?: number;         // Assets under management
  investmentStage?: 'seed' | 'series-a' | 'series-b' | 'growth' | 'late-stage';
  verticalFocus?: string[];      // SaaS, FinTech, Healthcare, etc.
  engagementSignals: string[];   // What they've shown interest in
}

export interface EnterpriseProfile {
  companySize: 'startup' | 'smb' | 'mid-market' | 'enterprise' | 'fortune-500';
  estimatedARR?: number;
  decisionMaker: 'ic' | 'manager' | 'director' | 'vp' | 'c-suite' | 'unknown';
  buyingStage: 'researching' | 'evaluating' | 'comparing' | 'deciding' | 'ready';
  technicalDepth: 'L1' | 'L2' | 'L3';  // Business, Technical, Engineering
  useCase?: string;
}

export interface ConversionEvent {
  eventName: string;
  eventType: 'micro' | 'macro';
  value?: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AttributionData {
  sessionId: string;
  utm: UTMParams;
  touchpoints: string[];
  conversions: ConversionEvent[];
  firstTouch: Date;
  lastTouch: Date;
  predictedLTV: number;
  predictedCAC: number;
  ltvCacRatio: number;
}

export type DecisionType = 'type_1' | 'type_2';
export type QualityTier = 'outstanding' | 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export interface Fortune100Assessment {
  decisionType: DecisionType;
  decisionId: string;
  qualityTier: QualityTier;
  compositeScore: number;
  recommendation: string;
  actionItems: string[];
  insights: {
    amazon: string;      // Type 1/Type 2 classification
    google: string;      // 70/30 rule insight
    apple: string;       // Focus principle
    microsoft: string;   // Growth mindset
    toyota: string;      // Continuous improvement
    netflix: string;     // Context over control
    mckinsey: string;    // Strategic framing
  };
  greenFlags: string[];
  redFlags: string[];
}

export interface CCSDecision {
  version: string;
  decisionId: string;
  sessionId: string;
  timestamp: Date;
  attribution: AttributionData;
  fortune100: Fortune100Assessment;
  recommendation: string;
  nextBestAction: string;
  escalationRequired: boolean;
  automatedFollowUp: string[];
}

export interface CCSConfig {
  domain: 'dbg_executive' | 'dbg_enterprise' | 'dbg_investor';
  enableAttribution?: boolean;
  enableFortune100?: boolean;
  ltvDefaults?: Record<string, number>;
  cacDefaults?: Record<string, number>;
}

// ============================================
// LAYER 4: ATTRIBUTION ENGINE (Investor-Grade)
// ============================================

export class AttributionEngine {
  private touchpoints: string[] = [];
  private conversions: ConversionEvent[] = [];
  private sessionStart: Date = new Date();

  // DBG-specific LTV predictions (consulting/enterprise deals)
  private ltvByProspectType: Record<string, number> = {
    'fortune-500': 500000,      // Fortune 500 enterprise deal
    'enterprise': 150000,       // Large enterprise
    'mid-market': 75000,        // Mid-market company
    'smb': 35000,               // Small-medium business
    'startup': 20000,           // Early-stage startup
    'investor': 1000000,        // Investor (portfolio value)
    'strategic': 250000,        // Strategic partner
    'unknown': 50000,
  };

  // CAC by acquisition channel
  private cacByChannel: Record<string, number> = {
    'organic': 500,
    'referral': 250,
    'linkedin': 2500,
    'google-ads': 3500,
    'content': 1000,
    'event': 5000,
    'direct': 0,
    'unknown': 1500,
  };

  parseUTM(url: string | Record<string, string>): UTMParams {
    if (typeof url === 'object') {
      return {
        source: url.utm_source || url.source,
        medium: url.utm_medium || url.medium,
        campaign: url.utm_campaign || url.campaign,
        content: url.utm_content || url.content,
        term: url.utm_term || url.term,
      };
    }

    try {
      const parsed = new URL(url);
      return {
        source: parsed.searchParams.get('utm_source') || undefined,
        medium: parsed.searchParams.get('utm_medium') || undefined,
        campaign: parsed.searchParams.get('utm_campaign') || undefined,
        content: parsed.searchParams.get('utm_content') || undefined,
        term: parsed.searchParams.get('utm_term') || undefined,
      };
    } catch {
      return {};
    }
  }

  trackTouchpoint(touchpoint: string): void {
    this.touchpoints.push(touchpoint);
  }

  trackConversion(
    eventName: string,
    eventType: 'micro' | 'macro',
    value?: number,
    metadata?: Record<string, unknown>
  ): ConversionEvent {
    const event: ConversionEvent = {
      eventName,
      eventType,
      value,
      timestamp: new Date(),
      metadata,
    };
    this.conversions.push(event);
    return event;
  }

  predictLTV(context: Record<string, unknown>): number {
    // Enterprise/investor LTV prediction
    const prospectType = (context.prospectType as string) ||
                         (context.companySize as string) ||
                         'unknown';

    let baseLTV = this.ltvByProspectType[prospectType] || this.ltvByProspectType['unknown'];

    // Multipliers based on context
    if (context.isInvestor) baseLTV *= 2;
    if (context.isFortune500) baseLTV *= 2.5;
    if (context.hasMultipleLocations) baseLTV *= 1.5;
    if (context.technicalDepth === 'L3') baseLTV *= 1.3;
    if (context.decisionMaker === 'c-suite') baseLTV *= 1.5;
    if (context.buyingStage === 'ready') baseLTV *= 1.2;
    if (context.referralSource) baseLTV *= 1.4;

    return Math.round(baseLTV);
  }

  predictCAC(context: Record<string, unknown>): number {
    const utm = context.utm as UTMParams | undefined;
    const channel = (context.channel as string) ||
                   utm?.source ||
                   'unknown';

    let baseCAC = this.cacByChannel[channel] || this.cacByChannel['unknown'];

    // Adjust based on deal complexity
    if (context.isEnterprise) baseCAC *= 1.5;
    if (context.requiresCustomWork) baseCAC *= 1.3;
    if (context.longSalesCycle) baseCAC *= 1.4;

    return Math.round(baseCAC);
  }

  buildAttribution(
    sessionId: string,
    utm: UTMParams,
    context: Record<string, unknown>
  ): AttributionData {
    const predictedLTV = this.predictLTV(context);
    const predictedCAC = this.predictCAC({ ...context, utm });

    return {
      sessionId,
      utm,
      touchpoints: [...this.touchpoints],
      conversions: [...this.conversions],
      firstTouch: this.sessionStart,
      lastTouch: new Date(),
      predictedLTV,
      predictedCAC,
      ltvCacRatio: predictedCAC > 0 ? Math.round(predictedLTV / predictedCAC * 10) / 10 : 0,
    };
  }

  reset(): void {
    this.touchpoints = [];
    this.conversions = [];
    this.sessionStart = new Date();
  }
}

// ============================================
// LAYER 5: FORTUNE 100 ENGINE (Enterprise-Grade)
// ============================================

export class Fortune100Engine {
  /**
   * Amazon Type 1/Type 2 Decision Classification
   *
   * Type 1: High-stakes, irreversible (enterprise deals, investor commitments)
   * Type 2: Reversible, bias toward action (demos, trials, content)
   */
  classifyDecisionType(context: Record<string, unknown>): DecisionType {
    const highStakesSignals = [
      context.isInvestor,
      context.isFortune500,
      context.isEnterprise,
      context.estimatedDealValue && (context.estimatedDealValue as number) > 100000,
      context.decisionMaker === 'c-suite',
      context.hasLegalImplications,
      context.requiresContractReview,
      context.involvesMultipleStakeholders,
    ];

    const highStakesCount = highStakesSignals.filter(Boolean).length;

    // Type 1 if 2+ high-stakes signals
    return highStakesCount >= 2 ? 'type_1' : 'type_2';
  }

  /**
   * Calculate composite quality score (0-100)
   */
  calculateCompositeScore(scores: Record<string, number>): number {
    const weights: Record<string, number> = {
      engagement: 0.20,
      qualification: 0.25,
      timing: 0.15,
      authority: 0.20,
      budget: 0.20,
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [key, weight] of Object.entries(weights)) {
      if (scores[key] !== undefined) {
        totalScore += scores[key] * weight;
        totalWeight += weight;
      }
    }

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;
  }

  /**
   * Determine quality tier based on score
   */
  determineQualityTier(score: number): QualityTier {
    if (score >= 90) return 'outstanding';
    if (score >= 80) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    if (score >= 30) return 'poor';
    return 'critical';
  }

  /**
   * Generate Fortune 100 company insights
   */
  generateInsights(
    decisionType: DecisionType,
    scores: Record<string, number>,
    context: Record<string, unknown>
  ): Fortune100Assessment['insights'] {
    const isHighValue = context.isEnterprise || context.isInvestor || context.isFortune500;
    const compositeScore = this.calculateCompositeScore(scores);

    return {
      amazon: decisionType === 'type_1'
        ? 'Type 1 Decision: High-stakes engagement requiring careful analysis. Gather stakeholder input, prepare detailed ROI projections, and ensure legal review if needed.'
        : 'Type 2 Decision: Bias toward action. Move quickly to demo, trial, or discovery call. This is reversible—speed matters more than perfection.',

      google: compositeScore >= 70
        ? '70/30 Rule: Strong foundation (70%) established. Focus remaining 30% on customization and specific use case alignment.'
        : '70/30 Rule: Foundation building needed. Focus on establishing core value proposition before diving into specifics.',

      apple: isHighValue
        ? 'Focus Principle: This is a high-value opportunity. Remove all distractions—single-threaded focus on this prospect\'s specific needs.'
        : 'Focus Principle: Standard engagement. Follow proven playbook while looking for unique value-add opportunities.',

      microsoft: context.technicalDepth === 'L3'
        ? 'Growth Mindset: Technical buyer engaged. Lean into architecture discussions, share technical case studies, offer POC.'
        : 'Growth Mindset: Focus on business outcomes and ROI. Save technical deep-dives for later stages.',

      toyota: context.messageCount && (context.messageCount as number) > 5
        ? 'Kaizen: Multi-turn engagement. Each interaction should build on previous—reference prior context, deepen relationship.'
        : 'Kaizen: Early engagement. Focus on understanding before selling. Ask 2x more than you tell.',

      netflix: context.awarenessLevel && (context.awarenessLevel as number) >= 4
        ? 'Context Over Control: Prospect is highly aware. Provide resources and let them self-navigate. Don\'t over-control the journey.'
        : 'Context Over Control: Prospect needs guidance. Provide clear next steps and structured path to value.',

      mckinsey: this.getMcKinseyFraming(context),
    };
  }

  private getMcKinseyFraming(context: Record<string, unknown>): string {
    if (context.isInvestor) {
      return 'Strategic Frame: Investor engagement. Position as portfolio value multiplier—emphasize scalability, defensibility, and market timing.';
    }
    if (context.isFortune500) {
      return 'Strategic Frame: Enterprise transformation opportunity. Frame as digital modernization initiative with executive sponsorship path.';
    }
    if (context.isEnterprise) {
      return 'Strategic Frame: Revenue operations optimization. Lead with efficiency gains and competitive advantage, followed by innovation potential.';
    }
    if (context.useCase) {
      return `Strategic Frame: Use case alignment. Tailor all messaging to ${context.useCase} outcomes and industry benchmarks.`;
    }
    return 'Strategic Frame: Discovery mode. Focus on uncovering pain points and building case for change before proposing solutions.';
  }

  /**
   * Identify green flags (positive signals)
   */
  identifyGreenFlags(context: Record<string, unknown>): string[] {
    const flags: string[] = [];

    if (context.isInvestor) flags.push('Investor engagement - high LTV potential');
    if (context.isFortune500) flags.push('Fortune 500 company - enterprise deal');
    if (context.decisionMaker === 'c-suite') flags.push('C-suite decision maker engaged');
    if (context.technicalDepth === 'L3') flags.push('Technical depth indicates serious evaluation');
    if (context.referralSource) flags.push('Referral source - higher trust baseline');
    if (context.buyingStage === 'ready') flags.push('Ready to buy signal detected');
    if (context.budgetConfirmed) flags.push('Budget confirmed or discussed');
    if (context.timelineUrgent) flags.push('Urgent timeline indicated');
    if (context.competitorMentioned) flags.push('Competitor mentioned - active evaluation');
    if (context.multipleStakeholders) flags.push('Multiple stakeholders - organizational buy-in');
    if (context.returnVisitor) flags.push('Return visitor - sustained interest');
    if (context.pricingViewed) flags.push('Pricing page viewed - serious intent');

    return flags;
  }

  /**
   * Identify red flags (risk signals)
   */
  identifyRedFlags(context: Record<string, unknown>): string[] {
    const flags: string[] = [];

    if (context.isCompetitor) flags.push('Competitor reconnaissance suspected');
    if (context.noEmail) flags.push('No email provided - qualification incomplete');
    if (context.freeEmailDomain) flags.push('Free email domain - may not be decision maker');
    if (context.lowEngagement) flags.push('Low engagement signals');
    if (context.priceOnlyFocus) flags.push('Price-only focus - may be unqualified');
    if (context.unrealisticTimeline) flags.push('Unrealistic timeline expectations');
    if (context.noAuthority) flags.push('No decision-making authority indicated');
    if (context.mismatchedICP) flags.push('Does not match ideal customer profile');
    if (context.previousChurn) flags.push('Previous customer who churned');
    if (context.negotiationTactics) flags.push('Heavy negotiation tactics early');

    return flags;
  }

  /**
   * Generate action items based on assessment
   */
  generateActionItems(
    decisionType: DecisionType,
    qualityTier: QualityTier,
    context: Record<string, unknown>
  ): string[] {
    const items: string[] = [];

    if (qualityTier === 'outstanding' || qualityTier === 'excellent') {
      items.push('Fast-track to discovery call within 24 hours');
      items.push('Prepare custom proposal based on stated needs');
      if (context.isEnterprise) items.push('Assign senior consultant to account');
      if (context.isInvestor) items.push('Schedule founder/CEO introduction');
    } else if (qualityTier === 'good') {
      items.push('Schedule discovery call within 48 hours');
      items.push('Send relevant case study matching their use case');
      items.push('Add to high-touch nurture sequence');
    } else if (qualityTier === 'fair') {
      items.push('Add to nurture sequence with educational content');
      items.push('Schedule follow-up in 1-2 weeks');
      items.push('Gather more qualification data before investing time');
    } else {
      items.push('Add to long-term nurture');
      items.push('Monitor for future engagement signals');
      items.push('Do not invest significant sales time currently');
    }

    if (decisionType === 'type_1') {
      items.push('Prepare ROI calculator specific to their situation');
      items.push('Identify all stakeholders and decision criteria');
    }

    return items;
  }

  /**
   * Full Fortune 100 assessment
   */
  assess(
    context: Record<string, unknown>,
    criterionScores?: Record<string, number>
  ): Fortune100Assessment {
    const scores = criterionScores || {
      engagement: (context.engagementScore as number) || 50,
      qualification: (context.qualificationScore as number) || 50,
      timing: (context.timingScore as number) || 50,
      authority: (context.authorityScore as number) || 50,
      budget: (context.budgetScore as number) || 50,
    };

    const decisionType = this.classifyDecisionType(context);
    const compositeScore = this.calculateCompositeScore(scores);
    const qualityTier = this.determineQualityTier(compositeScore);
    const insights = this.generateInsights(decisionType, scores, context);
    const greenFlags = this.identifyGreenFlags(context);
    const redFlags = this.identifyRedFlags(context);
    const actionItems = this.generateActionItems(decisionType, qualityTier, context);

    const recommendation = this.getRecommendation(qualityTier, decisionType, context);

    return {
      decisionType,
      decisionId: `dbg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      qualityTier,
      compositeScore,
      recommendation,
      actionItems,
      insights,
      greenFlags,
      redFlags,
    };
  }

  private getRecommendation(
    tier: QualityTier,
    type: DecisionType,
    context: Record<string, unknown>
  ): string {
    if (tier === 'outstanding') {
      return context.isInvestor
        ? 'PRIORITY: Investor engagement. Schedule executive call immediately. Prepare portfolio value proposition.'
        : 'PRIORITY: High-value prospect ready to engage. Fast-track to discovery. Assign senior resource.';
    }
    if (tier === 'excellent') {
      return type === 'type_1'
        ? 'Strong prospect with complex needs. Invest time in thorough discovery before proposing.'
        : 'Strong prospect. Move quickly to demo or trial. Speed matters.';
    }
    if (tier === 'good') {
      return 'Qualified prospect. Follow standard sales process with personalized touches.';
    }
    if (tier === 'fair') {
      return 'Needs more qualification. Nurture with content. Re-engage when buying signals strengthen.';
    }
    return 'Low priority. Automated nurture only. Focus resources on higher-tier prospects.';
  }
}

// ============================================
// MAIN CCS COMPLIANCE CLASS
// ============================================

export class CCSCompliance {
  private config: CCSConfig;
  private attribution: AttributionEngine;
  private fortune100: Fortune100Engine;
  private sessionData: Map<string, Record<string, unknown>> = new Map();

  constructor(config: CCSConfig = { domain: 'dbg_executive' }) {
    this.config = {
      enableAttribution: true,
      enableFortune100: true,
      ...config,
    };
    this.attribution = new AttributionEngine();
    this.fortune100 = new Fortune100Engine();
  }

  /**
   * Initialize a session with UTM tracking
   */
  initSession(sessionId: string, utm?: UTMParams): void {
    this.sessionData.set(sessionId, {
      startTime: new Date(),
      utm: utm || {},
      touchpoints: [],
      conversions: [],
      domain: this.config.domain,
    });

    if (utm?.source) {
      this.attribution.trackTouchpoint(`utm:${utm.source}/${utm.medium || 'direct'}`);
    }
  }

  /**
   * Track a conversion event
   */
  trackConversion(
    eventName: string,
    eventType: 'micro' | 'macro',
    value?: number,
    metadata?: Record<string, unknown>
  ): ConversionEvent {
    return this.attribution.trackConversion(eventName, eventType, value, metadata);
  }

  /**
   * Track a touchpoint
   */
  trackTouchpoint(touchpoint: string): void {
    this.attribution.trackTouchpoint(touchpoint);
  }

  /**
   * Parse UTM parameters
   */
  parseUTM(url: string | Record<string, string>): UTMParams {
    return this.attribution.parseUTM(url);
  }

  /**
   * Build full CCS decision
   */
  assessDecision(
    sessionId: string,
    context: Record<string, unknown>,
    utm?: UTMParams,
    criterionScores?: Record<string, number>
  ): CCSDecision {
    const attribution = this.attribution.buildAttribution(sessionId, utm || {}, context);
    const fortune100 = this.fortune100.assess(context, criterionScores);

    const escalationRequired =
      fortune100.qualityTier === 'outstanding' ||
      (fortune100.decisionType === 'type_1' && fortune100.qualityTier === 'excellent') ||
      fortune100.redFlags.length >= 3 ||
      (context.isInvestor as boolean) ||
      (context.isFortune500 as boolean);

    return {
      version: '2.0.0-enterprise',
      decisionId: fortune100.decisionId,
      sessionId,
      timestamp: new Date(),
      attribution,
      fortune100,
      recommendation: fortune100.recommendation,
      nextBestAction: fortune100.actionItems[0] || 'Continue engagement',
      escalationRequired,
      automatedFollowUp: this.generateAutomatedFollowUp(fortune100.qualityTier, context),
    };
  }

  private generateAutomatedFollowUp(
    tier: QualityTier,
    context: Record<string, unknown>
  ): string[] {
    const followUp: string[] = [];

    if (tier === 'outstanding' || tier === 'excellent') {
      followUp.push('Send calendar link for discovery call');
      followUp.push('Trigger "Hot Lead" Slack notification');
      if (context.useCase) {
        followUp.push(`Send ${context.useCase} case study`);
      }
    } else if (tier === 'good') {
      followUp.push('Send intro email with value prop');
      followUp.push('Add to 5-day nurture sequence');
    } else {
      followUp.push('Add to long-term nurture');
      followUp.push('Send weekly insights newsletter');
    }

    return followUp;
  }

  /**
   * Get session data
   */
  getSessionData(sessionId: string): Record<string, unknown> | undefined {
    return this.sessionData.get(sessionId);
  }

  /**
   * Reset session
   */
  resetSession(sessionId: string): void {
    this.sessionData.delete(sessionId);
    this.attribution.reset();
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create CCS metadata for API responses (investor-grade)
 */
export function createCCSMetadata(
  ccs: CCSCompliance,
  sessionId: string,
  leadTier: 'S' | 'A' | 'B' | 'C' | 'D',
  leadScore: number,
  context: Record<string, unknown>
): Record<string, unknown> {
  const decision = ccs.assessDecision(sessionId, {
    ...context,
    leadTier,
    leadScore,
    isEnterprise: leadTier === 'S' || leadTier === 'A',
    decisionMaker: context.technicalDepth === 'L3' ? 'director' : 'manager',
  });

  return {
    version: decision.version,
    decisionId: decision.decisionId,
    decisionType: decision.fortune100.decisionType,
    qualityTier: decision.fortune100.qualityTier,
    compositeScore: decision.fortune100.compositeScore,
    recommendation: decision.recommendation,
    nextBestAction: decision.nextBestAction,
    actionItems: decision.fortune100.actionItems,
    predictedLTV: decision.attribution.predictedLTV,
    ltvCacRatio: decision.attribution.ltvCacRatio,
    trackingComplete: true,
    escalationRequired: decision.escalationRequired,
    automatedFollowUp: decision.automatedFollowUp,
    insights: decision.fortune100.insights,
    greenFlags: decision.fortune100.greenFlags,
    redFlags: decision.fortune100.redFlags,
  };
}

/**
 * Determine if prospect qualifies for fast-track
 */
export function qualifiesForFastTrack(
  ccs: CCSCompliance,
  sessionId: string,
  context: Record<string, unknown>
): boolean {
  const decision = ccs.assessDecision(sessionId, context);
  return (
    decision.fortune100.qualityTier === 'outstanding' ||
    decision.fortune100.qualityTier === 'excellent' ||
    (context.isInvestor as boolean) ||
    (context.isFortune500 as boolean)
  );
}

/**
 * Check if manual review is required
 */
export function requiresManualReview(
  ccs: CCSCompliance,
  sessionId: string,
  context: Record<string, unknown>
): boolean {
  const decision = ccs.assessDecision(sessionId, context);
  return decision.escalationRequired;
}

/**
 * Get recommended action for a session
 */
export function getRecommendedAction(
  ccs: CCSCompliance,
  sessionId: string,
  context: Record<string, unknown>
): string {
  const decision = ccs.assessDecision(sessionId, context);
  return decision.nextBestAction;
}

/**
 * Classify prospect type from context
 */
export function classifyProspectType(context: Record<string, unknown>): string {
  if (context.isInvestor) return 'investor';
  if (context.isFortune500) return 'fortune-500';
  if (context.isEnterprise || context.companySize === 'enterprise') return 'enterprise';
  if (context.companySize === 'mid-market') return 'mid-market';
  if (context.companySize === 'smb') return 'smb';
  if (context.companySize === 'startup') return 'startup';
  return 'unknown';
}

/**
 * Get investor-specific insights
 */
export function getInvestorInsights(context: Record<string, unknown>): Record<string, string> {
  return {
    portfolioValue: 'AI consulting can drive 2-5x portfolio value through operational efficiency',
    marketTiming: 'AI adoption wave creates urgent need for implementation expertise',
    defensibility: 'Proprietary DMN frameworks and trained models create switching costs',
    scalability: 'Platform approach enables multi-tenant deployment across portfolio',
    exitMultiple: 'AI-native companies command 3-4x higher revenue multiples',
  };
}
