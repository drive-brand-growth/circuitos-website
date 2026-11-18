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
      <article className="grid-bg page-top pb-section">
        <Container>
          <p className="text-sm text-muted">
            <Link href="/method" className="link max-sm:inline-block max-sm:py-2">
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
          <dl className="mt-section-sm space-y-12">
            {visible.filter((term) => !isHeldCopy(term.entry.text)).map((term) => (
              <div key={term.slug} id={term.slug}>
                <dt className="text-2xl font-semibold tracking-tight">{term.entry.name}</dt>
                <dd className="mt-3 text-body text-muted">{term.entry.text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </article>
    </PageShell>
  )
}
