import PageShell from '@/components/PageShell'
import ProsePage from '@/components/ui/ProsePage'
import { getPage, getSite, listSteps, listTerms, metaFor } from '@/lib/content'
import { notFound } from 'next/navigation'

export async function generateMetadata() {
  return metaFor('method')
}

export default async function MethodPage() {
  const [page, site, steps, terms] = await Promise.all([
    getPage('method'),
    getSite(),
    listSteps(),
    listTerms(),
  ])
  if (!page) notFound()
  return (
    <PageShell>
      <ProsePage page={page} email={site.contactEmail} steps={steps} terms={terms} />
    </PageShell>
  )
}
