'use client'

import { motion } from 'framer-motion'

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
  },
  {
    step: '02',
    title: 'Score',
    desc: 'AI evaluates fit, intent, and timing across 72+ signals. Content gets pre-scored by three AI models for quality.',
  },
  {
    step: '03',
    title: 'Route',
    desc: 'Right message, right channel, right time. Leads tier into automated sequences. Content distributes across platforms.',
  },
  {
    step: '04',
    title: 'Engage',
    desc: 'Autonomous outreach with human approval gates. AI writes personalized emails in your brand voice. You approve before anything sends.',
  },
  {
    step: '05',
    title: 'Learn',
    desc: 'Every outcome feeds back into the model. GA4 engagement data updates scoring priors. The system gets more accurate with every cycle.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding px-6 border-t border-[#27272a]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">The closed loop</h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-lg leading-[1.6]">
            Score. Route. Engage. Learn. Repeat. Every cycle makes the next one better.
          </p>
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
              className="card rounded-xl p-6 relative"
            >
              <span className="text-sm text-blue-500 font-mono font-semibold">{item.step}</span>
              <h3 className="text-lg font-semibold mt-2 mb-2">{item.title}</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">{item.desc}</p>
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
