'use client'

import { useState } from 'react'

const QUESTIONS = [
  {
    id: 'q1',
    question:
      'What is your identification strategy? How do you separate causation from correlation, specifically?',
    realAnswer:
      'A real answer names the confounders and the adjustment method (backdoor criterion, FWL residualization, or equivalent). Vague references to "advanced modeling" are not an identification strategy.',
  },
  {
    id: 'q2',
    question: 'What baseline is my lift measured against, and where is it stored?',
    realAnswer:
      'A real answer describes a measured per-segment counterfactual that is queryable. "Industry benchmarks" and "historical averages" are not baselines. Lift is mathematically undefined without one.',
  },
  {
    id: 'q3',
    question: 'Where is the confidence interval on this number?',
    realAnswer:
      'A real answer surfaces a confidence interval on every point estimate. A number without uncertainty is a decoration, not a measurement. If the UI only shows a single value, there is no real answer here.',
  },
  {
    id: 'q4',
    question:
      'What does your product do when a number is NOT proven: refuse, or round up?',
    realAnswer:
      'A real answer describes a designed refusal state you can screenshot. If every screen always shows a number, the product rounds up. That is the tell.',
  },
]

type Choice = 'clear' | 'fuzzy' | 'noanswer'

type Answers = Record<string, Choice | undefined>

function scoreFor(c: Choice | undefined): number {
  return c === 'clear' ? 1 : 0
}

function getVerdict(score: number): { label: string; color: string } {
  if (score === 4) {
    return {
      label: 'Causal machinery. Rare. Verify the receipts anyway.',
      color: 'text-green-400',
    }
  }
  if (score >= 2) {
    return {
      label: 'Partial rigor. Ask for the refusal screenshot.',
      color: 'text-yellow-400',
    }
  }
  return {
    label: 'Attribution theater. The number is a sales asset, not a measurement.',
    color: 'text-red-400',
  }
}

const OPTIONS: { value: Choice; label: string }[] = [
  { value: 'clear', label: 'Clear answer (1 pt)' },
  { value: 'fuzzy', label: 'Fuzzy answer (0)' },
  { value: 'noanswer', label: 'No answer (0)' },
]

function optionClass(selected: boolean, value: Choice): string {
  if (!selected) {
    return 'border-[#3f3f46] text-[#a1a1aa] hover:border-[#52525b]'
  }
  if (value === 'clear') return 'border-green-500/60 bg-green-500/10 text-green-300'
  if (value === 'fuzzy') return 'border-yellow-500/60 bg-yellow-500/10 text-yellow-300'
  return 'border-red-500/60 bg-red-500/10 text-red-300'
}

export default function Scorecard() {
  const [answers, setAnswers] = useState<Answers>({})

  const answered = Object.values(answers).filter(Boolean).length
  const score = QUESTIONS.reduce((acc, q) => acc + scoreFor(answers[q.id]), 0)
  const verdict = answered > 0 ? getVerdict(score) : null

  function pick(id: string, value: Choice) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div className="space-y-6">
      {QUESTIONS.map((q, idx) => (
        <div key={q.id} className="card rounded-xl p-6 border border-[#27272a]">
          <p className="text-xs font-medium text-blue-400 mb-2">Question {idx + 1} of 4</p>
          <p className="text-white font-semibold text-base md:text-lg mb-3 leading-snug">
            {q.question}
          </p>
          <p className="text-[#71717a] text-sm mb-5 leading-relaxed">
            <span className="text-[#a1a1aa] font-medium">What a real answer sounds like:</span>{' '}
            {q.realAnswer}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            {OPTIONS.map((opt) => {
              const selected = answers[q.id] === opt.value
              return (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2.5 cursor-pointer px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${optionClass(selected, opt.value)}`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.value}
                    className="sr-only"
                    checked={selected}
                    onChange={() => pick(q.id, opt.value)}
                  />
                  {opt.label}
                </label>
              )
            })}
          </div>
        </div>
      ))}

      {answered > 0 && (
        <div className="card rounded-xl p-6 border border-blue-500/20 mt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#a1a1aa] text-sm font-medium">Score</span>
            <span className="text-white text-2xl font-bold">{score} / 4</span>
          </div>
          <div className="w-full bg-[#27272a] rounded-full h-2 mb-4">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(score / 4) * 100}%` }}
            />
          </div>
          {verdict && (
            <p className={`text-sm font-semibold ${verdict.color}`}>{verdict.label}</p>
          )}
        </div>
      )}
    </div>
  )
}
