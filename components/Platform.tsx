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

const cards = [
  {
    title: 'Predictive Scoring',
    desc: 'Every lead scored by AI before your team touches it. Not rules. Not guesses. Intelligence that learns from every outcome and gets more accurate over time.',
  },
  {
    title: 'Autonomous Outreach',
    desc: 'From first touch to booked call. AI-generated emails that match your brand voice. Human approval gates ensure nothing ships without your sign-off.',
  },
  {
    title: 'Content Intelligence',
    desc: 'AI writes, scores, and optimizes your content across blog, social, and email. Three AI models evaluate quality before publish. Real engagement data feeds back to improve every next piece.',
  },
  {
    title: 'Multi-Vertical',
    desc: 'One platform serves your entire portfolio. Isolated infrastructure per client. Shared intelligence. Each business gets its own scoring model, templates, and CRM routing.',
  },
]

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
                'Every lead scored and routed automatically. No cherry-picking. No missed opportunities.',
                'AI generates content, scores it for performance, and learns from real engagement data.',
                'One platform connects scoring, outreach, content, CRM, and analytics into a single pipeline.',
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
      </div>
    </section>
  )
}
