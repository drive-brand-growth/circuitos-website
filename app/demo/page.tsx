'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://usecircuitos.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Demo',
      item: 'https://usecircuitos.com/demo',
    },
  ],
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } }
}

// Demo request form (primary conversion)
function DemoForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')

    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormStatus('success')
      } else {
        setFormStatus('error')
      }
    } catch {
      window.location.href = `mailto:noel@drivebrandgrowth.com?subject=Demo Request from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nPhone: ${formData.phone}`)}`
      setFormStatus('success')
    }
  }

  return (
    <div className="card rounded-xl p-8">
      <h3 className="text-2xl font-semibold mb-2">Book a Demo</h3>
      <p className="text-sm text-[#a1a1aa] mb-6">30-minute personalized walkthrough</p>
      {formStatus === 'success' ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-400 text-3xl">&#10003;</span>
          </div>
          <h4 className="text-xl font-semibold mb-2">Thanks for reaching out!</h4>
          <p className="text-[#a1a1aa]">We&apos;ll be in touch within 24 hours to schedule your demo.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#a1a1aa] mb-1.5">Name</label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#71717a] focus:outline-none focus:border-blue-500/50"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#a1a1aa] mb-1.5">Work Email</label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#71717a] focus:outline-none focus:border-blue-500/50"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-[#a1a1aa] mb-1.5">Company</label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#71717a] focus:outline-none focus:border-blue-500/50"
              placeholder="Your company"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#a1a1aa] mb-1.5">Phone <span className="text-[#71717a]">(optional)</span></label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#71717a] focus:outline-none focus:border-blue-500/50"
              placeholder="(555) 123-4567"
            />
          </div>
          <button
            type="submit"
            disabled={formStatus === 'submitting'}
            className="w-full py-4 btn-primary text-white rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formStatus === 'submitting' ? 'Sending...' : 'Book a Demo'}
          </button>
          {formStatus === 'error' && (
            <p className="text-red-400 text-sm text-center">Something went wrong. Please try again or email noel@drivebrandgrowth.com</p>
          )}
          <p className="text-xs text-[#71717a] text-center">No commitment required. We&apos;ll reach out within 24 hours.</p>
        </form>
      )}
    </div>
  )
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
        <span className="ml-4 text-xs text-[#71717a] font-mono">circuitos — live scoring demo</span>
      </div>
      <div className="p-6 font-mono text-sm space-y-3 min-h-[320px]">
        {step === 0 && !scoring && (
          <div className="flex flex-col items-center justify-center h-[280px] gap-4">
            <p className="text-[#a1a1aa] text-center text-base font-sans">See how a lead gets scored in real-time</p>
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
                <span className="text-[#71717a]">[model]</span>
                <span className="text-green-400 ml-2">ICP encoded · Decision logic loaded · Qualification criteria active</span>
              </motion.div>
            )}
            {step >= 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-[#71717a]">[ingest]</span>
                <span className="text-green-400 ml-2">Lead received from web form</span>
              </motion.div>
            )}
            {step >= 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-[#71717a]">[enrich]</span>
                <span className="text-[#a1a1aa] ml-2">6 sources queried... web presence verified</span>
              </motion.div>
            )}
            {step >= 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-[#71717a]">[score]</span>
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
                <span className="text-[#71717a]">[route]</span>
                <span className="text-[#a1a1aa] ml-2">Action: generate personalized email sequence</span>
              </motion.div>
            )}
            {step >= 5 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-[#71717a]">[govern]</span>
                <span className="text-yellow-400 ml-2">PENDING_REVIEW</span>
                <span className="text-[#71717a] ml-2">&#8212; awaiting your approval</span>
                <div className="mt-4 pt-4 border-t border-[#27272a] text-[#a1a1aa] font-sans text-sm flex items-center justify-between">
                  <span>Nothing sends without your sign-off. Every action logged.</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); runDemo(); }}
                    className="ml-4 text-xs text-blue-400 hover:text-blue-300 font-medium flex-shrink-0"
                  >
                    Run again
                  </button>
                </div>
              </motion.div>
            )}
            {scoring && step < 5 && (
              <div className="flex items-center gap-2 text-[#71717a]">
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
        <span className="ml-4 text-xs text-[#71717a] font-mono">content intelligence — pipeline</span>
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
            Leads pile up. No way to know who&apos;s qualified
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-500 mt-0.5">&#10005;</span>
            Most tools need weeks of data before scoring is useful
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-500 mt-0.5">&#10005;</span>
            Content creation: 2 weeks from idea to publish
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-500 mt-0.5">&#10005;</span>
            No feedback loop. Can&apos;t explain what works
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
            Pre-configured scoring. Qualified leads identified from day one
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 mt-0.5">&#10003;</span>
            Every lead scored against your criteria instantly
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 mt-0.5">&#10003;</span>
            AI generates, fact-checks, and scores content same day
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 mt-0.5">&#10003;</span>
            Closed-loop learning. Every outcome improves the next prediction
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 mt-0.5">&#10003;</span>
            Emails written in your brand voice. You approve before send
          </li>
        </ul>
      </div>
    </div>
  )
}

export default function DemoPage() {
  return (
    <main className="min-h-screen grid-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Nav />

      {/* Demo Hero — Form + Scoring Demo side by side */}
      <section className="pt-36 pb-20 px-6 hero-glow">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-6 hero-headline">
              See it in action
            </h1>
            <p className="text-lg sm:text-xl text-[#a1a1aa] max-w-2xl mx-auto leading-[1.6]">
              Schedule a personalized walkthrough of the full pipeline with your business context.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid lg:grid-cols-2 gap-8 items-start">
            <DemoForm />
            <ScoringDemo />
          </motion.div>
        </motion.div>
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

      {/* Bottom CTA — repeats the form */}
      <section className="px-6 pb-20 border-t border-[#27272a] pt-20">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-[#a1a1aa] text-lg">
              We&apos;ll configure a system around your vertical, your ICPs, and your qualification criteria.
            </p>
          </motion.div>
          <DemoForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
