'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

// Lines of the JSON to type out one by one
const codeLines = [
  { text: '{', indent: 0, delay: 0 },
  { text: '"lead"', value: '"inbound_form"', indent: 1, delay: 100, keyColor: 'text-white', valColor: 'text-green-400' },
  { text: '"score"', value: '87.4', indent: 1, delay: 150, keyColor: 'text-white', valColor: 'text-blue-400' },
  { text: '"tier"', value: '"HIGH"', indent: 1, delay: 120, keyColor: 'text-white', valColor: 'text-green-400' },
  { text: '"action"', value: '"route_to_rep"', indent: 1, delay: 130, keyColor: 'text-white', valColor: 'text-green-400' },
  { text: '"enrichment"', value: '{', indent: 1, delay: 200, keyColor: 'text-white', valColor: 'text-[#a1a1aa]' },
  { text: '"sources_checked"', value: '6', indent: 2, delay: 100, keyColor: 'text-white', valColor: 'text-blue-400' },
  { text: '"web_presence"', value: '"verified"', indent: 2, delay: 120, keyColor: 'text-white', valColor: 'text-green-400' },
  { text: '"confidence"', value: '0.91', indent: 2, delay: 100, keyColor: 'text-white', valColor: 'text-blue-400' },
  { text: '}', indent: 1, delay: 80 },
  { text: '"governance"', value: '"approved"', indent: 1, delay: 150, keyColor: 'text-white', valColor: 'text-green-400' },
  { text: '"audit_trail"', value: 'true', indent: 1, delay: 120, keyColor: 'text-white', valColor: 'text-blue-400' },
  { text: '}', indent: 0, delay: 80 },
]

function TypingCode() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [done, setDone] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return
    let current = 0
    const showNext = () => {
      current++
      setVisibleLines(current)
      if (current < codeLines.length) {
        setTimeout(showNext, codeLines[current].delay + 60)
      } else {
        setDone(true)
      }
    }
    // Start after a short delay
    const timer = setTimeout(showNext, 500)
    return () => clearTimeout(timer)
  }, [isInView])

  const indent = (level: number) => '  '.repeat(level)

  return (
    <div ref={ref} className="code-block rounded-xl overflow-hidden glow">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#27272a]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]/80"></div>
          <div className="w-3 h-3 rounded-full bg-[#eab308]/80"></div>
          <div className="w-3 h-3 rounded-full bg-[#22c55e]/80"></div>
        </div>
        <span className="ml-4 text-xs text-[#52525b] font-mono">circuitos — scoring pipeline</span>
      </div>
      <pre className="p-6 text-sm overflow-x-auto leading-relaxed min-h-[320px]">
        <code className="text-[#a1a1aa]">
          {codeLines.map((line, i) => {
            if (i >= visibleLines) return null
            const isLast = i === visibleLines - 1 && !done

            if (!line.value) {
              // Plain bracket line
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {indent(line.indent)}{line.text}
                  {isLast && <span className="terminal-cursor">|</span>}
                </motion.div>
              )
            }

            // Determine if we need a comma (not last content line, not bracket closer)
            const needsComma = line.text !== '}' && i < codeLines.length - 2

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
              >
                {indent(line.indent)}
                <span className={line.keyColor}>{line.text}</span>
                {': '}
                <span className={line.valColor}>{line.value}</span>
                {needsComma ? ',' : ''}
                {isLast && <span className="terminal-cursor">|</span>}
              </motion.div>
            )
          })}
          {visibleLines === 0 && isInView && (
            <span className="terminal-cursor">|</span>
          )}
        </code>
      </pre>
    </div>
  )
}

export default function Hero() {
  return (
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
          Battle-tested across 6 live verticals
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold gradient-text mb-10 hero-headline"
        >
          Revenue intelligence<br />that learns
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg sm:text-xl md:text-2xl text-[#a1a1aa] max-w-2xl mx-auto mb-10 leading-[1.6]"
        >
          AI scores every lead. Content writes itself. Outreach runs autonomously.
          Every outcome feeds back into the model. The system gets smarter with every cycle.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <a href="/demo" className="w-full sm:w-auto px-8 py-3.5 btn-primary text-white rounded-lg font-semibold text-base">
            See It In Action
          </a>
          <a href="#how-it-works" className="w-full sm:w-auto px-8 py-3.5 border border-[#27272a] rounded-lg font-semibold hover:bg-white/5 transition-colors text-base">
            How It Works
          </a>
        </motion.div>
      </motion.div>

      {/* Pipeline Preview - Animated Typing */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="max-w-3xl mx-auto mt-16"
      >
        <TypingCode />
      </motion.div>
    </section>
  )
}
