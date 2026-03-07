'use client'

import { motion } from 'framer-motion'
import type { Vector4D } from '@/lib/revenue-physics'

interface VectorDisplayProps {
  vector: Vector4D
}

const AXIS_LENGTH = 80
const CENTER = 100

function polarToCart(value: number, angleDeg: number): { x: number; y: number } {
  const r = value * AXIS_LENGTH
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  }
}

export default function VectorDisplay({ vector }: VectorDisplayProps) {
  const axes = [
    { key: 'S' as const, label: 'S', angle: 0, value: vector.S },
    { key: 'T' as const, label: 'T', angle: 90, value: vector.T },
    { key: 'B' as const, label: 'B', angle: 180, value: vector.B },
    { key: 'C' as const, label: 'C', angle: 270, value: vector.C },
  ]

  const points = axes.map(a => polarToCart(a.value, a.angle))
  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ')

  const labelOffsets = [
    { dx: 0, dy: -10 },
    { dx: 12, dy: 0 },
    { dx: 0, dy: 14 },
    { dx: -12, dy: 0 },
  ]

  return (
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6">
      <h3 className="font-medium text-white mb-4">4D Vector</h3>
      <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
        {/* Grid circles */}
        {[0.25, 0.5, 0.75, 1].map(r => (
          <circle
            key={r}
            cx={CENTER}
            cy={CENTER}
            r={r * AXIS_LENGTH}
            fill="none"
            stroke="#27272a"
            strokeWidth={0.5}
          />
        ))}

        {/* Axis lines */}
        {axes.map(a => {
          const end = polarToCart(1, a.angle)
          return (
            <line
              key={a.key}
              x1={CENTER}
              y1={CENTER}
              x2={end.x}
              y2={end.y}
              stroke="#3f3f46"
              strokeWidth={1}
            />
          )
        })}

        {/* Data polygon */}
        <motion.polygon
          points={polygonPath}
          fill="rgba(59,130,246,0.2)"
          stroke="#3b82f6"
          strokeWidth={1.5}
          initial={false}
          animate={{ points: polygonPath }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        />

        {/* Data points */}
        {points.map((p, i) => (
          <motion.circle
            key={axes[i].key}
            r={3}
            fill="#3b82f6"
            initial={false}
            animate={{ cx: p.x, cy: p.y }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          />
        ))}

        {/* Labels */}
        {axes.map((a, i) => {
          const end = polarToCart(1, a.angle)
          return (
            <text
              key={`label-${a.key}`}
              x={end.x + labelOffsets[i].dx}
              y={end.y + labelOffsets[i].dy}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-[#a1a1aa]"
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}
            >
              {a.label} {a.value.toFixed(2)}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
