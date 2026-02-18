'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface Module {
  id: string
  name: string
  description: string
  price: number
  included?: boolean
}

interface AddOn {
  id: string
  name: string
  description: string
  price: number
  perUnit?: string
  quantity: number
  max: number
}

const verticalOptions = [
  { count: 1, label: '1 Vertical', sublabel: 'Single business line' },
  { count: 2, label: '2-3 Verticals', sublabel: 'Multi-brand portfolio' },
  { count: 4, label: '4-6 Verticals', sublabel: 'Enterprise portfolio' },
  { count: 7, label: '7+ Verticals', sublabel: 'Custom — let\'s talk' },
]

const coreModules: Module[] = [
  {
    id: 'provisioning',
    name: 'Platform Provisioning',
    description: 'Dedicated infrastructure, database, Docker stack, and CI/CD pipeline',
    price: 1500,
    included: true,
  },
  {
    id: 'icp',
    name: 'ICP Encoding & Calibration',
    description: 'Your ideal customer profile, qualification criteria, and decision logic configured into the scoring model',
    price: 1000,
    included: true,
  },
]

const featureModules: Module[] = [
  {
    id: 'scoring',
    name: 'Lead Scoring & Enrichment',
    description: 'Predictive scoring across 72+ signals with multi-source enrichment',
    price: 1500,
  },
  {
    id: 'outreach',
    name: 'Email Outreach Automation',
    description: 'AI-generated sequences in your brand voice with governance gates',
    price: 1250,
  },
  {
    id: 'content',
    name: 'Content Intelligence Engine',
    description: 'AI blog generation, fact-checking, multi-model quality scoring',
    price: 1500,
  },
  {
    id: 'social',
    name: 'Social Distribution',
    description: 'Automated distribution to 4 channels (Facebook, Instagram, X, Google Business)',
    price: 750,
  },
  {
    id: 'crm',
    name: 'CRM Integration',
    description: 'GoHighLevel setup, contact sync, pipeline automation, booking flows',
    price: 750,
  },
  {
    id: 'analytics',
    name: 'GA4 Feedback Loop',
    description: 'Closed-loop performance tracking — engagement data feeds back into the model',
    price: 500,
  },
]

const defaultAddOns: AddOn[] = [
  {
    id: 'migration',
    name: 'Data Migration',
    description: 'Import existing leads, contacts, or content from another platform',
    price: 500,
    perUnit: 'per source',
    quantity: 0,
    max: 5,
  },
  {
    id: 'custom-api',
    name: 'Custom API Integration',
    description: 'Connect a system beyond our native integrations (REST/webhook)',
    price: 1000,
    perUnit: 'per integration',
    quantity: 0,
    max: 5,
  },
  {
    id: 'priority',
    name: 'Priority Onboarding',
    description: 'Go live in 2 weeks instead of 4 — dedicated implementation sprint',
    price: 1500,
    quantity: 0,
    max: 1,
  },
  {
    id: 'training',
    name: 'Extended Training',
    description: '4 additional hands-on sessions for your team (beyond standard onboarding)',
    price: 750,
    quantity: 0,
    max: 1,
  },
]

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function BuildCalculator() {
  const [verticalCount, setVerticalCount] = useState(1)
  const [selectedModules, setSelectedModules] = useState<Set<string>>(
    new Set(['scoring', 'outreach', 'crm'])
  )
  const [addOns, setAddOns] = useState<AddOn[]>(defaultAddOns)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const toggleModule = (id: string) => {
    setSelectedModules(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const updateAddOnQty = (id: string, delta: number) => {
    setAddOns(prev => prev.map(a =>
      a.id === id
        ? { ...a, quantity: Math.max(0, Math.min(a.max, a.quantity + delta)) }
        : a
    ))
  }

  const estimate = useMemo(() => {
    // Core is always included
    const coreTotal = coreModules.reduce((sum, m) => sum + m.price, 0)

    // Selected feature modules
    const featureTotal = featureModules
      .filter(m => selectedModules.has(m.id))
      .reduce((sum, m) => sum + m.price, 0)

    // Additional verticals (first is included in core)
    const extraVerticals = Math.max(0, verticalCount - 1)
    const verticalCost = extraVerticals * 3500

    // Add-ons
    const addOnTotal = addOns.reduce((sum, a) => sum + (a.price * a.quantity), 0)

    const total = coreTotal + featureTotal + verticalCost + addOnTotal

    // Recommend a monthly tier
    let recommendedPlan = 'Starter'
    let monthlyPrice = 1500
    if (verticalCount >= 4 || selectedModules.size >= 5) {
      recommendedPlan = 'Enterprise'
      monthlyPrice = 0 // Custom
    } else if (verticalCount >= 2 || selectedModules.has('content') || selectedModules.has('analytics')) {
      recommendedPlan = 'Growth'
      monthlyPrice = 3500
    }

    return {
      coreTotal,
      featureTotal,
      verticalCost,
      extraVerticals,
      addOnTotal,
      total,
      recommendedPlan,
      monthlyPrice,
    }
  }, [verticalCount, selectedModules, addOns])

  return (
    <section id="build-calculator" className="section-padding px-6 border-t border-[#27272a]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-[-0.02em]">
            Estimate your build
          </h2>
          <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto">
            Transparent pricing. Select the modules you need and see exactly what your implementation costs — no surprises on the demo call.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Step 1: Verticals */}
          <div className="card rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-semibold">1</span>
              <h3 className="text-lg font-semibold">How many business lines?</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {verticalOptions.map((opt) => (
                <button
                  key={opt.count}
                  onClick={() => setVerticalCount(opt.count)}
                  className={`rounded-lg p-4 text-left transition-all border ${
                    verticalCount === opt.count
                      ? 'border-blue-500 bg-blue-500/10 text-white'
                      : 'border-[#27272a] bg-[#0a0a0a] text-[#a1a1aa] hover:border-[#3f3f46] hover:bg-[#0f0f0f]'
                  }`}
                >
                  <div className="font-semibold text-sm">{opt.label}</div>
                  <div className="text-xs mt-1 opacity-70">{opt.sublabel}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Modules */}
          <div className="card rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-semibold">2</span>
              <h3 className="text-lg font-semibold">Select your modules</h3>
            </div>

            {/* Core — always included */}
            <div className="mb-6">
              <p className="text-xs text-[#71717a] uppercase tracking-wider mb-3 font-medium">Core — included with every build</p>
              <div className="space-y-3">
                {coreModules.map((mod) => (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between rounded-lg p-4 bg-[#0a0a0a] border border-[#1a1a1a]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500 text-sm">&#10003;</span>
                      <div>
                        <div className="text-sm font-medium">{mod.name}</div>
                        <div className="text-xs text-[#71717a] mt-0.5">{mod.description}</div>
                      </div>
                    </div>
                    <span className="text-sm text-[#a1a1aa] font-mono whitespace-nowrap ml-4">
                      {formatPrice(mod.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature modules — selectable */}
            <div>
              <p className="text-xs text-[#71717a] uppercase tracking-wider mb-3 font-medium">Feature modules</p>
              <div className="space-y-3">
                {featureModules.map((mod) => {
                  const isSelected = selectedModules.has(mod.id)
                  return (
                    <button
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className={`w-full flex items-center justify-between rounded-lg p-4 text-left transition-all border ${
                        isSelected
                          ? 'border-blue-500/40 bg-blue-500/5'
                          : 'border-[#27272a] bg-[#0a0a0a] hover:border-[#3f3f46]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                          isSelected
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-[#3f3f46] bg-transparent'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{mod.name}</div>
                          <div className="text-xs text-[#71717a] mt-0.5">{mod.description}</div>
                        </div>
                      </div>
                      <span className={`text-sm font-mono whitespace-nowrap ml-4 ${
                        isSelected ? 'text-blue-400' : 'text-[#71717a]'
                      }`}>
                        {formatPrice(mod.price)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Step 3: Add-ons */}
          <div className="card rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-semibold">3</span>
              <h3 className="text-lg font-semibold">Additional services</h3>
            </div>
            <div className="space-y-3">
              {addOns.map((addon) => (
                <div
                  key={addon.id}
                  className={`flex items-center justify-between rounded-lg p-4 border transition-all ${
                    addon.quantity > 0
                      ? 'border-blue-500/40 bg-blue-500/5'
                      : 'border-[#27272a] bg-[#0a0a0a]'
                  }`}
                >
                  <div className="min-w-0 mr-4">
                    <div className="text-sm font-medium">{addon.name}</div>
                    <div className="text-xs text-[#71717a] mt-0.5">{addon.description}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-[#71717a] font-mono">
                      {formatPrice(addon.price)}{addon.perUnit ? ` ${addon.perUnit}` : ''}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateAddOnQty(addon.id, -1)}
                        disabled={addon.quantity === 0}
                        className="w-7 h-7 rounded border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label={`Decrease ${addon.name}`}
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-mono">{addon.quantity}</span>
                      <button
                        onClick={() => updateAddOnQty(addon.id, 1)}
                        disabled={addon.quantity >= addon.max}
                        className="w-7 h-7 rounded border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label={`Increase ${addon.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estimate Summary */}
          <motion.div
            className="card rounded-xl overflow-hidden border-blue-500/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs text-[#71717a] uppercase tracking-wider font-medium mb-1">Estimated implementation</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {verticalCount >= 7 ? 'Custom' : formatPrice(estimate.total)}
                    </span>
                    {verticalCount < 7 && (
                      <span className="text-[#71717a] text-sm">one-time</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#71717a] uppercase tracking-wider font-medium mb-1">Recommended plan</p>
                  <div className="flex items-baseline gap-2 justify-end">
                    <span className="text-xl font-semibold text-blue-400">{estimate.recommendedPlan}</span>
                    {estimate.monthlyPrice > 0 && (
                      <span className="text-[#71717a] text-sm">{formatPrice(estimate.monthlyPrice)}/mo</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable breakdown */}
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between py-3 border-t border-[#27272a] text-sm text-[#a1a1aa] hover:text-white transition-colors"
              >
                <span>View line-item breakdown</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showBreakdown && verticalCount < 7 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 pt-3 text-sm"
                >
                  {/* Core */}
                  {coreModules.map(m => (
                    <div key={m.id} className="flex justify-between text-[#a1a1aa]">
                      <span>{m.name}</span>
                      <span className="font-mono">{formatPrice(m.price)}</span>
                    </div>
                  ))}
                  {/* Features */}
                  {featureModules.filter(m => selectedModules.has(m.id)).map(m => (
                    <div key={m.id} className="flex justify-between text-[#a1a1aa]">
                      <span>{m.name}</span>
                      <span className="font-mono">{formatPrice(m.price)}</span>
                    </div>
                  ))}
                  {/* Extra verticals */}
                  {estimate.extraVerticals > 0 && (
                    <div className="flex justify-between text-[#a1a1aa]">
                      <span>Additional verticals ({estimate.extraVerticals})</span>
                      <span className="font-mono">{formatPrice(estimate.verticalCost)}</span>
                    </div>
                  )}
                  {/* Add-ons */}
                  {addOns.filter(a => a.quantity > 0).map(a => (
                    <div key={a.id} className="flex justify-between text-[#a1a1aa]">
                      <span>{a.name}{a.quantity > 1 ? ` (x${a.quantity})` : ''}</span>
                      <span className="font-mono">{formatPrice(a.price * a.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t border-[#27272a] font-semibold text-white">
                    <span>Total implementation</span>
                    <span className="font-mono">{formatPrice(estimate.total)}</span>
                  </div>
                </motion.div>
              )}

              {verticalCount >= 7 && showBreakdown && (
                <p className="text-[#a1a1aa] text-sm pt-3">
                  For 7+ verticals, we scope a custom implementation based on your portfolio complexity. Book a demo and we'll build your estimate together.
                </p>
              )}
            </div>

            {/* CTA */}
            <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
              <a
                href="/demo"
                className="block w-full text-center py-4 btn-primary text-white rounded-lg font-semibold text-lg"
              >
                Get your exact quote
              </a>
              <p className="text-xs text-[#71717a] text-center mt-3">
                Your estimate is a starting point — we finalize pricing on your demo call based on exact requirements.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
