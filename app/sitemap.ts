import type { MetadataRoute } from 'next'
import { getHome, listNotes, listPages, listSteps } from '@/lib/content'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [home, pages, steps, notes] = await Promise.all([getHome(), listPages(), listSteps(), listNotes()])
  const lastModified = new Date('2026-10-24')
  const paths = [
    ...(home.status === 'published' ? [''] : []),
    ...pages.map((page) => page.entry.path),
    ...steps.map((step) => `/method/${step.slug}`),
    ...notes.map((note) => `/field-notes/${note.slug}`),
    '/method/glossary',
  ]
  const unique = Array.from(new Set(paths))

  return unique.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === '' || path.startsWith('/field-notes') ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/method') || path === '/decisions' ? 0.8 : 0.6,
  }))
}
