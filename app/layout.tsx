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
    default: 'CircuitOS - Autonomous Revenue Intelligence Platform',
    template: '%s | CircuitOS'
  },
  description: 'Pre-configured revenue intelligence. Predictive scoring, autonomous outreach, content intelligence, and closed-loop optimization. One system, measurable results.',
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
    description: 'Pre-configured revenue intelligence. Predictive scoring, autonomous outreach, and closed-loop optimization. One system, measurable results.',
    images: ['https://usecircuitos.com/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CircuitOS - Revenue Intelligence That Learns',
    description: 'Pre-configured revenue intelligence. Predictive scoring, autonomous outreach, and closed-loop optimization. One system, measurable results.',
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
  name: 'DriveBrandGrowth',
  url: 'https://drivebrandgrowth.com',
  logo: 'https://usecircuitos.com/circuitos-logo-full.svg',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@usecircuitos.com',
    contactType: 'sales',
  },
  sameAs: [],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CircuitOS',
  description: 'Pre-configured revenue intelligence platform with predictive scoring, content intelligence, and closed-loop learning. One system, measurable results.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web-based',
  url: 'https://usecircuitos.com',
  image: 'https://usecircuitos.com/opengraph-image',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '1500',
    highPrice: '7500',
    offerCount: 3,
    availability: 'https://schema.org/OnlineOnly',
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
        text: 'CircuitOS is a pre-configured revenue intelligence platform that combines predictive lead scoring, content generation, and automated outreach into a single closed-loop system. It learns from every outcome to improve future predictions.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the closed-loop learning work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CircuitOS scores leads and content, tracks real outcomes (conversions, engagement, GA4 metrics), and feeds that data back into the scoring model. The system continuously improves its predictions based on actual results.',
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
    {
      '@type': 'Question',
      name: 'How does lead scoring work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your ICP and qualification criteria are encoded into the system before launch. Every incoming lead is scored across 72+ signals including fit, intent, and timing. The model ships pre-calibrated to your vertical so scoring is intelligent from day one.',
      },
    },
    {
      '@type': 'Question',
      name: 'What integrations does CircuitOS support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CircuitOS integrates natively with GoHighLevel (CRM), Instantly.ai (email outreach), and Google Analytics 4 (feedback loop). It also provides a full REST API and webhook support for custom integrations.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is content quality ensured?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every piece of content goes through a multi-step pipeline: generation, source verification, fact-checking, and multi-model quality evaluation covering readability, competitive uniqueness, and brand voice alignment. Nothing publishes without passing all gates.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does the onboarding process look like?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Onboarding follows five steps: Configure (encode your ICP, criteria, and brand voice), Score (activate the pre-calibrated scoring model), Route (set up CRM routing and outreach channels), Engage (launch automated sequences with approval gates), and Learn (connect GA4 feedback for continuous improvement).',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does CircuitOS cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CircuitOS offers three tiers: Starter ($1,500/month) for brands launching their first automated revenue engine, Growth ($3,500/month) for brands scaling across multiple business lines, and Enterprise (custom pricing) for organizations with complex, multi-brand operations. An implementation fee is scoped during your demo call.',
      },
    },
    {
      '@type': 'Question',
      name: 'What industries does CircuitOS work for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CircuitOS is vertical-agnostic. Each deployment is configured for the specific industry, ICP, and demand patterns of the business. Current live deployments span licensing, events, fitness, apparel, and professional services.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data isolated from other clients?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every vertical runs in its own containerized stack with a dedicated database, scoring model, and workflow configuration. No data is shared between verticals or clients.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I see a demo before committing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Request a demo at usecircuitos.com/demo and we will walk you through the entire pipeline using your business context — including live scoring, content intelligence, and outreach configuration. No commitment required.',
      },
    },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How CircuitOS Works',
  description: 'Five steps to predictable revenue with CircuitOS.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Configure',
      text: 'Encode your ICP, qualification criteria, brand voice, and demand patterns into the system.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Score',
      text: 'Every lead is scored across 72+ signals for fit, intent, and timing using the pre-calibrated model.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Route',
      text: 'Qualified leads are routed to the right channel with the right message automatically.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Engage',
      text: 'Personalized outreach sequences launch with human approval gates before anything sends.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Learn',
      text: 'Real outcomes feed back into the model. Every conversion, reply, and engagement makes the next prediction better.',
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Analytics />
        {children}
        <AriaX />
      </body>
    </html>
  )
}
