// Revenue Physics Engine — Pure TypeScript math engine
// Ported from circuitos/kernel/bayesian_scorer.py + circuit-os-pro/ml/bayesian_scorer.py
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
  bayesian: number   // 40% weight
  financial: number  // 25% weight
  philExperience: number // 20% weight — authority + fit
  engagement: number // 15% weight
  total: number      // weighted sum, 0-100
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
    prior: 0.10,
    decayRate: 0.050,
    description: 'Low starting probability, fast decay. Needs strong signals quickly or belief erodes to zero.',
    qualificationProfile: 'Unknown intent, no prior relationship, requires rapid qualification',
  },
  CONTENT_ENGAGED: {
    id: 'CONTENT_ENGAGED',
    name: 'Content Engaged',
    tagline: 'Downloaded a whitepaper, read the blog',
    prior: 0.15,
    decayRate: 0.020,
    description: 'Moderate start, slower decay. Deliberate researcher — the engine gives them time to convert.',
    qualificationProfile: 'Self-educating buyer, exploring solutions, needs trust-building content',
  },
  WARM_REFERRAL: {
    id: 'WARM_REFERRAL',
    name: 'Warm Referral',
    tagline: 'Introduced by an existing customer',
    prior: 0.20,
    decayRate: 0.015,
    description: 'Higher starting probability, patient decay. Warm intro carries social proof the engine respects.',
    qualificationProfile: 'Pre-qualified via social proof, higher trust baseline, shorter sales cycle',
  },
  ENTERPRISE_RFP: {
    id: 'ENTERPRISE_RFP',
    name: 'Enterprise RFP',
    tagline: 'Formal vendor evaluation in progress',
    prior: 0.25,
    decayRate: 0.005,
    description: 'Highest start, minimal decay. Formal process signals real budget and timeline commitment.',
    qualificationProfile: 'Budget allocated, multi-stakeholder, structured evaluation, long timeline',
  },
}

// ─── Signal Constants ────────────────────────────────────────────────────────

export const SIGNALS: Signal[] = [
  // Financial (25% composite weight)
  {
    id: 'revenue_1m_plus',
    label: 'Revenue $1M+',
    likelihoodRatio: 8.5,
    category: 'financial',
    confidence: 0.95,
    enrichmentSource: ['professional'],
    enrichmentQuery: 'Proprietary data → company revenue, funding rounds, financial indicators',
  },
  {
    id: 'revenue_500k_1m',
    label: 'Revenue $500K–$1M',
    likelihoodRatio: 5.0,
    category: 'financial',
    confidence: 0.85,
    enrichmentSource: ['professional'],
    enrichmentQuery: 'Proprietary data → company size indicators, employee count, growth signals',
  },
  {
    id: 'budget_allocated',
    label: 'Budget Allocated',
    likelihoodRatio: 2.8,
    category: 'financial',
    confidence: 0.70,
    enrichmentSource: ['professional', 'research'],
    enrichmentQuery: 'Proprietary data → procurement signals, vendor evaluation activity',
  },
  {
    id: 'existing_business',
    label: 'Existing Business Owner',
    likelihoodRatio: 3.2,
    category: 'financial',
    confidence: 0.80,
    enrichmentSource: ['professional'],
    enrichmentQuery: 'Proprietary data → business ownership, years operating, entity filings',
  },

  // Authority (20% composite weight with Fit)
  {
    id: 'csuite_contact',
    label: 'C-Suite Contact',
    likelihoodRatio: 6.0,
    category: 'authority',
    confidence: 0.90,
    enrichmentSource: ['professional', 'deep_analysis'],
    enrichmentQuery: 'Proprietary data → title verification, org chart, decision authority',
  },
  {
    id: 'multi_stakeholder',
    label: 'Multi-Stakeholder Engaged',
    likelihoodRatio: 4.0,
    category: 'authority',
    confidence: 0.85,
    enrichmentSource: ['deep_analysis'],
    enrichmentQuery: 'Proprietary data → buying committee signals, multiple contacts same account',
  },

  // Fit (20% composite weight with Authority)
  {
    id: 'icp_match_strong',
    label: 'Strong ICP Match',
    likelihoodRatio: 7.0,
    category: 'fit',
    confidence: 0.88,
    enrichmentSource: ['social'],
    enrichmentQuery: 'Proprietary data → industry vertical, company profile, tech stack match',
  },
  {
    id: 'competitor_displacement',
    label: 'Competitor Displacement',
    likelihoodRatio: 4.5,
    category: 'fit',
    confidence: 0.82,
    enrichmentSource: ['social', 'deep_analysis'],
    enrichmentQuery: 'Proprietary data → current vendor signals, dissatisfaction indicators',
  },
  {
    id: 'use_case_validated',
    label: 'Use Case Validated',
    likelihoodRatio: 9.0,
    category: 'fit',
    confidence: 0.98,
    enrichmentSource: ['deep_analysis'],
    enrichmentQuery: 'Proprietary data → published case studies, problem-solution alignment',
  },

  // Engagement (15% composite weight)
  {
    id: 'demo_requested',
    label: 'Demo Requested',
    likelihoodRatio: 6.0,
    category: 'engagement',
    confidence: 0.92,
    enrichmentSource: ['market'],
    enrichmentQuery: 'Proprietary data → form submission, UTM attribution, session context',
  },
  {
    id: 'content_downloaded',
    label: 'Content Downloaded',
    likelihoodRatio: 4.0,
    category: 'engagement',
    confidence: 0.78,
    enrichmentSource: ['market'],
    enrichmentQuery: 'Proprietary data → asset downloads, content engagement score',
  },
  {
    id: 'pricing_page_visits',
    label: 'Pricing Page Visits (3+)',
    likelihoodRatio: 3.5,
    category: 'engagement',
    confidence: 0.72,
    enrichmentSource: ['market'],
    enrichmentQuery: 'Proprietary data → page view frequency, return visits, session depth',
  },
  {
    id: 'form_complete',
    label: 'Full Form Completed',
    likelihoodRatio: 2.0,
    category: 'engagement',
    confidence: 0.65,
    enrichmentSource: ['research'],
    enrichmentQuery: 'Proprietary data → form field quality, completion rate, data enrichment',
  },

  // Market
  {
    id: 'market_identified',
    label: 'Target Market Identified',
    likelihoodRatio: 4.5,
    category: 'market',
    confidence: 0.80,
    enrichmentSource: ['market', 'research'],
    enrichmentQuery: 'Proprietary data → geographic demand, TAM analysis, competitive density',
  },

  // Negative
  {
    id: 'no_industry_match',
    label: 'No Industry Match',
    likelihoodRatio: 0.4,
    category: 'negative',
    confidence: 0.75,
    enrichmentSource: ['professional'],
    enrichmentQuery: 'Proprietary data → industry classification mismatch, vertical misalignment',
  },
  {
    id: 'weak_fit_score',
    label: 'Weak Product Fit',
    likelihoodRatio: 0.2,
    category: 'negative',
    confidence: 0.80,
    enrichmentSource: ['social'],
    enrichmentQuery: 'Proprietary data → needs analysis mismatch, feature gap detected',
  },
  {
    id: 'no_timeline',
    label: 'No Timeline Commitment',
    likelihoodRatio: 0.1,
    category: 'negative',
    confidence: 0.70,
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
  { name: 'deep_analysis', displayName: 'Deep Analysis Engine', description: 'Multi-source reasoning & pattern detection', color: '#f97316' },
]

// Simulated responses per engine per signal type
const ENRICHMENT_RESPONSES: Record<string, Record<string, string>> = {
  social: {
    icp_match_strong: 'Social analysis: 14 brand-relevant signals detected, sentiment score: 0.87',
    competitor_displacement: 'Social signals: Negative sentiment toward current vendor, exploring alternatives',
    weak_fit_score: 'Social analysis: Needs pattern misaligned with product capabilities, fit score: 0.22',
  },
  professional: {
    revenue_1m_plus: 'Company verified: $2.4M ARR, 45 employees, Series A funded, 6-year track record',
    revenue_500k_1m: 'Company verified: $780K ARR, 12 employees, bootstrapped, 3 years operating',
    budget_allocated: 'Procurement signal: Active vendor evaluation, Q2 budget cycle confirmed',
    existing_business: 'Business verified: Active entity since 2019, 3 registered businesses, good standing',
    csuite_contact: 'Title verified: CEO, 15+ years leadership experience, decision authority confirmed',
    no_industry_match: 'Industry classification: Outside target vertical, no relevant experience detected',
  },
  market: {
    demo_requested: 'Attribution: Organic search → pricing page (4m12s) → demo form, high intent score',
    content_downloaded: 'Engagement: Downloaded ROI calculator + case study, 18-min total session',
    pricing_page_visits: 'Behavior: 5 pricing page visits over 2 weeks, avg 3.8-min session depth',
    market_identified: 'Market data: Target region shows $4.2B TAM, 12% YoY growth, 340 potential accounts',
  },
  research: {
    budget_allocated: 'Research: 68% of similar companies allocate Q2 budget for new vendor evaluation',
    form_complete: 'Data quality: 12/12 fields completed, responses indicate high purchase intent',
    market_identified: 'Analysis: Target market median revenue $1.2M, technology adoption rate 73%',
    no_timeline: 'Pattern detected: 90+ days passive engagement, no urgency indicators in any channel',
  },
  deep_analysis: {
    csuite_contact: 'Deep analysis: Published thought leadership in target space, spoke at 2 industry events',
    multi_stakeholder: 'Pattern: 4 unique contacts from same account, spanning engineering + procurement',
    competitor_displacement: 'Analysis: Current vendor contract expires Q3, RFP language detected in job posts',
    use_case_validated: 'Deep match: Published case study mirrors prospect challenge exactly, 94% alignment',
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
      passed: certainty > 0.90,
      value: certainty,
      threshold: 0.90,
    },
    variance: {
      passed: variance < 0.05,
      value: variance,
      threshold: 0.05,
    },
    pulse: {
      passed: pulse > 3,
      value: pulse,
      threshold: 3.0,
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
    bayesian * 40 +
    financial * 25 +
    philExperience * 20 +
    engagement * 15
  )

  return { bayesian, financial, philExperience, engagement, total }
}

// ─── DMN Routing ─────────────────────────────────────────────────────────────

export function routeDMN(compositeScore: CompositeScore, gates: GateStatus): DMNRoute {
  const allGatesPass = gates.certainty.passed && gates.variance.passed && gates.pulse.passed
  const hasFriction = compositeScore.total < 20 && compositeScore.bayesian < 0.2

  if (allGatesPass) {
    return {
      action: 'CLUTCH_STRIKE',
      tier: 'CRITICAL',
      confidence: 0.99,
      description: 'Autonomous action authorized — immediate human escalation. High-authority intervention triggered.',
    }
  }

  if (hasFriction) {
    return {
      action: 'FRICTION_INTERCEPT',
      tier: 'INTERVENTION',
      confidence: 0.75,
      description: 'Friction detected — address objections, reroute messaging, deploy targeted content.',
    }
  }

  if (compositeScore.total > 70) {
    return {
      action: 'NURTURE_ACCELERATE',
      tier: 'HIGH',
      confidence: 0.85,
      description: 'Personalized email sequence + social retargeting. Priority follow-up within 24 hours.',
    }
  }

  if (compositeScore.total >= 40) {
    return {
      action: 'NURTURE_STANDARD',
      tier: 'MEDIUM',
      confidence: 0.65,
      description: 'Drip campaign activated — educational content, case studies, success stories.',
    }
  }

  return {
    action: 'IDENTITY_SHUNT',
    tier: 'LOW',
    confidence: 0.50,
    description: 'Automated re-education loop — requalification content, segment for future nurture.',
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
      certainty: { passed: false, value: posterior, threshold: 0.90 },
      variance: { passed: false, value: 1, threshold: 0.05 },
      pulse: { passed: false, value: 0, threshold: 3.0 },
    },
    pulseRate: 0,
    variance: 1,
    clutchStrike: false,
    simulatedTimeHours: 0,
    compositeScore: { bayesian: posterior, financial: 0, philExperience: 0, engagement: 0, total: posterior * 40 },
    dmnRoute: routeDMN(
      { bayesian: posterior, financial: 0, philExperience: 0, engagement: 0, total: posterior * 40 },
      {
        certainty: { passed: false, value: posterior, threshold: 0.90 },
        variance: { passed: false, value: 1, threshold: 0.05 },
        pulse: { passed: false, value: 0, threshold: 3.0 },
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
      certainty: { passed: false, value: 0, threshold: 0.90 },
      variance: { passed: false, value: 0, threshold: 0.05 },
      pulse: { passed: false, value: 0, threshold: 3.0 },
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
      certainty: { passed: false, value: 0, threshold: 0.90 },
      variance: { passed: false, value: 0, threshold: 0.05 },
      pulse: { passed: false, value: 0, threshold: 3.0 },
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
