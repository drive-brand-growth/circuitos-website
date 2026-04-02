'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } }
}

const steps = [
  {
    step: '01',
    title: 'Score',
    headline: 'Every lead evaluated in seconds',
    desc: 'A pre-calibrated Bayesian model evaluates fit, intent, and timing across 72+ signals. Your ICP encoded before launch — no training period, no cold start. You see the conviction score and every signal that produced it.',
    code: [
      { label: 'signals', text: '72 evaluated', color: 'text-blue-400' },
      { label: 'conviction', text: '0.784', color: 'text-green-400' },
      { label: 'tier', text: 'B — HIGH PRIORITY', color: 'text-green-400' },
      { label: 'latency', text: '0.8s', color: 'text-[#a1a1aa]' },
    ],
  },
  {
    step: '02',
    title: 'Decide',
    headline: 'Autonomous when confident, human when not',
    desc: 'Confidence thresholds mapped to risk classes determine what executes and what escalates. A low-risk action at 65% confidence runs autonomously. A high-risk action at 88% still escalates. Every action governed by rules, not guesses.',
    code: [
      { label: 'confidence', text: '78.4% > threshold 78.0%', color: 'text-green-400' },
      { label: 'decision', text: 'EXECUTE', color: 'text-green-400' },
      { label: 'risk_class', text: 'MEDIUM', color: 'text-blue-400' },
      { label: 'outreach', text: 'personalized, brand voice', color: 'text-[#a1a1aa]' },
    ],
  },
  {
    step: '03',
    title: 'Prove',
    headline: 'Full audit trail on every decision',
    desc: 'Every score, gate evaluation, and routing decision logged to a searchable decision trail with indefinite retention. If it happened, you can trace why. Outcomes feed back to refine the next prediction.',
    code: [
      { label: 'trail', text: 'decision → action → outcome', color: 'text-blue-400' },
      { label: 'audit', text: 'COMPLETE', color: 'text-green-400' },
      { label: 'retention', text: 'indefinite', color: 'text-[#a1a1aa]' },
      { label: 'feedback', text: 'GA4 closed-loop', color: 'text-green-400' },
    ],
  },
]

function StepCode({ code, isVisible }: { code: typeof steps[0]['code'], isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="mt-4 pt-3 border-t border-[#27272a] font-mono text-xs space-y-1.5">
            {code.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.2 }}
              >
                <span className="text-[#71717a]">{line.label}:</span>{' '}
                <span className={line.color}>{line.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <section id="how-it-works" className="section-padding px-6 border-t border-[#27272a]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">Score. Decide. Prove.</h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-lg leading-[1.6]">
            Three steps. Every lead scored, every action governed, every decision auditable.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              variants={fadeInUp}
              className="card rounded-xl p-8 relative cursor-pointer"
              tabIndex={0}
              role="button"
              aria-expanded={activeStep === i}
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
              onFocus={() => setActiveStep(i)}
              onBlur={() => setActiveStep(null)}
              onClick={() => setActiveStep(activeStep === i ? null : i)}
            >
              <span className="text-sm text-blue-500 font-mono font-semibold">{item.step}</span>
              <h3 className="text-xl font-bold mt-3 mb-1">{item.title}</h3>
              <p className="text-sm text-white/80 font-medium mb-3">{item.headline}</p>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">{item.desc}</p>
              <StepCode code={item.code} isVisible={activeStep === i} />
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#3f3f46] text-xl">&#8250;</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
