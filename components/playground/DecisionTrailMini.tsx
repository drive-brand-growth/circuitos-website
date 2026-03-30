'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap, CheckCircle } from 'lucide-react'
import type { FiredSignalEntry, DMNRoute, GateStatus } from '@/lib/revenue-physics'

interface DecisionTrailMiniProps {
  firedSignals: FiredSignalEntry[]
  dmnRoute: DMNRoute
  gates: GateStatus
  posterior: number
}

interface TrailEvent {
  type: 'decision' | 'action' | 'outcome'
  label: string
  detail: string
  status: 'success' | 'warning' | 'danger'
  time: number
}

function buildTrail(
  signals: FiredSignalEntry[],
  route: DMNRoute,
  gates: GateStatus,
  posterior: number
): TrailEvent[] {
  const events: TrailEvent[] = []

  for (const entry of signals) {
    const isNegative = entry.signal.likelihoodRatio < 1

    // Decision event
    events.push({
      type: 'decision',
      label: `Score: ${entry.signal.label}`,
      detail: `LR ${entry.signal.likelihoodRatio.toFixed(1)} → P=${entry.posteriorAfter.toFixed(4)}`,
      status: isNegative ? 'danger' : 'success',
      time: entry.time,
    })

    // Action event (gate evaluation after each signal)
    const conf = entry.posteriorAfter
    const gateStatus = conf >= 0.78 ? 'PASS' : conf >= 0.65 ? 'SOFT PASS' : 'BELOW'
    events.push({
      type: 'action',
      label: `Gate: ${gateStatus}`,
      detail: `Confidence ${(conf * 100).toFixed(1)}% vs threshold 78%`,
      status: conf >= 0.78 ? 'success' : conf >= 0.65 ? 'warning' : 'danger',
      time: entry.time,
    })
  }

  // Final routing outcome
  if (signals.length > 0) {
    events.push({
      type: 'outcome',
      label: `Route: ${route.action.replace(/_/g, ' ')}`,
      detail: `Tier ${route.tier} · Confidence ${(route.confidence * 100).toFixed(0)}%`,
      status: route.action === 'CLUTCH_STRIKE' ? 'success' : route.action === 'FRICTION_INTERCEPT' ? 'danger' : 'warning',
      time: signals[signals.length - 1]?.time || 0,
    })
  }

  return events
}

const ICONS = {
  decision: Shield,
  action: Zap,
  outcome: CheckCircle,
}

const STATUS_COLORS = {
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
}

export default function DecisionTrailMini({ firedSignals, dmnRoute, gates, posterior }: DecisionTrailMiniProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const events = buildTrail(firedSignals, dmnRoute, gates, posterior)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [events.length])

  return (
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#27272a]">
        <Shield size={14} className="text-blue-400" />
        <span className="text-sm font-medium text-white">Decision Trail</span>
        <span className="ml-auto text-[10px] text-[#71717a] font-mono">{events.length} events</span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[280px] overflow-y-auto p-3 space-y-1"
      >
        {events.length === 0 && (
          <p className="text-xs text-[#52525b] text-center py-6">Fire signals to generate decision events</p>
        )}
        {events.map((event, i) => {
          const Icon = ICONS[event.type]
          const color = STATUS_COLORS[event.status]
          return (
            <motion.div
              key={`${event.type}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2 px-2 py-1.5 rounded hover:bg-[#27272a]/50 transition-colors"
            >
              <Icon size={12} className="mt-0.5 shrink-0" style={{ color }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white">{event.label}</span>
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    {event.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-[#71717a] font-mono mt-0.5">{event.detail}</p>
              </div>
              <span className="text-[9px] text-[#52525b] font-mono shrink-0 mt-0.5">T+{event.time.toFixed(0)}h</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
