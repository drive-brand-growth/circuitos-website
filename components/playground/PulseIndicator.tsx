'use client'

import { motion } from 'framer-motion'
import type { FiredSignalEntry } from '@/lib/revenue-physics'

interface PulseIndicatorProps {
  pulseRate: number
  signals: FiredSignalEntry[]
  currentTime: number
}

export default function PulseIndicator({ pulseRate, signals, currentTime }: PulseIndicatorProps) {
  const width = 300
  const height = 80
  const padding = { top: 10, right: 20, bottom: 25, left: 30 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  // Build heartbeat path
  const baselineY = padding.top + chartH * 0.6
  const thresholdY = padding.top + chartH * (1 - 3 / Math.max(5, pulseRate + 2))

  // Create signal spikes on the timeline
  const windowStart = Math.max(0, currentTime - 4)
  const recentSignals = signals.filter(s => s.time >= windowStart)

  let pathD = `M ${padding.left} ${baselineY}`

  // Generate heartbeat-style path
  const points = 50
  for (let i = 1; i <= points; i++) {
    const x = padding.left + (i / points) * chartW
    const t = windowStart + (i / points) * 4

    // Check if there's a signal near this time
    const nearbySignal = recentSignals.find(s => Math.abs(s.time - t) < 0.15)
    if (nearbySignal) {
      const spikeHeight = Math.min(chartH * 0.8, chartH * 0.3 * Math.log(nearbySignal.signal.likelihoodRatio + 1))
      const spikeY = baselineY - spikeHeight
      pathD += ` L ${x - 3} ${baselineY} L ${x - 1} ${spikeY} L ${x + 1} ${baselineY + 4} L ${x + 3} ${baselineY}`
    } else {
      // Small noise
      const noise = Math.sin(i * 0.8) * 1.5
      pathD += ` L ${x} ${baselineY + noise}`
    }
  }

  const rateColor = pulseRate > 3 ? '#22c55e' : pulseRate > 1.5 ? '#eab308' : '#71717a'

  return (
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[#a1a1aa] uppercase tracking-wider">Pulse Rate</h3>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: rateColor }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="font-mono text-sm" style={{ color: rateColor }}>
            {pulseRate.toFixed(1)}x
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" aria-label="Pulse rate indicator">
        {/* Baseline */}
        <line
          x1={padding.left}
          y1={baselineY}
          x2={padding.left + chartW}
          y2={baselineY}
          stroke="#27272a"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Threshold line (3x) */}
        <line
          x1={padding.left}
          y1={thresholdY}
          x2={padding.left + chartW}
          y2={thresholdY}
          stroke="#22c55e"
          strokeWidth="0.5"
          strokeDasharray="3 3"
          opacity="0.4"
        />
        <text x={padding.left + chartW + 4} y={thresholdY + 3} fill="#22c55e" fontSize="7" opacity="0.6">3x</text>

        {/* Heartbeat line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={rateColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* X-axis label */}
        <text x={padding.left + chartW / 2} y={height - 3} fill="#71717a" fontSize="7" textAnchor="middle">
          last 4 hours
        </text>

        {/* Baseline label */}
        <text x={padding.left - 4} y={baselineY + 3} fill="#71717a" fontSize="7" textAnchor="end">1x</text>
      </svg>
    </div>
  )
}
