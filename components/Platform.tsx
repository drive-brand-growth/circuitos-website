'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// Animated decision pipeline terminal — the Circuit Method running on one deal
const pipelineSteps = [
  { label: 'observe', text: 'Deal: "Acme Corp — Q3 renewal · $48k"', color: 'text-blue-400' },
  { label: 'observe', text: 'Ingesting pipeline + attribution + activity signals...', color: 'text-[#a1a1aa]' },
  { label: 'decide', text: 'win_probability: 0.78 → confidence tier B', color: 'text-green-400' },
  { label: 'decide', text: 'attribution: 3 touchpoints credited → paid search led', color: 'text-green-400' },
  { label: 'decide', text: 'deal_risk: LOW — no red flags', color: 'text-green-400' },
  { label: 'act', text: 'Recommended: advance to proposal, draft follow-up', color: 'text-blue-400' },
  { label: 'govern', text: 'risk_class MEDIUM → human approval gate: PASSED', color: 'text-yellow-400' },
  { label: 'act', text: 'Action executed within governed rules', color: 'text-[#a1a1aa]' },
  { label: 'prove', text: 'Decision scored for calibration → confidence honest', color: 'text-green-400' },
  { label: 'prove', text: 'Signed audit entry written — tamper-evident, retained', color: 'text-[#a1a1aa]' },
]

function ContentPipelineTerminal() {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const startedRef = useRef(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView || startedRef.current) return
    startedRef.current = true
    let current = 0
    const showNext = () => {
      current++
      setVisibleSteps(current)
      if (current < pipelineSteps.length) {
        setTimeout(showNext, 400 + Math.random() * 200)
      }
    }
    setTimeout(showNext, 800)
  }, [isInView])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-12"
    >
      <div className="code-block rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#27272a]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]/80"></div>
            <div className="w-3 h-3 rounded-full bg-[#eab308]/80"></div>
            <div className="w-3 h-3 rounded-full bg-[#22c55e]/80"></div>
          </div>
          <span className="ml-4 text-xs text-[#71717a] font-mono">circuitos pro — decision pipeline</span>
        </div>
        <div className="p-6 font-mono text-sm space-y-2 min-h-[300px]">
          {isInView && visibleSteps === 0 && (
            <div className="flex items-center gap-2 text-[#71717a]">
              <span className="animate-pulse">&#9679;</span> Initializing pipeline...
            </div>
          )}
          {pipelineSteps.map((step, i) => {
            if (i >= visibleSteps) return null
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2"
              >
                <span className="text-[#71717a] flex-shrink-0">[{step.label}]</span>
                <span className={step.color}>{step.text}</span>
              </motion.div>
            )
          })}
          {visibleSteps > 0 && visibleSteps < pipelineSteps.length && (
            <div className="flex items-center gap-2 text-[#71717a]">
              <span className="animate-pulse">&#9679;</span> Processing...
            </div>
          )}
          {visibleSteps >= pipelineSteps.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 pt-4 border-t border-[#27272a] text-[#a1a1aa] font-sans text-sm"
            >
              Every decision runs the same loop — observe the signals, decide with calibrated confidence, act within governed rules, and prove the call was sound on a signed audit trail.
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Platform() {
  return (
    <section id="platform" className="section-padding px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">One decision, start to finish</h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-lg leading-[1.6]">
            From raw signals through a calibrated call, a governed action, and a signed proof — watch a single decision run in production.
          </p>
        </motion.div>

        <ContentPipelineTerminal />
      </div>
    </section>
  )
}
