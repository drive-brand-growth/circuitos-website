'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// Animated content pipeline terminal
const pipelineSteps = [
  { label: 'generate', text: 'Topic: "Lead Nurturing Best Practices"', color: 'text-blue-400' },
  { label: 'generate', text: 'AI engine generating 1,200-word article...', color: 'text-[#a1a1aa]' },
  { label: 'verify', text: 'Fact-checker: 12 claims validated against 5 sources', color: 'text-green-400' },
  { label: 'score', text: 'readability_model: 0.84', color: 'text-green-400' },
  { label: 'score', text: 'uniqueness_model: 0.78', color: 'text-green-400' },
  { label: 'score', text: 'brand_voice_model: 0.92', color: 'text-green-400' },
  { label: 'infer', text: 'Multi-model evaluation → composite: 84.7 → Tier: HIGH', color: 'text-blue-400' },
  { label: 'distribute', text: 'Blog → 4 social channels queued', color: 'text-[#a1a1aa]' },
  { label: 'govern', text: 'Status: PENDING_REVIEW', color: 'text-yellow-400' },
  { label: 'learn', text: 'Feedback loop registered. Model update in 48h.', color: 'text-[#a1a1aa]' },
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
          <span className="ml-4 text-xs text-[#71717a] font-mono">circuitos — content intelligence pipeline</span>
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
              Every piece of content goes through source verification, fact-checking, multi-AI scoring, and governance gates before publication.
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">One pipeline, start to finish</h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-lg leading-[1.6]">
            From content generation through fact-checking, scoring, and distribution — watch what a single pipeline run looks like in production.
          </p>
        </motion.div>

        <ContentPipelineTerminal />
      </div>
    </section>
  )
}
