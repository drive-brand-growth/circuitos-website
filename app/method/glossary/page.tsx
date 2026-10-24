import Link from 'next/link'
import PageShell from '@/components/PageShell'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import { getGlossary, isHeldCopy, listTerms } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata() {
  const glossary = await getGlossary()
  return pageMeta({
    title: glossary.title,
    description: glossary.description,
    path: '/method/glossary',
    noindex: glossary.status !== 'published',
  })
}

export default async function GlossaryPage() {
  const [glossary, visible] = await Promise.all([getGlossary(), listTerms()])

  return (
    <PageShell>
      <article className="pb-24 pt-16 sm:pt-24">
        <Container>
          <p className="text-sm text-[var(--muted)]">
            <Link href="/method" className="link">
              The method
            </Link>
          </p>
          <div className="mt-8">
            <SectionHeader
              as="h1"
              kicker={glossary.kicker}
              title={glossary.title}
              lede={isHeldCopy(glossary.lede) ? '' : glossary.lede}
            />
          </div>
          <dl className="mt-16 space-y-12">
            {visible.filter((term) => !isHeldCopy(term.entry.text)).map((term) => (
              <div key={term.slug} id={term.slug}>
                <dt className="text-2xl font-semibold tracking-tight">{term.entry.name}</dt>
                <dd className="mt-3 text-lg leading-relaxed text-[var(--muted)]">{term.entry.text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </article>
    </PageShell>
  )
}
