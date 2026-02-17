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

const problems = [
  {
    problem: 'Leads pile up and nobody knows which ones matter',
    solution: 'Predictive scoring, pre-configured to your ICP',
    desc: 'Your qualification criteria and demand patterns are encoded before launch. Every lead gets scored on fit, intent, and timing. Your team works the right prospects from day one.',
  },
  {
    problem: 'Outreach is either generic blasts or slow manual work',
    solution: 'Personalized sequences in your brand voice',
    desc: 'Emails written to match how your team actually talks. Each prospect gets a tailored sequence based on their score and profile. You review and approve before anything sends.',
  },
  {
    problem: 'Content takes weeks and you can\'t predict what will perform',
    solution: 'Generate, verify, score, and publish in hours',
    desc: 'Blog posts written, fact-checked against real sources, and scored for quality by multiple models. Social distribution across four channels. All before lunch, all with your sign-off.',
  },
  {
    problem: 'Every tool is a silo that doesn\'t talk to the others',
    solution: 'One system from lead to closed deal',
    desc: 'Scoring, outreach, content, CRM, and analytics in a single pipeline. No duct-taping five platforms together. One place to see what\'s working and why.',
  },
  {
    problem: 'Campaigns end and you can\'t explain what worked',
    solution: 'Every outcome makes the next prediction better',
    desc: 'Real engagement data feeds back into the model automatically. Open rates, reply rates, conversions, GA4 metrics. The system learns from every cycle so each one is more accurate than the last.',
  },
  {
    problem: 'You don\'t trust automation to act without oversight',
    solution: 'Nothing sends without your sign-off',
    desc: 'Every email, every blog post, every social update goes through approval gates. Confidence-based escalation routes edge cases to the right reviewer. Full audit trail on every decision.',
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
          Built to solve real problems
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#a1a1aa] text-center mb-16 text-lg max-w-2xl mx-auto"
        >
          Every feature exists because a real business had this exact problem
        </motion.p>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {problems.map((item) => (
            <motion.div
              key={item.problem}
              variants={fadeInUp}
              className="card rounded-xl p-8"
            >
              <p className="text-sm text-red-400 font-medium mb-3">{item.problem}</p>
              <h3 className="text-xl font-semibold mb-3">{item.solution}</h3>
              <p className="text-[#a1a1aa] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
