'use client'

import { useState } from 'react'

type AttributionState = 'citable' | 'pending_harness'

type AttributionEnvelope = {
  state: AttributionState
  lift: number | null
  ci_low: number | null
  ci_high: number | null
  evidence: { run_id: string; baseline_id: string } | null
}

const CITABLE: AttributionEnvelope = {
  state: 'citable',
  lift: 0.18,
  ci_low: 0.11,
  ci_high: 0.25,
  evidence: { run_id: 'fixture-run-001', baseline_id: 'fixture-baseline-v1' },
}

const PENDING: AttributionEnvelope = {
  state: 'pending_harness',
  lift: null,
  ci_low: null,
  ci_high: null,
  evidence: null,
}

export default function RefusalDemo() {
  const [active, setActive] = useState<AttributionState>('citable')
  const envelope = active === 'citable' ? CITABLE : PENDING

  return (
    <div className="card rounded-xl p-6 border border-[#27272a]">
      <p className="text-xs font-medium text-blue-400 mb-1">Live Demo</p>
      <h2 className="text-white text-xl font-bold mb-4 tracking-[-0.01em]">
        See the refusal live
      </h2>

      {/* Toggle */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActive('citable')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            active === 'citable'
              ? 'border-blue-500/60 bg-blue-500/10 text-blue-300'
              : 'border-[#3f3f46] text-[#a1a1aa] hover:border-[#52525b]'
          }`}
        >
          Proven segment
        </button>
        <button
          onClick={() => setActive('pending_harness')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            active === 'pending_harness'
              ? 'border-yellow-500/60 bg-yellow-500/10 text-yellow-300'
              : 'border-[#3f3f46] text-[#a1a1aa] hover:border-[#52525b]'
          }`}
        >
          Unproven segment
        </button>
      </div>

      {/* Result panel */}
      <div className="bg-[#18181b] rounded-xl p-5 border border-[#27272a] mb-4">
        <p className="text-xs font-medium text-[#71717a] mb-2 uppercase tracking-wide">
          Causal Lift
        </p>

        {envelope.state === 'citable' ? (
          <>
            <p className="text-4xl font-bold text-white mb-1">
              +{(envelope.lift! * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-[#71717a] mb-3">
              95% CI: {(envelope.ci_low! * 100).toFixed(0)}% to{' '}
              {(envelope.ci_high! * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-[#52525b]">
              run: {envelope.evidence!.run_id} / baseline: {envelope.evidence!.baseline_id}
            </p>
          </>
        ) : (
          /* UNPROVEN PATH: no numeric interpolation */
          <p className="text-lg font-semibold text-yellow-400">
            causal measurement pending baseline
          </p>
        )}
      </div>

      <p className="text-[#71717a] text-xs leading-relaxed">
        This is the same pending state our production API serves. Where every other tool shows you a
        number, we show you the truth. Synthetic data; the rule is real.
      </p>
    </div>
  )
}
