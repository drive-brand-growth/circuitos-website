import { notFound } from 'next/navigation'
import PageShell from '@/components/PageShell'
import ProsePage from '@/components/ui/ProsePage'
import { getPage, getSite, metaFor } from '@/lib/content'

export async function generateMetadata() {
  return metaFor('terms')
}

export default async function TermsPage() {
  const [page, site] = await Promise.all([getPage('terms'), getSite()])
  if (!page) notFound()
  return (
    <PageShell>
      <ProsePage page={page} email={site.contactEmail} />
    </PageShell>
  )
}
