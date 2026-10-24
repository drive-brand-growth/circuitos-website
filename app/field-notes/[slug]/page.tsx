import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageShell from '@/components/PageShell'
import Container from '@/components/ui/Container'
import MarkdocBody from '@/components/ui/MarkdocBody'
import SectionHeader from '@/components/ui/SectionHeader'
import { getNote, listNotes } from '@/lib/content'
import { articleJsonLd, pageMeta } from '@/lib/seo'

type Params = { slug: string }

export async function generateStaticParams() {
  const notes = await listNotes({ drafts: true })
  return notes.map((note) => ({ slug: note.slug }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const note = await getNote(params.slug)
  if (!note) return {}
  return pageMeta({
    title: note.title,
    description: note.description,
    path: `/field-notes/${params.slug}`,
    ogType: 'article',
    noindex: note.status !== 'published',
  })
}

export default async function FieldNotePage({ params }: { params: Params }) {
  const note = await getNote(params.slug)
  if (!note) notFound()
  const document = await note.body()

  const jsonLd =
    note.status === 'published'
      ? articleJsonLd({
          headline: note.title,
          description: note.description,
          path: `/field-notes/${params.slug}`,
          datePublished: note.datePublished,
          dateModified: note.dateModified,
        })
      : null

  return (
    <PageShell>
      <article className="pb-24 pt-16 sm:pt-24">
        {jsonLd ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        ) : null}
        <Container>
          <p className="text-sm text-[var(--muted)]">
            <Link href="/field-notes" className="link">
              Field notes
            </Link>
          </p>
          <div className="mt-8">
            <SectionHeader as="h1" kicker={note.kicker} title={note.title} />
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">Noel Pena · {note.datePublished}</p>
          {note.status !== 'published' ? (
            <p className="mt-6 text-sm text-[var(--muted)]">Draft. This note is not on the index.</p>
          ) : null}
          <div className="mt-10">
            <MarkdocBody document={document} />
          </div>
          <p className="mt-12 text-sm">
            <Link href="/method" className="link">
              Back to the method
            </Link>
          </p>
        </Container>
      </article>
    </PageShell>
  )
}
