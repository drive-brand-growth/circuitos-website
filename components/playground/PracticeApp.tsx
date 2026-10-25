'use client'

import { useReducer, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import Link from 'next/link'
import PlaygroundHeader from '@/components/playground/PlaygroundHeader'
import PersonaPicker from '@/components/playground/PersonaPicker'
import SignalBoard from '@/components/playground/SignalBoard'
import TimeSimulator from '@/components/playground/TimeSimulator'
import PosteriorMeter from '@/components/playground/PosteriorMeter'
import SocialEnginePanel from '@/components/playground/SocialEnginePanel'
import QualificationBreakdown from '@/components/playground/QualificationBreakdown'
import VectorDisplay from '@/components/playground/VectorDisplay'
import TripleGate from '@/components/playground/TripleGate'
import DMNRouter from '@/components/playground/DMNRouter'
import DecayCurve from '@/components/playground/DecayCurve'
import PulseIndicator from '@/components/playground/PulseIndicator'
import SignalFeed from '@/components/playground/SignalFeed'
import ClutchStrike from '@/components/playground/ClutchStrike'
import AutonomyPanel from '@/components/playground/AutonomyPanel'
import DecisionTrailMini from '@/components/playground/DecisionTrailMini'
import {
  type PersonaId,
  type EngineState,
  createInitialState,
  fireSignal,
  advanceTime,
  ENGINES,
} from '@/lib/revenue-physics'

// ─── Reducer ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SELECT_PERSONA'; personaId: PersonaId }
  | { type: 'FIRE_SIGNAL'; signalId: string }
  | { type: 'ADVANCE_TIME'; deltaHours: number }
  | { type: 'RESET' }
  | { type: 'DISMISS_CLUTCH' }

type State = {
  engine: EngineState | null
  personaSelected: boolean
  lastFiredEngines: string[]
}

const initialState: State = {
  engine: null,
  personaSelected: false,
  lastFiredEngines: [],
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_PERSONA':
      return {
        engine: createInitialState(action.personaId),
        personaSelected: true,
        lastFiredEngines: [],
      }

    case 'FIRE_SIGNAL': {
      if (!state.engine) return state
      const newEngine = fireSignal(state.engine, action.signalId)
      const firedSignal = newEngine.firedSignals.find(
        f => f.signal.id === action.signalId
      )
      return {
        ...state,
        engine: newEngine,
        lastFiredEngines: firedSignal?.engines ?? [],
      }
    }

    case 'ADVANCE_TIME': {
      if (!state.engine) return state
      return {
        ...state,
        engine: advanceTime(state.engine, action.deltaHours),
        lastFiredEngines: [],
      }
    }

    case 'RESET':
      return initialState

    case 'DISMISS_CLUTCH': {
      if (!state.engine) return state
      return {
        ...state,
        engine: { ...state.engine, clutchStrike: false },
      }
    }

    default:
      return state
  }
}

// ─── Animation variants ──────────────────────────────────────────────────────

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
}

// ─── Page ────────────────────────────────────────────────────────────────────

export type PracticeCopy = {
  kicker: string
  headline: string
  lede: string
  stages: { label: string; text: string }[]
  closeTitle: string
  closeBody: string
  closeHref: string
  closeLabel: string
}

export default function PracticeApp({ copy }: { copy: PracticeCopy }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const firedSignalIds = state.engine
    ? state.engine.firedSignals.map(f => f.signal.id)
    : []

  const uniqueEngines = state.engine
    ? Array.from(new Set(state.engine.socialEnrichments.map(e => e.engine)))
    : []

  return (
    <MotionConfig reducedMotion="user">
      <section className="grid-bg pb-12 px-6 pt-28">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div variants={fadeInUp}>
            <PlaygroundHeader
              persona={state.engine?.persona ?? null}
              onReset={() => dispatch({ type: 'RESET' })}
              kicker={copy.kicker}
              title={copy.headline}
              lede={copy.lede}
            />
            <dl className="mt-8 grid gap-3 sm:grid-cols-5 text-sm">
              {copy.stages.map((stage) => (
                <div key={stage.label} className="card rounded-xl px-4 py-4">
                  <dt className="font-medium text-white">{stage.label}</dt>
                  <dd className="mt-1 text-[#a1a1aa]">{stage.text}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Persona picker. It leaves after a choice. */}
          <AnimatePresence mode="wait">
            {!state.personaSelected && (
              <motion.div
                key="persona-picker"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10"
              >
                <PersonaPicker
                  onSelect={(personaId) => dispatch({ type: 'SELECT_PERSONA', personaId })}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Practice grid, after a simulated situation is chosen. */}
          <AnimatePresence>
            {state.personaSelected && state.engine && (
              <motion.div
                key="playground-grid"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left column. Signal, then time before an outcome. */}
                  <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-2 space-y-6 thin-scrollbar">
                      <SignalBoard
                        firedSignalIds={firedSignalIds}
                        onFireSignal={(signalId) =>
                          dispatch({ type: 'FIRE_SIGNAL', signalId })
                        }
                        disabled={false}
                      />
                      <TimeSimulator
                        currentTime={state.engine.simulatedTimeHours}
                        posterior={state.engine.posterior}
                        decayRate={state.engine.persona.decayRate}
                        onAdvance={(hours) =>
                          dispatch({ type: 'ADVANCE_TIME', deltaHours: hours })
                        }
                      />
                    </div>
                  </div>

                  {/* Right column. Switch, breaker, receipt. */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Switch: stated odds */}
                    <PosteriorMeter
                      posterior={state.engine.posterior}
                      logOdds={state.engine.logOdds}
                    />

                    {/* Switch rules and the breaker */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <AutonomyPanel
                        posterior={state.engine.posterior}
                        compositeScore={state.engine.compositeScore.total}
                      />
                      <DMNRouter route={state.engine.dmnRoute} />
                    </div>

                    {/* Receipt */}
                    <DecisionTrailMini
                      firedSignals={state.engine.firedSignals}
                      dmnRoute={state.engine.dmnRoute}
                      gates={state.engine.gates}
                      posterior={state.engine.posterior}
                    />

                    {/* Advanced toggle */}
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[#71717a] hover:text-[#a1a1aa] border border-[#27272a] rounded-lg hover:bg-white/[0.02] transition-all"
                    >
                      {showAdvanced ? 'Hide' : 'Show'} Advanced Panels
                      <svg
                        className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* More panels, hidden until asked for */}
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-6"
                      >
                        <SocialEnginePanel
                          socialEnrichments={state.engine.socialEnrichments}
                          latestSignalEngines={state.lastFiredEngines as any}
                        />

                        <QualificationBreakdown
                          compositeScore={state.engine.compositeScore}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <VectorDisplay vector={state.engine.vector} />
                          <TripleGate gates={state.engine.gates} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <DecayCurve
                            posterior={state.engine.posterior}
                            decayRate={state.engine.persona.decayRate}
                            currentTime={state.engine.simulatedTimeHours}
                          />
                          <PulseIndicator
                            pulseRate={state.engine.pulseRate}
                            signals={state.engine.firedSignals}
                            currentTime={state.engine.simulatedTimeHours}
                          />
                        </div>

                        <SignalFeed entries={state.engine.firedSignals} />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CLUTCH STRIKE overlay */}
          {state.engine?.clutchStrike && (
            <ClutchStrike
              posterior={state.engine.posterior}
              compositeScore={state.engine.compositeScore.total}
              socialEngines={uniqueEngines}
              onDismiss={() => dispatch({ type: 'DISMISS_CLUTCH' })}
            />
          )}

          {/* Bottom CTA */}
          {state.personaSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-20 text-center border-t border-[#27272a] pt-16 pb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] mb-4">
                {copy.closeTitle}
              </h2>
              <p className="text-[#a1a1aa] mb-8 max-w-lg mx-auto">
                {copy.closeBody}
              </p>
              <Link
                href={copy.closeHref}
                className="inline-block btn-primary text-white px-8 py-3.5 rounded-lg font-semibold"
              >
                {copy.closeLabel}
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>
    </MotionConfig>
  )
}
