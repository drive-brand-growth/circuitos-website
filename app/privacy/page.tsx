import { notFound } from 'next/navigation'
import PageShell from '@/components/PageShell'
import ProsePage from '@/components/ui/ProsePage'
import { getPage, getSite, metaFor } from '@/lib/content'

export async function generateMetadata() {
  return metaFor('privacy')
}

export default async function PrivacyPage() {
  const [page, site] = await Promise.all([getPage('privacy'), getSite()])
  if (!page) notFound()
  return (
    <PageShell>
      <ProsePage page={page} email={site.contactEmail} />
    </PageShell>
  )
}
