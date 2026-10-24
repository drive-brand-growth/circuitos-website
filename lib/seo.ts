import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/site'

type PageMetaInput = {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article'
  noindex?: boolean
}

export function pageMeta({ title, description, path, ogType = 'website', noindex = false }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      url,
      type: ogType,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${SITE_NAME}`,
      description,
    },
  }
}

export function personJsonLd(description?: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#noel-pena`,
    name: 'Noel Pena',
    url: `${SITE_URL}/about`,
    description:
      description ||
      'Noel Pena teaches The Circuit Method™. He has spent more than twenty years in RevOps and sales leadership.',
  }
}

export function websiteJsonLd(name = SITE_NAME, description = 'Predictable revenue, engineered. Written decisions. Honest odds. Proof of cause.') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name,
    url: SITE_URL,
    description,
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#noel-pena` },
  }
}

export function articleJsonLd(input: {
  headline: string
  description: string
  path: string
  datePublished: string
  dateModified: string
}) {
  const url = `${SITE_URL}${input.path}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    mainEntityOfPage: url,
    url,
    author: { '@id': `${SITE_URL}/#noel-pena` },
    publisher: { '@id': `${SITE_URL}/#noel-pena` },
    image: `${SITE_URL}/opengraph-image`,
  }
}
