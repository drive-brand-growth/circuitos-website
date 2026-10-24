import PageShell from '@/components/PageShell'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Container from '@/components/ui/Container'
import NewsletterForm from '@/components/NewsletterForm'
import SectionHeader from '@/components/ui/SectionHeader'
import StageDiagram from '@/components/ui/StageDiagram'
import { getHome, getSite, listNotes, listSteps } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

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
      <section className="rise px-6 pb-8 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="kicker">{home.kicker}</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">{site.promise}</h1>
          <p className="mt-6 text-2xl tracking-tight text-[var(--fg)] sm:text-3xl">{site.tagline}</p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">{home.intro}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={home.primaryHref}>{home.primaryLabel}</Button>
            <Button href={home.secondaryHref} variant="secondary">
              {home.secondaryLabel}
            </Button>
          </div>
        </div>
      </section>

      <section id="circuit" className="px-6 py-20 sm:py-28">
        <Container width="page">
          <SectionHeader
            align="center"
            kicker={home.circuitKicker}
            title={home.circuitTitle}
            lede={home.circuitLede}
          />
          <div className="mt-12">
            <StageDiagram
              centerTitle={home.diagramTitle}
              centerLine={home.diagramLine}
              stages={steps.map((step) => ({
                slug: step.slug,
                name: step.entry.name,
                href: `/method/${step.slug}`,
                accent: step.entry.accent,
              }))}
            />
          </div>
          <ol className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
        <Container width="page">
          <p className="mx-auto max-w-3xl text-center text-3xl font-semibold tracking-tight sm:text-4xl">{site.coreLine}</p>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-[var(--muted)]">{home.coreSupport}</p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {home.pillars.map((pillar) => (
              <Card key={pillar.href} href={pillar.href}>
                <p className="kicker">{pillar.kicker}</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">{pillar.title}</h2>
                <p className="mt-3 leading-relaxed text-[var(--muted)]">{pillar.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {featured ? (
        <section className="px-6 py-20">
          <Container width="page">
            <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-end">
              <SectionHeader kicker={home.notesKicker} title={home.notesTitle} lede={home.notesLede} />
              <Card href={`/field-notes/${featured.slug}`} className="md:p-8">
                <p className="kicker">{featured.entry.kicker}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{featured.entry.title}</h3>
                <p className="mt-3 text-[var(--muted)]">{featured.entry.description}</p>
                <p className="mt-6 text-sm font-medium">Read the note</p>
              </Card>
            </div>
          </Container>
        </section>
      ) : null}

      <section id="notes" className="px-6 py-20 sm:py-28">
        <Container>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{home.newsletterTitle}</h2>
          <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">{home.newsletterLede}</p>
          <NewsletterForm />
        </Container>
      </section>
    </PageShell>
  )
}
