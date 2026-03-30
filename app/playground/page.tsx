'use client'

import { useReducer, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
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

export default function PlaygroundPage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const firedSignalIds = state.engine
    ? state.engine.firedSignals.map(f => f.signal.id)
    : []

  const uniqueEngines = state.engine
    ? Array.from(new Set(state.engine.socialEnrichments.map(e => e.engine)))
    : []

  return (
    <main className="min-h-screen grid-bg">
      <Nav />

      <section className="pt-28 pb-12 px-6">
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
            />
          </motion.div>

          {/* Persona Picker — disappears after selection */}
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

          {/* Main playground grid — appears after persona selected */}
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
                  {/* Left column — sticky controls */}
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

                  {/* Right column — focused story: Score → Decide → Prove */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* SCORE — Conviction meter */}
                    <PosteriorMeter
                      posterior={state.engine.posterior}
                      logOdds={state.engine.logOdds}
                    />

                    {/* DECIDE — Autonomy gate + DMN routing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <AutonomyPanel
                        posterior={state.engine.posterior}
                        compositeScore={state.engine.compositeScore.total}
                      />
                      <DMNRouter route={state.engine.dmnRoute} />
                    </div>

                    {/* PROVE — Decision trail */}
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

                    {/* Advanced panels — hidden by default */}
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
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                See this on your real data
              </h2>
              <p className="text-[#a1a1aa] mb-8 max-w-lg mx-auto">
                This playground uses simulated signals. The real engine runs on your CRM data, social profiles, and live engagement signals.
              </p>
              <Link
                href="/demo"
                className="inline-block btn-primary text-white px-8 py-4 rounded-lg font-semibold text-lg"
              >
                Book a Demo
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
