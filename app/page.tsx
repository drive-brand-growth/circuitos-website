import PageShell from '@/components/PageShell'
import { getHome, getSite, isHeldCopy, listNotes, listSteps } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

function paragraphs(value: string | null | undefined) {
  return (value ?? '')
    .split(/\n+/)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter((part) => part && !isHeldCopy(part))
}

const proofCards = [
  { title: 'Recorded', text: 'The rule and the approval are written down.' },
  { title: 'Measured', text: 'The odds you stated can be scored later.' },
  { title: 'Proven', text: 'You can say what caused the result.' },
]

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
  const proof = paragraphs(home.proofBody)

  return (
    <PageShell>
      <section className="pt-36 pb-24 px-6 hero-glow overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#27272a] bg-[#27272a]/30 text-sm text-[#a1a1aa] mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            {home.kicker}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold gradient-text mb-8 hero-headline">
            {home.headline}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-6 leading-[1.5] font-medium">
            {site.tagline}
          </p>
          <div className="text-base sm:text-lg text-[#a1a1aa] max-w-2xl mx-auto mb-10 leading-relaxed space-y-4">
            {paragraphs(home.intro).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href={home.primaryHref}
              className="w-full sm:w-auto px-8 py-3.5 btn-primary text-white rounded-lg font-semibold text-base"
            >
              {home.primaryLabel}
            </a>
            <a
              href="/method"
              className="w-full sm:w-auto px-8 py-3.5 border border-[#27272a] rounded-lg font-semibold hover:bg-white/5 transition-colors text-base"
            >
              Read the method
            </a>
          </div>
          {home.calibration ? (
            <p className="mt-10 text-base sm:text-lg text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
              {home.calibration}
            </p>
          ) : null}
        </div>
      </section>

      <section className="section-padding px-6 border-t border-[#27272a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">{home.villainTitle}</h2>
            <div className="text-[#a1a1aa] max-w-2xl mx-auto text-lg leading-[1.6] space-y-4">
              {paragraphs(home.villainBody).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {home.pillars.map((pillar) => (
              <a key={pillar.href + pillar.title} href={pillar.href} className="card rounded-xl p-8 block">
                <span className="text-sm text-blue-500 font-mono font-semibold">{pillar.kicker}</span>
                <h3 className="text-xl font-bold mt-3 mb-1">{pillar.title}</h3>
                <p className="text-[#a1a1aa] text-sm leading-relaxed">{pillar.text}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding px-6 border-t border-[#27272a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">{home.revealTitle}</h2>
            <p className="text-white/90 text-lg font-medium mb-4">{home.circuitLede}</p>
            <div className="text-[#a1a1aa] max-w-2xl mx-auto text-lg leading-[1.6] space-y-4">
              {paragraphs(home.exampleLede).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step) => (
              <li key={step.slug}>
                <a href={`/method/${step.slug}`} className="card rounded-xl p-6 block h-full">
                  <span className="text-sm text-blue-500 font-mono font-semibold">0{step.entry.order}</span>
                  <h3 className="text-xl font-bold mt-3 mb-1">{step.entry.name}</h3>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed">{step.entry.line}</p>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {origin.length > 0 ? (
        <section className="section-padding px-6 border-t border-[#27272a]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-[-0.02em]">{home.originTitle}</h2>
            <div className="space-y-5 text-[#a1a1aa] text-lg leading-[1.6]">
              {origin.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-padding px-6 border-t border-[#27272a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">{home.proofTitle}</h2>
            <div className="text-[#a1a1aa] max-w-2xl mx-auto text-lg leading-[1.6] space-y-4">
              {proof.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {proofCards.map((card) => (
              <div key={card.title} className="card rounded-xl p-8">
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-[#a1a1aa] text-sm leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
          {featured ? (
            <a href={`/field-notes/${featured.slug}`} className="card rounded-xl p-8 block mt-6">
              <span className="text-sm text-blue-500 font-mono font-semibold">{home.notesKicker}</span>
              <h3 className="text-xl font-bold mt-3 mb-1">{featured.entry.title}</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">{featured.entry.description}</p>
            </a>
          ) : null}
        </div>
      </section>

      <section id="autopsy" className="section-padding px-6 border-t border-[#27272a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">Pipeline Autopsy</h2>
          <p className="text-lg sm:text-xl text-white/90 font-medium mb-4">Free. Send a pipeline export. Get a scored report.</p>
          <p className="text-[#a1a1aa] text-lg leading-[1.6] mb-8">
            The report covers where deals die, which sources lie, rep reality, what will really close, and the rules that are missing.
          </p>
          <a href="/autopsy" className="inline-block px-8 py-3.5 btn-primary text-white rounded-lg font-semibold text-base">
            {home.primaryLabel}
          </a>
        </div>
      </section>
    </PageShell>
  )
}
