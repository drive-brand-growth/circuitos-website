import 'server-only'

import { cache } from 'react'
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'
import { pageMeta } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'

export const reader = createReader(process.cwd(), keystaticConfig)

function tidy<T>(value: T): T {
  if (typeof value === 'string') return value.trim() as T
  if (typeof value === 'function' || value == null) return value
  if (Array.isArray(value)) return value.map((item) => tidy(item)) as T
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, tidy(item)])) as T
  }
  return value
}

export const getSite = cache(async () => {
  const site = await reader.singletons.site.read()
  if (!site) throw new Error('content/site.yaml is missing')
  return tidy(site)
})

export const getHome = cache(async () => {
  const home = await reader.singletons.home.read()
  if (!home) throw new Error('content/home.yaml is missing')
  return tidy(home)
})

export const getGlossary = cache(async () => {
  const glossary = await reader.singletons.glossary.read()
  if (!glossary) throw new Error('content/glossary.yaml is missing')
  return tidy(glossary)
})

export const getPage = cache(async (slug: string) => {
  const page = await reader.collections.pages.read(slug)
  return page ? tidy(page) : null
})

export const listPages = cache(async () => {
  const all = await reader.collections.pages.all()
  return tidy(all.filter((item) => item.entry.status === 'published'))
})

export const listSteps = cache(async (opts?: { drafts?: boolean }) => {
  const all = await reader.collections.steps.all()
  const rows = opts?.drafts ? all : all.filter((item) => item.entry.status === 'published')
  return tidy(rows).sort((a, b) => a.entry.order - b.entry.order)
})

export const getStep = cache(async (slug: string) => {
  const step = await reader.collections.steps.read(slug)
  return step ? tidy(step) : null
})

export const listTerms = cache(async (opts?: { drafts?: boolean }) => {
  const all = await reader.collections.terms.all()
  const rows = opts?.drafts ? all : all.filter((item) => item.entry.status === 'published')
  return tidy(rows).sort((a, b) => a.entry.order - b.entry.order)
})

export const listNotes = cache(async (opts?: { drafts?: boolean }) => {
  const all = await reader.collections.notes.all()
  const rows = opts?.drafts ? all : all.filter((item) => item.entry.status === 'published')
  return tidy(rows).sort((a, b) => (a.entry.datePublished < b.entry.datePublished ? 1 : -1))
})

export const getNote = cache(async (slug: string) => {
  const note = await reader.collections.notes.read(slug)
  return note ? tidy(note) : null
})

export async function metaFor(slug: string) {
  const page = await getPage(slug)
  if (!page) return {}
  return pageMeta({
    title: page.title,
    description: page.description,
    path: page.path,
    noindex: page.status !== 'published',
  })
}

export function fill(text: string | null | undefined, email: string): string {
  const host = SITE_URL.replace('https://', '')
  return (text ?? '').replaceAll('{{email}}', email).replaceAll('{{host}}', host)
}

export type SiteContent = Awaited<ReturnType<typeof getSite>>
export type HomeContent = Awaited<ReturnType<typeof getHome>>
export type PageContent = NonNullable<Awaited<ReturnType<typeof getPage>>>
export type StepContent = NonNullable<Awaited<ReturnType<typeof getStep>>>
export type TermEntry = Awaited<ReturnType<typeof listTerms>>[number]
export type NoteEntry = Awaited<ReturnType<typeof listNotes>>[number]
export type StepEntry = Awaited<ReturnType<typeof listSteps>>[number]
