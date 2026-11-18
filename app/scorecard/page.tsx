import Link from 'next/link'
import PageShell from '@/components/PageShell'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import { pageMeta } from '@/lib/seo'
import { SCORECARD, brierTerm, sortedEntries, summarize, type ScorecardEntry } from '@/lib/scorecard'

const TITLE = 'Scorecard'
const DESCRIPTION =
  'A dated public record of calls with their stated odds, scored later against a baseline. The record is empty until a real call is stated.'

export function generateMetadata() {
  return pageMeta({ title: TITLE, description: DESCRIPTION, path: '/scorecard' })
}

const COLUMNS = [
  { key: 'dateStated', label: 'Date stated', help: 'The day the call was written down, before the outcome was known.' },
  { key: 'call', label: 'Call', help: 'One sentence that can be judged true or false on the resolve date.' },
  { key: 'statedOdds', label: 'Stated odds', help: 'The odds given for the call on the day it was stated. Never edited later.' },
  { key: 'baselineOdds', label: 'Baseline', help: 'The simple guess to beat, such as the base rate, written down with the call.' },
  { key: 'resolveBy', label: 'Resolves by', help: 'The day the call can be judged.' },
  { key: 'outcome', label: 'Outcome', help: 'Pending, happened, or did not happen. Filled in on the day it is scored.' },
  { key: 'brier', label: 'Brier term', help: 'The squared gap between the odds and what happened, for the call and for the baseline. Lower is better.' },
] as const

const OUTCOME_LABEL: Record<ScorecardEntry['outcome'], string> = {
  pending: 'Pending',
  happened: 'Happened',
  'did-not-happen': 'Did not happen',
}

function percent(odds: number) {
  return `${Math.round(odds * 100)}%`
}

function score(value: number | null) {
  return value === null ? 'Not scored yet' : value.toFixed(3)
}

function cells(entry: ScorecardEntry) {
  const call = brierTerm(entry.statedOdds, entry.outcome)
  const baseline = brierTerm(entry.baselineOdds, entry.outcome)
  return {
    dateStated: entry.dateStated,
    call: entry.call,
    statedOdds: percent(entry.statedOdds),
    baselineOdds: percent(entry.baselineOdds),
    resolveBy: entry.resolveBy,
    outcome: entry.dateScored ? `${OUTCOME_LABEL[entry.outcome]}, scored ${entry.dateScored}` : OUTCOME_LABEL[entry.outcome],
    brier: call === null || baseline === null ? 'Not scored yet' : `${call.toFixed(3)} against ${baseline.toFixed(3)}`,
  }
}

export default function ScorecardPage() {
  const entries = sortedEntries(SCORECARD)
  const summary = summarize(entries)
  const stats = [
    { label: 'Calls recorded', value: String(summary.total) },
    { label: 'Awaiting outcome', value: String(summary.pending) },
    { label: 'Scored', value: String(summary.scored) },
    { label: 'Brier score', value: score(summary.brier) },
    { label: 'Baseline Brier score', value: score(summary.baselineBrier) },
  ]

  return (
    <PageShell>
      <article className="grid-bg pb-20 pt-36">
        <Container>
          <SectionHeader as="h1" kicker="Public record" title="Scorecard" />
          <div className="mt-8 space-y-5 text-[#a1a1aa] text-lg leading-[1.6]">
            <p>
              A dated record of calls. Each call goes in with its stated odds before the outcome is known. It gets
              scored later, next to a baseline.
            </p>
            {entries.length === 0 ? (
              <p>
                The record is empty today. No call has been stated in public yet, so there is nothing to score. Nothing
                on this page is a sample.
              </p>
            ) : (
              <p>Every call stays on the record, including the ones that miss. Nothing on this page is a sample.</p>
            )}
          </div>
        </Container>

        <div className="mx-auto mt-12 w-full max-w-6xl px-6">
          <section aria-labelledby="scorecard-summary">
            <h2 id="scorecard-summary" className="sr-only">
              Summary
            </h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-[#3f3f46] bg-white/[0.02] px-4 py-4">
                  <dt className="text-xs font-medium text-[#a1a1aa]">{stat.label}</dt>
                  <dd className="mt-1 font-mono text-base text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="scorecard-record" className="mt-10">
            <h2 id="scorecard-record" className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-white">
              The record
            </h2>

            {/* Narrow screens: one card per call. */}
            <div className="mt-6 space-y-4 min-[900px]:hidden">
              {entries.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#52525b] px-5 py-8 text-center text-[#d4d4d8]">
                  No calls recorded yet. The first entry appears here on the day a call is stated.
                </p>
              ) : (
                entries.map((entry) => {
                  const row = cells(entry)
                  return (
                    <div key={entry.id} id={entry.id} className="rounded-xl border border-[#3f3f46] bg-white/[0.02] p-5">
                      <dl>
                        {COLUMNS.map((column, index) => (
                          <div key={column.key} className={index > 0 ? 'mt-4' : ''}>
                            <dt className="text-xs font-medium text-[#a1a1aa]">{column.label}</dt>
                            <dd className="mt-1 text-sm leading-relaxed text-white break-words">{row[column.key]}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )
                })
              )}
            </div>

            {/* Wide screens: the table. */}
            <div
              className="mt-6 hidden overflow-x-auto rounded-xl border border-[#3f3f46] bg-white/[0.02] min-[900px]:block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              role="region"
              aria-labelledby="scorecard-record"
              tabIndex={0}
            >
              <table className="w-full min-w-[860px] text-left text-sm">
                <caption className="sr-only">
                  Calls with their stated odds, the baseline, the outcome, and the Brier term for each.
                </caption>
                <thead className="text-[#a1a1aa]">
                  <tr>
                    {COLUMNS.map((column) => (
                      <th key={column.key} scope="col" className="px-5 py-4 font-medium whitespace-nowrap">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr className="border-t border-[#3f3f46]">
                      <td colSpan={COLUMNS.length} className="px-5 py-12 text-center text-[#d4d4d8]">
                        No calls recorded yet. The first entry appears here on the day a call is stated.
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry) => {
                      const row = cells(entry)
                      return (
                        <tr key={entry.id} className="border-t border-[#3f3f46] text-white">
                          {COLUMNS.map((column) => (
                            <td
                              key={column.key}
                              className={`px-5 py-4 align-top ${column.key === 'call' ? '' : 'font-mono whitespace-nowrap'}`}
                            >
                              {row[column.key]}
                            </td>
                          ))}
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <Container>
          <section aria-labelledby="scorecard-columns" className="mt-16">
            <h2 id="scorecard-columns" className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-white">
              How to read it
            </h2>
            <dl className="mt-6 divide-y divide-[#27272a] border-y border-[#27272a]">
              {COLUMNS.map((column) => (
                <div key={column.key} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="font-medium text-white">{column.label}</dt>
                  <dd className="text-[#a1a1aa] leading-relaxed">{column.help}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="scorecard-rules" className="mt-16">
            <h2 id="scorecard-rules" className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-white">
              The rules of the record
            </h2>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-[#a1a1aa] text-lg leading-[1.6]">
              <li>A call is entered with its date and its odds before the outcome is known.</li>
              <li>The call, the date, the stated odds, and the baseline are never edited after that.</li>
              <li>Every call gets scored, including the ones that miss.</li>
              <li>The Brier score is always shown next to the baseline score on the same calls.</li>
              <li>There are no sample rows. If the record is empty, the page says it is empty.</li>
            </ol>
            <p className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/proof" className="text-blue-400 hover:text-blue-300 font-medium max-sm:inline-block max-sm:py-2">
                How results are scored
              </Link>
              <Link
                href="/forecasting"
                className="text-blue-400 hover:text-blue-300 font-medium max-sm:inline-block max-sm:py-2"
              >
                How a forecast is scored
              </Link>
            </p>
          </section>
        </Container>
      </article>
    </PageShell>
  )
}
