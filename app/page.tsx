import PageShell from '@/components/PageShell'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Container from '@/components/ui/Container'
import NewsletterForm from '@/components/NewsletterForm'
import SectionHeader from '@/components/ui/SectionHeader'
import CircuitBoard from '@/components/ui/CircuitBoard'
import { getHome, getSite, listNotes, listSteps } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

function paragraphs(value: string | null | undefined) {
  return (value ?? '')
    .split(/\n+/)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
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

export default async function HomePage() {
  const [site, home, steps, notes] = await Promise.all([getSite(), getHome(), listSteps(), listNotes()])
  const featured = notes.find((note) => note.entry.featured)

  return (
    <PageShell>
      <section className="rise px-6 pb-8 pt-24 sm:pt-32">
        <div className="mx-auto max-w-[65ch] text-center">
          <p className="kicker">{home.kicker}</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">{home.headline}</h1>
          <div className="mt-8 space-y-5 text-[var(--muted)]">
            {paragraphs(home.intro).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-28">
        <Container>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{home.villainTitle}</h2>
          <div className="mt-8 space-y-5 text-[var(--muted)]">
            {paragraphs(home.villainBody).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-10 text-3xl font-semibold tracking-tight sm:text-4xl">{site.coreLine}</p>
          <p className="mt-5 text-[var(--muted)]">{home.coreSupport}</p>
        </Container>
      </section>

      <section className="px-6 py-20 sm:py-28">
        <Container>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{home.originTitle}</h2>
          <div className="mt-8 space-y-5 text-[var(--muted)]">
            {paragraphs(home.originBody).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {home.circuitLede ? (
            <p className="mt-12 text-3xl font-semibold tracking-tight sm:text-4xl">{home.circuitLede}</p>
          ) : null}
        </Container>
      </section>

      <section id="circuit" className="px-6 py-20 sm:py-32">
        <Container width="page">
          <SectionHeader align="center" title={home.revealTitle} lede={site.tagline} />
          <div className="mt-14 -mx-6 sm:mx-0">
            <CircuitBoard
              stages={steps.map((step) => ({
                slug: step.slug,
                name: step.entry.name,
                href: `/method/${step.slug}`,
                line: step.entry.line ?? '',
              }))}
            />
          </div>
          <div className="mx-auto mt-20 max-w-[65ch] text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{home.exampleTitle}</h2>
            <div className="mt-6 space-y-5 text-left text-[var(--muted)] sm:text-center">
              {paragraphs(home.exampleLede).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ol className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step) => (
              <li key={step.slug}>
                <Card href={`/method/${step.slug}`} className="h-full p-5">
                  {step.entry.accent ? (
                    <span className="mb-3 inline-block h-1.5 w-1.5 rounded-full bg-[var(--switch)]" aria-hidden />
                  ) : (
                    <span className="font-mono text-xs text-[var(--muted)]">0{step.entry.order}</span>
                  )}
                  <h3 className="mt-2 font-semibold">{step.entry.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.entry.line}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="px-6 py-20 sm:py-28">
        <Container>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{home.proofTitle}</h2>
          <div className="mt-8 space-y-5 text-[var(--muted)]">
            {paragraphs(home.proofBody).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 grid gap-4">
            {home.pillars.map((pillar) => (
              <Card key={pillar.href} href={pillar.href}>
                <p className="kicker">{pillar.kicker}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{pillar.title}</h3>
                <p className="mt-3 text-[var(--muted)]">{pillar.text}</p>
              </Card>
            ))}
          </div>
          {featured ? (
            <Card href={`/field-notes/${featured.slug}`} className="mt-4">
              <p className="kicker">{home.notesKicker}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">{featured.entry.title}</h3>
              <p className="mt-3 text-[var(--muted)]">{featured.entry.description}</p>
            </Card>
          ) : null}
          <div className="mt-12">
            <Button href={home.primaryHref}>{home.primaryLabel}</Button>
          </div>
        </Container>
      </section>

      <section id="notes" className="px-6 py-20 sm:py-28">
        <Container>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{home.newsletterTitle}</h2>
          <p className="mt-4 text-[var(--muted)]">{home.newsletterLede}</p>
          <NewsletterForm />
        </Container>
      </section>
    </PageShell>
  )
}
