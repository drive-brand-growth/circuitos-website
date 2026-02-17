'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

const steps = [
  {
    step: '01',
    title: 'Ingest',
    desc: 'Leads flow in from forms, CSV imports, CRM sync, or webhooks. Content ideas queue from AI recommendations.',
    code: [
      { label: 'source', text: 'web_form', color: 'text-green-400' },
      { label: 'type', text: 'inbound_lead', color: 'text-green-400' },
      { label: 'fields', text: '12 captured', color: 'text-blue-400' },
      { label: 'status', text: 'queued_for_scoring', color: 'text-yellow-400' },
    ],
  },
  {
    step: '02',
    title: 'Score',
    desc: 'A pre-calibrated model evaluates fit, intent, and timing across 72+ signals. The system ships with vertical-specific logic, so scoring is intelligent from day one.',
    code: [
      { label: 'priors', text: 'pre-calibrated', color: 'text-green-400' },
      { label: 'signals', text: '72 evaluated', color: 'text-blue-400' },
      { label: 'composite', text: '87.4', color: 'text-green-400' },
      { label: 'confidence', text: '0.91', color: 'text-green-400' },
      { label: 'tier', text: 'HIGH', color: 'text-green-400' },
    ],
  },
  {
    step: '03',
    title: 'Route',
    desc: 'High-scoring leads tier into automated sequences. Content distributes across platforms. Right message, right channel, right time.',
    code: [
      { label: 'action', text: 'email_sequence', color: 'text-green-400' },
      { label: 'template', text: 'high_intent_v3', color: 'text-blue-400' },
      { label: 'channel', text: 'instantly_ai', color: 'text-[#a1a1aa]' },
      { label: 'priority', text: '1', color: 'text-yellow-400' },
    ],
  },
  {
    step: '04',
    title: 'Engage',
    desc: 'AI writes personalized emails in your brand voice with human approval gates on every action. Nothing sends without your sign-off.',
    code: [
      { label: 'email', text: 'generated', color: 'text-green-400' },
      { label: 'voice', text: 'brand_match: 0.94', color: 'text-green-400' },
      { label: 'govern', text: 'PENDING_REVIEW', color: 'text-yellow-400' },
      { label: 'audit', text: 'logged', color: 'text-blue-400' },
    ],
  },
  {
    step: '05',
    title: 'Learn',
    desc: 'Every outcome feeds back into the model. GA4 engagement data updates scoring automatically, so the system gets more accurate with every cycle.',
    code: [
      { label: 'outcome', text: 'meeting_booked', color: 'text-green-400' },
      { label: 'feedback', text: 'positive', color: 'text-green-400' },
      { label: 'priors', text: 'updated', color: 'text-blue-400' },
      { label: 'accuracy', text: '+0.3%', color: 'text-green-400' },
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
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">How it works</h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-lg leading-[1.6]">
            A self-improving pipeline that scores leads, routes outreach, and refines itself with every outcome.
          </p>
        </motion.div>

        {/* Pre-configuration callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 card rounded-xl p-8 border-blue-500/20 bg-blue-500/5"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <span className="text-sm text-blue-500 font-mono font-semibold">00</span>
              <h3 className="text-xl font-semibold mt-1">Configure</h3>
            </div>
            <div className="flex-1">
              <p className="text-[#a1a1aa] leading-relaxed">
                Before anything runs, we define your ideal customer, set up qualification criteria, and configure the decision logic for your vertical.
                The system knows what a good lead looks like before it processes a single one.
              </p>
            </div>
            <div className="flex-shrink-0 hidden md:flex flex-col gap-2 text-xs font-mono">
              <div><span className="text-[#71717a]">icp:</span> <span className="text-green-400">encoded</span></div>
              <div><span className="text-[#71717a]">decision_logic:</span> <span className="text-green-400">configured</span></div>
              <div><span className="text-[#71717a]">priors:</span> <span className="text-green-400">calibrated</span></div>
              <div><span className="text-[#71717a]">status:</span> <span className="text-blue-400">ready</span></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-5 gap-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              variants={fadeInUp}
              className="card rounded-xl p-6 relative cursor-pointer"
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
              <h3 className="text-lg font-semibold mt-2 mb-2">{item.title}</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">{item.desc}</p>
              <StepCode code={item.code} isVisible={activeStep === i} />
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[#3f3f46] text-lg">&#8250;</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
