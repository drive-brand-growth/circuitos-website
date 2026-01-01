/**
 * World-Class Structured Data for AI Search Optimization
 * Drive Brand Growth - Enterprise AI Architecture for Revenue Operations
 *
 * Schema types implemented:
 * - Organization (complete business info)
 * - ProfessionalService (consulting services)
 * - WebSite (with search action)
 * - FAQPage (comprehensive Q&A - 15+ questions)
 * - HowTo (engagement process)
 * - BreadcrumbList (navigation)
 * - Person (founder/technical leadership)
 * - Service/Offer (service catalog)
 * - SpeakableSpecification (voice AI)
 */

const baseUrl = 'https://drivebrandgrowth.com';

// Comprehensive FAQ data for AI search optimization
const faqData = [
  // Core Services
  {
    question: 'What does Drive Brand Growth do?',
    answer: 'Drive Brand Growth designs and deploys production-grade AI systems that automate lead qualification, scoring, and orchestration for revenue operations. We build actual infrastructure—not consulting theater. Our systems include automated lead scoring, intelligent routing, data enrichment, and decision intelligence engines that run 24/7.',
  },
  {
    question: 'What industries does Drive Brand Growth serve?',
    answer: 'We specialize in B2B SaaS, franchise operations, fitness/wellness, professional services, and any business with complex lead qualification needs. Our clients typically have sales teams that need to prioritize leads faster and more accurately than manual processes allow.',
  },
  {
    question: 'What makes Drive Brand Growth different from other AI consultants?',
    answer: 'We ship code, not PowerPoint. Most "AI consultants" bolt ChatGPT onto your CRM and call it transformation. We build custom automation infrastructure: lead scoring engines, decision intelligence systems, and revenue operations automation that runs in production. No consulting theater—actual deployed systems.',
  },
  // Technical Capabilities
  {
    question: 'What AI systems does Drive Brand Growth build?',
    answer: 'We build: (1) Automated lead scoring and qualification systems, (2) Intelligent lead routing based on intent and fit, (3) Data enrichment pipelines using multiple sources, (4) Decision intelligence engines for complex business logic, (5) Conversational AI with intent classification, (6) Revenue operations automation, and (7) Custom ML models trained on your data.',
  },
  {
    question: 'What technology stack does Drive Brand Growth use?',
    answer: 'Our systems are built on Python, FastAPI, PostgreSQL, and modern ML frameworks. We integrate with CRMs (HubSpot, Salesforce, GHL), automation platforms (n8n, Make), and leverage OpenAI, Anthropic, and custom ML models. All systems are production-grade with monitoring, alerting, and continuous improvement loops.',
  },
  {
    question: 'Can Drive Brand Growth integrate with our existing CRM?',
    answer: 'Yes, we integrate with all major CRMs including Salesforce, HubSpot, GoHighLevel (GHL), Pipedrive, and custom systems. Our integrations are bidirectional—we enrich your CRM with AI insights and trigger automation based on CRM events.',
  },
  // Process & Timeline
  {
    question: 'How long does it take to deploy an AI system with Drive Brand Growth?',
    answer: 'Production-ready systems are typically deployed in 6-12 weeks. Phase 1 (Discovery) takes 1-2 weeks, Phase 2 (Development) takes 4-6 weeks, Phase 3 (Intelligence Training) takes 2-3 weeks, and Phase 4 (Launch & Optimization) is ongoing. Timeline varies based on complexity and integration requirements.',
  },
  {
    question: 'What is the process for working with Drive Brand Growth?',
    answer: 'Our process: (1) Initial technical call to understand your current infrastructure and bottlenecks, (2) Discovery phase to identify automation opportunities and define success metrics, (3) System development with your existing tools and data, (4) Intelligence layer training on your historical data, (5) Controlled production rollout with monitoring, (6) Ongoing optimization and iteration.',
  },
  {
    question: 'Do you offer ongoing support after deployment?',
    answer: 'Yes, all deployments include monitoring, maintenance, and continuous improvement. AI systems need ongoing calibration as your business evolves. We track performance metrics, detect drift, and iterate on the intelligence layer to maintain accuracy.',
  },
  // Investment & ROI
  {
    question: 'How much does Drive Brand Growth cost?',
    answer: 'Investment is custom-quoted based on scope, complexity, and integration requirements. Typical projects range from $15,000 for focused automation to $100,000+ for enterprise-wide revenue operations transformation. ROI typically shows within 90 days through faster lead response, higher conversion rates, and reduced manual work.',
  },
  {
    question: 'What ROI can I expect from AI automation?',
    answer: 'Clients typically see: 10x faster lead response times, 40-60% improvement in lead-to-opportunity conversion, 65% reduction in manual qualification work, 3x pipeline velocity improvement, and measurable revenue lift within 90 days. Actual results depend on your current state and implementation scope.',
  },
  // Leadership & Credentials
  {
    question: 'Who is Noel Peña and what are his credentials?',
    answer: 'Noel Peña is the founder and technical leader of Drive Brand Growth. He is a certified data architect with experience building enterprise AI systems for franchise operations, B2B SaaS, and revenue operations. His background includes MLOps, production ML systems, and large-scale automation infrastructure.',
  },
  {
    question: 'Does Drive Brand Growth have case studies?',
    answer: 'Yes, our deployed systems include: Franchise Lead Operations ($120K-$600K projected Year 1 revenue), Inbound Lead Automation (10x faster response, 40% conversion increase), Digital Traffic Intelligence (3x pipeline velocity), and Intelligent Response Systems (65% support ticket reduction). Detailed case studies available under NDA.',
  },
  // Getting Started
  {
    question: 'How do I get started with Drive Brand Growth?',
    answer: 'Book a 45-minute technical call at drivebrandgrowth.com. This is an engineering-focused discussion—no sales pitch. We\'ll evaluate your current infrastructure, identify automation opportunities, and discuss potential system architecture. If there\'s a fit, we\'ll provide a custom proposal.',
  },
  {
    question: 'What information should I prepare before the call?',
    answer: 'Come prepared to discuss: (1) Your current lead flow and qualification process, (2) CRM and tools you use today, (3) Biggest bottlenecks in your revenue operations, (4) Volume of leads and deals you process, (5) Any specific outcomes you\'re trying to achieve. Technical documentation is helpful but not required.',
  },
];

// Generate the complete structured data graph
export function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      // Organization - Primary entity
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': `${baseUrl}/#organization`,
        name: 'Drive Brand Growth',
        alternateName: ['DBG', 'DriveBrandGrowth'],
        description: 'Enterprise AI architecture for revenue operations. We design and deploy production-grade AI systems that automate lead qualification, scoring, and orchestration.',
        url: baseUrl,
        email: 'noel@drivebrandgrowth.com',
        telephone: '+1-817-465-9331',
        foundingDate: '2023',
        founder: {
          '@type': 'Person',
          '@id': `${baseUrl}/#founder`,
          name: 'Noel Peña',
          jobTitle: 'Founder & Technical Lead',
          description: 'Certified data architect specializing in enterprise AI systems, MLOps, and revenue operations automation.',
          email: 'noel@drivebrandgrowth.com',
          sameAs: [
            'https://linkedin.com/in/noelpena',
          ],
        },
        image: `${baseUrl}/og-image.jpg`,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dallas-Fort Worth',
          addressRegion: 'TX',
          addressCountry: 'US',
        },
        areaServed: {
          '@type': 'Country',
          name: 'United States',
        },
        sameAs: [
          'https://linkedin.com/company/drivebrandgrowth',
        ],
        knowsAbout: [
          'AI Automation',
          'Lead Scoring',
          'Revenue Operations',
          'Machine Learning',
          'Data Architecture',
          'CRM Integration',
          'Sales Automation',
          'Decision Intelligence',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'AI Automation Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Lead Scoring & Qualification Automation',
                description: 'AI-powered lead scoring that runs 24/7, qualifying leads instantly based on fit, intent, and behavior signals.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Revenue Operations Automation',
                description: 'End-to-end automation of lead flow, routing, enrichment, and handoff processes.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Decision Intelligence Systems',
                description: 'Custom ML models and decision engines for complex business logic and scoring.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Conversational AI Implementation',
                description: 'Intent-aware chat systems with 91%+ classification accuracy and intelligent escalation.',
              },
            },
          ],
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          reviewCount: '12',
          bestRating: '5',
          worstRating: '1',
        },
      },

      // WebSite with SearchAction
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Drive Brand Growth',
        description: 'Enterprise AI Architecture for Revenue Operations',
        publisher: { '@id': `${baseUrl}/#organization` },
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },

      // BreadcrumbList
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Systems', item: `${baseUrl}/#systems` },
          { '@type': 'ListItem', position: 3, name: 'Approach', item: `${baseUrl}/#approach` },
          { '@type': 'ListItem', position: 4, name: 'Contact', item: `${baseUrl}/#contact` },
        ],
      },

      // FAQPage with comprehensive Q&A
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/#faq`,
        name: 'Drive Brand Growth FAQ',
        description: 'Frequently asked questions about AI automation, revenue operations, lead scoring, and working with Drive Brand Growth.',
        mainEntity: faqData.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },

      // HowTo for Engagement Process
      {
        '@type': 'HowTo',
        '@id': `${baseUrl}/#howto-engage`,
        name: 'How to Work with Drive Brand Growth',
        description: 'Step-by-step process for engaging Drive Brand Growth to build your AI automation infrastructure.',
        image: `${baseUrl}/og-image.jpg`,
        totalTime: 'P12W',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Book Technical Call',
            text: 'Schedule a 45-minute engineering-focused call to discuss your current infrastructure, bottlenecks, and automation opportunities. No sales pitch—just technical evaluation.',
            url: `${baseUrl}/#contact`,
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Discovery & Strategy',
            text: 'Deep-dive into your current operations, identify automation opportunities, define success metrics, and create a custom implementation roadmap.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'System Development',
            text: 'Build your custom automation infrastructure, connect to existing tools and data, implement intelligent decision logic, and set up monitoring.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Intelligence Layer',
            text: 'Train systems on your historical data, calibrate scoring logic, implement continuous improvement loops, and validate accuracy against benchmarks.',
          },
          {
            '@type': 'HowToStep',
            position: 5,
            name: 'Launch & Optimize',
            text: 'Controlled production rollout, performance tuning, team training, and ongoing monitoring with iteration.',
          },
        ],
      },

      // WebPage with SpeakableSpecification
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/#webpage`,
        name: 'Drive Brand Growth - Enterprise AI Architecture for Revenue Operations',
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: [
            'h1',
            '.hero-description',
            '.stats-panel',
          ],
        },
        mainEntity: {
          '@type': 'Service',
          name: 'AI Revenue Operations Automation',
          description: 'Production-grade AI systems for lead qualification, scoring, and orchestration. 6-12 week deployment timeline.',
          provider: { '@id': `${baseUrl}/#organization` },
        },
      },

      // Case Studies / Results
      {
        '@type': 'ItemList',
        '@id': `${baseUrl}/#case-studies`,
        name: 'Deployed AI Systems',
        description: 'Production systems built by Drive Brand Growth',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'CreativeWork',
              name: 'Franchise Lead Operations',
              description: 'Automated lead scoring, territory validation, ROI projections, and pipeline automation for fitness franchise. Result: $120K-$600K projected Year 1 revenue.',
              about: 'Fitness & Franchising',
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@type': 'CreativeWork',
              name: 'Inbound Lead Automation',
              description: 'Instant scoring on form submission, automated enrichment, intent-based prioritization, intelligent routing. Result: 10x faster response, 40% conversion increase.',
              about: 'B2B SaaS',
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@type': 'CreativeWork',
              name: 'Digital Traffic Intelligence',
              description: 'Visitor identification, automated prospect discovery, CRM sync, behavioral pattern recognition. Result: 3x pipeline velocity improvement.',
              about: 'Multi-Industry',
            },
          },
          {
            '@type': 'ListItem',
            position: 4,
            item: {
              '@type': 'CreativeWork',
              name: 'Intelligent Response System',
              description: 'Context-aware conversation handling, 91% intent classification accuracy, personalized responses, smart escalation. Result: 65% reduction in support tickets.',
              about: 'Customer Success',
            },
          },
        ],
      },
    ],
  };
}

// Export FAQ data for use in dedicated FAQ page
export { faqData };
