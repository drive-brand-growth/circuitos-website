'use client'

import { motion } from 'framer-motion'
import { Zap, Brain, MessageCircle, Clock, CheckCircle2 } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  return (
    <main className="min-h-screen grid-bg">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="sr-only skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#27272a] bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <a href="/" className="flex items-center gap-2">
              <img src="/circuitos-icon.svg" alt="CircuitOS" className="h-8 w-8" />
              <span className="text-xl font-semibold tracking-tight">
                Circuit<span className="text-blue-500">OS</span>
              </span>
            </a>
            <div className="hidden md:flex items-center gap-8 text-sm text-[#a1a1aa]">
              <a href="#how-it-works" className="font-medium hover:text-white transition-colors">How it Works</a>
              <a href="#aria" className="font-medium hover:text-white transition-colors">Aria AI</a>
              <a href="#features" className="font-medium hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="font-medium hover:text-white transition-colors">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#contact" className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors">Contact</a>
            <a href="#demo" className="text-sm btn-primary text-white px-4 py-2 rounded-lg font-medium">
              Get Demo
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="main-content" className="pt-36 pb-24 px-8 sm:px-12 md:px-6 hero-glow">
        <motion.div
          className="max-w-4xl mx-auto text-center px-2 sm:px-0"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#27272a] bg-[#27272a]/30 text-sm text-[#a1a1aa] mb-8"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            50M+ decision capacity / month
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.02em] gradient-text mb-10 leading-[1.15]"
          >
            Lead intelligence<br />that doesn't guess
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-2xl text-[#a1a1aa] max-w-2xl mx-auto mb-10 leading-[1.6]"
          >
            Score leads in 15ms. Validate claims against social signals.
            Catch the liars before your sales team wastes time.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <a href="#demo" className="w-full sm:w-auto px-8 py-3.5 btn-primary text-white rounded-lg font-semibold text-base">
              Request Demo
            </a>
            <a href="#how-it-works" className="w-full sm:w-auto px-8 py-3.5 border border-[#27272a] rounded-lg font-semibold hover:bg-white/5 transition-colors text-base">
              See How It Works
            </a>
          </motion.div>
        </motion.div>

        {/* Code Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-3xl mx-auto mt-16"
        >
          <div className="code-block rounded-xl overflow-hidden glow">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[#27272a]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]/80"></div>
                <div className="w-3 h-3 rounded-full bg-[#eab308]/80"></div>
                <div className="w-3 h-3 rounded-full bg-[#22c55e]/80"></div>
              </div>
              <span className="ml-4 text-xs text-[#52525b]">Response — 15ms</span>
            </div>
            <pre className="p-6 text-sm overflow-x-auto leading-relaxed">
              <code className="text-[#a1a1aa]">{`{
  `}<span className="text-white">"priority"</span>{`: `}<span className="text-blue-400">98</span>{`,
  `}<span className="text-white">"tier"</span>{`: `}<span className="text-green-400">"hot"</span>{`,
  `}<span className="text-white">"action"</span>{`: `}<span className="text-green-400">"immediate_call"</span>{`,
  `}<span className="text-white">"social_validation"</span>{`: {
    `}<span className="text-white">"trust_level"</span>{`: `}<span className="text-green-400">"high_trust"</span>{`,
    `}<span className="text-white">"claims_validated"</span>{`: `}<span className="text-blue-400">true</span>{`,
    `}<span className="text-white">"red_flags"</span>{`: `}<span className="text-yellow-400">[]</span>{`
  },
  `}<span className="text-white">"deterministic"</span>{`: `}<span className="text-blue-400">true</span>{`
}`}</code>
            </pre>
          </div>
        </motion.div>
      </section>

      {/* Logos / Trust */}
      <section className="py-12 border-y border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-[#52525b] mb-8">Trusted by revenue teams who need certainty</p>
          <div className="flex items-center justify-center gap-12 md:gap-16 text-[#3f3f46]">
            <span className="text-lg font-semibold">MetroFlex</span>
            <span className="text-lg font-semibold">DriveBrandGrowth</span>
            <span className="text-lg font-semibold opacity-50">Your Logo Here</span>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="section-padding px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-[-0.02em]">The problem with lead scoring</h2>
              <ul className="space-y-4 text-[#a1a1aa]">
                {[
                  'People lie on forms. "I have $1M to invest" often means $50k.',
                  'AI scoring is a black box. Same lead, different score every time.',
                  'Sales teams chase ghosts while real buyers wait.',
                  'No way to explain why a lead scored the way it did.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-red-500 mt-0.5 text-lg flex-shrink-0">✗</span>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-[-0.02em]">CircuitOS fixes this</h2>
              <ul className="space-y-4 text-[#a1a1aa]">
                {[
                  'Validates claims against social signals. We catch the liars.',
                  'Deterministic scoring. Same input = same output. Every time.',
                  '15ms response time. Route leads before competitors respond.',
                  'Full audit trail. Know exactly which rule triggered and why.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-blue-500 mt-0.5 text-lg flex-shrink-0">✓</span>
                    <span className="text-base sm:text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
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
              Lead comes in. Gets scored. Gets validated. Gets routed. Under 20 milliseconds.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { step: '01', title: 'Lead Ingests', desc: 'API, CSV, or webhook. We accept leads from anywhere.' },
              { step: '02', title: 'DMN Scores', desc: 'Deterministic rules assign priority, tier, and action.' },
              { step: '03', title: 'Social Validates', desc: 'Cross-reference claims with X, Instagram, LinkedIn.' },
              { step: '04', title: 'Action Triggers', desc: 'Hot lead? CRM updated, Slack pinged, rep alerted.' },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                className="card rounded-xl p-8"
              >
                <span className="text-sm text-blue-500 font-mono font-semibold">{item.step}</span>
                <h3 className="text-xl font-semibold mt-3 mb-3">{item.title}</h3>
                <p className="text-[#a1a1aa] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Aria AI Agent Section */}
      <section id="aria" className="section-padding px-6 border-t border-[#27272a] aria-glow overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-950/40 border border-blue-500/30 mb-6">
                <Zap className="w-4 h-4 text-blue-400 mr-2" aria-hidden="true" />
                <span className="text-sm font-medium text-blue-300">Autonomous AI Agent</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-[-0.02em]">
                Aria takes action
                <span className="block gradient-text-blue">while you sleep</span>
              </h2>

              <p className="text-lg text-[#a1a1aa] mb-8 leading-[1.6]">
                CircuitOS scores your leads. Aria engages them automatically. Email, SMS, Slack, chat—working 24/7 without you lifting a finger.
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-950/40 to-cyan-950/40 rounded-lg p-4 border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-300">2.3s</div>
                  <div className="text-xs text-[#a1a1aa] mt-1">Avg Response</div>
                </div>
                <div className="bg-gradient-to-br from-green-950/40 to-emerald-950/40 rounded-lg p-4 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-300">24/7</div>
                  <div className="text-xs text-[#a1a1aa] mt-1">Always On</div>
                </div>
                <div className="bg-gradient-to-br from-purple-950/40 to-pink-950/40 rounded-lg p-4 border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-300">5+</div>
                  <div className="text-xs text-[#a1a1aa] mt-1">Channels</div>
                </div>
              </div>

              {/* Capabilities */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Brain, text: 'Intelligent Routing' },
                  { icon: MessageCircle, text: 'Multi-Channel' },
                  { icon: Clock, text: 'Memory System' },
                  { icon: CheckCircle2, text: 'Self-Learning' },
                ].map((cap, i) => (
                  <div key={i} className="flex items-center gap-3 text-[#a1a1aa]">
                    <cap.icon className="w-4 h-4 text-blue-400" aria-hidden="true" />
                    <span className="text-sm">{cap.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Terminal Demo */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gray-950 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                <div className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-mono text-gray-500 ml-4">aria@circuitos</span>
                </div>
                <div className="p-6 font-mono text-sm space-y-2 text-green-400/90 h-80 overflow-hidden">
                  <p className="text-gray-500">$ circuitos-intake --lead-id=prospect_8392</p>
                  <p>✓ Incoming lead: sarah@techcorp.com</p>
                  <p>✓ ICP Score: <span className="text-blue-400">87</span>/100</p>
                  <p>✓ Routing: <span className="text-yellow-400">FAST_TRACK</span></p>
                  <p className="text-gray-500 pt-2">$ aria-engage --channel=email</p>
                  <p>[01:23:45] Aria initializing...</p>
                  <p>✓ Awareness: <span className="text-purple-400">PRODUCT_AWARE</span></p>
                  <p>✓ Persona: <span className="text-cyan-400">Vendor/Exhibitor</span></p>
                  <p className="text-green-400">→ Email sent to sarah@techcorp.com</p>
                  <p>✓ Added to GHL (ID: contact_5847)</p>
                  <p>✓ Slack notification sent</p>
                  <p className="pt-2 text-gray-500">$ aria-followup --delay=4h</p>
                  <p>✓ Scheduled: Quick follow-up</p>
                  <p>✓ Memory stored for next visit</p>
                  <p className="inline-flex items-center">
                    <span className="terminal-cursor">▊</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-padding px-6 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-[-0.02em]"
          >
            Built for certainty
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                title: 'Social Validation',
                desc: 'Cross-reference what they claim with what they post. Gym owner? We check. $500k capital? We verify lifestyle signals.',
                icon: '🔍'
              },
              {
                title: 'Deterministic Scoring',
                desc: 'DMN decision tables, not black-box AI. Every score is explainable, auditable, and reproducible.',
                icon: '⚡'
              },
              {
                title: 'Timing Intelligence',
                desc: 'Detect WHY NOW signals. Corporate exit? Sold business? Inheritance? We see the triggers others miss.',
                icon: '🎯'
              },
              {
                title: 'Red Flag Detection',
                desc: 'Claims $1M but posts about budget constraints? We flag it. Your sales team only talks to real buyers.',
                icon: '🚩'
              },
              {
                title: 'Full Audit Trail',
                desc: 'Every decision logged. Which rule fired. What the inputs were. Compliance-ready from day one.',
                icon: '📋'
              },
              {
                title: 'Multi-Tenant Ready',
                desc: 'White-label for agencies. Each client gets their own rules, personas, and integrations.',
                icon: '🏢'
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="card rounded-xl p-8"
              >
                <span className="text-3xl mb-5 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-[#a1a1aa] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-padding px-6 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">Pricing</h2>
            <p className="text-[#a1a1aa] text-lg">One-time build + monthly platform fee</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                name: 'Starter',
                build: '$7,500',
                monthly: '$497',
                leads: '1,000 leads/mo',
                features: ['DMN scoring engine', 'ML predictions', 'GHL integration', 'Slack alerts'],
              },
              {
                name: 'Growth',
                build: '$12,500',
                monthly: '$997',
                leads: '5,000 leads/mo',
                features: ['Everything in Starter', 'Social validation', 'Aria AI agent', 'Priority support'],
                popular: true,
              },
              {
                name: 'Enterprise',
                build: '$25,000+',
                monthly: '$1,997',
                leads: 'Unlimited',
                features: ['Everything in Growth', 'Real data ML training', 'White-label ready', 'Dedicated support'],
              },
            ].map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeInUp}
                className={`card rounded-xl p-8 ${plan.popular ? 'border-blue-500/50 bg-blue-500/5' : ''}`}
              >
                {plan.popular && (
                  <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-medium">Most Popular</span>
                )}
                <h3 className="text-2xl font-semibold mt-5">{plan.name}</h3>
                <div className="mt-6 mb-2">
                  <span className="text-4xl font-bold">{plan.build}</span>
                  <span className="text-[#a1a1aa] text-sm ml-2">build</span>
                </div>
                <div className="mb-8">
                  <span className="text-2xl font-semibold">{plan.monthly}</span>
                  <span className="text-[#a1a1aa] text-sm ml-1">/month</span>
                </div>
                <p className="text-sm text-[#a1a1aa] mb-8 pb-8 border-b border-[#27272a]">{plan.leads}</p>
                <ul className="space-y-4 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-[#a1a1aa]">
                      <span className="text-blue-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="#demo" className={`block text-center mt-10 py-3 rounded-lg font-semibold transition-all ${plan.popular ? 'btn-primary text-white' : 'border border-[#27272a] hover:bg-white/5'}`}>
                  Get Started
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="section-padding px-6 border-t border-[#27272a]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-[-0.02em]">Ready to stop guessing?</h2>
          <p className="text-[#a1a1aa] mb-10 text-lg leading-[1.6]">
            See CircuitOS score your leads in real-time. No commitment, no BS.
          </p>
          <a href="mailto:noel@drivebrandgrowth.com?subject=CircuitOS Demo Request" className="inline-block px-10 py-4 btn-primary text-white rounded-lg font-semibold text-lg">
            Request Demo
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src="/circuitos-icon.svg" alt="CircuitOS" className="h-8 w-8" />
            <div>
              <span className="text-xl font-semibold">Circuit<span className="text-blue-500">OS</span></span>
              <p className="text-sm text-[#52525b] mt-1">Same input. Same output. Every time.</p>
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm text-[#a1a1aa]">
            <a href="https://drivebrandgrowth.com" className="hover:text-white transition-colors">DriveBrandGrowth</a>
            <a href="mailto:noel@drivebrandgrowth.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-[#27272a] text-center text-sm text-[#52525b]">
          © {new Date().getFullYear()} CircuitOS. Built by DriveBrandGrowth.
        </div>
      </footer>
    </main>
  )
}
