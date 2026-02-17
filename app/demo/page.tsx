'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } }
}

// Simulated scoring animation
function ScoringDemo() {
  const [step, setStep] = useState(0)
  const [scoring, setScoring] = useState(false)

  const runDemo = () => {
    setScoring(true)
    setStep(0)
    const steps = [1, 2, 3, 4, 5]
    steps.forEach((s, i) => {
      setTimeout(() => setStep(s), (i + 1) * 800)
    })
    setTimeout(() => setScoring(false), 5000)
  }

  return (
    <div className="card rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#27272a]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]/80"></div>
          <div className="w-3 h-3 rounded-full bg-[#eab308]/80"></div>
          <div className="w-3 h-3 rounded-full bg-[#22c55e]/80"></div>
        </div>
        <span className="ml-4 text-xs text-[#52525b] font-mono">circuitos — live scoring demo</span>
      </div>
      <div className="p-6 font-mono text-sm space-y-3 min-h-[320px]">
        {step === 0 && !scoring && (
          <div className="flex flex-col items-center justify-center h-[280px] gap-4">
            <p className="text-[#a1a1aa] text-center text-base font-sans">See how CircuitOS scores a lead in real-time</p>
            <button
              onClick={runDemo}
              className="btn-primary text-white px-6 py-3 rounded-lg font-semibold font-sans"
            >
              Run Scoring Demo
            </button>
          </div>
        )}

        {(scoring || step > 0) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-400">
              &#62; Ingesting lead...
            </motion.div>
            {step >= 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-[#52525b]">[ingest]</span>
                <span className="text-green-400 ml-2">Lead received from web form</span>
              </motion.div>
            )}
            {step >= 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-[#52525b]">[enrich]</span>
                <span className="text-[#a1a1aa] ml-2">6 sources queried... web presence verified</span>
              </motion.div>
            )}
            {step >= 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-[#52525b]">[score]</span>
                <span className="text-[#a1a1aa] ml-2">72 signals evaluated</span>
                <div className="pl-6 mt-1 text-xs space-y-1">
                  <div><span className="text-blue-400">composite_score:</span> <span className="text-green-400">82.6</span></div>
                  <div><span className="text-blue-400">tier:</span> <span className="text-green-400">HIGH</span></div>
                  <div><span className="text-blue-400">confidence:</span> <span className="text-green-400">0.89</span></div>
                </div>
              </motion.div>
            )}
            {step >= 4 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-[#52525b]">[route]</span>
                <span className="text-[#a1a1aa] ml-2">Action: generate personalized email sequence</span>
              </motion.div>
            )}
            {step >= 5 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-[#52525b]">[govern]</span>
                <span className="text-yellow-400 ml-2">PENDING_REVIEW</span>
                <span className="text-[#52525b] ml-2">&#8212; awaiting your approval</span>
                <div className="mt-4 pt-4 border-t border-[#27272a] text-[#a1a1aa] font-sans text-sm">
                  Nothing sends without your sign-off. Every action logged. Full audit trail.
                </div>
              </motion.div>
            )}
            {scoring && step < 5 && (
              <div className="flex items-center gap-2 text-[#52525b]">
                <span className="animate-pulse">&#9679;</span> Processing...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Content pipeline demo
function ContentDemo() {
  return (
    <div className="card rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#27272a]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]/80"></div>
          <div className="w-3 h-3 rounded-full bg-[#eab308]/80"></div>
          <div className="w-3 h-3 rounded-full bg-[#22c55e]/80"></div>
        </div>
        <span className="ml-4 text-xs text-[#52525b] font-mono">content intelligence — pipeline</span>
      </div>
      <div className="p-6 font-mono text-sm space-y-4">
        <div>
          <span className="text-blue-400">[generate]</span>
          <span className="text-[#a1a1aa] ml-2">AI writes blog post from topic recommendation</span>
        </div>
        <div>
          <span className="text-blue-400">[verify]</span>
          <span className="text-[#a1a1aa] ml-2">Fact-checker validates 12 claims against 5+ sources</span>
        </div>
        <div>
          <span className="text-blue-400">[score]</span>
          <span className="text-[#a1a1aa] ml-2">Proprietary multi-model evaluation</span>
          <div className="pl-6 mt-1 text-xs space-y-1">
            <div><span className="text-green-400">readability_model:</span> 0.82</div>
            <div><span className="text-green-400">uniqueness_model:</span> 0.75</div>
            <div><span className="text-green-400">brand_voice_model:</span> 0.91</div>
          </div>
        </div>
        <div>
          <span className="text-blue-400">[infer]</span>
          <span className="text-[#a1a1aa] ml-2">Multi-model evaluation &#8594; composite score &#8594; tier assignment</span>
        </div>
        <div>
          <span className="text-blue-400">[distribute]</span>
          <span className="text-[#a1a1aa] ml-2">Blog &#8594; 4 social channels (pending your approval)</span>
        </div>
        <div>
          <span className="text-blue-400">[learn]</span>
          <span className="text-[#a1a1aa] ml-2">Engagement data feeds back &#8594; inference model updates</span>
        </div>
        <div className="pt-4 border-t border-[#27272a] text-[#a1a1aa] font-sans text-sm">
          Every piece of content goes through source verification, fact-checking, multi-AI scoring, and governance gates before publication.
        </div>
      </div>
    </div>
  )
}

// Before/After comparison
function BeforeAfter() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card rounded-xl p-8">
        <h3 className="text-lg font-semibold mb-4 text-red-400">Without CircuitOS</h3>
        <ul className="space-y-3 text-[#a1a1aa] text-sm">
          <li className="flex items-start gap-3">
            <span className="text-red-500 mt-0.5">&#10005;</span>
            Manual lead qualification takes 2-4 hours per prospect
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-500 mt-0.5">&#10005;</span>
            Content creation: 2 weeks from idea to publish
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-500 mt-0.5">&#10005;</span>
            No feedback loop. Can't explain what works
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-500 mt-0.5">&#10005;</span>
            Each vertical needs separate tools and processes
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-500 mt-0.5">&#10005;</span>
            Email campaigns based on gut feeling
          </li>
        </ul>
      </div>
      <div className="card rounded-xl p-8 border-blue-500/30 bg-blue-500/5">
        <h3 className="text-lg font-semibold mb-4 text-blue-400">With CircuitOS</h3>
        <ul className="space-y-3 text-[#a1a1aa] text-sm">
          <li className="flex items-start gap-3">
            <span className="text-blue-500 mt-0.5">&#10003;</span>
            Every lead scored automatically across 72+ signals
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 mt-0.5">&#10003;</span>
            AI generates, fact-checks, and scores content same day
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 mt-0.5">&#10003;</span>
            Closed-loop learning. Model improves with every outcome
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 mt-0.5">&#10003;</span>
            One platform serves all verticals with isolated infrastructure
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 mt-0.5">&#10003;</span>
            AI writes emails in your brand voice. You approve before send
          </li>
        </ul>
      </div>
    </div>
  )
}

export default function DemoPage() {
  return (
    <main className="min-h-screen grid-bg">
      <Nav />

      {/* Demo Hero */}
      <section className="pt-36 pb-16 px-8 sm:px-12 md:px-6 hero-glow">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-6 hero-headline"
          >
            See it in action
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-[#a1a1aa] max-w-2xl mx-auto leading-[1.6]"
          >
            Walk through the two core pipelines: lead scoring and content intelligence.
            Everything you see here runs in production across 6 active verticals.
          </motion.p>
        </motion.div>
      </section>

      {/* Scoring Demo */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Lead Scoring Pipeline</h2>
            <p className="text-[#a1a1aa]">Watch how a lead flows through enrichment, scoring, routing, and governance in real-time.</p>
          </motion.div>
          <ScoringDemo />
        </div>
      </section>

      {/* Content Demo */}
      <section className="px-6 pb-20 border-t border-[#27272a] pt-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Content Intelligence Pipeline</h2>
            <p className="text-[#a1a1aa]">From AI generation through multi-model quality assurance to GA4 feedback. The system writes, verifies, scores, and learns.</p>
          </motion.div>
          <ContentDemo />
        </div>
      </section>

      {/* Before/After */}
      <section className="px-6 pb-20 border-t border-[#27272a] pt-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">The difference</h2>
          </motion.div>
          <BeforeAfter />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 border-t border-[#27272a] pt-20">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for a personalized walkthrough?</h2>
            <p className="text-[#a1a1aa] mb-8 text-lg">
              We'll configure a demo around your vertical, your ICPs, and your content strategy.
            </p>
            <a href="/#contact" className="inline-block px-8 py-4 btn-primary text-white rounded-lg font-semibold text-lg">
              Request Your Demo
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
