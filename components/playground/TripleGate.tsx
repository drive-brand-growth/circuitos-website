'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock, ShieldCheck } from 'lucide-react'
import type { GateStatus } from '@/lib/revenue-physics'

interface TripleGateProps {
  gates: GateStatus
}

interface GateRowProps {
  label: string
  rule: string
  passed: boolean
  value: number
  formatValue: (v: number) => string
}

function GateRow({ label, rule, passed, value, formatValue }: GateRowProps) {
  return (
    <motion.div
      className="flex items-center gap-3 py-3"
      layout
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={passed ? 'pass' : 'fail'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`flex items-center justify-center w-8 h-8 rounded-lg ${
            passed
              ? 'bg-green-500/20 text-green-400'
              : 'bg-[#27272a] text-[#71717a]'
          }`}
          style={passed ? { boxShadow: '0 0 12px rgba(34, 197, 94, 0.3)' } : undefined}
        >
          {passed ? <ShieldCheck size={18} /> : <Lock size={18} />}
        </motion.div>
      </AnimatePresence>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{label}</span>
          <span className="font-mono text-xs text-[#71717a]">{rule}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-[#a1a1aa]">{formatValue(value)}</span>
        <motion.span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            passed
              ? 'bg-green-500/20 text-green-400'
              : 'bg-[#27272a] text-[#71717a]'
          }`}
          animate={passed ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {passed ? 'PASS' : 'FAIL'}
        </motion.span>
      </div>
    </motion.div>
  )
}

export default function TripleGate({ gates }: TripleGateProps) {
  const allPassed = gates.certainty.passed && gates.variance.passed && gates.pulse.passed

  return (
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-white">Triple Gate</h3>
        {allPassed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-500/20 px-2 py-1 rounded-full"
          >
            <Unlock size={12} />
            ALL GATES OPEN
          </motion.div>
        )}
      </div>

      <div className="divide-y divide-[#27272a]">
        <GateRow
          label="Certainty"
          rule="P > 0.90"
          passed={gates.certainty.passed}
          value={gates.certainty.value}
          formatValue={(v) => v.toFixed(4)}
        />
        <GateRow
          label="Variance"
          rule="&sigma;&sup2; < 0.05"
          passed={gates.variance.passed}
          value={gates.variance.value}
          formatValue={(v) => v.toFixed(6)}
        />
        <GateRow
          label="Pulse"
          rule="Rate > 3&times;"
          passed={gates.pulse.passed}
          value={gates.pulse.value}
          formatValue={(v) => `${v.toFixed(2)}x`}
        />
      </div>
    </div>
  )
}
