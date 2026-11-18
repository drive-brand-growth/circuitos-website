import { notFound } from 'next/navigation'
import PageShell from '@/components/PageShell'
import ProsePage from '@/components/ui/ProsePage'
import { getPage, getSite, metaFor } from '@/lib/content'

export async function generateMetadata() {
  return metaFor('proof')
}

export default async function ProofPage() {
  const [page, site] = await Promise.all([getPage('proof'), getSite()])
  if (!page) notFound()
  return (
    <PageShell>
      <ProsePage page={page} email={site.contactEmail} />
    </PageShell>
  )
}
