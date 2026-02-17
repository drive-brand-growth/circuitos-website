'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    vertical: '',
    message: '',
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
      // Fallback: open mailto if API unreachable
      window.location.href = `mailto:noel@drivebrandgrowth.com?subject=Demo Request from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nVertical: ${formData.vertical}\n\n${formData.message}`)}`
      setFormStatus('success')
    }
  }

  return (
    <section id="contact" className="section-padding px-6 border-t border-[#27272a]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-[-0.02em]">Ready to close the loop?</h2>
            <p className="text-[#a1a1aa] mb-8 text-lg leading-[1.6]">
              See how a predictable, data-driven revenue system works — not another AI chatbot, but a complete pipeline configured for your business.
              We'll walk you through the entire pipeline with your business context.
            </p>
            <ul className="space-y-4 text-[#a1a1aa]">
              <li className="flex items-center gap-3">
                <span className="text-blue-500">&#10003;</span> Personalized walkthrough of your vertical
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-500">&#10003;</span> See real scoring with sample data
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-500">&#10003;</span> Content intelligence demo
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-500">&#10003;</span> No commitment required
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card rounded-xl p-8"
          >
            <h3 className="text-2xl font-semibold mb-6">Request a Demo</h3>
            {formStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-400 text-3xl">&#10003;</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">Thanks for reaching out!</h4>
                <p className="text-[#a1a1aa]">We'll be in touch within 24 hours to schedule your demo.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#a1a1aa] mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500/50"
                    placeholder="Your name"
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
                    placeholder="you@company.com"
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
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label htmlFor="vertical" className="block text-sm font-medium text-[#a1a1aa] mb-2">Industry / Vertical</label>
                  <select
                    id="vertical"
                    value={formData.vertical}
                    onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="">Select your industry</option>
                    <option value="saas">SaaS / Technology</option>
                    <option value="agency">Marketing Agency</option>
                    <option value="franchise">Franchise / Licensing</option>
                    <option value="ecommerce">E-commerce / Retail</option>
                    <option value="events">Events / Entertainment</option>
                    <option value="fitness">Fitness / Wellness</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="professional-services">Professional Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#a1a1aa] mb-2">What are you looking to solve?</label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500/50 resize-none"
                    placeholder="Tell us about your current challenges..."
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
                  <p className="text-red-400 text-sm text-center">Something went wrong. Please try again or email noel@drivebrandgrowth.com</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
