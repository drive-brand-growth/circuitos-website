import Link from 'next/link'
import PageShell from '@/components/PageShell'
import Button from '@/components/ui/Button'
import LoopDiagram from '@/components/ui/LoopDiagram'
import { fill, getHome, getSite, isHeldCopy, listNotes, listSteps } from '@/lib/content'
import { SCORECARD, summarize } from '@/lib/scorecard'
import { pageMeta } from '@/lib/seo'

function paragraphs(value: string | null | undefined) {
  return (value ?? '')
    .split(/\n+/)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter((part) => part && !isHeldCopy(part))
}

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`
}

/** "One. Two." becomes ["One.", "Two."] so the hero can set each sentence on its own line. */
function sentences(value: string) {
  return value.match(/[^.!?]+[.!?]*/g)?.map((part) => part.trim()).filter(Boolean) ?? [value]
}

const num = (index: number) => String(index + 1).padStart(2, '0')

export async function generateMetadata() {
  const [site, home] = await Promise.all([getSite(), getHome()])
  return {
    ...pageMeta({
      title: site.promise,
      description: site.description,
      path: '/',
      noindex: home.status !== 'published',
    }),
    title: { absolute: `${site.name} · ${site.promise}` },
  }
}

export default async function HomePage() {
  const [site, home, steps, notes] = await Promise.all([getSite(), getHome(), listSteps(), listNotes()])
  const featured = notes.find((note) => note.entry.featured)
  const origin = paragraphs(home.originBody)
  const record = summarize(SCORECARD)
  const mailto = `mailto:${site.contactEmail}`
  const headline = sentences(home.headline)
  const readout = [
    { label: 'Status', value: home.heroStatus || 'Proof in progress' },
    { label: 'Public scorecard', value: plural(record.total, 'call recorded', 'calls recorded') },
    { label: 'Calls scored', value: String(record.scored) },
  ]

  return (
    <PageShell>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="hero-glow grid-bg page-top">
        <div className="shell pb-section-sm">
          <p className="rise">
            <Link
              href="/proof"
              className="inline-flex min-h-9 items-center gap-2.5 rounded-full border border-line-strong bg-fg/[0.03] py-1.5 pl-3 pr-4 text-sm text-soft transition-colors duration-200 hover:border-subtle"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {home.heroStatus}
              <span aria-hidden="true" className="text-subtle">
                →
              </span>
            </Link>
          </p>
          <h1 id="hero-title" className="mt-8 max-w-[16ch] text-display text-fg">
            {headline.map((part, index) => (
              <span key={part} className={`block ${index > 0 ? 'text-muted' : ''}`}>
                {part}
              </span>
            ))}
          </h1>
          <p className="rise mt-8 max-w-measure text-lead text-soft" style={{ ['--i' as string]: 1 }}>
            {site.description}
          </p>
          <div className="rise mt-4 max-w-measure space-y-4 text-body text-muted" style={{ ['--i' as string]: 2 }}>
            {paragraphs(home.intro).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ ['--i' as string]: 3 }}>
            <Button href={mailto} className="w-full sm:w-auto">
              Get in touch
            </Button>
            <Button href="/proof" variant="secondary" className="w-full sm:w-auto">
              See how proof is scored
            </Button>
          </div>
        </div>
        <div className="shell">
          <dl className="grid grid-cols-1 divide-y divide-line border-t border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {readout.map((item, index) => (
              <div key={item.label} className={`py-5 sm:py-6 ${index > 0 ? 'sm:pl-6' : ''}`}>
                <dt className="font-mono text-eyebrow uppercase text-subtle">{item.label}</dt>
                <dd className="mt-3 font-mono text-sm text-soft">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Who it is for */}
      <section aria-labelledby="audience-title" className="section">
        <div className="shell">
          <div className="reveal max-w-3xl">
            <p className="eyebrow">{home.audienceKicker}</p>
            <h2 id="audience-title" className="mt-5 text-title text-fg">
              {home.audienceTitle}
            </h2>
            <div className="mt-6 max-w-measure space-y-4 text-lead text-muted">
              {paragraphs(home.audienceBody).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ul className="reveal mt-14 grid border-t border-line md:mt-20 md:grid-cols-3 md:divide-x md:divide-line">
            {home.audience.map((item, index) => (
              <li
                key={item.title}
                className={`border-b border-line py-8 md:border-b-0 md:py-10 ${index > 0 ? 'md:pl-8' : ''} ${index < home.audience.length - 1 ? 'md:pr-8' : ''}`}
              >
                <h3 className="text-subhead text-fg">{item.title}</h3>
                <p className="mt-3 text-body text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Three steps, then the five stage loop */}
      <section aria-labelledby="steps-title" className="section">
        <div className="shell">
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
            <div className="reveal lg:col-span-5">
              <p className="eyebrow">{home.stepsKicker}</p>
              <h2 id="steps-title" className="mt-5 text-title text-fg">
                {home.stepsTitle}
              </h2>
              <p className="mt-6 max-w-md text-lead text-muted">{home.stepsLede}</p>
              <LoopDiagram className="mt-10 w-full max-w-[26rem] lg:mt-14" />
            </div>
            <ol className="reveal border-b border-line lg:col-span-7">
              {home.plainSteps.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-line py-9 md:gap-x-10 md:py-11">
                  <span aria-hidden="true" className="pt-1.5 font-mono text-sm text-accent">
                    {num(index)}
                  </span>
                  <div>
                    <h3 className="text-heading text-fg">{step.title}</h3>
                    <p className="mt-3 max-w-xl text-body text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="reveal mt-20 md:mt-28">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-heading text-fg">{home.revealTitle}</h3>
                <p className="mt-3 max-w-xl text-body text-muted">{home.loopLede}</p>
              </div>
              <Link href="/method" className="link-block shrink-0">
                Read the method
              </Link>
            </div>
            <ol className="mt-8 grid overflow-hidden rounded-panel border border-line sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((step) => (
                <li key={step.slug} className="-mb-px -mr-px border-b border-r border-line">
                  <Link
                    href={`/method/${step.slug}`}
                    className="block h-full p-6 transition-colors duration-200 hover:bg-fg/[0.04] focus-visible:-outline-offset-2"
                  >
                    <span aria-hidden="true" className="font-mono text-xs text-accent">
                      0{step.entry.order}
                    </span>
                    <span className="mt-4 block text-[1.0625rem] font-semibold tracking-[-0.015em] text-fg">{step.entry.name}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-muted">{step.entry.line}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Proof in progress */}
      <section aria-labelledby="proof-title" className="section">
        <div className="shell">
          <div className="grid items-start gap-x-16 gap-y-12 lg:grid-cols-12">
            <div className="reveal lg:col-span-5">
              <p className="eyebrow">{home.proofKicker}</p>
              <h2 id="proof-title" className="mt-5 text-title text-fg">
                {home.proofTitle}
              </h2>
              <div className="mt-6 max-w-md space-y-4 text-lead text-muted">
                {paragraphs(home.proofBody).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button href="/proof" className="w-full whitespace-nowrap sm:w-auto">
                  How proof is scored
                </Button>
                <Button href="/scorecard" variant="secondary" className="w-full whitespace-nowrap sm:w-auto">
                  Open the scorecard
                </Button>
              </div>
            </div>

            {/* A plain preview of the public record. It reads from the same data as /scorecard. */}
            <div className="reveal lg:col-span-7">
              <div className="panel overflow-hidden">
                <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
                  <p className="font-mono text-eyebrow uppercase text-subtle">Public scorecard</p>
                  <p className="inline-flex items-center gap-2 font-mono text-xs text-soft">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {plural(record.total, 'call recorded', 'calls recorded')}
                  </p>
                </div>
                <div aria-hidden="true" className="grid grid-cols-3 gap-4 border-b border-line px-5 py-3 text-xs text-subtle sm:grid-cols-4 sm:px-6">
                  <span>Date stated</span>
                  <span>Stated odds</span>
                  <span className="hidden sm:block">Outcome</span>
                  <span className="text-right">Brier term</span>
                </div>
                <p className="px-5 py-14 text-center text-sm text-muted sm:px-6 sm:py-20">
                  {record.total === 0
                    ? 'No calls recorded yet. The record starts on the day a call is stated.'
                    : `${plural(record.scored, 'call', 'calls')} scored so far. Open the scorecard for the full record.`}
                </p>
              </div>
              <ol className="mt-2">
                {home.proofPoints.map((point, index) => (
                  <li key={point.title} className="grid grid-cols-[auto_1fr] gap-x-6 border-b border-line py-7">
                    <span aria-hidden="true" className="pt-1 font-mono text-sm text-accent">
                      {num(index)}
                    </span>
                    <div>
                      <h3 className="text-subhead text-fg">{point.title}</h3>
                      <p className="mt-2 text-body text-muted">{point.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* What I teach, and the work behind it */}
      <section aria-labelledby="teach-title" className="section">
        <div className="shell">
          <div className="reveal max-w-3xl">
            <h2 id="teach-title" className="text-title text-fg">
              {home.villainTitle}
            </h2>
            <div className="mt-6 max-w-measure space-y-4 text-lead text-muted">
              {paragraphs(home.villainBody).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ul className={`reveal mt-14 grid gap-4 ${home.pillars.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {home.pillars.map((pillar) => (
              <li key={pillar.href + pillar.title}>
                <Link href={pillar.href} className="panel-link h-full p-7">
                  <span className="font-mono text-eyebrow uppercase text-subtle">{pillar.kicker}</span>
                  <h3 className="mt-5 text-subhead text-fg">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{pillar.text}</p>
                </Link>
              </li>
            ))}
          </ul>

          {origin.length > 0 || featured ? (
            <div className="reveal mt-16 grid gap-x-16 gap-y-10 border-t border-line pt-12 md:mt-20 lg:grid-cols-12">
              {origin.length > 0 ? (
                <div className="lg:col-span-5">
                  <h3 className="text-subhead text-fg">{home.originTitle}</h3>
                  <div className="mt-3 space-y-4 text-body text-muted">
                    {origin.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ) : null}
              {featured ? (
                <div className="lg:col-span-7">
                  <Link href={`/field-notes/${featured.slug}`} className="panel-link p-7">
                    <span className="font-mono text-eyebrow uppercase text-subtle">{home.notesKicker}</span>
                    <h3 className="mt-5 text-subhead text-fg">{featured.entry.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{featured.entry.description}</p>
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {/* Contact */}
      <section aria-labelledby="contact-title" className="section hero-glow overflow-hidden">
        <div className="shell">
          <div className="reveal mx-auto max-w-3xl text-center">
            <p className="eyebrow">{home.contactKicker}</p>
            <h2 id="contact-title" className="mt-5 text-title text-fg">
              {home.contactTitle}
            </h2>
            <div className="mx-auto mt-6 max-w-measure space-y-4 text-lead text-muted">
              {paragraphs(home.contactBody).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button href={mailto} className="w-full sm:w-auto">
                {fill(home.contactLabel, site.contactEmail)}
              </Button>
            </div>
          </div>
          <aside
            id="autopsy"
            aria-labelledby="autopsy-title"
            className="reveal panel mx-auto mt-16 grid max-w-4xl gap-6 p-7 md:mt-20 md:grid-cols-[1fr_auto] md:items-center md:p-9"
          >
            <div>
              <h3 id="autopsy-title" className="text-subhead text-fg">
                Pipeline Autopsy
              </h3>
              <p className="mt-2 text-body text-soft">Free. Send a pipeline export. Get a scored report.</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                The report covers where deals die, which sources lie, rep reality, what will really close, and the rules
                that are missing.
              </p>
            </div>
            <Button href={home.primaryHref || '/autopsy'} variant="secondary" className="w-full md:w-auto">
              {home.primaryLabel}
            </Button>
          </aside>
        </div>
      </section>
    </PageShell>
  )
}
