import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import IntegrationBar from '@/components/IntegrationBar'
import Platform from '@/components/Platform'
import HowItWorks from '@/components/HowItWorks'
import TruthSection from '@/components/TruthSection'
import Capabilities from '@/components/Capabilities'
import Pricing from '@/components/Pricing'
import BuildCalculator from '@/components/BuildCalculator'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CircuitOS',
  description: 'Governed AI for revenue teams. Stochastic models propose. Deterministic factories commit. Ledgers prove. Calibrated scoring, attribution, and signed audit trails.',
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
    'Calibrated Win-Probability Scoring',
    'Multi-Touch Attribution',
    'Deal Risk Score',
    'Decision-Quality Calibration',
    'Signed, Tamper-Evident Audit Trail',
    'Human-in-the-Loop Governance',
    'Confidence-Based Escalation',
    'Closed-Loop Learning',
    'CRM Integration',
    'Content Intelligence (optional module)',
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
        text: 'CircuitOS is a governed AI decisioning platform. It tells growth-stage businesses which deals will close and which marketing is actually working — and proves the decision was sound before the outcome is known, with a signed audit trail every time.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is this different from a black-box AI tool?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most AI tools give you a recommendation with no audit trail and no way to know if it was right. CircuitOS produces a calibrated probability with a confidence tier, governs the action with rules, and scores the decision afterward for whether its confidence was honest — proof of decision quality independent of outcome luck.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the closed-loop learning work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CircuitOS tracks real outcomes (conversions, engagement, attribution) and feeds them back into the scoring model. Every result refines the next prediction, so the system gets sharper over time — on your data, not a generic benchmark.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can CircuitOS handle multiple businesses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Higher tiers support multiple business lines, each in its own isolated stack with a dedicated scoring model, configuration, and database. No data is shared between business lines or clients.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is anything published or sent automatically?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Confidence-based governance determines what the system handles autonomously and what gets escalated to a human. Every action lands on a signed audit trail. Nothing irreversible happens without your approval.',
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
        text: 'Roughly four weeks from contract to live decisioning. We encode your ICP, configure the decision logic, integrate your CRM, and activate the signal flow. You confirm your sources and mapping — we handle the rest.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does CircuitOS cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Three monthly tiers: Growth ($3,500/month), Scale ($6,500/month), and Enterprise ($12,000/month). A one-time implementation fee covers platform setup, configuration, and integrations. Use the build calculator on our site for exact line-item costs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What industries does CircuitOS work for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CircuitOS is industry-agnostic — each deployment is configured for the specific business, ICP, and demand patterns. We run it on our own businesses today, including Drive Brand Growth and MetroFlex, and CircuitOS itself runs on the platform.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data isolated from other clients?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Each deployment runs in its own containerized stack with a dedicated database, scoring model, and configuration. No data is shared between business lines or clients, and deployment can run on your own infrastructure.',
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
  description: 'The Circuit Method — the four-move loop every decision runs in CircuitOS.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Observe',
      text: 'Ingest the signals — pipeline data, attribution touchpoints, deal activity, and market context — from your CRM, analytics, and engagement sources.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Decide',
      text: 'Produce a calibrated probability with a confidence tier, governed by rules — not a black-box guess. You see the conviction and the signals behind it.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Act',
      text: 'Execute the recommended action with full parameter logging, or escalate to a human when confidence or risk demands it.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Prove',
      text: 'After the outcome, score the decision for whether its confidence was honest, and write a signed, tamper-evident audit entry. Outcomes feed back to sharpen the next call.',
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
      <TruthSection />
      <HowItWorks />
      <Capabilities />
      <Pricing />
      <BuildCalculator />
      <ContactForm />
      <Footer />
    </main>
  )
}
