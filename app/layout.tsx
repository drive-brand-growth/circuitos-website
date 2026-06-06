import type { Metadata, Viewport } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'
import AriaX from '@/components/AriaX'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://usecircuitos.com'),
  title: {
    default: 'CircuitOS — Governed AI Decisioning',
    template: '%s | CircuitOS'
  },
  description: 'Governed AI decisioning. Know which deals will close and which marketing is working — and prove the decision was sound before the outcome is known, with a signed audit trail every time.',
  keywords: [
    'governed AI decisioning',
    'AI decision governance',
    'calibrated lead scoring',
    'win probability scoring',
    'multi-touch attribution',
    'AI audit trail',
    'decision quality calibration',
    'auditable AI',
    'revenue decisioning',
    'mid-market AI platform',
  ],
  authors: [{ name: 'CircuitOS', url: 'https://usecircuitos.com' }],
  creator: 'DriveBrandGrowth',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://usecircuitos.com',
    siteName: 'CircuitOS',
    title: 'CircuitOS — Governed AI Decisioning',
    description: 'Know which deals will close and which marketing is working — and prove the decision was sound before the outcome is known, with a signed audit trail every time.',
    images: ['https://usecircuitos.com/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CircuitOS — Governed AI Decisioning',
    description: 'Know which deals will close and which marketing is working — and prove it, with a signed audit trail every time.',
    images: ['https://usecircuitos.com/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  alternates: {
    canonical: 'https://usecircuitos.com',
  },
  icons: {
    icon: '/circuitos-icon.svg',
    apple: '/circuitos-icon.svg',
  },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://usecircuitos.com/#organization',
  name: 'CircuitOS',
  legalName: 'DriveBrandGrowth LLC',
  url: 'https://usecircuitos.com',
  logo: 'https://usecircuitos.com/circuitos-logo-full.svg',
  description: 'Governed AI decisioning platform for mid-market B2B companies. Calibrated win-probability scoring, multi-touch attribution, and a signed audit trail that proves decision quality before the outcome is known.',
  founder: {
    '@type': 'Person',
    name: 'Noel Pena',
    jobTitle: 'Founder & CEO',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@usecircuitos.com',
    contactType: 'sales',
  },
  parentOrganization: {
    '@type': 'Organization',
    name: 'DriveBrandGrowth',
    url: 'https://drivebrandgrowth.com',
  },
  sameAs: [],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://usecircuitos.com/#website',
  name: 'CircuitOS',
  url: 'https://usecircuitos.com',
  publisher: { '@id': 'https://usecircuitos.com/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://usecircuitos.com/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        <div className="overflow-x-hidden w-full">
          <Analytics />
          {children}
          <AriaX />
        </div>
      </body>
    </html>
  )
}
