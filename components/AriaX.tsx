'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Local fallback knowledge for when API is unavailable
const fallbackKB: Record<string, string> = {
  'what is circuitos': 'CircuitOS is a pre-configured revenue intelligence platform. It scores leads, generates content, and automates outreach in a single closed-loop system — intelligent before your first lead arrives.',
  'pricing': 'Three tiers: **Starter** ($1,500/mo), **Growth** ($3,500/mo), **Enterprise** (custom). Implementation fee scoped during your demo. [See pricing](/#pricing)',
  'demo': 'You can [book a demo here](/demo) — 30-minute personalized walkthrough with your business context. No commitment.',
  'how': 'Five steps: Configure your ICP → Score every lead (72+ signals) → Route to the right channel → Engage with AI outreach → Learn from every outcome. [See how it works](/#how-it-works)',
  'integration': 'Native integrations: GoHighLevel (CRM), Instantly.ai (email), Google Analytics 4 (feedback loop). Plus Claude, Gemini, Perplexity for content quality. REST API + webhooks for custom.',
  'contact': 'Reach us at hello@usecircuitos.com or [book a demo](/demo). We respond within 24 hours.',
  'hello': "Hey! I'm Aria X, the CircuitOS concierge. I can help with anything about the platform — scoring, outreach, content, pricing. What are you looking into?",
}

function localFallback(query: string): string {
  const q = query.toLowerCase()
  for (const [key, answer] of Object.entries(fallbackKB)) {
    if (q.includes(key)) return answer
  }
  if (/hi|hey|sup|yo|good/.test(q)) return fallbackKB['hello']
  if (/price|cost|how much|plan/.test(q)) return fallbackKB['pricing']
  if (/book|demo|started|try/.test(q)) return fallbackKB['demo']
  if (/work|step|pipeline|process/.test(q)) return fallbackKB['how']
  return "Great question — I'd love to connect you with someone who can dive deeper. [Book a demo](/demo) or email hello@usecircuitos.com."
}

function formatMessage(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-400 underline hover:text-blue-300" target="_self">$1</a>')
    .replace(/\n/g, '<br/>')
}

const tierColors: Record<string, string> = {
  awareness: 'bg-[#71717a]',
  warm: 'bg-blue-500',
  hot: 'bg-orange-500',
  qualified: 'bg-green-500',
}

const tierLabels: Record<string, string> = {
  awareness: 'Online',
  warm: 'Engaged',
  hot: 'High Intent',
  qualified: 'Ready to Talk',
}

export default function AriaX() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [quickReplies, setQuickReplies] = useState<string[]>(['What is CircuitOS?', 'How does it work?', 'See pricing'])
  const [isTyping, setIsTyping] = useState(false)
  const [leadTier, setLeadTier] = useState('awareness')
  const [hasNotification, setHasNotification] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const greetedRef = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Show greeting when first opened
  useEffect(() => {
    if (isOpen && !greetedRef.current && messages.length === 0) {
      greetedRef.current = true
      setIsTyping(true)
      setTimeout(() => {
        setMessages([{
          role: 'assistant',
          content: "Hey, I'm Aria X — the CircuitOS concierge. I can walk you through the platform, answer questions about scoring, outreach, content intelligence, or pricing. What can I help with?",
        }])
        setIsTyping(false)
      }, 600)
    }
  }, [isOpen, messages.length])

  // Proactive nudge after 15s on site
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && messages.length === 0) {
        setHasNotification(true)
      }
    }, 15000)
    return () => clearTimeout(timer)
  }, [isOpen, messages.length])

  const sendMessage = useCallback(async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || isTyping) return
    setInput('')
    setHasNotification(false)

    const userMsg: Message = { role: 'user', content: msg }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: updatedMessages.slice(-20),
        }),
      })

      if (!res.ok) throw new Error('API error')

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      if (data.lead_tier) setLeadTier(data.lead_tier)
      if (data.quick_replies) setQuickReplies(data.quick_replies)
    } catch {
      // Fallback to local matching
      const answer = localFallback(msg)
      setMessages(prev => [...prev, { role: 'assistant', content: answer }])
    } finally {
      setIsTyping(false)
    }
  }, [input, isTyping, messages])

  return (
    <>
      {/* Toggle button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Notification badge */}
        {hasNotification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute -top-2 -left-48 bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-[#a1a1aa] whitespace-nowrap shadow-lg"
          >
            Have questions? I can help.
            <div className="absolute top-1/2 right-0 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#18181b] border-r border-t border-[#27272a] rotate-45" />
          </motion.div>
        )}
        <button
          onClick={() => { setIsOpen(!isOpen); setHasNotification(false) }}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? 'bg-[#18181b] border border-[#27272a]'
              : 'bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 hover:scale-105'
          }`}
          aria-label={isOpen ? 'Close chat' : 'Open Aria X assistant'}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {hasNotification && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-black" />
              )}
            </>
          )}
        </button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] bg-black rounded-xl shadow-2xl flex flex-col border border-[#27272a] overflow-hidden"
            role="dialog"
            aria-label="Aria X chat assistant"
          >
            {/* Header */}
            <div className="bg-[#0a0a0a] px-5 py-4 flex items-center justify-between border-b border-[#27272a]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <span className="text-white font-bold text-xs">AX</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Aria X</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${tierColors[leadTier] || tierColors.awareness}`} />
                    <span className="text-[#71717a] text-xs">{tierLabels[leadTier] || 'Online'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#71717a] hover:text-white transition-colors p-1"
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-[8px]">AX</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#18181b] text-[#e4e4e7] border border-[#27272a]'
                    }`}
                  >
                    <span
                      className="whitespace-pre-wrap [&_a]:text-blue-400 [&_a]:underline [&_a:hover]:text-blue-300"
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                    />
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <span className="text-white font-bold text-[8px]">AX</span>
                  </div>
                  <div className="bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-[#71717a] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#71717a] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-2 h-2 bg-[#71717a] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {!isTyping && quickReplies.length > 0 && (
              <div className="px-4 py-2.5 border-t border-[#27272a] flex flex-wrap gap-2">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(reply)}
                    className="px-3 py-1.5 text-xs bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-blue-400 border border-[#27272a] hover:border-blue-500/40 rounded-full transition-all duration-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-[#27272a]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Ask about CircuitOS..."
                  className="flex-1 bg-[#18181b] text-white border border-[#27272a] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder:text-[#52525b]"
                  disabled={isTyping}
                  aria-label="Chat message"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isTyping || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-[#27272a] disabled:text-[#52525b] text-white rounded-lg px-3.5 py-2.5 transition-colors"
                  aria-label="Send message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
              <p className="text-[#3f3f46] text-[10px] mt-2 text-center">
                Powered by CircuitOS
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
