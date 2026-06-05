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
    title: 'Observe',
    headline: 'Ingest every signal that matters',
    desc: 'Pipeline data, attribution touchpoints, deal activity, and market context flow in continuously from your CRM, analytics, and engagement sources. The full picture, in one place, before a decision is made.',
    code: [
      { label: 'sources', text: 'CRM · attribution · GA4', color: 'text-blue-400' },
      { label: 'signals', text: 'fit · intent · timing', color: 'text-[#a1a1aa]' },
      { label: 'context', text: 'pipeline + market', color: 'text-[#a1a1aa]' },
      { label: 'status', text: 'INGESTED', color: 'text-green-400' },
    ],
  },
  {
    step: '02',
    title: 'Decide',
    headline: 'A calibrated probability, not a black-box guess',
    desc: 'Every decision gets a calibrated probability and a confidence tier — the likelihood a deal closes, governed by rules. You see the conviction and the signals behind it, never a number with no explanation.',
    code: [
      { label: 'win_probability', text: '0.784', color: 'text-green-400' },
      { label: 'confidence', text: 'tier B', color: 'text-green-400' },
      { label: 'governed', text: 'rules, not guesses', color: 'text-blue-400' },
      { label: 'explainable', text: 'signals shown', color: 'text-[#a1a1aa]' },
    ],
  },
  {
    step: '03',
    title: 'Act',
    headline: 'Autonomous when confident, human when not',
    desc: 'Confidence mapped to risk class determines what runs and what escalates. A low-risk action at 65% executes; a high-risk one at 88% still routes to a person. Every action taken with full parameter logging.',
    code: [
      { label: 'action', text: 'EXECUTE', color: 'text-green-400' },
      { label: 'risk_class', text: 'MEDIUM', color: 'text-blue-400' },
      { label: 'escalation', text: 'rules-based', color: 'text-[#a1a1aa]' },
      { label: 'logged', text: 'full parameters', color: 'text-[#a1a1aa]' },
    ],
  },
  {
    step: '04',
    title: 'Prove',
    headline: 'Proof the decision was sound — before the outcome',
    desc: 'After the result, the decision is scored for whether its confidence was honest — proof of decision quality independent of outcome luck — and written to a signed, tamper-evident audit trail. Outcomes feed back to sharpen the next call.',
    code: [
      { label: 'decision_quality', text: 'calibrated', color: 'text-green-400' },
      { label: 'audit', text: 'SIGNED', color: 'text-green-400' },
      { label: 'retention', text: 'indefinite', color: 'text-[#a1a1aa]' },
      { label: 'feedback', text: 'closed-loop', color: 'text-blue-400' },
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">Observe. Decide. Act. Prove.</h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-lg leading-[1.6]">
            The Circuit Method — the four-move loop every decision runs. Calibrated, governed, and proven on a signed audit trail.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
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
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#3f3f46] text-xl">&#8250;</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
