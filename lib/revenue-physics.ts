// Practice sandbox math. Figures are example data only.
// They are round illustrations, not production scoring settings.
// Zero React dependencies. All pure functions.

// ─── Types ───────────────────────────────────────────────────────────────────

export type PersonaId = 'COLD_INBOUND' | 'CONTENT_ENGAGED' | 'WARM_REFERRAL' | 'ENTERPRISE_RFP'

export type SignalCategory = 'financial' | 'authority' | 'fit' | 'engagement' | 'market' | 'negative'

export type EngineName = 'social' | 'professional' | 'market' | 'research' | 'deep_analysis'

export interface Persona {
  id: PersonaId
  name: string
  tagline: string
  prior: number
  decayRate: number
  description: string
  qualificationProfile: string
}

export interface Signal {
  id: string
  label: string
  likelihoodRatio: number
  category: SignalCategory
  confidence: number
  enrichmentSource: EngineName[]
  enrichmentQuery: string
}

export interface Vector4D {
  S: number // Signal strength — mean of confidences
  T: number // Temporal freshness — 1/(1+dt)
  B: number // Breadth — min(1, count/5)
  C: number // Conviction — posterior
}

export interface GateStatus {
  certainty: { passed: boolean; value: number; threshold: number }
  variance: { passed: boolean; value: number; threshold: number }
  pulse: { passed: boolean; value: number; threshold: number }
}

export interface CompositeScore {
  bayesian: number
  financial: number
  philExperience: number
  engagement: number
  total: number
}

export type DMNAction = 'CLUTCH_STRIKE' | 'NURTURE_ACCELERATE' | 'NURTURE_STANDARD' | 'IDENTITY_SHUNT' | 'FRICTION_INTERCEPT'

export interface DMNRoute {
  action: DMNAction
  tier: string
  confidence: number
  description: string
}

export interface SocialEnrichment {
  engine: EngineName
  query: string
  result: string
  score: number
  signalId: string
}

export interface FiredSignalEntry {
  signal: Signal
  posteriorAfter: number
  time: number
  engines: EngineName[]
}

export interface EngineState {
  persona: Persona
  firedSignals: FiredSignalEntry[]
  posterior: number
  logOdds: number
  vector: Vector4D
  gates: GateStatus
  pulseRate: number
  variance: number
  clutchStrike: boolean
  simulatedTimeHours: number
  compositeScore: CompositeScore
  dmnRoute: DMNRoute
  socialEnrichments: SocialEnrichment[]
  posteriorHistory: number[]
}

// ─── Persona Constants ───────────────────────────────────────────────────────

export const PERSONAS: Record<PersonaId, Persona> = {
  COLD_INBOUND: {
    id: 'COLD_INBOUND',
    name: 'Cold Inbound',
    tagline: 'Unknown lead from a web form',
    prior: 0.20,
    decayRate: 0.10,
    description: 'Low starting probability, fast decay. Needs strong signals quickly or belief erodes to zero.',
    qualificationProfile: 'Unknown intent, no prior relationship, requires rapid qualification',
  },
  CONTENT_ENGAGED: {
    id: 'CONTENT_ENGAGED',
    name: 'Content Engaged',
    tagline: 'Downloaded a whitepaper, read the blog',
    prior: 0.40,
    decayRate: 0.05,
    description: 'Moderate start, slower decay. A careful reader. The practice run gives them time.',
    qualificationProfile: 'Reading on their own, exploring, needs material that earns trust',
  },
  WARM_REFERRAL: {
    id: 'WARM_REFERRAL',
    name: 'Warm Referral',
    tagline: 'Introduced by an existing customer',
    prior: 0.60,
    decayRate: 0.02,
    description: 'Higher starting probability, patient decay. Warm intro carries social proof the engine respects.',
    qualificationProfile: 'Introduced by someone already known, higher trust, a shorter path',
  },
  ENTERPRISE_RFP: {
    id: 'ENTERPRISE_RFP',
    name: 'Enterprise RFP',
    tagline: 'Formal vendor evaluation in progress',
    prior: 0.80,
    decayRate: 0.01,
    description: 'Highest start, minimal decay. Formal process signals real budget and timeline commitment.',
    qualificationProfile: 'Budget allocated, several people involved, a structured review, a long timeline',
  },
}

// ─── Signal Constants ────────────────────────────────────────────────────────

export const SIGNALS: Signal[] = [
  // Financial
  {
    id: 'revenue_1m_plus',
    label: 'Revenue $1M+',
    likelihoodRatio: 8,
    category: 'financial',
    confidence: 0.8,
    enrichmentSource: ['professional'],
    enrichmentQuery: 'Proprietary data → company revenue, funding rounds, financial indicators',
  },
  {
    id: 'revenue_500k_1m',
    label: 'Revenue from $500K to $1M',
    likelihoodRatio: 4,
    category: 'financial',
    confidence: 0.7,
    enrichmentSource: ['professional'],
    enrichmentQuery: 'Proprietary data → company size indicators, employee count, growth signals',
  },
  {
    id: 'budget_allocated',
    label: 'Budget Allocated',
    likelihoodRatio: 2,
    category: 'financial',
    confidence: 0.6,
    enrichmentSource: ['professional', 'research'],
    enrichmentQuery: 'Proprietary data → procurement signals, vendor evaluation activity',
  },
  {
    id: 'existing_business',
    label: 'Existing Business Owner',
    likelihoodRatio: 3,
    category: 'financial',
    confidence: 0.7,
    enrichmentSource: ['professional'],
    enrichmentQuery: 'Proprietary data → business ownership, years operating, entity filings',
  },

  // Authority
  {
    id: 'csuite_contact',
    label: 'Executive contact',
    likelihoodRatio: 5,
    category: 'authority',
    confidence: 0.8,
    enrichmentSource: ['professional', 'deep_analysis'],
    enrichmentQuery: 'Proprietary data → title verification, org chart, decision authority',
  },
  {
    id: 'multi_stakeholder',
    label: 'Several people engaged',
    likelihoodRatio: 3,
    category: 'authority',
    confidence: 0.7,
    enrichmentSource: ['deep_analysis'],
    enrichmentQuery: 'Proprietary data → buying committee signals, multiple contacts same account',
  },

  // Fit
  {
    id: 'icp_match_strong',
    label: 'Strong ICP Match',
    likelihoodRatio: 6,
    category: 'fit',
    confidence: 0.8,
    enrichmentSource: ['social'],
    enrichmentQuery: 'Proprietary data → industry vertical, company profile, tech stack match',
  },
  {
    id: 'competitor_displacement',
    label: 'Competitor Displacement',
    likelihoodRatio: 4,
    category: 'fit',
    confidence: 0.7,
    enrichmentSource: ['social', 'deep_analysis'],
    enrichmentQuery: 'Proprietary data → current vendor signals, dissatisfaction indicators',
  },
  {
    id: 'use_case_validated',
    label: 'Use Case Validated',
    likelihoodRatio: 8,
    category: 'fit',
    confidence: 0.9,
    enrichmentSource: ['deep_analysis'],
    enrichmentQuery: 'Proprietary data → how the problem and the offer line up',
  },

  // Engagement
  {
    id: 'demo_requested',
    label: 'Meeting requested',
    likelihoodRatio: 5,
    category: 'engagement',
    confidence: 0.8,
    enrichmentSource: ['market'],
    enrichmentQuery: 'Proprietary data → form submission, UTM attribution, session context',
  },
  {
    id: 'content_downloaded',
    label: 'Content Downloaded',
    likelihoodRatio: 3,
    category: 'engagement',
    confidence: 0.7,
    enrichmentSource: ['market'],
    enrichmentQuery: 'Proprietary data → asset downloads, content engagement score',
  },
  {
    id: 'pricing_page_visits',
    label: 'Pricing Page Visits (3+)',
    likelihoodRatio: 3,
    category: 'engagement',
    confidence: 0.6,
    enrichmentSource: ['market'],
    enrichmentQuery: 'Proprietary data → page view frequency, return visits, session depth',
  },
  {
    id: 'form_complete',
    label: 'Full Form Completed',
    likelihoodRatio: 2,
    category: 'engagement',
    confidence: 0.6,
    enrichmentSource: ['research'],
    enrichmentQuery: 'Proprietary data → form field quality, completion rate, data enrichment',
  },

  // Market
  {
    id: 'market_identified',
    label: 'Target Market Identified',
    likelihoodRatio: 4,
    category: 'market',
    confidence: 0.7,
    enrichmentSource: ['market', 'research'],
    enrichmentQuery: 'Proprietary data → geographic demand, TAM analysis, competitive density',
  },

  // Negative
  {
    id: 'no_industry_match',
    label: 'No Industry Match',
    likelihoodRatio: 0.5,
    category: 'negative',
    confidence: 0.6,
    enrichmentSource: ['professional'],
    enrichmentQuery: 'Proprietary data → industry classification mismatch, vertical misalignment',
  },
  {
    id: 'weak_fit_score',
    label: 'Weak Product Fit',
    likelihoodRatio: 0.25,
    category: 'negative',
    confidence: 0.7,
    enrichmentSource: ['social'],
    enrichmentQuery: 'Proprietary data → needs analysis mismatch, feature gap detected',
  },
  {
    id: 'no_timeline',
    label: 'No Timeline Commitment',
    likelihoodRatio: 0.2,
    category: 'negative',
    confidence: 0.6,
    enrichmentSource: ['research'],
    enrichmentQuery: 'Proprietary data → no urgency indicators, passive browsing pattern',
  },
]

// ─── Enrichment Engine Metadata ──────────────────────────────────────────────

export interface EngineInfo {
  name: EngineName
  displayName: string
  description: string
  color: string
}

export const ENGINES: EngineInfo[] = [
  { name: 'social', displayName: 'Social Signal Engine', description: 'Brand sentiment & social intelligence', color: '#3b82f6' },
  { name: 'professional', displayName: 'Professional Intelligence', description: 'Professional network & company data', color: '#22c55e' },
  { name: 'market', displayName: 'Market Intelligence', description: 'Search trends & competitive landscape', color: '#a855f7' },
  { name: 'research', displayName: 'Research Engine', description: 'Cited industry research & market data', color: '#06b6d4' },
  { name: 'deep_analysis', displayName: 'Deep Analysis Engine', description: 'Reasoning across sources and pattern detection', color: '#f97316' },
]

// Simulated responses per engine per signal type
const ENRICHMENT_RESPONSES: Record<string, Record<string, string>> = {
  social: {
    icp_match_strong: 'Example only. A sketch of public posts that mention the brand.',
    competitor_displacement: 'Example only. A sketch of unease with a current vendor.',
    weak_fit_score: 'Example only. A sketch where the stated need misses the offer.',
  },
  professional: {
    revenue_1m_plus: 'Example only. A larger company sketch, not a real account.',
    revenue_500k_1m: 'Example only. A smaller company sketch, not a real account.',
    budget_allocated: 'Example only. A buying cycle sketch, not a confirmed budget.',
    existing_business: 'Example only. An owner sketch, not a filing lookup.',
    csuite_contact: 'Example only. An executive title sketch, not a verified person.',
    no_industry_match: 'Example only. A field that sits outside this sketch.',
  },
  market: {
    demo_requested: 'Example only. A sketch of a visit that ends on a meeting form.',
    content_downloaded: 'Example only. A sketch of someone reading a page.',
    pricing_page_visits: 'Example only. A sketch of repeat visits to a pricing page.',
    market_identified: 'Example only. A market sketch, not a measured market.',
  },
  research: {
    budget_allocated: 'Example only. A sketch of a budget conversation, not a study.',
    form_complete: 'Example only. A sketch of a finished form, not a quality score.',
    market_identified: 'Example only. A market sketch with no measured adoption.',
    no_timeline: 'Example only. A sketch with no date attached.',
  },
  deep_analysis: {
    csuite_contact: 'Example only. A sketch of public writing, not a named speaker.',
    multi_stakeholder: 'Example only. A sketch of several people at one account.',
    competitor_displacement: 'Example only. A sketch of a vendor change, not a contract date.',
    use_case_validated: 'Example only. A sketch where the problem lines up with the offer.',
  },
}

// ─── Core Math Functions ─────────────────────────────────────────────────────

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

export function logOdds(p: number): number {
  const clamped = Math.max(1e-10, Math.min(1 - 1e-10, p))
  return Math.log(clamped / (1 - clamped))
}

export function bayesianUpdate(currentLogOdds: number, signal: Signal): number {
  const lnLR = Math.log(signal.likelihoodRatio)
  const updated = currentLogOdds + lnLR
  return Math.max(-20, Math.min(20, updated))
}

export function applyDecay(posterior: number, lambda: number, deltaHours: number): number {
  return posterior * Math.exp(-lambda * deltaHours)
}

export function computeVector(state: EngineState): Vector4D {
  const signals = state.firedSignals
  const S = signals.length > 0
    ? signals.reduce((sum, s) => sum + s.signal.confidence, 0) / signals.length
    : 0
  const T = 1 / (1 + state.simulatedTimeHours)
  const B = Math.min(1, signals.length / 5)
  const C = state.posterior

  return { S, T, B, C }
}

export function computeVariance(posteriorHistory: number[]): number {
  const recent = posteriorHistory.slice(-10)
  if (recent.length < 2) return 1
  const mean = recent.reduce((a, b) => a + b, 0) / recent.length
  const variance = recent.reduce((sum, v) => sum + (v - mean) ** 2, 0) / recent.length
  return variance
}

export function computePulseRate(
  signals: FiredSignalEntry[],
  currentTime: number,
  windowHours: number = 4
): number {
  const baselineRate = 1 // 1 signal per window = baseline
  const recentSignals = signals.filter(s => (currentTime - s.time) <= windowHours)
  const rate = recentSignals.length / Math.max(1, windowHours)
  return rate / baselineRate
}

export function evaluateGates(state: EngineState): GateStatus {
  const certainty = state.posterior
  const variance = computeVariance(state.posteriorHistory)
  const pulse = computePulseRate(state.firedSignals, state.simulatedTimeHours)

  return {
    certainty: {
      passed: certainty > 0.80,
      value: certainty,
      threshold: 0.80,
    },
    variance: {
      passed: variance < 0.10,
      value: variance,
      threshold: 0.10,
    },
    pulse: {
      passed: pulse > 2,
      value: pulse,
      threshold: 2,
    },
  }
}

// ─── Composite Scoring ───────────────────────────────────────────────────────

function categoryScore(signals: FiredSignalEntry[], categories: SignalCategory[]): number {
  const relevant = signals.filter(s => categories.includes(s.signal.category))
  if (relevant.length === 0) return 0
  const total = relevant.reduce((sum, s) => {
    const isNegative = s.signal.likelihoodRatio < 1
    return sum + (isNegative ? -s.signal.confidence : s.signal.confidence)
  }, 0)
  return Math.max(0, Math.min(1, total / Math.max(1, relevant.length)))
}

export function computeCompositeScore(state: EngineState): CompositeScore {
  const bayesian = state.posterior
  const financial = categoryScore(state.firedSignals, ['financial'])
  const philExperience = categoryScore(state.firedSignals, ['authority', 'fit'])
  const engagement = categoryScore(state.firedSignals, ['engagement'])

  const total = (
    bayesian * 25 +
    financial * 25 +
    philExperience * 25 +
    engagement * 25
  )

  return { bayesian, financial, philExperience, engagement, total }
}

// ─── DMN Routing ─────────────────────────────────────────────────────────────

export function routeDMN(compositeScore: CompositeScore, gates: GateStatus): DMNRoute {
  const allGatesPass = gates.certainty.passed && gates.variance.passed && gates.pulse.passed
  const hasFriction = compositeScore.total < 25 && compositeScore.bayesian < 0.25

  if (allGatesPass) {
    return {
      action: 'CLUTCH_STRIKE',
      tier: 'CRITICAL',
      confidence: 0.9,
      description: 'The practice gates passed. Prepare the draft. A written gate and a named person\'s recorded approval still stand before anything reaches a customer or moves money.',
    }
  }

  if (hasFriction) {
    return {
      action: 'FRICTION_INTERCEPT',
      tier: 'INTERVENTION',
      confidence: 0.7,
      description: 'Friction detected. Answer the objection, change the route, and draft a note the owner can release.',
    }
  }

  if (compositeScore.total > 75) {
    return {
      action: 'NURTURE_ACCELERATE',
      tier: 'HIGH',
      confidence: 0.8,
      description: 'A drafted note sequence and a reminder. A written gate and a named person\'s recorded approval still stand before a customer sees it.',
    }
  }

  if (compositeScore.total >= 50) {
    return {
      action: 'NURTURE_STANDARD',
      tier: 'MEDIUM',
      confidence: 0.6,
      description: 'A slower sequence of notes the team already uses. A written gate and a named person\'s recorded approval still stand before anything sends.',
    }
  }

  return {
    action: 'IDENTITY_SHUNT',
    tier: 'LOW',
    confidence: 0.4,
    description: 'Hold for a later pass. Draft material that qualifies them again, and keep them out of the live route.',
  }
}

// ─── Social Engine Simulation ────────────────────────────────────────────────

export function simulateSocialEnrichment(signal: Signal): SocialEnrichment[] {
  return signal.enrichmentSource.map(engine => {
    const responses = ENRICHMENT_RESPONSES[engine] || {}
    const result = responses[signal.id] || `Enrichment data collected for ${signal.label}`
    const score = signal.likelihoodRatio > 1
      ? 0.5 + (Math.log(signal.likelihoodRatio) / Math.log(10)) * 0.25
      : 0.2

    return {
      engine,
      query: signal.enrichmentQuery,
      result,
      score: Math.min(1, score),
      signalId: signal.id,
    }
  })
}

// ─── State Management ────────────────────────────────────────────────────────

export function createInitialState(personaId: PersonaId): EngineState {
  const persona = PERSONAS[personaId]
  const posterior = persona.prior
  const lo = logOdds(posterior)

  const state: EngineState = {
    persona,
    firedSignals: [],
    posterior,
    logOdds: lo,
    vector: { S: 0, T: 1, B: 0, C: posterior },
    gates: {
      certainty: { passed: false, value: posterior, threshold: 0.80 },
      variance: { passed: false, value: 1, threshold: 0.10 },
      pulse: { passed: false, value: 0, threshold: 2 },
    },
    pulseRate: 0,
    variance: 1,
    clutchStrike: false,
    simulatedTimeHours: 0,
    compositeScore: { bayesian: posterior, financial: 0, philExperience: 0, engagement: 0, total: posterior * 25 },
    dmnRoute: routeDMN(
      { bayesian: posterior, financial: 0, philExperience: 0, engagement: 0, total: posterior * 25 },
      {
        certainty: { passed: false, value: posterior, threshold: 0.80 },
        variance: { passed: false, value: 1, threshold: 0.10 },
        pulse: { passed: false, value: 0, threshold: 2 },
      }
    ),
    socialEnrichments: [],
    posteriorHistory: [posterior],
  }

  return state
}

export function fireSignal(state: EngineState, signalId: string): EngineState {
  const signal = SIGNALS.find(s => s.id === signalId)
  if (!signal) return state
  if (state.firedSignals.some(f => f.signal.id === signalId)) return state

  const newLogOdds = bayesianUpdate(state.logOdds, signal)
  const newPosterior = sigmoid(newLogOdds)
  const newEnrichments = simulateSocialEnrichment(signal)

  const entry: FiredSignalEntry = {
    signal,
    posteriorAfter: newPosterior,
    time: state.simulatedTimeHours,
    engines: signal.enrichmentSource,
  }

  const firedSignals = [...state.firedSignals, entry]
  const posteriorHistory = [...state.posteriorHistory, newPosterior]
  const socialEnrichments = [...state.socialEnrichments, ...newEnrichments]

  const nextState: EngineState = {
    ...state,
    firedSignals,
    posterior: newPosterior,
    logOdds: newLogOdds,
    posteriorHistory,
    socialEnrichments,
    vector: { S: 0, T: 0, B: 0, C: 0 },
    gates: {
      certainty: { passed: false, value: 0, threshold: 0.80 },
      variance: { passed: false, value: 0, threshold: 0.10 },
      pulse: { passed: false, value: 0, threshold: 2 },
    },
    pulseRate: 0,
    variance: 0,
    clutchStrike: false,
    compositeScore: { bayesian: 0, financial: 0, philExperience: 0, engagement: 0, total: 0 },
    dmnRoute: state.dmnRoute,
  }

  nextState.vector = computeVector(nextState)
  nextState.variance = computeVariance(posteriorHistory)
  nextState.pulseRate = computePulseRate(firedSignals, state.simulatedTimeHours)
  nextState.gates = evaluateGates(nextState)
  nextState.compositeScore = computeCompositeScore(nextState)
  nextState.dmnRoute = routeDMN(nextState.compositeScore, nextState.gates)

  const allGatesPass = nextState.gates.certainty.passed &&
    nextState.gates.variance.passed &&
    nextState.gates.pulse.passed
  nextState.clutchStrike = allGatesPass && !state.clutchStrike

  return nextState
}

export function advanceTime(state: EngineState, deltaHours: number): EngineState {
  const newTime = state.simulatedTimeHours + deltaHours
  const decayed = applyDecay(state.posterior, state.persona.decayRate, deltaHours)
  const newLogOdds = logOdds(decayed)
  const posteriorHistory = [...state.posteriorHistory, decayed]

  const nextState: EngineState = {
    ...state,
    simulatedTimeHours: newTime,
    posterior: decayed,
    logOdds: newLogOdds,
    posteriorHistory,
    vector: { S: 0, T: 0, B: 0, C: 0 },
    gates: {
      certainty: { passed: false, value: 0, threshold: 0.80 },
      variance: { passed: false, value: 0, threshold: 0.10 },
      pulse: { passed: false, value: 0, threshold: 2 },
    },
    pulseRate: 0,
    variance: 0,
    clutchStrike: false,
    compositeScore: { bayesian: 0, financial: 0, philExperience: 0, engagement: 0, total: 0 },
    dmnRoute: state.dmnRoute,
  }

  nextState.vector = computeVector(nextState)
  nextState.variance = computeVariance(posteriorHistory)
  nextState.pulseRate = computePulseRate(state.firedSignals, newTime)
  nextState.gates = evaluateGates(nextState)
  nextState.compositeScore = computeCompositeScore(nextState)
  nextState.dmnRoute = routeDMN(nextState.compositeScore, nextState.gates)

  return nextState
}
