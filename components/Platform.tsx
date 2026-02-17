'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

const cards = [
  {
    title: 'Predictive Scoring',
    desc: 'Your ICP, qualification criteria, and demand patterns pre-configured before launch. Every lead scored against your definition of qualified.',
  },
  {
    title: 'Autonomous Outreach',
    desc: 'From first touch to booked call. Personalized emails that match your brand voice. Nothing ships without your sign-off.',
  },
  {
    title: 'Content Intelligence',
    desc: 'Content generated, scored, and optimized across blog, social, and email. Multi-model quality evaluation before publish. Real engagement data feeds back to improve every next piece.',
  },
  {
    title: 'Multi-Vertical',
    desc: 'One platform serves your entire portfolio. Isolated infrastructure per client. Shared intelligence. Each business gets its own scoring model, templates, and CRM routing.',
  },
]

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
          <span className="ml-4 text-xs text-[#52525b] font-mono">circuitos — content intelligence pipeline</span>
        </div>
        <div className="p-6 font-mono text-sm space-y-2 min-h-[300px]">
          {isInView && visibleSteps === 0 && (
            <div className="flex items-center gap-2 text-[#52525b]">
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
                <span className="text-[#52525b] flex-shrink-0">[{step.label}]</span>
                <span className={step.color}>{step.text}</span>
              </motion.div>
            )
          })}
          {visibleSteps > 0 && visibleSteps < pipelineSteps.length && (
            <div className="flex items-center gap-2 text-[#52525b]">
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
        <div className="grid md:grid-cols-2 gap-16 md:gap-20 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-[-0.02em]">The problem with revenue operations</h2>
            <ul className="space-y-4 text-[#a1a1aa]">
              {[
                'Leads pile up. Your team cherry-picks. Good prospects slip through.',
                'Content takes weeks to produce and you have no idea if it will perform.',
                'Every tool is a silo. CRM doesn\'t talk to email doesn\'t talk to analytics.',
                'You can\'t explain why one campaign worked and another didn\'t.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-red-500 mt-0.5 text-lg flex-shrink-0">&#10005;</span>
                  <span className="text-base sm:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-[-0.02em]">CircuitOS closes the loop</h2>
            <ul className="space-y-4 text-[#a1a1aa]">
              {[
                'Predictable lead qualification. Every lead scored against pre-defined criteria and routed automatically. No cherry-picking.',
                'Content generated, scored for performance, and refined from real engagement data.',
                'One system. Scoring, outreach, content, CRM, and analytics in a single pipeline.',
                'Full audit trail on every decision. You know exactly what worked and why.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-blue-500 mt-0.5 text-lg flex-shrink-0">&#10003;</span>
                  <span className="text-base sm:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeInUp}
              className="card rounded-xl p-8"
            >
              <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
              <p className="text-[#a1a1aa] leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Pipeline Terminal */}
        <ContentPipelineTerminal />
      </div>
    </section>
  )
}
