'use client'

interface DecayCurveProps {
  posterior: number
  decayRate: number
  currentTime: number
}

const WIDTH = 300
const HEIGHT = 150
const PADDING = { top: 10, right: 10, bottom: 25, left: 35 }
const PLOT_W = WIDTH - PADDING.left - PADDING.right
const PLOT_H = HEIGHT - PADDING.top - PADDING.bottom
const HOURS_SPAN = 48
const Y_GRIDLINES = [0.25, 0.5, 0.75]

export default function DecayCurve({ posterior, decayRate, currentTime }: DecayCurveProps) {
  // Generate curve points from currentTime to currentTime + 48h
  const points: { x: number; y: number }[] = []
  const steps = 100
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * HOURS_SPAN
    const value = posterior * Math.exp(-decayRate * t)
    const x = PADDING.left + (t / HOURS_SPAN) * PLOT_W
    const y = PADDING.top + (1 - Math.min(1, value)) * PLOT_H
    points.push({ x, y })
  }

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const fillPath = `${linePath} L${points[points.length - 1].x},${PADDING.top + PLOT_H} L${points[0].x},${PADDING.top + PLOT_H} Z`

  // Current position dot (at t=0 relative to projection)
  const dotX = PADDING.left
  const dotY = PADDING.top + (1 - Math.min(1, posterior)) * PLOT_H

  // X-axis labels
  const xLabels = [0, 12, 24, 36, 48]

  return (
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6">
      <h3 className="font-medium text-white mb-4">Belief Decay Projection</h3>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full">
        {/* Y-axis gridlines */}
        {Y_GRIDLINES.map(v => {
          const y = PADDING.top + (1 - v) * PLOT_H
          return (
            <g key={v}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={PADDING.left + PLOT_W}
                y2={y}
                stroke="#27272a"
                strokeWidth={0.5}
                strokeDasharray="3,3"
              />
              <text
                x={PADDING.left - 4}
                y={y}
                textAnchor="end"
                dominantBaseline="central"
                className="fill-[#71717a]"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px' }}
              >
                {v.toFixed(2)}
              </text>
            </g>
          )
        })}

        {/* X-axis baseline */}
        <line
          x1={PADDING.left}
          y1={PADDING.top + PLOT_H}
          x2={PADDING.left + PLOT_W}
          y2={PADDING.top + PLOT_H}
          stroke="#3f3f46"
          strokeWidth={0.5}
        />

        {/* X-axis labels */}
        {xLabels.map(h => {
          const x = PADDING.left + (h / HOURS_SPAN) * PLOT_W
          return (
            <text
              key={h}
              x={x}
              y={HEIGHT - 5}
              textAnchor="middle"
              className="fill-[#71717a]"
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px' }}
            >
              {h}h
            </text>
          )
        })}

        {/* Fill under curve */}
        <path d={fillPath} fill="rgba(59,130,246,0.1)" />

        {/* Curve line */}
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth={1.5} />

        {/* Current position glowing dot */}
        <circle cx={dotX} cy={dotY} r={5} fill="rgba(59,130,246,0.3)" />
        <circle cx={dotX} cy={dotY} r={3} fill="#3b82f6" />
      </svg>
      <div className="flex justify-between mt-2 font-mono text-xs text-[#71717a]">
        <span>T+{currentTime.toFixed(1)}h</span>
        <span>T+{(currentTime + HOURS_SPAN).toFixed(1)}h</span>
      </div>
    </div>
  )
}
