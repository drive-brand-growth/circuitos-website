'use client'

import { motion } from 'framer-motion'
import type { DMNRoute, DMNAction } from '@/lib/revenue-physics'

interface DMNRouterProps {
  route: DMNRoute
}

interface RouteConfig {
  action: DMNAction
  label: string
  description: string
  color: string
}

const ROUTES: RouteConfig[] = [
  {
    action: 'CLUTCH_STRIKE',
    label: 'Clutch Strike',
    description: 'Immediate Escalation',
    color: '#eab308',
  },
  {
    action: 'NURTURE_ACCELERATE',
    label: 'Nurture Accelerate',
    description: 'Accelerated Nurture',
    color: '#22c55e',
  },
  {
    action: 'NURTURE_STANDARD',
    label: 'Nurture Standard',
    description: 'Standard Nurture',
    color: '#3b82f6',
  },
  {
    action: 'IDENTITY_SHUNT',
    label: 'Identity Shunt',
    description: 'Re-education Loop',
    color: '#f59e0b',
  },
  {
    action: 'FRICTION_INTERCEPT',
    label: 'Friction Intercept',
    description: 'Friction Intercept',
    color: '#ef4444',
  },
]

export default function DMNRouter({ route }: DMNRouterProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6">
      <h3 className="font-medium text-white mb-4">DMN Decision Router</h3>
      <div className="space-y-1">
        {ROUTES.map(r => {
          const isActive = route.action === r.action
          return (
            <motion.div
              key={r.action}
              layout
              className="relative rounded-lg px-4 py-3 transition-colors"
              style={{
                borderLeft: isActive ? `2px solid ${r.color}` : '2px solid transparent',
                backgroundColor: isActive ? `${r.color}0d` : 'transparent',
              }}
            >
              <div className="flex items-center gap-3">
                {/* Status dot */}
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={
                    isActive
                      ? {
                          backgroundColor: r.color,
                          boxShadow: `0 0 8px ${r.color}80`,
                        }
                      : {
                          border: `1.5px solid ${r.color}60`,
                          backgroundColor: 'transparent',
                        }
                  }
                />

                {/* Route name */}
                <span
                  className={`text-sm font-mono ${isActive ? 'text-white' : 'text-[#52525b]'}`}
                >
                  {r.label}
                </span>

                {/* Confidence badge */}
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto text-xs font-mono rounded px-2 py-0.5"
                    style={{
                      backgroundColor: `${r.color}20`,
                      color: r.color,
                    }}
                  >
                    {(route.confidence * 100).toFixed(0)}%
                  </motion.span>
                )}
              </div>

              {/* Active description */}
              {isActive && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-[#a1a1aa] mt-1 ml-[22px]"
                >
                  {route.description}
                </motion.p>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
