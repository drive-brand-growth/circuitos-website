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

const shell = 'mx-auto w-full max-w-6xl px-6'
const band = 'border-t border-[#27272a] py-20 md:py-28'
const kicker = 'font-mono text-sm font-medium text-blue-400'
const h2 = 'mt-3 text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white'
const body = 'text-[#a1a1aa] text-lg leading-[1.6]'
const textLink =
  'inline-flex min-h-11 items-center font-medium text-blue-400 underline decoration-blue-400/40 underline-offset-4 hover:text-blue-300'

export default async function HomePage() {
  const [site, home, steps, notes] = await Promise.all([getSite(), getHome(), listSteps(), listNotes()])
  const featured = notes.find((note) => note.entry.featured)
  const origin = paragraphs(home.originBody)
  const record = summarize(SCORECARD)
  const mailto = `mailto:${site.contactEmail}`

  return (
    <PageShell>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div
          aria-hidden="true"
          className="grid-bg pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        <div className={`${shell} relative grid items-center gap-12 lg:grid-cols-12 lg:gap-10`}>
          <div className="lg:col-span-7">
            <p className={kicker}>{home.kicker}</p>
            <h1
              id="hero-title"
              className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-[-0.03em] text-white"
            >
              {home.headline}
            </h1>
            <p className="mt-7 max-w-2xl text-xl md:text-2xl font-medium leading-[1.45] text-[#e4e4e7]">
              {site.description}
            </p>
            <div className={`mt-5 max-w-2xl space-y-4 ${body}`}>
              {paragraphs(home.intro).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button href={mailto} className="w-full sm:w-auto">
                Get in touch
              </Button>
              <Button href="/proof" variant="secondary" className="w-full sm:w-auto">
                See how proof is scored
              </Button>
            </div>
            {home.heroStatus ? (
              <p className="mt-8 flex items-start gap-3 text-sm text-[#a1a1aa]">
                <span aria-hidden="true" className="mt-[0.4rem] h-2 w-2 shrink-0 rounded-full border border-blue-400" />
                <span>
                  {home.heroStatus}{' '}
                  <Link href="/scorecard" className="text-blue-400 underline decoration-blue-400/40 underline-offset-4 hover:text-blue-300">
                    The scorecard is public
                  </Link>
                  .
                </span>
              </p>
            ) : null}
          </div>
          <div className="lg:col-span-5">
            <LoopDiagram className="mx-auto w-full max-w-md lg:max-w-none" />
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section aria-labelledby="audience-title" className={band}>
        <div className={`${shell} grid gap-10 lg:grid-cols-12`}>
          <div className="lg:col-span-5">
            <p className={kicker}>{home.audienceKicker}</p>
            <h2 id="audience-title" className={h2}>
              {home.audienceTitle}
            </h2>
            <div className={`mt-5 space-y-4 ${body}`}>
              {paragraphs(home.audienceBody).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ul className="divide-y divide-[#27272a] border-y border-[#27272a] lg:col-span-7">
            {home.audience.map((item) => (
              <li key={item.title} className="py-6">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-[#a1a1aa] leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Three steps, then the five stage loop */}
      <section aria-labelledby="steps-title" className={band}>
        <div className={shell}>
          <div className="max-w-2xl">
            <p className={kicker}>{home.stepsKicker}</p>
            <h2 id="steps-title" className={h2}>
              {home.stepsTitle}
            </h2>
            <p className={`mt-5 ${body}`}>{home.stepsLede}</p>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-[#3f3f46] bg-[#3f3f46] md:grid-cols-3">
            {home.plainSteps.map((step, index) => (
              <li key={step.title} className="bg-black p-7 md:p-8">
                <p aria-hidden="true" className="font-mono text-sm font-medium text-blue-400">
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-[#a1a1aa] leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-16">
            <h3 className="text-xl font-bold text-white">{home.revealTitle}</h3>
            <p className="mt-2 max-w-2xl text-[#a1a1aa] leading-relaxed">{home.loopLede}</p>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((step) => (
                <li key={step.slug}>
                  <Link
                    href={`/method/${step.slug}`}
                    className="block h-full rounded-lg border border-[#3f3f46] bg-white/[0.02] p-5 transition-colors hover:border-[#71717a] hover:bg-white/[0.04]"
                  >
                    <span aria-hidden="true" className="font-mono text-sm font-medium text-blue-400">
                      0{step.entry.order}
                    </span>
                    <span className="mt-2 block text-base font-semibold text-white">{step.entry.name}</span>
                    <span className="mt-1 block text-sm text-[#a1a1aa] leading-relaxed">{step.entry.line}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-6">
              <Link href="/method" className={textLink}>
                Read the method
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Proof in progress */}
      <section aria-labelledby="proof-title" className={band}>
        <div className={`${shell} grid gap-10 lg:grid-cols-12`}>
          <div className="lg:col-span-5">
            <p className={kicker}>{home.proofKicker}</p>
            <h2 id="proof-title" className={h2}>
              {home.proofTitle}
            </h2>
            <div className={`mt-5 space-y-4 ${body}`}>
              {paragraphs(home.proofBody).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href="/proof" className="w-full whitespace-nowrap sm:w-auto">
                How proof is scored
              </Button>
              <Button href="/scorecard" variant="secondary" className="w-full whitespace-nowrap sm:w-auto">
                Open the scorecard
              </Button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ol className="divide-y divide-[#27272a] border-y border-[#27272a]">
              {home.proofPoints.map((point, index) => (
                <li key={point.title} className="flex gap-5 py-6">
                  <span aria-hidden="true" className="font-mono text-sm font-medium text-blue-400 pt-1">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{point.title}</h3>
                    <p className="mt-2 text-[#a1a1aa] leading-relaxed">{point.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#3f3f46] bg-white/[0.02] px-5 py-4">
                <dt className="text-xs font-medium text-[#a1a1aa]">Public scorecard</dt>
                <dd className="mt-1 font-mono text-sm text-white">{plural(record.total, 'call recorded', 'calls recorded')}</dd>
              </div>
              <div className="rounded-lg border border-[#3f3f46] bg-white/[0.02] px-5 py-4">
                <dt className="text-xs font-medium text-[#a1a1aa]">Scored so far</dt>
                <dd className="mt-1 font-mono text-sm text-white">{plural(record.scored, 'call', 'calls')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* What I teach, and the work behind it */}
      <section aria-labelledby="teach-title" className={band}>
        <div className={shell}>
          <div className="max-w-2xl">
            <h2 id="teach-title" className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white">
              {home.villainTitle}
            </h2>
            <div className={`mt-5 space-y-4 ${body}`}>
              {paragraphs(home.villainBody).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ul className={`mt-10 grid gap-4 ${home.pillars.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {home.pillars.map((pillar) => (
              <li key={pillar.href + pillar.title}>
                <Link
                  href={pillar.href}
                  className="block h-full rounded-xl border border-[#3f3f46] bg-white/[0.02] p-7 transition-colors hover:border-[#71717a] hover:bg-white/[0.04]"
                >
                  <span className="font-mono text-sm font-medium text-blue-400">{pillar.kicker}</span>
                  <h3 className="mt-3 text-xl font-bold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-[#a1a1aa] leading-relaxed">{pillar.text}</p>
                </Link>
              </li>
            ))}
          </ul>

          {origin.length > 0 || featured ? (
            <div className="mt-16 grid gap-10 lg:grid-cols-12">
              {origin.length > 0 ? (
                <div className="lg:col-span-6">
                  <h3 className="text-xl font-bold text-white">{home.originTitle}</h3>
                  <div className="mt-3 space-y-4 text-[#a1a1aa] leading-relaxed">
                    {origin.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ) : null}
              {featured ? (
                <div className="lg:col-span-6">
                  <Link
                    href={`/field-notes/${featured.slug}`}
                    className="block rounded-xl border border-[#3f3f46] bg-white/[0.02] p-7 transition-colors hover:border-[#71717a] hover:bg-white/[0.04]"
                  >
                    <span className="font-mono text-sm font-medium text-blue-400">{home.notesKicker}</span>
                    <h3 className="mt-3 text-xl font-bold text-white">{featured.entry.title}</h3>
                    <p className="mt-2 text-sm text-[#a1a1aa] leading-relaxed">{featured.entry.description}</p>
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {/* Contact */}
      <section aria-labelledby="contact-title" className={band}>
        <div className={`${shell} grid gap-10 lg:grid-cols-12`}>
          <div className="lg:col-span-7">
            <p className={kicker}>{home.contactKicker}</p>
            <h2 id="contact-title" className={h2}>
              {home.contactTitle}
            </h2>
            <div className={`mt-5 max-w-2xl space-y-4 ${body}`}>
              {paragraphs(home.contactBody).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <Button href={mailto} className="w-full sm:w-auto">
                {fill(home.contactLabel, site.contactEmail)}
              </Button>
            </div>
          </div>
          <aside
            id="autopsy"
            aria-labelledby="autopsy-title"
            className="rounded-xl border border-[#3f3f46] bg-white/[0.02] p-7 lg:col-span-5"
          >
            <h3 id="autopsy-title" className="text-xl font-bold text-white">
              Pipeline Autopsy
            </h3>
            <p className="mt-3 font-medium text-[#e4e4e7]">Free. Send a pipeline export. Get a scored report.</p>
            <p className="mt-3 text-[#a1a1aa] leading-relaxed">
              The report covers where deals die, which sources lie, rep reality, what will really close, and the rules
              that are missing.
            </p>
            <p className="mt-4">
              <Link href={home.primaryHref || '/autopsy'} className={textLink}>
                {home.primaryLabel}
              </Link>
            </p>
          </aside>
        </div>
      </section>
    </PageShell>
  )
}
