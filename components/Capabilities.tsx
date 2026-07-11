'use client'

import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.12 } }
}

const capabilities = [
  {
    title: 'Calibrated win-probability scoring',
    desc: 'Every deal gets a calibrated probability it closes, with the confidence tier and the signals behind it. You see the conviction and the reasoning, never a magic number with no explanation.',
  },
  {
    title: 'Deal risk before the slip',
    desc: 'Red flags surface on a deal before it slips, not after the loss. The system watches activity, timing, and engagement and tells you which deals need attention now.',
  },
  {
    title: 'Attribution you can defend',
    desc: 'Credit the touchpoints that moved revenue, not last-click folklore. Know what to fund and what to cut.',
  },
  {
    title: 'Proof of decision quality',
    desc: 'After the outcome, every decision is scored for whether its confidence was honest: proof the call was sound independent of luck. The one thing a black-box recommendation can never give you.',
  },
]

export default function Capabilities() {
  return (
    <section id="capabilities" className="section-padding px-6 border-t border-[#27272a]">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-[-0.02em]"
        >
          What you get
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#a1a1aa] text-center mb-16 text-lg max-w-2xl mx-auto"
        >
          Four capabilities that work together as one governed decision loop, not six tools duct-taped together.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {capabilities.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="card rounded-xl p-8"
            >
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-[#a1a1aa] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[#71717a] mt-10 max-w-2xl mx-auto"
        >
          Optional modules: governed outreach, content with fact-check gates, and social
          distribution. Available on Scale and Enterprise, or as add-ons.
        </motion.p>
      </div>
    </section>
  )
}
