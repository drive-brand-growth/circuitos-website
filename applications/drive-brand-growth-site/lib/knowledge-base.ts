/**
 * Drive Brand Growth Knowledge Base
 *
 * Structured knowledge for semantic RAG retrieval
 * Organized by category for metadata filtering
 */

export interface KnowledgeChunk {
  id: string;
  content: string;
  metadata: {
    category: 'services' | 'pricing' | 'methodology' | 'case-studies' | 'technical' | 'faq' | 'company';
    subcategory?: string;
    keywords: string[];
    technicalDepth: 'L1' | 'L2' | 'L3'; // Business, Technical, Engineering
  };
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  // ============================================
  // COMPANY OVERVIEW
  // ============================================
  {
    id: 'company-overview-001',
    content: `Drive Brand Growth is an AI consulting firm specializing in enterprise-grade AI architecture for revenue operations. Founded by Noel Peña, a Chief Data & AI Officer candidate at the University of Michigan, DBG designs and deploys production-grade AI systems that automate lead qualification, scoring, and orchestration. We don't do consulting theater—we ship actual infrastructure that drives measurable revenue outcomes.`,
    metadata: {
      category: 'company',
      subcategory: 'overview',
      keywords: ['about', 'company', 'who', 'background', 'founder'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'company-founder-001',
    content: `Noel Peña is the Founder and Chief AI Architect at Drive Brand Growth. He's currently pursuing the Chief Data & AI Officer certification at the University of Michigan. His specializations include: Multi-Agent Orchestration, Decision Model Notation (DMN), Predictive ML systems, and Revenue Operations automation. He brings hands-on engineering experience deploying production AI systems, not just strategy consulting.`,
    metadata: {
      category: 'company',
      subcategory: 'team',
      keywords: ['noel', 'founder', 'team', 'leadership', 'credentials'],
      technicalDepth: 'L1',
    },
  },

  // ============================================
  // SERVICES - LEAD QUALIFICATION
  // ============================================
  {
    id: 'service-lead-qual-overview',
    content: `Our Lead Qualification System automates what most teams do manually—scoring leads 24/7 without human bottlenecks. The system scores every lead 0-100 based on fit, intent, and engagement, then assigns priority tiers (S/A/B/C/D) with automatic SLA routing. It integrates with GHL, HubSpot, and Salesforce. Typical results: 10x faster lead response, 40% increase in conversion rates, 65% reduction in manual qualification time.`,
    metadata: {
      category: 'services',
      subcategory: 'lead-qualification',
      keywords: ['lead', 'scoring', 'qualification', 'automate', 'tier', 'routing'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'service-lead-qual-technical',
    content: `Lead Qualification Architecture: Multi-layer scoring pipeline with three primary scores. Fit Score (0-100): Firmographic + demographic signals via Clearbit/Apollo enrichment—company size, industry, title, location matching ICP. Intent Score (0-100): Behavioral patterns including page visits, content engagement, email opens with time-decay weighting functions. Engagement Score (0-100): Activity recency, frequency, and depth metrics with configurable half-life decay. DMN Decision Tables route leads: IF score >= 80 AND awareness >= 4 → Tier S (5-min SLA). IF score >= 60 AND urgency >= 2 → Tier A (30-60 min). Includes drift detection, automatic threshold recalibration, and A/B testing for scoring weights.`,
    metadata: {
      category: 'services',
      subcategory: 'lead-qualification',
      keywords: ['architecture', 'fit', 'intent', 'engagement', 'dmn', 'scoring', 'technical'],
      technicalDepth: 'L3',
    },
  },
  {
    id: 'service-lead-qual-integrations',
    content: `Lead Qualification Integrations: Native connectors for GoHighLevel (GHL), HubSpot, Salesforce, Pipedrive, and ActiveCampaign. Webhook-based ingestion for form submissions, chat interactions, and email engagement events. Real-time scoring on inbound leads with sub-200ms response times. Bi-directional sync keeps your CRM updated with scores, tiers, and recommended actions. Custom field mapping supports any CRM schema.`,
    metadata: {
      category: 'services',
      subcategory: 'lead-qualification',
      keywords: ['integration', 'ghl', 'hubspot', 'salesforce', 'crm', 'webhook'],
      technicalDepth: 'L2',
    },
  },

  // ============================================
  // SERVICES - CONVERSATIONAL AI
  // ============================================
  {
    id: 'service-chat-overview',
    content: `Our Conversational AI systems are production-grade chat agents that actually convert—not generic chatbots that frustrate visitors. Core capabilities include intent classification with confidence scoring, multi-turn dialogue with context memory, objection handling for 6 common types (Price, Timing, Authority, Need, Trust, Comparison), intelligent human handoff triggers, and awareness-based messaging using Schwartz 5 levels. These systems achieve 2.3x higher conversion rates vs generic bot responses.`,
    metadata: {
      category: 'services',
      subcategory: 'conversational-ai',
      keywords: ['chat', 'bot', 'conversational', 'ai', 'agent', 'message'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'service-chat-technical',
    content: `Conversational AI Architecture: Intent classification using fine-tuned transformer models with 91% accuracy. Context management with sliding window memory (last 10 turns) plus semantic compression for long conversations. Objection handling: rule-based triggers for common objections with LLM-generated personalized responses. RAG-powered knowledge retrieval using ChromaDB with two-stage retrieval (bi-encoder initial search, cross-encoder reranking). Handoff logic: confidence threshold monitoring, sentiment analysis triggers, explicit escalation requests. Deployable as web widget, SMS agent (via GHL/Twilio), or API endpoint.`,
    metadata: {
      category: 'services',
      subcategory: 'conversational-ai',
      keywords: ['architecture', 'intent', 'rag', 'chromadb', 'handoff', 'nlp'],
      technicalDepth: 'L3',
    },
  },
  {
    id: 'service-chat-schwartz',
    content: `Awareness-Based Messaging (Schwartz 5 Levels): Our chat agents detect and adapt to prospect awareness levels. Level 1 (Unaware): Focus on problem education, not solution selling. Level 2 (Problem Aware): Validate their pain, introduce possibility of solutions. Level 3 (Solution Aware): Differentiate our approach from alternatives. Level 4 (Product Aware): Handle objections, provide proof points. Level 5 (Most Aware): Remove friction, make booking easy. Message templates and conversation flows automatically adapt based on detected awareness level.`,
    metadata: {
      category: 'services',
      subcategory: 'conversational-ai',
      keywords: ['schwartz', 'awareness', 'messaging', 'copywriting', 'conversion'],
      technicalDepth: 'L2',
    },
  },

  // ============================================
  // SERVICES - DATA PIPELINE
  // ============================================
  {
    id: 'service-pipeline-overview',
    content: `Data Pipeline & RevOps Infrastructure: We build the plumbing that connects your revenue stack—eliminating data silos and manual sync headaches. Services include ETL pipeline design and implementation, real-time data sync between tools, analytics dashboards and reporting automation, data quality monitoring and alerting, and reverse ETL for activating data in your CRM. Typical results: 3x pipeline velocity improvement, single source of truth for revenue data.`,
    metadata: {
      category: 'services',
      subcategory: 'data-pipeline',
      keywords: ['data', 'pipeline', 'etl', 'sync', 'analytics', 'revops'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'service-pipeline-technical',
    content: `Data Pipeline Architecture: Event-driven architecture using webhooks and message queues. Apache Kafka or Redis Streams for high-throughput event processing. dbt for transformation layer with version-controlled SQL models. Incremental processing with CDC (Change Data Capture) for efficiency. Data quality checks using Great Expectations with automated alerting. Monitoring via Prometheus metrics with Grafana dashboards. Supports both real-time streaming and batch processing patterns depending on use case requirements.`,
    metadata: {
      category: 'services',
      subcategory: 'data-pipeline',
      keywords: ['architecture', 'kafka', 'redis', 'dbt', 'cdc', 'streaming'],
      technicalDepth: 'L3',
    },
  },

  // ============================================
  // PRICING
  // ============================================
  {
    id: 'pricing-overview',
    content: `Pricing is based on scope and integration complexity. Typical engagement ranges: Lead Scoring System: $15,000-$30,000 (4-6 weeks implementation). Conversational AI Agent: $20,000-$40,000 (6-8 weeks implementation). Full Revenue Engine (scoring + chat + automation): $50,000-$100,000 (10-14 weeks implementation). All engagements include: custom architecture design, integration with your existing CRM/tools, team training and documentation, 90-day post-launch support.`,
    metadata: {
      category: 'pricing',
      subcategory: 'overview',
      keywords: ['price', 'cost', 'investment', 'budget', 'how much'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'pricing-factors',
    content: `Pricing factors that affect investment: Number of integrations required (each CRM/tool connection adds complexity). Data volume and processing requirements. Custom model training needs (if using proprietary data). Compliance requirements (HIPAA, SOC2, GDPR). Ongoing support and maintenance tier selected. Enterprise clients with complex requirements typically fall in the higher ranges. Startups with simpler stacks can often achieve results at the lower end.`,
    metadata: {
      category: 'pricing',
      subcategory: 'factors',
      keywords: ['price', 'cost', 'enterprise', 'startup', 'complexity'],
      technicalDepth: 'L1',
    },
  },

  // ============================================
  // METHODOLOGY
  // ============================================
  {
    id: 'methodology-overview',
    content: `Our methodology delivers production-ready systems in 6-12 weeks. No PowerPoint consulting—just code that ships. Phase 1 (Discovery & Strategy): Deep-dive into current operations, identify automation opportunities, define success metrics and KPIs, create custom implementation roadmap. Phase 2 (System Development): Build custom automation infrastructure, connect to existing tools and data, implement intelligent decision logic, set up real-time monitoring. Phase 3 (Intelligence Layer): Train systems on historical data, calibrate scoring and qualification logic, implement continuous improvement loops, validate accuracy against benchmarks. Phase 4 (Launch & Optimize): Controlled production rollout, performance tuning and refinement, team training and documentation, ongoing monitoring and iteration.`,
    metadata: {
      category: 'methodology',
      subcategory: 'phases',
      keywords: ['process', 'methodology', 'how', 'work', 'phases', 'timeline'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'methodology-technical',
    content: `Technical Implementation Standards: All code follows production-grade practices—type hints, comprehensive testing (95%+ coverage), structured logging, error handling. Infrastructure as Code using Terraform/Pulumi for reproducible deployments. CI/CD pipelines for automated testing and deployment. Model versioning with MLflow for tracking experiments and promoting models. A/B testing framework built-in for validating changes before full rollout. Drift detection monitors for data distribution shifts that could degrade model performance.`,
    metadata: {
      category: 'methodology',
      subcategory: 'technical-standards',
      keywords: ['standards', 'testing', 'cicd', 'mlflow', 'infrastructure'],
      technicalDepth: 'L3',
    },
  },

  // ============================================
  // CASE STUDIES
  // ============================================
  {
    id: 'case-franchise-overview',
    content: `Case Study: Franchise Lead Operations (Fitness & Franchising). Challenge: Manual lead qualification was creating bottlenecks, with sales team spending 60% of time on unqualified prospects. Solution: Deployed automated lead scoring with territory availability validation and ROI projections for $40k-$60k licensing deals. Implemented intelligent nurture sequencing based on lead tier. Results: $120k-$600k projected Year 1 revenue increase. 10x faster lead response time. Sales team now focuses only on Tier S and A leads.`,
    metadata: {
      category: 'case-studies',
      subcategory: 'franchise',
      keywords: ['franchise', 'fitness', 'case study', 'results', 'roi'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'case-saas-overview',
    content: `Case Study: Inbound Lead Automation (B2B SaaS). Challenge: Leads sat in queue for 24-48 hours before first contact. Conversion rate was declining as competitors responded faster. Solution: Instant scoring on form submission with automated data enrichment. Intent-based prioritization with intelligent routing to sales or nurture tracks. Results: 10x faster response time (from 24 hours to under 5 minutes for hot leads). 40% increase in conversion rate. Sales team capacity effectively doubled without new hires.`,
    metadata: {
      category: 'case-studies',
      subcategory: 'saas',
      keywords: ['saas', 'b2b', 'case study', 'conversion', 'response time'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'case-traffic-overview',
    content: `Case Study: Digital Traffic Intelligence (Multi-Industry). Challenge: Website traffic was anonymous—no way to identify or engage interested visitors who didn't fill out forms. Solution: Visitor identification and tracking with automated prospect discovery. CRM sync and outreach triggering based on behavioral patterns. Results: 3x pipeline velocity improvement. Identified and engaged prospects who would have otherwise been lost. New revenue source from previously invisible traffic.`,
    metadata: {
      category: 'case-studies',
      subcategory: 'traffic-intelligence',
      keywords: ['traffic', 'visitor', 'identification', 'tracking', 'anonymous'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'case-support-overview',
    content: `Case Study: Intelligent Response System (Customer Success). Challenge: Support team overwhelmed with repetitive questions. Response times lagging, customer satisfaction declining. Solution: Context-aware conversation handling with 91% intent classification accuracy. Personalized response generation with smart escalation to human agents when needed. Results: 65% reduction in support ticket volume. Faster resolution for common issues. Human agents freed up for complex, high-value interactions.`,
    metadata: {
      category: 'case-studies',
      subcategory: 'customer-success',
      keywords: ['support', 'customer', 'success', 'tickets', 'automation'],
      technicalDepth: 'L1',
    },
  },

  // ============================================
  // TECHNICAL / FAQ
  // ============================================
  {
    id: 'tech-stack-001',
    content: `Technology Stack: Backend built with Python (FastAPI) and TypeScript (Next.js). ML infrastructure uses MLflow for model tracking, scikit-learn and XGBoost for traditional ML, and LangChain for LLM orchestration. Vector database: ChromaDB for semantic search with sentence-transformers embeddings. Database: PostgreSQL for transactional data, Redis for caching. Infrastructure: Docker containers deployed on Fly.io or Railway, with Vercel for frontend. Monitoring: Prometheus + Grafana + Loki stack.`,
    metadata: {
      category: 'technical',
      subcategory: 'stack',
      keywords: ['technology', 'stack', 'python', 'fastapi', 'mlflow', 'chromadb'],
      technicalDepth: 'L3',
    },
  },
  {
    id: 'tech-dmn-001',
    content: `Decision Model Notation (DMN): We use DMN for transparent, auditable business rules in lead routing and scoring. Unlike black-box ML models, DMN decision tables are human-readable and easily modified by non-engineers. Example rule: IF lead_score >= 80 AND awareness_level >= 4 AND has_budget = true THEN tier = 'S' AND sla_minutes = 5 AND action = 'immediate_call'. DMN integrates with ML predictions—ML provides scores, DMN applies business logic for routing decisions.`,
    metadata: {
      category: 'technical',
      subcategory: 'dmn',
      keywords: ['dmn', 'decision', 'rules', 'routing', 'logic', 'table'],
      technicalDepth: 'L2',
    },
  },
  {
    id: 'faq-timeline-001',
    content: `How long does implementation take? Typical timelines: Lead Scoring System: 4-6 weeks. Conversational AI Agent: 6-8 weeks. Full Revenue Engine: 10-14 weeks. Factors that affect timeline: complexity of existing tech stack, number of integrations required, data quality and availability, custom model training needs. We can often deliver a working POC within 2-3 weeks to prove value before full implementation.`,
    metadata: {
      category: 'faq',
      subcategory: 'timeline',
      keywords: ['how long', 'timeline', 'weeks', 'implementation', 'poc'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'faq-integrations-001',
    content: `What integrations do you support? Primary CRM integrations: GoHighLevel (GHL), HubSpot, Salesforce, Pipedrive, ActiveCampaign, Zoho CRM. Marketing automation: Mailchimp, Klaviyo, Marketo. Communication: Twilio (SMS/Voice), SendGrid, Postmark. Data enrichment: Clearbit, Apollo, ZoomInfo. Custom integrations available via webhook or API for any tool with an API.`,
    metadata: {
      category: 'faq',
      subcategory: 'integrations',
      keywords: ['integration', 'connect', 'ghl', 'hubspot', 'salesforce', 'crm'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'faq-difference-001',
    content: `How is DBG different from other AI consultants? We ship code, not PowerPoints. Most AI consultants deliver strategy decks and leave implementation to you. We build and deploy production systems. Our founder has hands-on engineering experience—he's built and deployed the systems we sell, not just advised on them. We focus specifically on revenue operations, not general AI consulting. Every engagement includes working infrastructure, not just recommendations.`,
    metadata: {
      category: 'faq',
      subcategory: 'differentiation',
      keywords: ['different', 'why', 'compare', 'versus', 'other'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'faq-booking-001',
    content: `How do I get started? Book a 45-minute Technical Walkthrough with Noel. This is not a sales pitch—it's a technical discussion where we: audit your current infrastructure, identify highest-impact automation opportunities, scope a proof-of-concept if there's a fit. You can book via the website or email noel@drivebrandgrowth.com. Include your current tech stack, what you're trying to automate, and your timeline.`,
    metadata: {
      category: 'faq',
      subcategory: 'getting-started',
      keywords: ['start', 'book', 'call', 'meeting', 'schedule', 'contact'],
      technicalDepth: 'L1',
    },
  },

  // ============================================
  // CIRCUIT OS - REVENUE PREDICTION ENGINE
  // ============================================
  {
    id: 'circuitos-overview-001',
    content: `Circuit OS is a Revenue Prediction Engine. Not another dashboard. Not another CRM plugin. It answers the questions your tools can't: Which deals close this quarter? Not which ones you hope will. Which $500K opportunity is actually a $50K discovery trap? Which rep's pipeline is real vs fantasy? Where do you coach first Monday morning to change the outcome? Your CRM is a rearview mirror. Circuit OS is the windshield.`,
    metadata: {
      category: 'technical',
      subcategory: 'circuit-os',
      keywords: ['circuit os', 'revenue prediction', 'forecast', 'pipeline', 'deals'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'circuitos-how-it-works-001',
    content: `How Circuit OS Works: Step 1 - Data Ingestion: Connects to your CRM (Salesforce, HubSpot, GHL) and pulls deal data including stage history, activity patterns, stakeholder engagement, and timeline changes. Step 2 - Pattern Extraction: Analyzes your historical wins and losses to find patterns unique to YOUR business. What activity sequences lead to close? How long do real deals stay in each stage? Step 3 - Real-Time Scoring: Every deal gets scored against those patterns with close probability, stage accuracy, risk score, and qualification gaps. Step 4 - Gap Detection: Your methodology (MEDDIC, BANT) becomes executable logic that runs automatically. Step 5 - Continuous Learning: Tracks predictions against outcomes and gets smarter every quarter.`,
    metadata: {
      category: 'technical',
      subcategory: 'circuit-os',
      keywords: ['how it works', 'scoring', 'patterns', 'methodology', 'learning'],
      technicalDepth: 'L2',
    },
  },
  {
    id: 'circuitos-dmn-001',
    content: `DMN (Decision Model and Notation) is how we encode your sales methodology as executable logic. Instead of a PDF your reps ignore, your process becomes rules that run automatically. Example: IF champion_identified = false AND stage > 2, Flag "No champion identified past discovery" and Action "Coach rep on champion development". IF economic_buyer_engaged = false AND deal_value > $100K, Flag "No EB engagement on enterprise deal" and Action "Escalate to manager review". IF days_in_stage > 2x average AND no_activity_7_days, Flag "Deal stalled" and Action "Add to at-risk pipeline review". DMN integrates with ML predictions—ML provides scores, DMN applies business logic for routing decisions.`,
    metadata: {
      category: 'technical',
      subcategory: 'dmn',
      keywords: ['dmn', 'decision model', 'methodology', 'meddic', 'bant', 'rules'],
      technicalDepth: 'L2',
    },
  },
  {
    id: 'circuitos-ml-scoring-001',
    content: `ML Scoring uses ensemble models (XGBoost, LightGBM, Neural Networks) trained on YOUR closed deals, not industry benchmarks. Every deal gets scored on: Close Probability (0-100%) based on patterns from your wins. Stage Accuracy - is this deal actually in the stage the rep says? Risk Score - probability of slip or loss. Velocity Index - moving faster or slower than winners? Scores update continuously as new activity comes in. Not daily. Not weekly. Real-time.`,
    metadata: {
      category: 'technical',
      subcategory: 'ml-scoring',
      keywords: ['ml', 'machine learning', 'scoring', 'probability', 'prediction'],
      technicalDepth: 'L2',
    },
  },
  {
    id: 'circuitos-feedback-loop-001',
    content: `Feedback Loop and Continuous Learning: Every prediction is tracked against actual outcome. When deals close or die, the system learns. Accuracy improves quarter over quarter. Drift detection flags when patterns change. Auto-retraining triggers when accuracy drops below threshold. The engine adapts to your business as your business changes. No manual model updates. No stale scoring.`,
    metadata: {
      category: 'technical',
      subcategory: 'feedback-loops',
      keywords: ['feedback', 'learning', 'drift', 'retraining', 'accuracy'],
      technicalDepth: 'L2',
    },
  },
  {
    id: 'circuitos-monday-output-001',
    content: `The Monday Morning Output from Circuit OS: FORECAST STATUS shows Commit at $2.4M (87% confidence), Best Case at $3.1M (62% confidence), and At Risk showing $890K across 3 deals with stall signals. PRIORITY COACHING ranked by revenue impact: 1. Acme Corp ($340K) - No EB engagement, 45 days in negotiation. 2. TechStart ($180K) - Champion went dark, last activity 12 days. 3. GlobalFin ($420K) - Procurement loop, timeline slipped 2x. REP ACCURACY shows Sarah at 84% (commit reliable), Mike at 61% (over-forecasts by avg 22%), James at 73% (sandbagging - actuals beat commit).`,
    metadata: {
      category: 'technical',
      subcategory: 'circuit-os',
      keywords: ['monday', 'output', 'forecast', 'coaching', 'priority'],
      technicalDepth: 'L1',
    },
  },

  // ============================================
  // CIRCUIT OS PRICING
  // ============================================
  {
    id: 'circuitos-pricing-overview-001',
    content: `Circuit OS Pricing replaces $250K-$400K in payroll with a fraction of the cost. Starter at $497/month: For 1-3 reps, weekly deal scoring, close probability on every deal, basic gap detection, Monday priority email. Setup $2,500. Growth at $1,497/month: For 4-10 reps, real-time CRM integration, full methodology enforcement, rep accuracy tracking, forecast dashboard, risk alerts. Setup $7,500. Scale at $3,497/month: For 10-25 reps, dedicated success manager, weekly pipeline review, auto-retraining, unlimited users. Setup $15,000. Enterprise: Custom pricing for 25+ reps.`,
    metadata: {
      category: 'pricing',
      subcategory: 'circuit-os',
      keywords: ['pricing', 'cost', 'tier', 'starter', 'growth', 'scale', 'enterprise'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'circuitos-roi-001',
    content: `Circuit OS ROI Math: Starter tier ($6K/year) breaks even by saving or closing ONE extra $8,500 deal per year. Realistic value is 2 deals you would have missed plus 5 hours/week saved on manual forecasting. Growth tier ($18K/year) breaks even with ONE extra $25,500 deal per year. Replaces a RevOps analyst salary of $95,000. Scale tier ($42K/year) breaks even with TWO extra $28,500 deals per year. Replaces RevOps analyst + Sales Ops manager + fractional VP advisory, totaling $300K+ in payroll.`,
    metadata: {
      category: 'pricing',
      subcategory: 'roi',
      keywords: ['roi', 'break even', 'value', 'payroll', 'savings'],
      technicalDepth: 'L1',
    },
  },

  // ============================================
  // IDEAL CUSTOMER PROFILES
  // ============================================
  {
    id: 'icp-high-ticket-001',
    content: `Ideal Customer Profiles for Circuit OS - High-Ticket, Longer Sales Cycles: Franchise Sales (Non-Conglomerate) with 10-50 deals per year, $50K-$500K deal size, 3-12 month cycles. B2B SaaS Mid-Market with growing teams and board pressure, $25K-$150K ARR, 2-6 months. Professional Services with complex relationship-driven engagements, $50K-$500K, 2-9 months. Commercial Real Estate with high stakes and few deals per agent, $100K-$1M+, 3-18 months. Equipment/Machinery Sales with capital purchases and budget cycles, $75K-$500K, 3-12 months.`,
    metadata: {
      category: 'company',
      subcategory: 'icp',
      keywords: ['icp', 'ideal customer', 'franchise', 'saas', 'high ticket'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'icp-disqualifiers-001',
    content: `Circuit OS Disqualifiers - Not Our Market: Transactional sales under $5K deal size. High-volume low-touch with thousands of deals per month. Pure inbound self-serve models. Enterprise with existing RevOps teams (unless white-label). Companies with less than 12 months of deal history. We need enough data to find patterns.`,
    metadata: {
      category: 'company',
      subcategory: 'icp',
      keywords: ['disqualify', 'not fit', 'wrong', 'transactional'],
      technicalDepth: 'L1',
    },
  },

  // ============================================
  // FOUNDER / CREDIBILITY
  // ============================================
  {
    id: 'founder-credentials-001',
    content: `Noel Pena's Background: 15 years enterprise B2B sales - closed the deals, not just analyzed them. Executive experience in corporate environments. Serial entrepreneur and advisor to companies of all shapes and sizes. University of Michigan Chief Data and AI Officer program. Built systems that predict which deals close. The standard is: sounds like someone who closed $1M+ deals, built systems that ship, has no patience for theater, and respects the reader's time.`,
    metadata: {
      category: 'company',
      subcategory: 'founder',
      keywords: ['noel', 'founder', 'credentials', 'background', 'experience'],
      technicalDepth: 'L1',
    },
  },

  // ============================================
  // COMPETITIVE DIFFERENTIATION
  // ============================================
  {
    id: 'differentiation-vs-generic-001',
    content: `What makes Circuit OS different from generic AI tools: Generic tools train on industry benchmarks, same model for every customer, static scoring that degrades over time, you configure rules manually. Circuit OS trains on YOUR closed deals, creates a model unique to your revenue patterns, uses continuous learning from outcomes, and enforces your methodology automatically. Generic = off-the-shelf guessing. Circuit OS = custom prediction engine.`,
    metadata: {
      category: 'technical',
      subcategory: 'differentiation',
      keywords: ['different', 'vs', 'generic', 'comparison', 'unique'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'differentiation-vs-revops-tools-001',
    content: `Circuit OS vs traditional RevOps tools (Clari, Gong, etc.): Most RevOps tools are dashboards showing you what already happened. They're rearview mirrors. Circuit OS is the windshield. It tells you what's about to happen. Clari and similar tools aggregate rep forecasts and apply some math. We analyze deal patterns and predict outcomes. Big difference when your comp plan depends on accuracy.`,
    metadata: {
      category: 'technical',
      subcategory: 'differentiation',
      keywords: ['clari', 'gong', 'revops', 'comparison', 'versus'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'differentiation-vs-consultants-001',
    content: `DBG vs traditional AI consultants: Most AI consultants deliver PowerPoint decks with recommendations and leave implementation to you. We ship working code. Every engagement produces production infrastructure, not strategy documents. You work directly with Noel, not a rotating cast of junior consultants. 16 systems live in production right now. We've done this 16 times.`,
    metadata: {
      category: 'company',
      subcategory: 'differentiation',
      keywords: ['different', 'consultant', 'vs', 'powerpoint', 'production'],
      technicalDepth: 'L1',
    },
  },

  // ============================================
  // SPECIFIC USE CASES
  // ============================================
  {
    id: 'usecase-franchise-001',
    content: `Franchise Sales use case: Franchise licensing deals are high-ticket ($40K-$500K), long cycle (3-12 months), and few per year (10-50 deals). Territory validation matters. Financial qualification matters. Discovery depth matters. Circuit OS tracks these signals, scores every deal against your winning patterns, and tells you Monday morning which prospects need attention. One extra closed deal pays for the system for years.`,
    metadata: {
      category: 'services',
      subcategory: 'franchise',
      keywords: ['franchise', 'licensing', 'territory', 'high ticket'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'usecase-saas-001',
    content: `B2B SaaS use case: SaaS deals have consistent patterns - demo to close ratios, engagement sequences, stakeholder involvement. Circuit OS learns YOUR patterns from historical data. When a current deal deviates from winning patterns (champion goes dark, timeline slips, stakeholder count drops), it flags it before the rep updates the forecast. Prevents surprise slips at quarter end.`,
    metadata: {
      category: 'services',
      subcategory: 'saas',
      keywords: ['saas', 'software', 'demo', 'subscription'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'usecase-professional-services-001',
    content: `Professional Services use case: Consulting, law, accounting firms with relationship-driven sales. Deals are often referral-based with long nurture cycles. Circuit OS tracks referral source effectiveness, engagement depth before proposal, and stakeholder relationship strength. Predicts which proposals close vs which need more development. Helps partners focus on winnable work.`,
    metadata: {
      category: 'services',
      subcategory: 'professional-services',
      keywords: ['consulting', 'professional services', 'law', 'accounting'],
      technicalDepth: 'L1',
    },
  },

  // ============================================
  // IMPLEMENTATION DETAILS
  // ============================================
  {
    id: 'implementation-timeline-001',
    content: `Circuit OS Implementation Timeline: Week 1 is data collection and process mapping. Week 2 is pattern discovery from your historical wins and losses. Week 3 is model training and accuracy validation. Week 4 is deployment and team onboarding. For companies with clean CRM data, we can have predictions running in 30 days. For companies starting from spreadsheets, add 1-2 weeks for data normalization.`,
    metadata: {
      category: 'methodology',
      subcategory: 'implementation',
      keywords: ['timeline', 'implementation', 'weeks', 'onboarding'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'implementation-data-requirements-001',
    content: `What data does Circuit OS need? Minimum: 30 closed deals with outcomes over 12-24 months. Workable: 50-100 closed deals with basic attributes. Ideal: 200+ closed deals with stage history, activity data, stakeholder info, and timeline changes. If you have less than 30 deals, we supplement with industry patterns and refine as you close more. Data quality matters more than quantity.`,
    metadata: {
      category: 'methodology',
      subcategory: 'data-requirements',
      keywords: ['data', 'requirements', 'deals', 'history', 'minimum'],
      technicalDepth: 'L2',
    },
  },
  {
    id: 'implementation-crm-integration-001',
    content: `CRM Integration: Circuit OS connects natively to Salesforce, HubSpot, GoHighLevel (GHL), and Pipedrive. We pull deal data via API - stage history, activity logs, contact engagement, timeline changes. Bi-directional sync pushes scores and recommendations back to your CRM. Your reps see predictions in their workflow without switching tools. Setup takes 1-2 days once credentials are provided.`,
    metadata: {
      category: 'technical',
      subcategory: 'integration',
      keywords: ['crm', 'salesforce', 'hubspot', 'ghl', 'integration'],
      technicalDepth: 'L2',
    },
  },

  // ============================================
  // OBJECTION HANDLING
  // ============================================
  {
    id: 'objection-pricing-001',
    content: `Pricing Concern Response: Circuit OS starts at $497/month. The question isn't whether you can afford it - it's whether you can afford not to know which deals close. One deal you would have missed or slipped pays for the system for 1-3 years depending on your deal size. At Growth tier ($1,497/month), you're replacing a $95K RevOps analyst salary with more consistent, less biased predictions.`,
    metadata: {
      category: 'faq',
      subcategory: 'objections',
      keywords: ['price', 'cost', 'afford', 'expensive', 'worth it'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'objection-already-have-tools-001',
    content: `Already Have RevOps Tools Response: Your current tools show you what happened. Pipeline reports, activity dashboards, forecast snapshots. Circuit OS tells you what happens next. It's not replacing your CRM or Clari - it's adding a prediction layer that your current stack doesn't have. The question is: does your current setup tell you Monday morning which 5 deals need coaching and why? If not, there's a gap.`,
    metadata: {
      category: 'faq',
      subcategory: 'objections',
      keywords: ['already have', 'tools', 'clari', 'salesforce', 'replace'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'objection-ai-accuracy-001',
    content: `AI Accuracy Skepticism Response: Fair concern. Most AI tools are demos that don't work in production. Circuit OS is different for two reasons: First, we train on YOUR data, not generic benchmarks. Second, we track every prediction against actual outcomes and retrain when accuracy drops. Current accuracy: 91% on close predictions. We can show you historical prediction vs. actual for client pipelines.`,
    metadata: {
      category: 'faq',
      subcategory: 'objections',
      keywords: ['accuracy', 'work', 'trust', 'skeptical', 'proof'],
      technicalDepth: 'L1',
    },
  },
  {
    id: 'objection-data-security-001',
    content: `Data Security Concern Response: Your deal data stays in your infrastructure unless you want managed hosting. We use encrypted connections (TLS 1.3), no data leaves your CRM without your explicit API credentials, and we sign NDAs before any data access. For enterprise clients requiring SOC2 or specific compliance, we can discuss dedicated deployment options.`,
    metadata: {
      category: 'faq',
      subcategory: 'objections',
      keywords: ['security', 'data', 'privacy', 'soc2', 'compliance'],
      technicalDepth: 'L2',
    },
  },

  // ============================================
  // TECHNICAL ARCHITECTURE
  // ============================================
  {
    id: 'tech-architecture-overview-001',
    content: `Circuit OS Technical Architecture: Data Layer pulls from your CRM via API. ML Layer uses ensemble models (XGBoost, LightGBM, Neural Networks) trained on your deals. DMN Layer executes your sales methodology as decision rules. Prediction Layer provides real-time scoring via API. Feedback Layer tracks outcomes and triggers retraining. Everything runs in production, not notebooks. Sub-200ms response times.`,
    metadata: {
      category: 'technical',
      subcategory: 'architecture',
      keywords: ['architecture', 'stack', 'technical', 'layers'],
      technicalDepth: 'L3',
    },
  },
  {
    id: 'tech-ml-models-001',
    content: `ML Model Details: We use ensemble methods combining XGBoost for structured features, LightGBM for categorical variables, and optional neural network embeddings for sequence patterns. Feature engineering includes: stage velocity (days in stage vs. average), activity recency (time-decayed engagement), stakeholder breadth (unique contacts per opportunity), and timeline stability (close date changes). Models retrain automatically when drift is detected.`,
    metadata: {
      category: 'technical',
      subcategory: 'ml',
      keywords: ['ml', 'model', 'xgboost', 'neural network', 'features'],
      technicalDepth: 'L3',
    },
  },
  {
    id: 'tech-dmn-details-001',
    content: `DMN Engine Details: Decision Model and Notation (DMN) is an OMG standard for business rules. We use it to encode sales methodology as executable decision tables. Example table: columns are Champion Identified, EB Engaged, Days in Stage, Activity Last 7 Days. Rows define outcomes: if champion=false AND stage>2, action="Flag missing champion". Rules are version-controlled and auditable. Non-engineers can read and modify them in FEEL expression language.`,
    metadata: {
      category: 'technical',
      subcategory: 'dmn',
      keywords: ['dmn', 'decision table', 'feel', 'rules engine'],
      technicalDepth: 'L3',
    },
  },
];

/**
 * Get all chunks for embedding
 */
export function getAllChunks(): KnowledgeChunk[] {
  return KNOWLEDGE_BASE;
}

/**
 * Filter chunks by category
 */
export function getChunksByCategory(category: KnowledgeChunk['metadata']['category']): KnowledgeChunk[] {
  return KNOWLEDGE_BASE.filter(chunk => chunk.metadata.category === category);
}

/**
 * Filter chunks by technical depth
 */
export function getChunksByDepth(depth: 'L1' | 'L2' | 'L3'): KnowledgeChunk[] {
  return KNOWLEDGE_BASE.filter(chunk => chunk.metadata.technicalDepth === depth);
}
