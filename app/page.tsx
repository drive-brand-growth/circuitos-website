import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import IntegrationBar from '@/components/IntegrationBar'
import Platform from '@/components/Platform'
import HowItWorks from '@/components/HowItWorks'
import Capabilities from '@/components/Capabilities'
import Pricing from '@/components/Pricing'
import BuildCalculator from '@/components/BuildCalculator'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

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
    lowPrice: '3500',
    highPrice: '12000',
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
      name: 'How does lead scoring work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your ICP and qualification criteria are encoded before launch. Every lead is scored across 72+ signals for fit, intent, and timing. Pre-calibrated to your vertical — intelligent from day one, no training period.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the closed-loop learning work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CircuitOS scores leads, tracks real outcomes (conversions, engagement, GA4 metrics), and feeds that data back into the scoring model. The system continuously improves its predictions based on actual results.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can CircuitOS handle multiple businesses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. CircuitOS supports unlimited verticals with isolated infrastructure per business line. Each gets its own scoring model, templates, CRM routing, and database. No data is shared between verticals or clients.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is anything published or sent automatically?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Confidence-based governance determines what the system handles autonomously and what gets escalated to a human. Every action has a full audit trail. Nothing irreversible happens without your approval.',
      },
    },
    {
      '@type': 'Question',
      name: 'What integrations does CircuitOS support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CircuitOS connects to any CRM (HubSpot, Salesforce, and more), email automation platforms, and Google Analytics 4 for closed-loop feedback. Full REST API and webhook support for custom integrations.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does onboarding look like?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Four weeks from contract to live scoring. We encode your ICP, configure scoring logic, integrate your CRM, and activate lead flow. You confirm lead sources and CRM mapping — we handle the rest.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does CircuitOS cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Three monthly tiers: Growth ($3,500/month), Scale ($6,500/month), and Enterprise ($12,000/month). One-time implementation fee covers platform setup, ICP encoding, and integrations. Use the build calculator on our site for exact line-item costs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What industries does CircuitOS work for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CircuitOS is vertical-agnostic. Each deployment is configured for the specific industry, ICP, and demand patterns of the business. Current deployments span professional services, franchise operations, e-commerce, and SaaS.',
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
      name: 'Can I see a demo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Try the interactive playground at usecircuitos.com/playground or request a personalized walkthrough at usecircuitos.com/demo. No commitment required.',
      },
    },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How CircuitOS Works',
  description: 'Three steps to governed revenue intelligence with CircuitOS.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Score',
      text: 'Every lead evaluated across 72+ signals for fit, intent, and timing. Pre-calibrated to your vertical — intelligent from day one.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Decide',
      text: 'Confidence thresholds determine autonomous execution vs. human escalation. High confidence: execute. Low confidence: ask a human. Every action governed.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Prove',
      text: 'Full audit trail on every score, every gate evaluation, every routing decision. Outcomes feed back to improve the next cycle.',
    },
  ],
}

export default function Home() {
  return (
    <main className="min-h-screen grid-bg">
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
      <a href="#main-content" className="sr-only skip-link">
        Skip to main content
      </a>
      <Nav />
      <Hero />
      <IntegrationBar />
      <Platform />
      <HowItWorks />
      <Capabilities />
      <Pricing />
      <BuildCalculator />
      <ContactForm />
      <Footer />
    </main>
  )
}
