import type { Metadata, Viewport } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'

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
    default: 'CircuitOS - Autonomous Revenue Intelligence Platform',
    template: '%s | CircuitOS'
  },
  description: 'AI-powered revenue intelligence that learns. Predictive lead scoring, autonomous outreach, content intelligence, and closed-loop optimization. One platform for every vertical.',
  keywords: [
    'revenue intelligence platform',
    'AI lead scoring',
    'autonomous outreach',
    'content intelligence',
    'predictive scoring',
    'multi-vertical platform',
    'sales automation',
    'lead enrichment',
    'AI content generation',
    'closed-loop marketing',
  ],
  authors: [{ name: 'CircuitOS', url: 'https://usecircuitos.com' }],
  creator: 'DriveBrandGrowth',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://usecircuitos.com',
    siteName: 'CircuitOS',
    title: 'CircuitOS - Autonomous Revenue Intelligence',
    description: 'AI scores every lead. Content writes itself. Outreach runs autonomously. Every outcome feeds back into the model. The system gets smarter with every cycle.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CircuitOS - Autonomous Revenue Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CircuitOS - Revenue Intelligence That Learns',
    description: 'AI-powered scoring, outreach, and content intelligence. One platform, every vertical. The system learns from every outcome.',
    images: ['/og-image.png'],
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CircuitOS',
  description: 'Autonomous revenue intelligence platform with predictive scoring, content intelligence, and closed-loop learning.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web-based',
  url: 'https://usecircuitos.com',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '1500',
    highPrice: '7500',
    offerCount: 3,
  },
  featureList: [
    'Predictive Lead Scoring',
    'Autonomous Email Outreach',
    'Content Intelligence Engine',
    'Proprietary Multi-Model Quality Assurance',
    'GA4 Feedback Loop',
    'Multi-Vertical Support',
    'Human-in-the-Loop Governance',
    'Full Audit Trail',
    'Multi-Source Enrichment',
    'CRM Integration',
  ],
  author: {
    '@type': 'Organization',
    name: 'DriveBrandGrowth',
    url: 'https://drivebrandgrowth.com',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is CircuitOS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CircuitOS is an autonomous revenue intelligence platform that combines predictive lead scoring, AI-powered content generation, and automated outreach into a single closed-loop system that learns from every outcome.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the closed-loop learning work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CircuitOS scores leads and content using AI, tracks real outcomes (conversions, engagement, GA4 metrics), and feeds that data back into the scoring model. The system continuously improves its predictions based on actual results.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can CircuitOS handle multiple businesses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. CircuitOS supports unlimited verticals with isolated infrastructure per client. Each business gets its own scoring model, templates, CRM routing, and database. Currently battle-tested across 6 live verticals.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is content published automatically?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. All content and outreach requires explicit human approval. CircuitOS has governance gates that ensure nothing publishes or sends without your sign-off. Every action has a full audit trail.',
      },
    },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  )
}
