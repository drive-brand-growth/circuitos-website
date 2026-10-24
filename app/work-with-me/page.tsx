import { notFound } from 'next/navigation'
import PageShell from '@/components/PageShell'
import ProsePage from '@/components/ui/ProsePage'
import { getPage, getSite, metaFor } from '@/lib/content'

export async function generateMetadata() {
  return metaFor('work-with-me')
}

export default async function WorkWithMePage() {
  const [page, site] = await Promise.all([getPage('work-with-me'), getSite()])
  if (!page) notFound()
  return (
    <PageShell>
      <ProsePage page={page} email={site.contactEmail} />
    </PageShell>
  )
}
