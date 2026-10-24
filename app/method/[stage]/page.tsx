import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageShell from '@/components/PageShell'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import { getStep, isHeldCopy, listSteps } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

type Params = { stage: string }

export async function generateStaticParams() {
  const steps = await listSteps({ drafts: true })
  return steps.map((step) => ({ stage: step.slug }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const step = await getStep(params.stage)
  if (!step) return {}
  return pageMeta({
    title: step.name,
    description: step.summary,
    path: `/method/${params.stage}`,
    noindex: step.status !== 'published',
  })
}

export default async function StageRoute({ params }: { params: Params }) {
  const step = await getStep(params.stage)
  if (!step) notFound()

  return (
    <PageShell>
      <article className="pb-24 pt-16 sm:pt-24">
        <Container>
          <p className="text-sm text-[var(--muted)]">
            <Link href="/method" className="link">
              The method
            </Link>
            <span className="px-2">/</span>
            <span className="font-mono">0{step.order}</span>
          </p>
          <div className="mt-8">
            <SectionHeader as="h1" kicker={step.kicker} title={step.name} />
          </div>
          <div className="reading mt-8 space-y-6 text-[var(--muted)]">
            {step.lede.filter((paragraph) => !isHeldCopy(paragraph)).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {step.sections.map((section) => {
            const paragraphs = section.paragraphs.filter((paragraph) => !isHeldCopy(paragraph))
            const bullets = section.bullets.filter((item) => !isHeldCopy(item))
            if (!paragraphs.length && !bullets.length) return null
            return (
              <section key={section.heading} className="mt-20">
                {section.heading ? (
                  <h2 className="mb-5 text-3xl font-semibold tracking-tight sm:text-4xl">{section.heading}</h2>
                ) : null}
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="reading mb-5 text-[var(--muted)]">
                    {paragraph}
                  </p>
                ))}
                {bullets.length > 0 ? (
                  <ul className="reading mb-5 list-disc space-y-3 pl-5 text-[var(--muted)]">
                    {bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            )
          })}
          <h2 className="mb-5 mt-20 text-3xl font-semibold tracking-tight sm:text-4xl">The short circuit</h2>
          <p className="reading text-[var(--muted)]">{step.caution}</p>
          <p className="mt-10 text-sm">
            <Link href={step.nextHref} className="link">
              Continue to {step.nextLabel}
            </Link>
          </p>
        </Container>
      </article>
    </PageShell>
  )
}
