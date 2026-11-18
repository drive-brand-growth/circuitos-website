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
      detail: `Example LR ${entry.signal.likelihoodRatio.toFixed(1)} → P=${entry.posteriorAfter.toFixed(4)}`,
      status: isNegative ? 'danger' : 'success',
      time: entry.time,
    })

    // Action event (gate evaluation after each signal)
    const conf = entry.posteriorAfter
    const gateStatus = conf >= 0.8 ? 'PASS' : conf >= 0.5 ? 'SOFT PASS' : 'BELOW'
    events.push({
      type: 'action',
      label: `Gate: ${gateStatus}`,
      detail: `Example only. Stated odds ${Math.round(conf * 100)} percent. Example gate is 80 percent.`,
      status: conf >= 0.8 ? 'success' : conf >= 0.5 ? 'warning' : 'danger',
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
    <div className="bg-surface border border-line rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
        <Shield size={14} className="text-accent" />
        <span className="text-sm font-medium text-fg">Receipt</span>
        <span className="ml-auto text-xs text-subtle font-mono">{events.length} events</span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[280px] overflow-y-auto p-3 space-y-1"
      >
        {events.length === 0 && (
          <p className="text-xs text-faint text-center py-6">Fire a signal to start the receipt</p>
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
              className="flex items-start gap-2 px-2 py-1.5 rounded hover:bg-line/50 transition-colors"
            >
              <Icon size={12} className="mt-0.5 shrink-0" style={{ color }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-fg">{event.label}</span>
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    {event.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-subtle font-mono mt-0.5">{event.detail}</p>
              </div>
              <span className="text-xs text-faint font-mono shrink-0 mt-0.5">T+{event.time.toFixed(0)}h</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
