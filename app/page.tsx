'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

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
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'user' | 'aria', text: string}[]>([
    { role: 'aria', text: "Hi! I'm Aria, your AI assistant. I can answer questions about CircuitOS, our pricing, or help you schedule a demo. What would you like to know?" }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  // Escape key handler for chat widget accessibility
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && chatOpen) {
        setChatOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [chatOpen])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInputValue('')
    setIsTyping(true)

    // Simulate Aria response (in production, this would call your AI backend)
    setTimeout(() => {
      let response = "Great question! I'd be happy to help with that. Could you tell me a bit more about what you're looking for? Or if you'd like, scroll down to fill out the contact form and our team will reach out!"

      const lowerMsg = userMessage.toLowerCase()

      // Integrations
      if (lowerMsg.includes('salesforce') || lowerMsg.includes('crm')) {
        response = "Yes! CircuitOS integrates with Salesforce, HubSpot, and GoHighLevel. We push scored leads directly to your CRM with full audit trails. Want to see how the Salesforce integration works?"
      } else if (lowerMsg.includes('hubspot')) {
        response = "Absolutely! We have native HubSpot integration. Leads get scored in 15ms and synced to HubSpot with custom properties for score, tier, and validation status. Want me to show you?"
      } else if (lowerMsg.includes('ghl') || lowerMsg.includes('gohighlevel') || lowerMsg.includes('high level')) {
        response = "Yes! GoHighLevel is one of our most popular integrations. We can trigger GHL workflows based on lead scores and push all data to custom fields. Many agencies use this setup."
      } else if (lowerMsg.includes('integrat') || lowerMsg.includes('connect') || lowerMsg.includes('api') || lowerMsg.includes('webhook')) {
        response = "CircuitOS integrates with Salesforce, HubSpot, GoHighLevel, Slack, Zapier, and has a full REST API. We also support webhooks for real-time lead routing. What system are you looking to connect?"
      }
      // Pricing
      else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('pricing') || lowerMsg.includes('how much')) {
        response = "CircuitOS has 3 tiers:\n\n• Starter: $7,500 build + $497/mo (1,000 leads)\n• Growth: $12,500 + $997/mo (5,000 leads + me!)\n• Enterprise: $25,000+ + $1,997/mo (unlimited)\n\nWhich tier sounds closest to your needs?"
      }
      // Demo
      else if (lowerMsg.includes('demo') || lowerMsg.includes('trial') || lowerMsg.includes('test') || lowerMsg.includes('try')) {
        response = "I'd love to show you CircuitOS in action! We do live demos where we score YOUR actual leads so you can see real results. Fill out the contact form below or scroll down to 'Request Demo'. What's your biggest lead scoring challenge?"
      }
      // Features
      else if (lowerMsg.includes('social') || lowerMsg.includes('validat')) {
        response = "Social validation is one of our killer features. We cross-reference what leads claim on forms with their actual social media activity. Someone says they own a gym but never posts fitness content? We flag it. It catches liars before your sales team wastes time."
      } else if (lowerMsg.includes('score') || lowerMsg.includes('scoring')) {
        response = "CircuitOS scores leads in 15ms using deterministic DMN rules. Same input = same output, every time. No black-box AI guessing. Every score is fully auditable - you can see exactly which rules fired and why."
      } else if (lowerMsg.includes('fast') || lowerMsg.includes('speed') || lowerMsg.includes('quick')) {
        response = "15 milliseconds. That's how fast we score leads. Your hot leads get routed before competitors even know they exist. Most 'AI' scoring takes 500ms-2s. We're 30-100x faster."
      } else if (lowerMsg.includes('feature') || lowerMsg.includes('what do you') || lowerMsg.includes('what can')) {
        response = "CircuitOS provides:\n\n• 15ms lead scoring\n• Social signal validation\n• Deterministic DMN rules (auditable)\n• Red flag detection\n• CRM integrations\n• Me (Aria) for 24/7 lead qualification\n\nWhat matters most to you?"
      }
      // About Aria
      else if (lowerMsg.includes('aria') || lowerMsg.includes('who are you') || lowerMsg.includes('are you ai') || lowerMsg.includes('are you real')) {
        response = "I'm Aria - an autonomous AI agent with semantic RAG memory. I qualify leads 24/7 with 2.3s average response time and 94% accuracy. I never forget a conversation and I'm included in Growth and Enterprise plans. How can I help you today?"
      }
      // Company
      else if (lowerMsg.includes('company') || lowerMsg.includes('who made') || lowerMsg.includes('behind')) {
        response = "CircuitOS is built by DriveBrandGrowth. We specialize in AI-powered revenue systems for B2B companies. Our founder Noel has built lead intelligence systems for gyms, franchises, and SaaS companies."
      }
      // Competitors
      else if (lowerMsg.includes('different') || lowerMsg.includes('competitor') || lowerMsg.includes('vs') || lowerMsg.includes('compare')) {
        response = "Unlike traditional lead scoring:\n\n• We're deterministic (not black-box AI)\n• We validate claims against social signals\n• We're 30-100x faster (15ms vs 500ms+)\n• Every decision has a full audit trail\n\nWant to see a side-by-side comparison?"
      }
      // Greeting
      else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey') || lowerMsg === 'yo') {
        response = "Hey! 👋 I'm Aria, your AI assistant for CircuitOS. I can help with pricing, features, integrations, or schedule a demo. What brings you here today?"
      }
      // Thanks
      else if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
        response = "You're welcome! Is there anything else I can help you with? I'm here 24/7."
      }

      setMessages(prev => [...prev, { role: 'aria', text: response }])
      setIsTyping(false)
    }, 1500)
  }

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
              <a href="#features" className="font-medium hover:text-white transition-colors">Features</a>
              <a href="#aria" className="font-medium hover:text-white transition-colors">Aria AI</a>
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold gradient-text mb-10 hero-headline"
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
              },
              {
                title: 'Deterministic Scoring',
                desc: 'DMN decision tables, not black-box AI. Every score is explainable, auditable, and reproducible.',
              },
              {
                title: 'Timing Intelligence',
                desc: 'Detect WHY NOW signals. Corporate exit? Sold business? Inheritance? We see the triggers others miss.',
              },
              {
                title: 'Red Flag Detection',
                desc: 'Claims $1M but posts about budget constraints? We flag it. Your sales team only talks to real buyers.',
              },
              {
                title: 'Full Audit Trail',
                desc: 'Every decision logged. Which rule fired. What the inputs were. Compliance-ready from day one.',
              },
              {
                title: 'Multi-Tenant Ready',
                desc: 'White-label for agencies. Each client gets their own rules, personas, and integrations.',
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="card rounded-xl p-8"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-[#a1a1aa] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Aria AI Agent */}
      <section id="aria" className="section-padding px-6 border-t border-[#27272a] aria-glow">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-sm text-blue-400 mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Autonomous AI Agent
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">
              Meet <span className="gradient-text-blue">Aria</span>
            </h2>
            <p className="text-[#a1a1aa] max-w-2xl mx-auto text-lg leading-[1.6]">
              Your 24/7 autonomous agent with semantic RAG memory. She qualifies leads,
              handles objections, and never forgets a conversation.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Aria Capabilities */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                {
                  title: 'Semantic RAG Memory',
                  desc: 'Aria remembers every interaction using vector embeddings. She recalls context from weeks ago mid-conversation.',
                },
                {
                  title: '2.3s Response Time',
                  desc: 'Responds across email, SMS, Slack, and web chat faster than human sales reps. 24/7, no PTO.',
                },
                {
                  title: 'Autonomous Qualification',
                  desc: 'Uses CircuitOS scoring to pre-qualify leads before routing. Only real buyers reach your team.',
                },
                {
                  title: 'Multi-Channel Presence',
                  desc: 'One agent, every channel. Seamless handoffs between email, text, and live chat.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-lg">A</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-[#a1a1aa] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Aria Terminal Demo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="code-block rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-5 py-4 border-b border-[#27272a]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]/80"></div>
                  <div className="w-3 h-3 rounded-full bg-[#eab308]/80"></div>
                  <div className="w-3 h-3 rounded-full bg-[#22c55e]/80"></div>
                </div>
                <span className="ml-4 text-xs text-[#52525b]">aria-agent — live</span>
              </div>
              <div className="p-6 font-mono text-sm space-y-4">
                <div>
                  <span className="text-[#52525b]">[incoming]</span>
                  <span className="text-[#a1a1aa] ml-2">"I'm interested in licensing a gym"</span>
                </div>
                <div>
                  <span className="text-blue-400">[aria]</span>
                  <span className="text-[#a1a1aa] ml-2">Retrieving context from RAG...</span>
                </div>
                <div className="pl-4 border-l-2 border-blue-500/30 text-[#71717a] text-xs">
                  <div>memory_hit: conversation_2024_11_15</div>
                  <div>persona_match: gym_owner_prospect</div>
                  <div>score: 87 / tier: warm</div>
                </div>
                <div>
                  <span className="text-blue-400">[aria]</span>
                  <span className="text-green-400 ml-2">"Welcome back! Last time we discussed the Arlington location. Ready to talk franchise fees?"</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-[#52525b]">response_time:</span>
                  <span className="text-green-400">2.1s</span>
                  <span className="text-[#52525b] ml-4">channel:</span>
                  <span className="text-blue-400">sms</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Aria Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-[#27272a]"
          >
            {[
              { stat: '2.3s', label: 'Avg Response' },
              { stat: '24/7', label: 'Availability' },
              { stat: '94%', label: 'Qualification Accuracy' },
              { stat: '0', label: 'Sick Days' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text-blue">{item.stat}</div>
                <div className="text-sm text-[#a1a1aa] mt-1">{item.label}</div>
              </div>
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

      {/* Contact / Demo Form */}
      <section id="demo" className="section-padding px-6 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left - CTA Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-[-0.02em]">Ready to stop guessing?</h2>
              <p className="text-[#a1a1aa] mb-8 text-lg leading-[1.6]">
                See CircuitOS score your leads in real-time. We'll show you how deterministic scoring
                catches the liars and routes hot leads before competitors respond.
              </p>
              <ul className="space-y-4 text-[#a1a1aa]">
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">✓</span> Live demo with YOUR leads
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">✓</span> No commitment required
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">✓</span> See real scores in 15ms
                </li>
              </ul>
            </motion.div>

            {/* Right - Contact Form */}
            <motion.div
              id="contact"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card rounded-xl p-8"
            >
              <h3 className="text-2xl font-semibold mb-6">Request a Demo</h3>
              {formStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-400 text-3xl">✓</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Thanks for reaching out!</h4>
                  <p className="text-[#a1a1aa]">We'll be in touch within 24 hours to schedule your demo.</p>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setFormStatus('submitting')
                    // Send to email (in production, this would be an API endpoint)
                    try {
                      const mailtoLink = `mailto:hello@usecircuitos.com?subject=Demo Request from ${formData.name}&body=Name: ${formData.name}%0AEmail: ${formData.email}%0ACompany: ${formData.company}%0A%0AMessage:%0A${formData.message}`
                      window.open(mailtoLink, '_blank')
                      setFormStatus('success')
                    } catch {
                      setFormStatus('error')
                    }
                  }}
                  className="space-y-5"
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#a1a1aa] mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500/50"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#a1a1aa] mb-2">Work Email</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500/50"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-[#a1a1aa] mb-2">Company</label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500/50"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#a1a1aa] mb-2">What's your biggest lead scoring challenge?</label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500/50 resize-none"
                      placeholder="Tell us about your current lead scoring challenges..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full py-4 btn-primary text-white rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Request Demo'}
                  </button>
                  {formStatus === 'error' && (
                    <p className="text-red-400 text-sm text-center">Something went wrong. Please try again or email hello@usecircuitos.com</p>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        </div>
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
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="mailto:hello@usecircuitos.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-[#27272a] text-center text-sm text-[#52525b]" suppressHydrationWarning>
          © 2025 CircuitOS. All rights reserved.
        </div>
      </footer>

      {/* Aria Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              id="aria-chat-panel"
              role="dialog"
              aria-label="Chat with Aria AI assistant"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-20 right-0 w-[360px] bg-[#0a0a0a] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Aria</h3>
                    <p className="text-white/70 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Online • 2.3s avg response
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  aria-label="Close chat"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Chat Messages */}
              <div className="h-[320px] overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-[#1a1a1a] text-[#e4e4e7] rounded-bl-md border border-[#27272a]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#1a1a1a] text-[#a1a1aa] px-4 py-3 rounded-2xl rounded-bl-md border border-[#27272a]">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-[#27272a]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Aria anything..."
                    aria-label="Type your message to Aria"
                    className="flex-1 bg-[#1a1a1a] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500/50"
                  />
                  <button
                    onClick={handleSend}
                    aria-label="Send message"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Bubble Button */}
        <motion.button
          onClick={() => setChatOpen(!chatOpen)}
          aria-label={chatOpen ? "Close chat with Aria" : "Open chat with Aria"}
          aria-expanded={chatOpen}
          aria-controls="aria-chat-panel"
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-lg flex items-center justify-center hover:shadow-blue-500/25 hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {chatOpen ? (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="relative">
              <span className="text-white font-bold text-2xl" aria-hidden="true">A</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-600" aria-hidden="true"></span>
            </div>
          )}
        </motion.button>
      </div>
    </main>
  )
}
