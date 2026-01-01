import type { Metadata, Viewport } from 'next'
import './globals.css'

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
    default: 'CircuitOS - Lead Scoring Software | Deterministic AI Platform',
    template: '%s | CircuitOS'
  },
  description: 'Score leads in 15ms with deterministic AI. Validate claims against social signals. Lead intelligence platform that catches liars before your sales team wastes time.',
  keywords: [
    'lead scoring software',
    'lead intelligence platform',
    'deterministic AI',
    'lead validation',
    'social validation',
    'lead routing',
    'B2B lead scoring',
    'AI lead scoring',
    'lead qualification',
    'sales intelligence'
  ],
  authors: [{ name: 'CircuitOS', url: 'https://usecircuitos.com' }],
  creator: 'DriveBrandGrowth',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://usecircuitos.com',
    siteName: 'CircuitOS',
    title: 'CircuitOS - Lead Scoring Software for Sales Teams',
    description: 'Score leads in 15ms with deterministic AI. Validate claims against social signals. Catch liars before sales wastes time.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CircuitOS - Deterministic Lead Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CircuitOS - Lead Scoring Software | Deterministic AI',
    description: 'Score leads in 15ms. Validate claims. Catch liars before sales wastes time.',
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

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CircuitOS',
  description: 'Deterministic lead scoring platform that validates claims against social signals.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web-based',
  url: 'https://usecircuitos.com',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '497',
    highPrice: '1997',
    offerCount: 3,
  },
  featureList: [
    'Social Validation',
    'Deterministic Scoring',
    'Timing Intelligence',
    'Red Flag Detection',
    'Full Audit Trail',
    'Multi-Tenant Ready',
    'Aria AI Agent',
    '15ms Response Time',
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
      name: 'How fast is CircuitOS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CircuitOS scores leads in 15 milliseconds, allowing hot leads to be routed immediately before competitors respond.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is deterministic scoring?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Deterministic scoring means the same input always produces the same output. Unlike black-box AI, our DMN rules are explainable, auditable, and reproducible.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does social validation work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We cross-reference what prospects claim with what they post on X, Instagram, and LinkedIn. If they claim to own a gym but never post fitness content, we flag it.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Aria?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aria is an autonomous AI agent that automatically engages leads across email, SMS, Slack, and chat 24/7, with 2.3s average response time.',
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
      <body className="antialiased">{children}</body>
    </html>
  )
}
