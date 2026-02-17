'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const metrics = [
  { value: '847', label: 'Leads Scored', trend: '+12%' },
  { value: '73%', label: 'Route Rate', trend: '+4%' },
  { value: '12', label: 'Active Sequences', trend: '' },
  { value: '0.91', label: 'Model Confidence', trend: '+0.03' },
]

const leads = [
  { name: 'Sarah Chen', company: 'Apex Digital', score: 92.4, tier: 'HIGH', action: 'Routed to Rep', tierColor: 'text-green-400', actionColor: 'text-green-400' },
  { name: 'Marcus Webb', company: 'Rivera & Co', score: 87.1, tier: 'HIGH', action: 'Email Queued', tierColor: 'text-green-400', actionColor: 'text-blue-400' },
  { name: 'Lisa Park', company: 'Summit Health', score: 76.3, tier: 'MEDIUM', action: 'Scoring...', tierColor: 'text-yellow-400', actionColor: 'text-yellow-400', active: true },
  { name: 'James Torres', company: 'BlueLine Mfg', score: 64.8, tier: 'MEDIUM', action: 'Enriching', tierColor: 'text-yellow-400', actionColor: 'text-[#a1a1aa]' },
  { name: 'Alex Kim', company: 'NovaPoint Inc', score: 41.2, tier: 'LOW', action: 'Nurture', tierColor: 'text-red-400', actionColor: 'text-[#a1a1aa]' },
]

export default function DashboardPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="max-w-4xl mx-auto mt-16"
    >
      <div className="rounded-xl overflow-hidden border border-[#27272a] bg-[#0a0a0a] glow">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[#27272a] bg-[#111]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]/80"></div>
            <div className="w-3 h-3 rounded-full bg-[#eab308]/80"></div>
            <div className="w-3 h-3 rounded-full bg-[#22c55e]/80"></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="bg-[#1a1a1a] rounded-md px-4 py-1.5 text-xs text-[#71717a] max-w-md">
              app.usecircuitos.com/dashboard/scoring
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            {/* App header */}
            <div className="px-6 py-3 border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-semibold text-sm">//</span>
                <span className="text-white font-semibold text-sm">CircuitOS</span>
                <span className="text-[#27272a] mx-2">|</span>
                <span className="text-[#71717a] text-sm">Lead Scoring</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#71717a]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  All systems operational
                </span>
              </div>
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-4 border-b border-[#27272a]">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  className="px-6 py-4 border-r border-[#27272a] last:border-r-0"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">{m.value}</span>
                    {m.trend && <span className="text-[10px] text-green-400">{m.trend}</span>}
                  </div>
                  <span className="text-[11px] text-[#71717a]">{m.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Lead table */}
            <div className="px-6 py-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#a1a1aa]">Recent Leads</span>
                <span className="text-[11px] text-[#71717a]">Updated 2m ago</span>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 text-[11px] text-[#71717a] uppercase tracking-wider pb-2 border-b border-[#27272a]">
                <div className="col-span-3">Name</div>
                <div className="col-span-3">Company</div>
                <div className="col-span-2 text-right">Score</div>
                <div className="col-span-2 text-center">Tier</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              {/* Table rows */}
              {leads.map((lead, i) => (
                <motion.div
                  key={lead.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                  className="grid grid-cols-12 gap-2 py-2.5 text-sm border-b border-[#27272a]/50 items-center"
                >
                  <div className="col-span-3 text-white flex items-center gap-2">
                    {lead.active ? (
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse flex-shrink-0"></span>
                    ) : (
                      <span className="w-1.5 h-1.5 flex-shrink-0"></span>
                    )}
                    <span>{lead.name}</span>
                  </div>
                  <div className="col-span-3 text-[#a1a1aa]">{lead.company}</div>
                  <div className="col-span-2 text-right font-mono text-white">{lead.score}</div>
                  <div className="col-span-2 text-center">
                    <span className={`${lead.tierColor} text-xs font-semibold px-2 py-0.5 rounded bg-white/5`}>
                      {lead.tier}
                    </span>
                  </div>
                  <div className={`col-span-2 text-right text-xs ${lead.actionColor}`}>{lead.action}</div>
                </motion.div>
              ))}
            </div>

            {/* Bottom status bar */}
            <div className="px-6 py-2.5 border-t border-[#27272a] flex items-center justify-between text-[11px] text-[#71717a]">
              <span>72 signals · ICP-configured · Decision logic active</span>
              <span>Model v3.2 · Last calibration: 2h ago</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
