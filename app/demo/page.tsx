'use client'

import { useReducer, useEffect, useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// ─── SEO ──────────────────────────────────────────────────────────────────────

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://usecircuitos.com' },
    { '@type': 'ListItem', position: 2, name: 'Demo', item: 'https://usecircuitos.com/demo' },
  ],
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PainPoint = 'scoring' | 'outreach' | 'integration' | 'intelligence'
type LeadVolume = 'starter' | 'growth' | 'scale' | 'enterprise'
type StackMaturity = 'spreadsheets' | 'basic_crm' | 'marketing_auto' | 'custom'
type Timing = 'now' | 'evaluating' | 'exploring' | 'building_case'
type DemoPhase = 'wizard' | 'transition' | 'demo' | 'complete'

interface DemoState {
  phase: DemoPhase
  wizardStep: number
  answers: {
    painPoint: PainPoint | null
    leadVolume: LeadVolume | null
    stackMaturity: StackMaturity | null
    timing: Timing | null
  }
  demoStep: number
  isPaused: boolean
  formSubmitted: boolean
  showCTA: boolean
}

type DemoAction =
  | { type: 'SET_PAIN_POINT'; value: PainPoint }
  | { type: 'SET_LEAD_VOLUME'; value: LeadVolume }
  | { type: 'SET_STACK_MATURITY'; value: StackMaturity }
  | { type: 'SET_TIMING'; value: Timing }
  | { type: 'ADVANCE_WIZARD' }
  | { type: 'START_TRANSITION' }
  | { type: 'START_DEMO' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_PAUSED'; value: boolean }
  | { type: 'SHOW_CTA' }
  | { type: 'HIDE_CTA' }
  | { type: 'SUBMIT_FORM' }
  | { type: 'COMPLETE' }

const initialState: DemoState = {
  phase: 'wizard',
  wizardStep: 0,
  answers: { painPoint: null, leadVolume: null, stackMaturity: null, timing: null },
  demoStep: 0,
  isPaused: false,
  formSubmitted: false,
  showCTA: false,
}

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'SET_PAIN_POINT':
      return { ...state, answers: { ...state.answers, painPoint: action.value } }
    case 'SET_LEAD_VOLUME':
      return { ...state, answers: { ...state.answers, leadVolume: action.value } }
    case 'SET_STACK_MATURITY':
      return { ...state, answers: { ...state.answers, stackMaturity: action.value } }
    case 'SET_TIMING':
      return { ...state, answers: { ...state.answers, timing: action.value } }
    case 'ADVANCE_WIZARD':
      return { ...state, wizardStep: state.wizardStep + 1 }
    case 'START_TRANSITION':
      return { ...state, phase: 'transition' }
    case 'START_DEMO':
      return { ...state, phase: 'demo', demoStep: 0 }
    case 'NEXT_STEP':
      if (state.demoStep >= 9) return { ...state, phase: 'complete' }
      return { ...state, demoStep: state.demoStep + 1, showCTA: false }
    case 'PREV_STEP':
      if (state.demoStep <= 0) return state
      return { ...state, demoStep: state.demoStep - 1, showCTA: false }
    case 'SET_PAUSED':
      return { ...state, isPaused: action.value }
    case 'SHOW_CTA':
      return { ...state, showCTA: true }
    case 'HIDE_CTA':
      return { ...state, showCTA: false }
    case 'SUBMIT_FORM':
      return { ...state, formSubmitted: true, showCTA: false }
    case 'COMPLETE':
      return { ...state, phase: 'complete' }
    default:
      return state
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const scaleMap: Record<LeadVolume, number> = { starter: 1, growth: 3, scale: 8, enterprise: 20 }

const wizardQuestions = [
  {
    title: 'What\'s your biggest pain point?',
    subtitle: 'This determines where your demo starts',
    options: [
      { value: 'scoring', label: 'Lead Scoring', sublabel: 'We don\'t know which leads to call first', icon: '⎯' },
      { value: 'outreach', label: 'Outreach', sublabel: 'Follow-ups are manual and slow', icon: '↗' },
      { value: 'integration', label: 'Integration', sublabel: 'Our tools don\'t talk to each other', icon: '⇄' },
      { value: 'intelligence', label: 'Intelligence', sublabel: 'We\'re flying blind on pipeline data', icon: '◎' },
    ],
  },
  {
    title: 'How many leads do you process monthly?',
    subtitle: 'We\'ll scale the demo to match your volume',
    options: [
      { value: 'starter', label: 'Under 500/mo', sublabel: 'Early-stage pipeline', icon: '·' },
      { value: 'growth', label: '500 – 2,000/mo', sublabel: 'Growing pipeline', icon: '··' },
      { value: 'scale', label: '2,000 – 10,000/mo', sublabel: 'Scaling operations', icon: '···' },
      { value: 'enterprise', label: '10,000+/mo', sublabel: 'Enterprise volume', icon: '····' },
    ],
  },
  {
    title: 'What\'s your current stack?',
    subtitle: 'We\'ll show how CircuitOS fits in',
    options: [
      { value: 'spreadsheets', label: 'Spreadsheets / Manual', sublabel: 'Google Sheets, Excel, or manual tracking', icon: '▦' },
      { value: 'basic_crm', label: 'Basic CRM', sublabel: 'HubSpot, Salesforce, or similar', icon: '◫' },
      { value: 'marketing_auto', label: 'Marketing Automation', sublabel: 'Marketo, Pardot, or similar', icon: '⚙' },
      { value: 'custom', label: 'Custom / In-House', sublabel: 'Built your own tools', icon: '⟨/⟩' },
    ],
  },
  {
    title: 'Where are you in the buying process?',
    subtitle: 'So we can tailor the next steps',
    options: [
      { value: 'now', label: 'Ready to buy now', sublabel: 'Need a solution this quarter', icon: '▶' },
      { value: 'evaluating', label: 'Actively evaluating', sublabel: 'Comparing 2-3 options', icon: '⟳' },
      { value: 'exploring', label: 'Just exploring', sublabel: 'Researching the space', icon: '◌' },
      { value: 'building_case', label: 'Building a case', sublabel: 'Need data for internal buy-in', icon: '◧' },
    ],
  },
]

// ─── Demo Step Data ───────────────────────────────────────────────────────────

interface DemoStepData {
  module: PainPoint
  headline: string
  narrative: Record<StackMaturity, string>
  metrics: { label: string; base: number; suffix?: string }[]
  leads: { name: string; score: number; status: string; tier: 'HIGH' | 'MEDIUM' | 'LOW' }[]
  activeTab: string
  statusMessage: string
}

const scoringPath: DemoStepData[] = [
  {
    module: 'scoring',
    headline: 'Raw leads land in the pipeline',
    narrative: {
      spreadsheets: 'Right now you\'re tracking leads in spreadsheets. Watch what happens when they flow into CircuitOS instead.',
      basic_crm: 'Your CRM captures the data. CircuitOS starts scoring the moment a lead enters.',
      marketing_auto: 'Your marketing automation sends the leads. CircuitOS picks up where it leaves off.',
      custom: 'Your system pushes leads via API. CircuitOS ingests and starts scoring instantly.',
    },
    metrics: [
      { label: 'Leads Incoming', base: 47, suffix: '' },
      { label: 'Avg Score', base: 0, suffix: '' },
      { label: 'Scored', base: 0, suffix: '' },
      { label: 'Routed', base: 0, suffix: '' },
    ],
    leads: [
      { name: 'Sarah Chen', score: 0, status: 'Ingesting...', tier: 'LOW' },
      { name: 'Marcus Webb', score: 0, status: 'Ingesting...', tier: 'LOW' },
      { name: 'Lisa Park', score: 0, status: 'Queued', tier: 'LOW' },
      { name: 'James Torres', score: 0, status: 'Queued', tier: 'LOW' },
      { name: 'Alex Kim', score: 0, status: 'Queued', tier: 'LOW' },
    ],
    activeTab: 'Leads',
    statusMessage: 'Ingesting new batch...',
  },
  {
    module: 'scoring',
    headline: 'Bayesian model applies 72+ signals',
    narrative: {
      spreadsheets: 'Instead of gut feel, every lead gets scored against behavioral and firmographic data — automatically.',
      basic_crm: 'Your CRM has the basics. CircuitOS layers on web behavior, firmographics, and engagement signals.',
      marketing_auto: 'You already track engagement. CircuitOS adds Bayesian inference on top for predictive accuracy.',
      custom: 'Your custom signals flow right in. The Bayesian model combines them with 72+ additional data points.',
    },
    metrics: [
      { label: 'Leads Incoming', base: 47, suffix: '' },
      { label: 'Signals Active', base: 72, suffix: '' },
      { label: 'Processing', base: 5, suffix: '' },
      { label: 'Model Confidence', base: 0.87, suffix: '' },
    ],
    leads: [
      { name: 'Sarah Chen', score: 89.2, status: 'Scoring...', tier: 'HIGH' },
      { name: 'Marcus Webb', score: 76.4, status: 'Scoring...', tier: 'MEDIUM' },
      { name: 'Lisa Park', score: 64.1, status: 'Enriching', tier: 'MEDIUM' },
      { name: 'James Torres', score: 0, status: 'Queued', tier: 'LOW' },
      { name: 'Alex Kim', score: 0, status: 'Queued', tier: 'LOW' },
    ],
    activeTab: 'Leads',
    statusMessage: 'Bayesian model processing...',
  },
  {
    module: 'scoring',
    headline: 'Confidence intervals, not just numbers',
    narrative: {
      spreadsheets: 'Most tools give you a single score. CircuitOS shows the confidence range — so you know how sure the model is.',
      basic_crm: 'Your CRM lead score is a black box. Here you see the confidence interval and why.',
      marketing_auto: 'Marketo gives you a number. CircuitOS gives you a range, a confidence level, and an explanation.',
      custom: 'Your scoring model outputs a number. CircuitOS wraps it in Bayesian confidence bands.',
    },
    metrics: [
      { label: 'Leads Scored', base: 47, suffix: '' },
      { label: 'Avg Score', base: 71.3, suffix: '' },
      { label: 'High Tier', base: 12, suffix: '' },
      { label: 'Confidence', base: 0.91, suffix: '' },
    ],
    leads: [
      { name: 'Sarah Chen', score: 92.4, status: '±3.2', tier: 'HIGH' },
      { name: 'Marcus Webb', score: 87.1, status: '±4.8', tier: 'HIGH' },
      { name: 'Lisa Park', score: 76.3, status: '±6.1', tier: 'MEDIUM' },
      { name: 'James Torres', score: 64.8, status: '±8.4', tier: 'MEDIUM' },
      { name: 'Alex Kim', score: 41.2, status: '±5.7', tier: 'LOW' },
    ],
    activeTab: 'Leads',
    statusMessage: 'All leads scored with confidence bands',
  },
  {
    module: 'scoring',
    headline: 'Triple-gate approval fires',
    narrative: {
      spreadsheets: 'Before any action fires, three independent gates must approve. Nothing happens without your rules.',
      basic_crm: 'Your CRM auto-assigns leads blindly. CircuitOS requires three gates to agree before routing.',
      marketing_auto: 'Your automation has rules. CircuitOS adds a triple-gate: ICP match, score threshold, and governance.',
      custom: 'Your custom logic decides. CircuitOS adds three independent approval gates on top.',
    },
    metrics: [
      { label: 'Gate 1: ICP', base: 1, suffix: '' },
      { label: 'Gate 2: Score', base: 1, suffix: '' },
      { label: 'Gate 3: Govern', base: 1, suffix: '' },
      { label: 'Approved', base: 8, suffix: '' },
    ],
    leads: [
      { name: 'Sarah Chen', score: 92.4, status: 'APPROVED', tier: 'HIGH' },
      { name: 'Marcus Webb', score: 87.1, status: 'APPROVED', tier: 'HIGH' },
      { name: 'Lisa Park', score: 76.3, status: 'REVIEW', tier: 'MEDIUM' },
      { name: 'James Torres', score: 64.8, status: 'NURTURE', tier: 'MEDIUM' },
      { name: 'Alex Kim', score: 41.2, status: 'NURTURE', tier: 'LOW' },
    ],
    activeTab: 'Leads',
    statusMessage: 'Triple-gate validation complete',
  },
  {
    module: 'scoring',
    headline: 'High-score leads auto-route to sales',
    narrative: {
      spreadsheets: 'No more forgetting to follow up. High-scoring leads are instantly routed to your sales sequence.',
      basic_crm: 'Instead of manual assignment, CircuitOS routes high-score leads directly into active sequences.',
      marketing_auto: 'Your automation handles the nurture. CircuitOS routes the hot leads to human reps immediately.',
      custom: 'Your system gets a webhook. The high-score lead is routed before your team even checks Slack.',
    },
    metrics: [
      { label: 'Auto-Routed', base: 8, suffix: '' },
      { label: 'To Sales', base: 3, suffix: '' },
      { label: 'To Sequence', base: 5, suffix: '' },
      { label: 'Avg Response', base: 2.4, suffix: 'min' },
    ],
    leads: [
      { name: 'Sarah Chen', score: 92.4, status: 'Routed → Rep', tier: 'HIGH' },
      { name: 'Marcus Webb', score: 87.1, status: 'Routed → Seq', tier: 'HIGH' },
      { name: 'Lisa Park', score: 76.3, status: 'Sequence #2', tier: 'MEDIUM' },
      { name: 'James Torres', score: 64.8, status: 'Nurture Drip', tier: 'MEDIUM' },
      { name: 'Alex Kim', score: 41.2, status: 'Cold Nurture', tier: 'LOW' },
    ],
    activeTab: 'Leads',
    statusMessage: 'Sales routing complete — 3 leads to reps',
  },
  {
    module: 'scoring',
    headline: 'Low-score leads auto-nurture',
    narrative: {
      spreadsheets: 'Leads that aren\'t ready get nurtured automatically. No lead falls through the cracks.',
      basic_crm: 'Your CRM would let these sit. CircuitOS assigns them to drip campaigns tailored to their score.',
      marketing_auto: 'Your existing nurture flows run. CircuitOS decides which track based on score and behavior.',
      custom: 'Your system receives the nurture webhook with score context, so your custom flows can act on it.',
    },
    metrics: [
      { label: 'In Nurture', base: 34, suffix: '' },
      { label: 'Drip Active', base: 5, suffix: '' },
      { label: 'Re-engagement', base: 12, suffix: '' },
      { label: 'Warm-up Rate', base: 23, suffix: '%' },
    ],
    leads: [
      { name: 'Sarah Chen', score: 92.4, status: 'In Pipeline', tier: 'HIGH' },
      { name: 'Marcus Webb', score: 87.1, status: 'Seq Active', tier: 'HIGH' },
      { name: 'Lisa Park', score: 76.3, status: 'Warming Up', tier: 'MEDIUM' },
      { name: 'James Torres', score: 64.8, status: 'Drip #3', tier: 'MEDIUM' },
      { name: 'Alex Kim', score: 41.2, status: 'Re-engage', tier: 'LOW' },
    ],
    activeTab: 'Leads',
    statusMessage: 'Nurture sequences assigned to 34 leads',
  },
  {
    module: 'scoring',
    headline: 'CTA checkpoint',
    narrative: {
      spreadsheets: 'You\'ve seen the scoring engine in action. Ready to see it with your data?',
      basic_crm: 'Imagine this running on top of your CRM. Let\'s set it up.',
      marketing_auto: 'This intelligence layer plugs right into your existing stack. Let\'s talk specifics.',
      custom: 'CircuitOS integrates via API. Let\'s scope your custom implementation.',
    },
    metrics: [
      { label: 'Leads Scored', base: 847, suffix: '' },
      { label: 'Route Rate', base: 73, suffix: '%' },
      { label: 'Sequences', base: 12, suffix: '' },
      { label: 'Confidence', base: 0.91, suffix: '' },
    ],
    leads: [
      { name: 'Sarah Chen', score: 92.4, status: 'Converted', tier: 'HIGH' },
      { name: 'Marcus Webb', score: 87.1, status: 'Meeting Set', tier: 'HIGH' },
      { name: 'Lisa Park', score: 76.3, status: 'Engaged', tier: 'MEDIUM' },
      { name: 'James Torres', score: 64.8, status: 'Warming', tier: 'MEDIUM' },
      { name: 'Alex Kim', score: 41.2, status: 'Nurturing', tier: 'LOW' },
    ],
    activeTab: 'Leads',
    statusMessage: 'Scoring engine fully operational',
  },
  {
    module: 'scoring',
    headline: 'Revenue impact projection',
    narrative: {
      spreadsheets: 'Here\'s the before and after. Manual tracking vs. intelligent scoring — the numbers speak.',
      basic_crm: 'Your CRM gets you part of the way. See the incremental revenue from adding CircuitOS scoring.',
      marketing_auto: 'You\'re already automating. CircuitOS adds the intelligence layer. Here\'s the projected uplift.',
      custom: 'Your custom stack does the basics. Here\'s what Bayesian scoring adds to your bottom line.',
    },
    metrics: [
      { label: 'Before: Conv Rate', base: 2.1, suffix: '%' },
      { label: 'After: Conv Rate', base: 4.8, suffix: '%' },
      { label: 'Revenue Lift', base: 128, suffix: '%' },
      { label: 'Time Saved', base: 23, suffix: 'hrs/wk' },
    ],
    leads: [
      { name: 'Sarah Chen', score: 92.4, status: 'Won — $48K', tier: 'HIGH' },
      { name: 'Marcus Webb', score: 87.1, status: 'Won — $32K', tier: 'HIGH' },
      { name: 'Lisa Park', score: 76.3, status: 'Proposal', tier: 'MEDIUM' },
      { name: 'James Torres', score: 64.8, status: 'Qualified', tier: 'MEDIUM' },
      { name: 'Alex Kim', score: 41.2, status: 'Nurturing', tier: 'LOW' },
    ],
    activeTab: 'Leads',
    statusMessage: 'Revenue projection calculated',
  },
  {
    module: 'scoring',
    headline: 'Model retrains on new data',
    narrative: {
      spreadsheets: 'Every conversion teaches the model. Your scoring gets smarter every week — automatically.',
      basic_crm: 'Your CRM stores outcomes. CircuitOS feeds them back into the model to improve predictions.',
      marketing_auto: 'Your analytics track conversions. CircuitOS uses that data to retrain the scoring model.',
      custom: 'Conversion events flow back via webhook. The Bayesian model updates its priors automatically.',
    },
    metrics: [
      { label: 'Training Events', base: 234, suffix: '' },
      { label: 'Model Version', base: 3.4, suffix: '' },
      { label: 'Accuracy Δ', base: 4.2, suffix: '%' },
      { label: 'Next Retrain', base: 6, suffix: 'hrs' },
    ],
    leads: [
      { name: 'Sarah Chen', score: 94.1, status: 'Model Updated', tier: 'HIGH' },
      { name: 'Marcus Webb', score: 88.3, status: 'Model Updated', tier: 'HIGH' },
      { name: 'Lisa Park', score: 78.9, status: 'Score Revised', tier: 'MEDIUM' },
      { name: 'James Torres', score: 62.1, status: 'Score Revised', tier: 'MEDIUM' },
      { name: 'Alex Kim', score: 44.7, status: 'Score Revised', tier: 'LOW' },
    ],
    activeTab: 'Leads',
    statusMessage: 'Model v3.4 — retrained on 234 events',
  },
  {
    module: 'scoring',
    headline: 'Your scoring dashboard — live',
    narrative: {
      spreadsheets: 'From spreadsheets to this. Every lead scored, routed, and tracked — with full audit trail.',
      basic_crm: 'This runs alongside your CRM. Every score, every route, every outcome — one dashboard.',
      marketing_auto: 'The intelligence layer your automation stack was missing. All signals, one view.',
      custom: 'Plugged into your custom stack via API. Full visibility into the scoring pipeline.',
    },
    metrics: [
      { label: 'Leads Scored', base: 847, suffix: '' },
      { label: 'Route Rate', base: 73, suffix: '%' },
      { label: 'Active Sequences', base: 12, suffix: '' },
      { label: 'Model Confidence', base: 0.91, suffix: '' },
    ],
    leads: [
      { name: 'Sarah Chen', score: 94.1, status: 'Won', tier: 'HIGH' },
      { name: 'Marcus Webb', score: 88.3, status: 'Proposal', tier: 'HIGH' },
      { name: 'Lisa Park', score: 78.9, status: 'Engaged', tier: 'MEDIUM' },
      { name: 'James Torres', score: 62.1, status: 'Nurturing', tier: 'MEDIUM' },
      { name: 'Alex Kim', score: 44.7, status: 'Cold', tier: 'LOW' },
    ],
    activeTab: 'Leads',
    statusMessage: 'All systems operational · Model v3.4',
  },
]

const outreachPath: DemoStepData[] = [
  {
    module: 'outreach', headline: 'High-conviction deal enters the action queue',
    narrative: { spreadsheets: 'Instead of remembering to follow up, every high-conviction deal automatically enters a governed action queue.', basic_crm: 'Your CRM flags the deal. CircuitOS decides the next move and queues it — within your rules.', marketing_auto: 'Your automation fired a generic sequence. CircuitOS decides the right action per deal, governed.', custom: 'Your system sends the high-conviction signal. CircuitOS queues the governed next move instantly.' },
    metrics: [{ label: 'Queue Depth', base: 23, suffix: '' }, { label: 'Avg Wait', base: 0, suffix: 'min' }, { label: 'Sequences', base: 8, suffix: '' }, { label: 'Active', base: 156, suffix: '' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: 'Queued', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: 'Queued', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: 'Pending', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: 'Pending', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: 'Nurture', tier: 'LOW' }],
    activeTab: 'Sequences', statusMessage: 'High-conviction deals entering action queue...',
  },
  {
    module: 'outreach', headline: 'AI drafts the next move, in your voice',
    narrative: { spreadsheets: 'No more copy-paste templates. The recommended action is drafted for each deal from its profile and score.', basic_crm: 'Your CRM has the contact data. CircuitOS uses it to draft the recommended move in your brand voice.', marketing_auto: 'Your templates are generic. CircuitOS tailors each action to the specific deal and its conviction.', custom: 'Your deal data flows in. The recommended action is drafted from every field — scanned for brand compliance.' },
    metrics: [{ label: 'Drafts Created', base: 23, suffix: '' }, { label: 'Personalization', base: 94, suffix: '%' }, { label: 'Brand Match', base: 0.91, suffix: '' }, { label: 'Pending Review', base: 23, suffix: '' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: 'Drafted', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: 'Drafted', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: 'Drafting...', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: 'Queued', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: 'Nurture', tier: 'LOW' }],
    activeTab: 'Sequences', statusMessage: 'Drafting recommended actions...',
  },
  {
    module: 'outreach', headline: 'Action executes within governed rules',
    narrative: { spreadsheets: 'Nothing fires blindly. Each action runs only when confidence and risk class allow — every step logged.', basic_crm: 'Your CRM just sends. CircuitOS executes the move only within your governance rules, fully logged.', marketing_auto: 'You already run sequences. CircuitOS adds confidence-and-risk gating so only the right moves fire.', custom: 'Your system handles delivery. CircuitOS governs which actions are allowed to run, and records each one.' },
    metrics: [{ label: 'Executed', base: 23, suffix: '' }, { label: 'Within Rules', base: 100, suffix: '%' }, { label: 'Logged', base: 53, suffix: '' }, { label: 'Touch Points', base: 53, suffix: '' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: 'Executed', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: 'Executed', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: 'Executed', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: 'Gated', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: 'Nurture', tier: 'LOW' }],
    activeTab: 'Sequences', statusMessage: 'Actions executing within governed rules',
  },
  {
    module: 'outreach', headline: 'Live signals update the decision',
    narrative: { spreadsheets: 'You\'d never know who engaged. CircuitOS reads every response signal and updates the conviction in real-time.', basic_crm: 'Your CRM tracks opens. CircuitOS folds engagement back into the deal\'s calibrated probability.', marketing_auto: 'You track engagement already. CircuitOS turns it into an updated win probability, not just a metric.', custom: 'Engagement events flow back via webhook and re-score the deal — the decision stays current.' },
    metrics: [{ label: 'Signals In', base: 18, suffix: '' }, { label: 'Re-scored', base: 7, suffix: '' }, { label: 'Replies', base: 3, suffix: '' }, { label: 'Conviction ↑', base: 2, suffix: '' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: 'Engaged → ↑', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: 'Replied ✓', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: 'Opened', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: 'No Activity', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: 'Opened', tier: 'LOW' }],
    activeTab: 'Sequences', statusMessage: 'Conviction updated — 2 deals strengthening',
  },
  {
    module: 'outreach', headline: 'Confidence spikes → escalate to a human',
    narrative: { spreadsheets: 'When a deal heats up, you\'d never catch it in time. CircuitOS escalates high-confidence moments to a person.', basic_crm: 'Your CRM shows activity. CircuitOS routes the high-conviction deal to your rep the moment it crosses threshold.', marketing_auto: 'Your scoring catches it eventually. CircuitOS escalates in real-time when confidence demands a human.', custom: 'A threshold-crossing event fires instantly. Your team is in the loop before the moment passes.' },
    metrics: [{ label: 'Escalated', base: 2, suffix: '' }, { label: 'Avg Escalation', base: 3.2, suffix: 'min' }, { label: 'To Human', base: 2, suffix: '' }, { label: 'Rep Notified', base: 2, suffix: '' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: '☎ Human Now', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: '☎ Human Now', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: 'Autonomous', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: 'Autonomous', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: 'Nurture', tier: 'LOW' }],
    activeTab: 'Sequences', statusMessage: 'Escalation: 2 high-conviction deals → human',
  },
  {
    module: 'outreach', headline: 'Negative signal → governed auto-pause',
    narrative: { spreadsheets: 'You\'d keep pushing a cooling deal. CircuitOS detects negative signals and pauses the action automatically.', basic_crm: 'Your CRM keeps sending. CircuitOS pauses on out-of-office, unsubscribe, or a dropping conviction.', marketing_auto: 'Your automation has suppression lists. CircuitOS adds real-time, governance-aware pausing.', custom: 'Your system gets a pause event. CircuitOS handles the decision logic — you handle the edge cases.' },
    metrics: [{ label: 'Paused', base: 4, suffix: '' }, { label: 'OOO Detected', base: 2, suffix: '' }, { label: 'Conviction ↓', base: 1, suffix: '' }, { label: 'Resume Queue', base: 3, suffix: '' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: 'With Rep', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: 'With Rep', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: 'Paused (OOO)', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: 'Active', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: 'Paused', tier: 'LOW' }],
    activeTab: 'Sequences', statusMessage: 'Governed pause: 4 actions held on signals',
  },
  {
    module: 'outreach', headline: 'CTA checkpoint',
    narrative: { spreadsheets: 'From manual follow-ups to governed, auto-paced action on every deal. Ready to see it live?', basic_crm: 'CircuitOS turns your CRM contacts into governed pipeline action. Let\'s set it up.', marketing_auto: 'The governed action layer your automation stack is missing. Let\'s discuss your setup.', custom: 'Full API access. Plug CircuitOS\'s governed action engine into your existing workflow.' },
    metrics: [{ label: 'Actions Run', base: 234, suffix: '' }, { label: 'Within Rules', base: 100, suffix: '%' }, { label: 'Reply Rate', base: 34, suffix: '%' }, { label: 'Meetings Set', base: 12, suffix: '' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: 'Meeting Set', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: 'Meeting Set', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: 'Replied', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: 'Engaged', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: 'Warming', tier: 'LOW' }],
    activeTab: 'Sequences', statusMessage: 'Action engine fully operational',
  },
  {
    module: 'outreach', headline: 'Every reply scored for intent',
    narrative: { spreadsheets: 'Is that reply interested or annoyed? Each response is read and scored for intent — feeding the next decision.', basic_crm: 'Your CRM shows "replied." CircuitOS tells you the intent — and adjusts the deal\'s conviction.', marketing_auto: 'Your automation counts replies. CircuitOS scores the intent and re-decides the next move.', custom: 'Intent classification via API. Your system knows the decision input, not just the activity.' },
    metrics: [{ label: 'Positive', base: 8, suffix: '' }, { label: 'Neutral', base: 12, suffix: '' }, { label: 'Negative', base: 3, suffix: '' }, { label: 'Accuracy', base: 94, suffix: '%' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: 'Positive', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: 'Positive', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: 'Neutral', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: 'Neutral', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: 'Warming', tier: 'LOW' }],
    activeTab: 'Sequences', statusMessage: 'Intent scored: 8 positive, 12 neutral, 3 negative',
  },
  {
    module: 'outreach', headline: 'Meeting booked — written to the audit trail',
    narrative: { spreadsheets: 'The meeting is booked and the decision is logged automatically. No manual data entry.', basic_crm: 'Your CRM updates the instant the meeting confirms — and the action lands on a signed audit trail.', marketing_auto: 'Meeting data flows back to your platform, and every decision behind it is recorded.', custom: 'Booking event fires to your webhook. CRM, calendar, pipeline, and the audit trail all update at once.' },
    metrics: [{ label: 'Meetings', base: 12, suffix: '' }, { label: 'CRM Synced', base: 12, suffix: '' }, { label: 'Audited', base: 12, suffix: '' }, { label: 'Pipeline $', base: 384, suffix: 'K' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: 'Meeting 3/12', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: 'Meeting 3/13', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: 'Follow-Up', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: 'Engaged', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: 'Nurturing', tier: 'LOW' }],
    activeTab: 'Sequences', statusMessage: '12 meetings booked — logged to audit trail',
  },
  {
    module: 'outreach', headline: 'Action performance, fully auditable',
    narrative: { spreadsheets: 'From manual follow-ups to this. Every action, every outcome, every decision — on one auditable trail.', basic_crm: 'Your CRM tracks contacts. CircuitOS tracks every governed action and its outcome in one view.', marketing_auto: 'The action analytics your platform is missing — tied to the decision that triggered each one.', custom: 'Full performance and audit data available via API. Dashboard included.' },
    metrics: [{ label: 'Actions Run', base: 847, suffix: '' }, { label: 'Reply Rate', base: 34, suffix: '%' }, { label: 'Meetings', base: 12, suffix: '' }, { label: 'Pipeline', base: 384, suffix: 'K' }],
    leads: [{ name: 'Sarah Chen', score: 94.1, status: 'Won', tier: 'HIGH' }, { name: 'Marcus Webb', score: 88.3, status: 'Proposal', tier: 'HIGH' }, { name: 'Lisa Park', score: 78.9, status: 'Engaged', tier: 'MEDIUM' }, { name: 'James Torres', score: 62.1, status: 'Nurturing', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 44.7, status: 'Warming', tier: 'LOW' }],
    activeTab: 'Sequences', statusMessage: 'All systems operational · 12 meetings this week',
  },
]

const integrationPath: DemoStepData[] = [
  {
    module: 'integration', headline: 'Signal sources connect',
    narrative: { spreadsheets: 'Your spreadsheets become one of many inputs. CircuitOS observes CRM, email, analytics, and more.', basic_crm: 'Your CRM is signal one. CircuitOS ingests your email, analytics, and every other source.', marketing_auto: 'Your stack is already complex. CircuitOS unifies every signal into one decisioning layer.', custom: 'Your custom systems connect via REST API. CircuitOS becomes the signal hub for every decision.' },
    metrics: [{ label: 'Sources', base: 0, suffix: '' }, { label: 'Connected', base: 0, suffix: '' }, { label: 'Events/hr', base: 0, suffix: '' }, { label: 'Status', base: 0, suffix: '' }],
    leads: [{ name: 'CRM', score: 0, status: 'Connecting...', tier: 'LOW' }, { name: 'Email', score: 0, status: 'Connecting...', tier: 'LOW' }, { name: 'Analytics', score: 0, status: 'Pending', tier: 'LOW' }, { name: 'Webhooks', score: 0, status: 'Pending', tier: 'LOW' }, { name: 'Custom API', score: 0, status: 'Pending', tier: 'LOW' }],
    activeTab: 'Integrations', statusMessage: 'Connecting signal sources...',
  },
  {
    module: 'integration', headline: 'Unified deal profile assembled',
    narrative: { spreadsheets: 'One deal, scattered across 3 spreadsheets. CircuitOS merges them into a single decision-ready profile.', basic_crm: 'Your CRM has the basics. CircuitOS enriches with engagement, attribution, and activity signals.', marketing_auto: 'Your platforms each hold a piece. CircuitOS assembles the complete picture a decision needs.', custom: 'Every system contributes signals. CircuitOS builds one unified, decision-ready profile.' },
    metrics: [{ label: 'Sources', base: 5, suffix: '' }, { label: 'Connected', base: 5, suffix: '' }, { label: 'Profiles Built', base: 47, suffix: '' }, { label: 'Fields Merged', base: 23, suffix: '' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: '3 sources', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: '4 sources', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: '3 sources', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: '2 sources', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: '2 sources', tier: 'LOW' }],
    activeTab: 'Integrations', statusMessage: 'Unified profiles assembled from 5 sources',
  },
  {
    module: 'integration', headline: 'Deduplication engine fires',
    narrative: { spreadsheets: 'The same deal in 3 spreadsheets? CircuitOS finds and merges duplicates so decisions run on clean data.', basic_crm: 'CRM duplicates skew every score. CircuitOS deduplicates across all connected sources.', marketing_auto: 'Your platforms create duplicate records. CircuitOS merges them with confidence scoring.', custom: 'Dedup runs across all sources. Merge events fire to your system via webhook.' },
    metrics: [{ label: 'Records Scanned', base: 847, suffix: '' }, { label: 'Duplicates', base: 34, suffix: '' }, { label: 'Merged', base: 34, suffix: '' }, { label: 'Accuracy', base: 99.2, suffix: '%' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: 'Merged (3→1)', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: 'Merged (2→1)', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: 'Clean', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: 'Clean', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: 'Merged (2→1)', tier: 'LOW' }],
    activeTab: 'Integrations', statusMessage: 'Dedup complete: 34 duplicates merged',
  },
  {
    module: 'integration', headline: 'Real-time signal stream',
    narrative: { spreadsheets: 'No more batch exports. Every deal activity hits the signal stream in real-time, ready to re-score.', basic_crm: 'Your CRM syncs every 15 minutes. CircuitOS streams signals in real-time so decisions stay current.', marketing_auto: 'Your automation batches updates. CircuitOS processes signals as they happen.', custom: 'Your system emits events via webhooks. Sub-second latency into the decision engine.' },
    metrics: [{ label: 'Events/hr', base: 1247, suffix: '' }, { label: 'Latency', base: 120, suffix: 'ms' }, { label: 'Sources', base: 5, suffix: '' }, { label: 'Uptime', base: 99.9, suffix: '%' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: 'Email Opened', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: 'Page Visit', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: 'Form Submit', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: 'Email Click', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: 'Ad Click', tier: 'LOW' }],
    activeTab: 'Integrations', statusMessage: 'Signal stream: 1,247 events/hr across 5 sources',
  },
  {
    module: 'integration', headline: 'Governed action fires to your systems',
    narrative: { spreadsheets: 'CircuitOS can push a decision anywhere — your CRM, Slack, accounting tool, anywhere.', basic_crm: 'When a decision is made, CircuitOS fires webhooks to update every connected system.', marketing_auto: 'Your platforms receive structured webhooks for every governed action and outcome.', custom: 'Your endpoints receive typed, versioned payloads for every decision and action.' },
    metrics: [{ label: 'Webhooks Fired', base: 234, suffix: '' }, { label: 'Success Rate', base: 99.7, suffix: '%' }, { label: 'Avg Latency', base: 89, suffix: 'ms' }, { label: 'Endpoints', base: 8, suffix: '' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: '→ CRM + Slack', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: '→ CRM', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: '→ Email Tool', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: '→ CRM', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: '→ Nurture', tier: 'LOW' }],
    activeTab: 'Integrations', statusMessage: '234 webhooks fired — 99.7% success rate',
  },
  {
    module: 'integration', headline: 'Bi-directional sync',
    narrative: { spreadsheets: 'Changes in your tools flow to CircuitOS. Decisions flow back. Two-way sync, no drift.', basic_crm: 'Update a deal in your CRM — CircuitOS sees it instantly. And the decision flows back.', marketing_auto: 'Your automation and CircuitOS stay in perfect sync. No manual reconciliation.', custom: 'Full bi-directional sync via API. Your system of record stays yours.' },
    metrics: [{ label: 'Syncs/hr', base: 456, suffix: '' }, { label: 'Bi-directional', base: 5, suffix: '' }, { label: 'Conflicts', base: 0, suffix: '' }, { label: 'Latency', base: 200, suffix: 'ms' }],
    leads: [{ name: 'CRM → COS', score: 0, status: 'Synced ✓', tier: 'HIGH' }, { name: 'COS → CRM', score: 0, status: 'Synced ✓', tier: 'HIGH' }, { name: 'Email ↔ COS', score: 0, status: 'Synced ✓', tier: 'MEDIUM' }, { name: 'Analytics →', score: 0, status: 'Synced ✓', tier: 'MEDIUM' }, { name: 'Webhooks ↔', score: 0, status: 'Synced ✓', tier: 'HIGH' }],
    activeTab: 'Integrations', statusMessage: 'Bi-directional sync: 0 conflicts',
  },
  {
    module: 'integration', headline: 'CTA checkpoint',
    narrative: { spreadsheets: 'From disconnected spreadsheets to one decision-ready signal layer. Ready to connect your tools?', basic_crm: 'CircuitOS becomes the signal layer feeding every decision. Let\'s set it up.', marketing_auto: 'The unified signal layer your decisions need. Let\'s map your connections.', custom: 'Full API documentation and webhook specs. Let\'s plan your integration.' },
    metrics: [{ label: 'Sources', base: 5, suffix: '' }, { label: 'Events/hr', base: 1247, suffix: '' }, { label: 'Uptime', base: 99.9, suffix: '%' }, { label: 'Syncs', base: 456, suffix: '/hr' }],
    leads: [{ name: 'Sarah Chen', score: 92.4, status: 'Full Profile', tier: 'HIGH' }, { name: 'Marcus Webb', score: 87.1, status: 'Full Profile', tier: 'HIGH' }, { name: 'Lisa Park', score: 76.3, status: 'Full Profile', tier: 'MEDIUM' }, { name: 'James Torres', score: 64.8, status: 'Enriching', tier: 'MEDIUM' }, { name: 'Alex Kim', score: 41.2, status: 'Basic', tier: 'LOW' }],
    activeTab: 'Integrations', statusMessage: 'Signal layer fully operational',
  },
  {
    module: 'integration', headline: 'Self-healing with retry',
    narrative: { spreadsheets: 'When a connection hiccups, CircuitOS retries with exponential backoff. No signal lost.', basic_crm: 'API timeouts happen. CircuitOS handles retries automatically — your data stays consistent.', marketing_auto: 'Integration failures are invisible to you. CircuitOS retries and logs everything.', custom: 'Retry policies are configurable per endpoint. Exponential backoff with dead-letter queues.' },
    metrics: [{ label: 'Retries', base: 12, suffix: '' }, { label: 'Recovered', base: 12, suffix: '' }, { label: 'Failed', base: 0, suffix: '' }, { label: 'DLQ', base: 0, suffix: '' }],
    leads: [{ name: 'CRM Sync', score: 0, status: 'Retry → OK', tier: 'HIGH' }, { name: 'Email API', score: 0, status: 'Retry → OK', tier: 'HIGH' }, { name: 'Webhook #3', score: 0, status: 'Retry → OK', tier: 'MEDIUM' }, { name: 'Analytics', score: 0, status: 'OK', tier: 'HIGH' }, { name: 'Custom API', score: 0, status: 'OK', tier: 'HIGH' }],
    activeTab: 'Integrations', statusMessage: '12 retries — all recovered, 0 signal loss',
  },
  {
    module: 'integration', headline: 'Signed, tamper-evident audit log',
    narrative: { spreadsheets: 'Every signal and decision is logged to a signed, tamper-evident trail — for compliance and proof.', basic_crm: 'Your CRM has limited logs. CircuitOS signs every signal, score, action, and route.', marketing_auto: 'A complete, tamper-evident trail across all platforms — one place to prove what happened.', custom: 'Signed audit logs accessible via API. Every event, every transformation, every decision.' },
    metrics: [{ label: 'Log Entries', base: 12847, suffix: '' }, { label: 'Retention', base: 90, suffix: 'days' }, { label: 'Signed', base: 1, suffix: '' }, { label: 'Export', base: 1, suffix: '' }],
    leads: [{ name: '12:01 PM', score: 0, status: 'Deal Observed', tier: 'HIGH' }, { name: '12:01 PM', score: 0, status: 'Scored: 92.4', tier: 'HIGH' }, { name: '12:02 PM', score: 0, status: 'Decision Logged', tier: 'HIGH' }, { name: '12:02 PM', score: 0, status: 'CRM Updated', tier: 'MEDIUM' }, { name: '12:03 PM', score: 0, status: 'Signed ✓', tier: 'MEDIUM' }],
    activeTab: 'Integrations', statusMessage: '12,847 signed audit entries — 90-day retention',
  },
  {
    module: 'integration', headline: 'Signal health dashboard',
    narrative: { spreadsheets: 'One dashboard for every connection. See health, latency, and throughput at a glance.', basic_crm: 'Every source in one view. Health status, sync frequency, and error rates.', marketing_auto: 'The signal monitoring your stack is missing. Full visibility, zero blind spots.', custom: 'Health metrics available via API. Dashboard included for visual monitoring.' },
    metrics: [{ label: 'Connections', base: 5, suffix: '' }, { label: 'Healthy', base: 5, suffix: '' }, { label: 'Throughput', base: 1247, suffix: '/hr' }, { label: 'Uptime', base: 99.9, suffix: '%' }],
    leads: [{ name: 'CRM', score: 0, status: 'Healthy ✓', tier: 'HIGH' }, { name: 'Email', score: 0, status: 'Healthy ✓', tier: 'HIGH' }, { name: 'Analytics', score: 0, status: 'Healthy ✓', tier: 'HIGH' }, { name: 'Webhooks', score: 0, status: 'Healthy ✓', tier: 'HIGH' }, { name: 'Custom API', score: 0, status: 'Healthy ✓', tier: 'HIGH' }],
    activeTab: 'Integrations', statusMessage: 'All sources healthy · 99.9% uptime',
  },
]

const intelligencePath: DemoStepData[] = [
  {
    module: 'intelligence', headline: 'Pipeline + attribution aggregated',
    narrative: { spreadsheets: 'Your spreadsheets give you a snapshot. CircuitOS aggregates pipeline and attribution from every source in real-time.', basic_crm: 'Your CRM reports are a start. CircuitOS pulls pipeline, attribution, and activity for the full picture.', marketing_auto: 'Your dashboards show marketing metrics. CircuitOS ties them to sales outcomes and revenue.', custom: 'Your data warehouse feeds in. CircuitOS aggregates and analyzes across every source.' },
    metrics: [{ label: 'Sources', base: 5, suffix: '' }, { label: 'Data Points', base: 12847, suffix: '' }, { label: 'Updated', base: 0, suffix: 'min ago' }, { label: 'Coverage', base: 100, suffix: '%' }],
    leads: [{ name: 'Q1 Pipeline', score: 0, status: 'Aggregating...', tier: 'HIGH' }, { name: 'Q2 Forecast', score: 0, status: 'Pending', tier: 'MEDIUM' }, { name: 'Win/Loss', score: 0, status: 'Pending', tier: 'MEDIUM' }, { name: 'Attribution', score: 0, status: 'Pending', tier: 'LOW' }, { name: 'Market', score: 0, status: 'Pending', tier: 'LOW' }],
    activeTab: 'Intelligence', statusMessage: 'Aggregating pipeline + attribution from 5 sources...',
  },
  {
    module: 'intelligence', headline: 'Attribution traces revenue to its source',
    narrative: { spreadsheets: 'No more guessing what worked. CircuitOS traces each won deal back to the marketing that actually drove it.', basic_crm: 'Your CRM shows the funnel. CircuitOS credits the touchpoints that moved each deal — not just last click.', marketing_auto: 'Your platform tracks the marketing funnel. CircuitOS extends attribution through sales to closed revenue.', custom: 'Multi-touch attribution available via API. Know what to spend more on and what to cut.' },
    metrics: [{ label: 'Top of Funnel', base: 847, suffix: '' }, { label: 'Qualified', base: 234, suffix: '' }, { label: 'Proposals', base: 67, suffix: '' }, { label: 'Won', base: 23, suffix: '' }],
    leads: [{ name: 'Paid Search', score: 0, status: '$420K won', tier: 'HIGH' }, { name: 'Referral', score: 0, status: '$310K won', tier: 'HIGH' }, { name: 'Content', score: 0, status: '$180K won', tier: 'MEDIUM' }, { name: 'Events', score: 0, status: '$90K won', tier: 'MEDIUM' }, { name: 'Cold Outbound', score: 0, status: '$40K won', tier: 'LOW' }],
    activeTab: 'Intelligence', statusMessage: 'Attribution mapped: paid search led $420K won',
  },
  {
    module: 'intelligence', headline: 'Deal Risk Score flags at-risk deals',
    narrative: { spreadsheets: 'You\'d never spot a deal going cold until it\'s too late. The Deal Risk Score flags at-risk deals in real-time.', basic_crm: 'Your CRM shows pipeline. CircuitOS scores which deals are about to slip — before the loss.', marketing_auto: 'Your automation tracks engagement. CircuitOS correlates it into a calibrated deal-risk score.', custom: 'Deal Risk Scores available via API. Trigger your own intervention workflows on the red flags.' },
    metrics: [{ label: 'Active Deals', base: 67, suffix: '' }, { label: 'At Risk', base: 8, suffix: '' }, { label: 'Slipping', base: 5, suffix: '' }, { label: 'Intervention', base: 3, suffix: '' }],
    leads: [{ name: 'Apex Digital', score: 89, status: 'On Track', tier: 'HIGH' }, { name: 'Rivera & Co', score: 72, status: 'AT RISK', tier: 'MEDIUM' }, { name: 'Summit Health', score: 45, status: 'SLIPPING', tier: 'LOW' }, { name: 'BlueLine Mfg', score: 81, status: 'On Track', tier: 'HIGH' }, { name: 'NovaPoint', score: 38, status: 'AT RISK', tier: 'LOW' }],
    activeTab: 'Intelligence', statusMessage: 'Deal Risk: 8 deals flagged before they slip',
  },
  {
    module: 'intelligence', headline: 'Competitor mention alert',
    narrative: { spreadsheets: 'You\'d never know a prospect is also talking to competitors. CircuitOS detects the signal and folds it into the score.', basic_crm: 'Your CRM doesn\'t track competitor mentions. CircuitOS does — across email, web, and activity.', marketing_auto: 'Your automation can\'t see competitive risk. CircuitOS monitors it across channels.', custom: 'Competitor signals fire to your webhook and adjust the deal\'s risk in real-time.' },
    metrics: [{ label: 'Mentions', base: 12, suffix: '' }, { label: 'Competitors', base: 4, suffix: '' }, { label: 'Deals Affected', base: 6, suffix: '' }, { label: 'Alerts Sent', base: 6, suffix: '' }],
    leads: [{ name: 'Rivera & Co', score: 72, status: 'Competitor A', tier: 'MEDIUM' }, { name: 'Summit Health', score: 45, status: 'Competitor B', tier: 'LOW' }, { name: 'NovaPoint', score: 38, status: 'Competitor A', tier: 'LOW' }, { name: 'Apex Digital', score: 89, status: 'No Mentions', tier: 'HIGH' }, { name: 'BlueLine Mfg', score: 81, status: 'No Mentions', tier: 'HIGH' }],
    activeTab: 'Intelligence', statusMessage: '12 competitor mentions across 6 deals',
  },
  {
    module: 'intelligence', headline: 'Weekly decision briefing auto-generates',
    narrative: { spreadsheets: 'No more building reports manually. CircuitOS generates a weekly decision briefing automatically.', basic_crm: 'Your CRM has basic reports. CircuitOS writes an executive briefing grounded only in your real numbers.', marketing_auto: 'Your platform sends weekly emails. CircuitOS sends a briefing tied to decisions and outcomes.', custom: 'Briefing data available via API. A grounded, zero-fabrication summary included.' },
    metrics: [{ label: 'Briefing', base: 1, suffix: '' }, { label: 'Insights', base: 12, suffix: '' }, { label: 'Action Items', base: 5, suffix: '' }, { label: 'Confidence', base: 0.92, suffix: '' }],
    leads: [{ name: 'Pipeline Health', score: 0, status: 'Strong ↑', tier: 'HIGH' }, { name: 'Win Rate', score: 0, status: '34% (+2%)', tier: 'HIGH' }, { name: 'At-Risk Deals', score: 0, status: '8 flagged', tier: 'MEDIUM' }, { name: 'Top Source', score: 0, status: 'Paid search', tier: 'HIGH' }, { name: 'Forecast', score: 0, status: '$1.2M Q1', tier: 'HIGH' }],
    activeTab: 'Intelligence', statusMessage: 'Weekly briefing generated — 12 insights, 5 actions',
  },
  {
    module: 'intelligence', headline: 'Anomaly detection flags a pattern break',
    narrative: { spreadsheets: 'A sudden drop in pipeline? You\'d notice next month. CircuitOS flags anomalies in real-time.', basic_crm: 'Your CRM shows last month\'s data. CircuitOS detects anomalies as they happen.', marketing_auto: 'Your platform tracks trends. CircuitOS spots when something breaks the pattern.', custom: 'Anomaly events fire to your webhook. Investigate before the damage spreads.' },
    metrics: [{ label: 'Anomalies', base: 2, suffix: '' }, { label: 'Severity', base: 0, suffix: '' }, { label: 'Detected', base: 3, suffix: 'min ago' }, { label: 'Impact', base: 0, suffix: '' }],
    leads: [{ name: 'New Pipeline', score: 0, status: '↓ 34% (anomaly)', tier: 'LOW' }, { name: 'Engagement', score: 0, status: 'Normal', tier: 'HIGH' }, { name: 'Win Rate', score: 0, status: '↑ 12% (good)', tier: 'HIGH' }, { name: 'Cycle Time', score: 0, status: '↑ 2d (flag)', tier: 'MEDIUM' }, { name: 'Pipeline $', score: 0, status: 'Normal', tier: 'HIGH' }],
    activeTab: 'Intelligence', statusMessage: 'Anomaly detected: new pipeline ↓ 34%',
  },
  {
    module: 'intelligence', headline: 'CTA checkpoint',
    narrative: { spreadsheets: 'From flying blind to provable decision intelligence. Ready to see your data?', basic_crm: 'The decision intelligence layer your CRM is missing. Let\'s connect your data.', marketing_auto: 'Provable intelligence for your entire revenue pipeline. Let\'s set it up.', custom: 'Full API access to attribution, risk, and forecasting. Let\'s plan your integration.' },
    metrics: [{ label: 'Insights/wk', base: 12, suffix: '' }, { label: 'Accuracy', base: 94, suffix: '%' }, { label: 'Time Saved', base: 8, suffix: 'hrs' }, { label: 'Coverage', base: 100, suffix: '%' }],
    leads: [{ name: 'Pipeline', score: 0, status: '$1.2M', tier: 'HIGH' }, { name: 'Win Rate', score: 0, status: '34%', tier: 'HIGH' }, { name: 'At-Risk', score: 0, status: '8 deals', tier: 'MEDIUM' }, { name: 'Briefings', score: 0, status: 'Weekly', tier: 'HIGH' }, { name: 'Anomalies', score: 0, status: '2 flagged', tier: 'MEDIUM' }],
    activeTab: 'Intelligence', statusMessage: 'Decision intelligence fully operational',
  },
  {
    module: 'intelligence', headline: 'Calibrated revenue forecast with confidence',
    narrative: { spreadsheets: 'Your spreadsheet forecast is a guess. CircuitOS builds a calibrated, probabilistic forecast with confidence bands.', basic_crm: 'Your CRM forecast is weighted pipeline. CircuitOS adds calibrated probability and confidence intervals.', marketing_auto: 'Your attribution shows history. CircuitOS forecasts forward with calibrated confidence.', custom: 'Forecast and confidence bands available via API for your own dashboards.' },
    metrics: [{ label: 'Q1 Forecast', base: 1.2, suffix: 'M' }, { label: 'Confidence', base: 87, suffix: '%' }, { label: 'Best Case', base: 1.5, suffix: 'M' }, { label: 'Worst Case', base: 0.9, suffix: 'M' }],
    leads: [{ name: 'March', score: 0, status: '$420K ±$60K', tier: 'HIGH' }, { name: 'April', score: 0, status: '$380K ±$80K', tier: 'HIGH' }, { name: 'May', score: 0, status: '$400K ±$90K', tier: 'MEDIUM' }, { name: 'Q1 Total', score: 0, status: '$1.2M ±$180K', tier: 'HIGH' }, { name: 'Q2 Est', score: 0, status: '$1.4M ±$250K', tier: 'MEDIUM' }],
    activeTab: 'Intelligence', statusMessage: 'Calibrated forecast: $1.2M Q1 (87% confidence)',
  },
  {
    module: 'intelligence', headline: 'Recommended next decisions',
    narrative: { spreadsheets: 'Instead of wondering what to do next, CircuitOS tells you — the highest-impact decisions, prioritized.', basic_crm: 'Your CRM shows tasks. CircuitOS recommends the highest-impact next decisions, with the reasoning.', marketing_auto: 'Your platform suggests A/B tests. CircuitOS recommends the revenue-maximizing next move.', custom: 'Decision recommendations available via API. Integrate into your own workflow.' },
    metrics: [{ label: 'Decisions', base: 8, suffix: '' }, { label: 'High Priority', base: 3, suffix: '' }, { label: 'Est Impact', base: 45, suffix: 'K' }, { label: 'Time to Act', base: 15, suffix: 'min' }],
    leads: [{ name: '#1 Call Rivera', score: 0, status: 'High — at risk', tier: 'HIGH' }, { name: '#2 Follow up Apex', score: 0, status: 'High — hot', tier: 'HIGH' }, { name: '#3 Resend Summit', score: 0, status: 'Medium', tier: 'MEDIUM' }, { name: '#4 Update forecast', score: 0, status: 'Medium', tier: 'MEDIUM' }, { name: '#5 Review anomaly', score: 0, status: 'Low', tier: 'LOW' }],
    activeTab: 'Intelligence', statusMessage: '8 recommended decisions — 3 high priority',
  },
  {
    module: 'intelligence', headline: 'Decision intelligence dashboard',
    narrative: { spreadsheets: 'From no visibility to provable decision intelligence. Every signal, every decision, one dashboard.', basic_crm: 'The layer that turns your CRM from a database into a governed decision engine.', marketing_auto: 'Full-funnel decision intelligence from first signal to closed, proven revenue.', custom: 'Enterprise decision intelligence via API. Dashboard included. Full data ownership.' },
    metrics: [{ label: 'Pipeline', base: 1.2, suffix: 'M' }, { label: 'Win Rate', base: 34, suffix: '%' }, { label: 'Insights/wk', base: 12, suffix: '' }, { label: 'Forecast Acc', base: 87, suffix: '%' }],
    leads: [{ name: 'Observe', score: 0, status: 'Active ✓', tier: 'HIGH' }, { name: 'Decide', score: 0, status: 'Active ✓', tier: 'HIGH' }, { name: 'Act', score: 0, status: 'Active ✓', tier: 'HIGH' }, { name: 'Prove', score: 0, status: 'Signed ✓', tier: 'HIGH' }, { name: 'Forecast', score: 0, status: '$1.2M Q1', tier: 'HIGH' }],
    activeTab: 'Intelligence', statusMessage: 'All decision systems operational',
  },
]

const demoPaths: Record<PainPoint, DemoStepData[]> = {
  scoring: scoringPath,
  outreach: outreachPath,
  integration: integrationPath,
  intelligence: intelligencePath,
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const slideIn = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 flex-1">
          <div className={`w-3 h-3 rounded-full transition-all duration-300 flex-shrink-0 ${
            i < step ? 'bg-blue-500' : i === step ? 'bg-blue-500 ring-4 ring-blue-500/20' : 'bg-[#27272a]'
          }`} />
          {i < total - 1 && (
            <div className="flex-1 h-0.5 rounded-full overflow-hidden bg-[#27272a]">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: '0%' }}
                animate={{ width: i < step ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function OptionCard({
  icon,
  label,
  sublabel,
  selected,
  onClick,
}: {
  icon: string
  label: string
  sublabel: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left rounded-xl p-6 border transition-all ${
        selected
          ? 'border-blue-500 bg-blue-500/10 text-white'
          : 'border-[#27272a] bg-[#0a0a0a] text-[#a1a1aa] hover:border-[#3f3f46] hover:bg-[#0f0f0f]'
      }`}
    >
      <div className="text-lg font-mono mb-2 opacity-60">{icon}</div>
      <div className="font-semibold text-base mb-1">{label}</div>
      <div className="text-sm opacity-70">{sublabel}</div>
    </motion.button>
  )
}

function WizardQuestion({
  question,
  selectedValue,
  onSelect,
}: {
  question: typeof wizardQuestions[0]
  selectedValue: string | null
  onSelect: (value: string) => void
}) {
  return (
    <motion.div
      key={question.title}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-[-0.02em]">{question.title}</h2>
      <p className="text-[#a1a1aa] mb-8">{question.subtitle}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((opt) => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            sublabel={opt.sublabel}
            selected={selectedValue === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </motion.div>
  )
}

function DemoTransition() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-2 border-[#27272a] border-t-blue-500"
      />
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Building your demo...</h2>
        <p className="text-[#a1a1aa]">Personalizing the experience based on your answers</p>
      </div>
    </motion.div>
  )
}

function DemoDashboard({
  step,
  scale,
  activeTab,
}: {
  step: DemoStepData
  scale: number
  activeTab: string
}) {
  const tabs = ['Leads', 'Sequences', 'Integrations', 'Intelligence']
  const tierColors: Record<string, string> = { HIGH: 'text-green-400', MEDIUM: 'text-yellow-400', LOW: 'text-red-400' }

  const scaleValue = (base: number, suffix?: string) => {
    if (suffix === '%' || suffix === 'M' || suffix === 'K' || base === 0 || base < 1) {
      return `${base}${suffix || ''}`
    }
    const scaled = Math.round(base * scale)
    return `${scaled.toLocaleString()}${suffix ? ` ${suffix}` : ''}`
  }

  return (
    <div className="rounded-xl overflow-hidden border border-[#27272a] bg-[#0a0a0a]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#27272a] bg-[#111]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/80" />
        </div>
        <div className="ml-3 flex-1">
          <div className="bg-[#1a1a1a] rounded-md px-3 py-1 text-[11px] text-[#71717a] max-w-xs font-mono">
            app.usecircuitos.com/dashboard
          </div>
        </div>
      </div>

      {/* App header with nav tabs */}
      <div className="px-4 py-2.5 border-b border-[#27272a] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-semibold text-sm">//</span>
          <span className="text-white font-semibold text-sm">CircuitOS</span>
        </div>
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <span
              key={tab}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                activeTab === tab
                  ? 'bg-blue-500/20 text-blue-400 font-medium'
                  : 'text-[#71717a] hover:text-[#a1a1aa]'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-4 border-b border-[#27272a]">
        {step.metrics.map((m, i) => (
          <motion.div
            key={`${m.label}-${i}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="px-4 py-3 border-r border-[#27272a] last:border-r-0"
          >
            <div className="text-base md:text-lg font-bold text-white font-mono">
              {scaleValue(m.base, m.suffix)}
            </div>
            <span className="text-[10px] text-[#71717a]">{m.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Lead table */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-12 gap-1 text-[10px] text-[#71717a] uppercase tracking-wider pb-1.5 border-b border-[#27272a]">
          <div className="col-span-3">Name</div>
          <div className="col-span-3 text-right">Score</div>
          <div className="col-span-3 text-center">Tier</div>
          <div className="col-span-3 text-right">Status</div>
        </div>
        {step.leads.map((lead, i) => (
          <motion.div
            key={`${lead.name}-${i}`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.25 }}
            className="grid grid-cols-12 gap-1 py-1.5 text-xs border-b border-[#27272a]/50 items-center"
          >
            <div className="col-span-3 text-white truncate">{lead.name}</div>
            <div className="col-span-3 text-right font-mono text-white">
              {lead.score > 0 ? lead.score.toFixed(1) : '—'}
            </div>
            <div className="col-span-3 text-center">
              <span className={`${tierColors[lead.tier]} text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/5`}>
                {lead.tier}
              </span>
            </div>
            <div className="col-span-3 text-right text-[11px] text-[#a1a1aa] truncate">{lead.status}</div>
          </motion.div>
        ))}
      </div>

      {/* Status bar */}
      <div className="px-4 py-2 border-t border-[#27272a] flex items-center justify-between text-[10px] text-[#71717a]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          {step.statusMessage}
        </span>
      </div>
    </div>
  )
}

function NarrativePanel({
  step,
  stackMaturity,
}: {
  step: DemoStepData
  stackMaturity: StackMaturity
}) {
  return (
    <motion.div
      key={step.headline}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="space-y-3"
    >
      <div className="text-[11px] text-blue-400 font-mono uppercase tracking-wider">
        {step.module} module
      </div>
      <h3 className="text-xl md:text-2xl font-bold tracking-[-0.02em]">{step.headline}</h3>
      <p className="text-[#a1a1aa] text-sm leading-relaxed">{step.narrative[stackMaturity]}</p>
    </motion.div>
  )
}

function DemoControls({
  currentStep,
  totalSteps,
  isPaused,
  onNext,
  onPrev,
  onPause,
  progressPercent,
}: {
  currentStep: number
  totalSteps: number
  isPaused: boolean
  onNext: () => void
  onPrev: () => void
  onPause: (v: boolean) => void
  progressPercent: number
}) {
  return (
    <div className="flex items-center gap-4 mt-6">
      <button
        onClick={onPrev}
        disabled={currentStep === 0}
        className="px-3 py-1.5 rounded-lg border border-[#27272a] text-[#a1a1aa] text-sm hover:border-[#3f3f46] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Back
      </button>

      {/* Step dots */}
      <div className="flex items-center gap-1.5 flex-1 justify-center">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentStep ? 'bg-blue-500 scale-125' : i < currentStep ? 'bg-blue-500/40' : 'bg-[#27272a]'
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => onPause(!isPaused)}
        className="px-3 py-1.5 rounded-lg border border-[#27272a] text-[#a1a1aa] text-sm hover:border-[#3f3f46] hover:text-white transition-all"
      >
        {isPaused ? 'Play' : 'Pause'}
      </button>

      <button
        onClick={onNext}
        className="px-3 py-1.5 rounded-lg border border-blue-500/40 text-blue-400 text-sm hover:bg-blue-500/10 transition-all"
      >
        Next
      </button>

      {/* Auto-advance progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#27272a]">
        <motion.div
          className="h-full bg-blue-500/60"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  )
}

function InlineDemoForm({
  heading,
  onSubmit,
  onSkip,
  qualificationData,
}: {
  heading: string
  onSubmit: () => void
  onSkip?: () => void
  qualificationData: string
}) {
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const companyRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameRef.current?.value || '',
          email: emailRef.current?.value || '',
          company: companyRef.current?.value || '',
          message: `[Interactive Demo] ${qualificationData}`,
        }),
      })
      if (res.ok) {
        setStatus('success')
        setTimeout(onSubmit, 2000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <motion.div {...fadeInUp} className="text-center py-6">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-green-400 text-2xl">&#10003;</span>
        </div>
        <h4 className="text-lg font-semibold mb-1">Thanks for reaching out!</h4>
        <p className="text-[#a1a1aa] text-sm">We&apos;ll be in touch within 24 hours.</p>
      </motion.div>
    )
  }

  return (
    <motion.div {...fadeInUp}>
      <h3 className="text-xl font-bold mb-4">{heading}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          ref={nameRef}
          type="text"
          required
          placeholder="Your name"
          className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#71717a] focus:outline-none focus:border-blue-500/50"
        />
        <input
          ref={emailRef}
          type="email"
          required
          placeholder="Work email"
          className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#71717a] focus:outline-none focus:border-blue-500/50"
        />
        <input
          ref={companyRef}
          type="text"
          placeholder="Company"
          className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#71717a] focus:outline-none focus:border-blue-500/50"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full py-3 btn-primary text-white rounded-lg font-semibold text-sm disabled:opacity-50"
        >
          {status === 'submitting' ? 'Sending...' : heading}
        </button>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="w-full text-center text-sm text-[#71717a] hover:text-[#a1a1aa] transition-colors py-1"
          >
            Skip for now
          </button>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-xs text-center">Something went wrong. Please try again.</p>
        )}
      </form>
    </motion.div>
  )
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function DemoPage() {
  const [state, dispatch] = useReducer(demoReducer, initialState)
  const [progressPercent, setProgressPercent] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { phase, wizardStep, answers, demoStep, isPaused, showCTA, formSubmitted } = state

  // Derived values
  const painPoint = answers.painPoint || 'scoring'
  const scale = scaleMap[answers.leadVolume || 'starter']
  const stackMaturity = answers.stackMaturity || 'spreadsheets'
  const isHighIntent = answers.timing === 'now' || answers.timing === 'evaluating'
  const currentPath = demoPaths[painPoint]
  const currentStepData = currentPath[demoStep]

  const qualificationSummary = `Pain: ${answers.painPoint}, Volume: ${answers.leadVolume}, Stack: ${answers.stackMaturity}, Timing: ${answers.timing}`

  // Wizard selection handlers
  const handleWizardSelect = useCallback((value: string) => {
    const step = wizardStep
    if (step === 0) dispatch({ type: 'SET_PAIN_POINT', value: value as PainPoint })
    else if (step === 1) dispatch({ type: 'SET_LEAD_VOLUME', value: value as LeadVolume })
    else if (step === 2) dispatch({ type: 'SET_STACK_MATURITY', value: value as StackMaturity })
    else if (step === 3) dispatch({ type: 'SET_TIMING', value: value as Timing })

    // Auto-advance after 600ms
    setTimeout(() => {
      if (step < 3) {
        dispatch({ type: 'ADVANCE_WIZARD' })
      } else {
        dispatch({ type: 'START_TRANSITION' })
        // After 2 second transition, start demo
        setTimeout(() => dispatch({ type: 'START_DEMO' }), 2000)
      }
    }, 600)
  }, [wizardStep])

  // Get current wizard answer value
  const currentWizardValue = (): string | null => {
    if (wizardStep === 0) return answers.painPoint
    if (wizardStep === 1) return answers.leadVolume
    if (wizardStep === 2) return answers.stackMaturity
    if (wizardStep === 3) return answers.timing
    return null
  }

  // Auto-advance timer for demo steps
  useEffect(() => {
    if (phase !== 'demo' || isPaused || showCTA) {
      setProgressPercent(0)
      return
    }

    const STEP_DURATION = 4000
    const TICK = 50
    let elapsed = 0

    timerRef.current = setInterval(() => {
      elapsed += TICK
      setProgressPercent((elapsed / STEP_DURATION) * 100)

      if (elapsed >= STEP_DURATION) {
        // Check if we should show CTA at step 6 (index 6 = step 7)
        if (demoStep === 6 && isHighIntent && !formSubmitted) {
          dispatch({ type: 'SHOW_CTA' })
          if (timerRef.current) clearInterval(timerRef.current)
          return
        }
        dispatch({ type: 'NEXT_STEP' })
        elapsed = 0
        setProgressPercent(0)
      }
    }, TICK)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase, demoStep, isPaused, showCTA, isHighIntent, formSubmitted])

  // Pause on hover
  const handleMouseEnter = () => {
    if (phase === 'demo') dispatch({ type: 'SET_PAUSED', value: true })
  }
  const handleMouseLeave = () => {
    if (phase === 'demo') dispatch({ type: 'SET_PAUSED', value: false })
  }

  return (
    <main className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Nav />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* ── Phase: Wizard ── */}
          <AnimatePresence mode="wait">
            {phase === 'wizard' && (
              <motion.div
                key="wizard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div {...fadeInUp} className="text-center mb-10">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4 hero-headline">
                    See CircuitOS in action
                  </h1>
                  <p className="text-[#a1a1aa] text-lg">
                    Answer 4 quick questions and we&apos;ll build a personalized demo.
                  </p>
                </motion.div>

                <ProgressBar step={wizardStep} total={4} />

                <AnimatePresence mode="wait">
                  <WizardQuestion
                    key={wizardStep}
                    question={wizardQuestions[wizardStep]}
                    selectedValue={currentWizardValue()}
                    onSelect={handleWizardSelect}
                  />
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── Phase: Transition ── */}
            {phase === 'transition' && (
              <motion.div key="transition">
                <DemoTransition />
              </motion.div>
            )}

            {/* ── Phase: Demo ── */}
            {(phase === 'demo' || phase === 'complete') && (
              <motion.div
                key="demo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                ref={containerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Demo layout: narrative + dashboard */}
                <div className="grid lg:grid-cols-5 gap-6 items-start">

                  {/* Narrative panel (left side, 2/5 width on desktop) */}
                  <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                      <NarrativePanel
                        key={demoStep}
                        step={currentStepData}
                        stackMaturity={stackMaturity}
                      />
                    </AnimatePresence>

                    {/* CTA overlay for high-intent at step 7 */}
                    <AnimatePresence>
                      {showCTA && isHighIntent && demoStep === 6 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="card rounded-xl p-6 border-blue-500/30 bg-blue-500/5"
                        >
                          <InlineDemoForm
                            heading="Book Your Strategy Call"
                            qualificationData={qualificationSummary}
                            onSubmit={() => dispatch({ type: 'SUBMIT_FORM' })}
                            onSkip={() => {
                              dispatch({ type: 'HIDE_CTA' })
                              dispatch({ type: 'NEXT_STEP' })
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Explorer CTA at step 10 (complete) */}
                    {phase === 'complete' && !isHighIntent && !formSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card rounded-xl p-6 border-blue-500/30 bg-blue-500/5"
                      >
                        <InlineDemoForm
                          heading="See the Full Platform"
                          qualificationData={qualificationSummary}
                          onSubmit={() => dispatch({ type: 'SUBMIT_FORM' })}
                        />
                      </motion.div>
                    )}

                    {/* High-intent final CTA at complete */}
                    {phase === 'complete' && isHighIntent && !formSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card rounded-xl p-6 border-blue-500/30 bg-blue-500/5"
                      >
                        <InlineDemoForm
                          heading="Book Your Strategy Call"
                          qualificationData={qualificationSummary}
                          onSubmit={() => dispatch({ type: 'SUBMIT_FORM' })}
                        />
                      </motion.div>
                    )}

                    {/* Post-submit message */}
                    {formSubmitted && phase === 'complete' && (
                      <motion.div {...fadeInUp} className="text-center py-4">
                        <p className="text-[#a1a1aa] text-sm">
                          Want to explore more?{' '}
                          <a href="/playground" className="text-blue-400 hover:text-blue-300">
                            Try the Revenue Physics Playground
                          </a>
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Dashboard (right side, 3/5 width on desktop) */}
                  <div className="lg:col-span-3 relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={demoStep}
                        {...slideIn}
                      >
                        <DemoDashboard
                          step={currentStepData}
                          scale={scale}
                          activeTab={currentStepData.activeTab}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Demo controls */}
                    {phase === 'demo' && (
                      <DemoControls
                        currentStep={demoStep}
                        totalSteps={10}
                        isPaused={isPaused}
                        onNext={() => {
                          if (demoStep === 6 && isHighIntent && !formSubmitted) {
                            dispatch({ type: 'SHOW_CTA' })
                          } else {
                            dispatch({ type: 'NEXT_STEP' })
                          }
                        }}
                        onPrev={() => dispatch({ type: 'PREV_STEP' })}
                        onPause={(v) => dispatch({ type: 'SET_PAUSED', value: v })}
                        progressPercent={progressPercent}
                      />
                    )}

                    {/* Complete state controls */}
                    {phase === 'complete' && (
                      <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                          onClick={() => dispatch({ type: 'PREV_STEP' })}
                          className="px-4 py-2 rounded-lg border border-[#27272a] text-[#a1a1aa] text-sm hover:border-[#3f3f46] hover:text-white transition-all"
                        >
                          Review Steps
                        </button>
                        <a
                          href="/playground"
                          className="px-4 py-2 rounded-lg border border-blue-500/40 text-blue-400 text-sm hover:bg-blue-500/10 transition-all"
                        >
                          Try the Playground
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      <Footer />
    </main>
  )
}
