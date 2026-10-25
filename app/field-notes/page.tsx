import { notFound } from 'next/navigation'
import PageShell from '@/components/PageShell'
import Card from '@/components/ui/Card'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import { getPage, listNotes, metaFor } from '@/lib/content'

export async function generateMetadata() {
  return metaFor('field-notes')
}

export default async function FieldNotesPage() {
  const [page, notes] = await Promise.all([getPage('field-notes'), listNotes()])
  if (!page) notFound()

  return (
    <PageShell>
      <section className="grid-bg pb-20 pt-36">
        <Container>
          <SectionHeader as="h1" kicker={page.kicker} title={page.headline} lede={page.lede[0]} />
          <div className="mt-14 space-y-4">
            {notes.map((note) => (
              <Card key={note.slug} href={`/field-notes/${note.slug}`}>
                <p className="text-sm text-blue-400 font-medium">{note.entry.kicker}</p>
                <h2 className="mt-3 text-xl md:text-2xl font-bold">{note.entry.title}</h2>
                <p className="mt-3 text-sm text-[#a1a1aa] leading-relaxed">{note.entry.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </PageShell>
  )
}
