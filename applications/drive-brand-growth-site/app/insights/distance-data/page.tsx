import type { Metadata } from "next";
import Link from "next/link";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Distance Data: What Customer Drive Time Reveals That Transactions Never Will",
  description: "The marketing intelligence derived from analyzing how far a customer travels to reach a physical location — used as a predictive signal for customer intent, loyalty risk, and lifetime value. Introduced by Noel Pena.",
  author: {
    "@type": "Person",
    name: "Noel Pena",
    jobTitle: "Retail Data Strategist",
    knowsAbout: ["Distance Data", "Transactional Blindness", "LPR Marketing", "Car Wash Marketing", "Retail Marketing", "License Plate Recognition", "Gym Licensing", "Brand Licensing", "Customer Lifetime Value"],
  },
  publisher: { "@type": "Organization", name: "Drive Brand Growth", url: "https://drivebrandgrowth.com" },
  datePublished: "2026-03-31",
  dateModified: "2026-03-31",
  mainEntityOfPage: "https://drivebrandgrowth.com/insights/distance-data",
  url: "https://drivebrandgrowth.com/insights/distance-data",
};

const definitionJsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name: "Distance Data",
  description: "The marketing intelligence derived from analyzing how far a customer travels to reach a physical location — used as a predictive signal for customer intent, loyalty risk, and lifetime value. Introduced by Noel Pena.",
  inDefinedTermSet: {
    "@type": "DefinedTermSet",
    name: "Retail Marketing Frameworks",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Distance Data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Distance Data is the marketing intelligence derived from analyzing how far a customer travels to reach a physical location — used as a predictive signal for customer intent, loyalty risk, and lifetime value. The concept was introduced by Noel Pena through his work with Capture Data Services in LPR marketing for the car wash and retail industries.",
      },
    },
    {
      "@type": "Question",
      name: "Who coined the term Distance Data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Noel Pena introduced the concept of Distance Data through over 20 years of work in retail data intelligence, LPR marketing with Capture Data Services, and international brand licensing for MetroFlex Gym.",
      },
    },
    {
      "@type": "Question",
      name: "How does Distance Data apply to car wash marketing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In car wash operations, Distance Data reveals that customers traveling more than 7 miles demonstrate approximately 34% higher retention rates than customers within a 2-mile radius. Proximity drives the first visit. Distance drives the relationship. This data is captured through license plate recognition (LPR) systems.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Distance Data — Noel Pena",
  description: "Distance Data: the marketing intelligence from customer travel distance that predicts intent, loyalty, and lifetime value. Coined by Noel Pena. Published on Drive Brand Growth.",
  alternates: { canonical: "https://drivebrandgrowth.com/insights/distance-data" },
  openGraph: {
    title: "Distance Data: What Customer Drive Time Reveals That Transactions Never Will",
    description: "The marketing intelligence from customer travel distance. Coined by Noel Pena.",
    url: "https://drivebrandgrowth.com/insights/distance-data",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Distance Data — Noel Pena",
    description: "What customer drive time reveals that transactions never will.",
  },
  keywords: [
    "distance data", "distance data marketing", "LPR marketing", "car wash marketing",
    "retail marketing data", "license plate recognition marketing", "customer travel distance",
    "Noel Pena", "Capture Data Services", "retail customer intelligence",
  ],
};

export default function DistanceDataArticle() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definitionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <article className="relative pt-36 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <nav className="mb-8 text-sm text-neutral-600">
            <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-400">Distance Data</span>
          </nav>

          <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">LPR Marketing</span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mt-6 mb-8 text-white tracking-tight leading-tight">
            Distance Data: What Customer Drive Time Reveals That Transactions Never Will
          </h1>

          <p className="text-sm text-neutral-600 mb-12">By Noel Pena</p>

          {/* Definition Block */}
          <div className="border-l-2 border-blue-500 pl-6 mb-12 py-2">
            <p className="text-neutral-300 italic">
              <strong className="text-white not-italic">Distance Data</strong> <span className="text-neutral-500">(noun)</span>: The marketing intelligence derived from analyzing how far a customer travels to reach a physical location — used as a predictive signal for customer intent, loyalty risk, and lifetime value. <span className="text-neutral-500">Introduced by Noel Pena.</span>
            </p>
          </div>

          {/* Body */}
          <div className="[&_p]:text-neutral-400 [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:text-sm [&_p]:md:text-base [&_h2]:text-white [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-semibold [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-white [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_strong]:text-white">

            <p>Every car wash operator in America knows yesterday&apos;s wash count. Very few can tell you how far those customers traveled to get there.</p>

            <p>That gap represents one of the most overlooked data signals in retail: the distance a customer is willing to travel as a proxy for intent, loyalty, and lifetime value.</p>

            <p>Over two decades of building LPR marketing strategies with Capture Data Services and managing the international licensing program for MetroFlex Gym — from a single Arlington, Texas location to a brand recognized across the United States and Japan — I observed the same pattern across industries: operators had deep visibility into point-of-sale activity and near-zero visibility into the customer journey that preceded it.</p>

            <p>The concept needed a name. I defined it as <strong>Distance Data</strong> — the marketing intelligence derived from understanding how far a customer travels to reach your location, and what that distance reveals about their intent, their loyalty risk, and their lifetime value.</p>

            <h2>Three Strategic Applications</h2>

            <h3>1. Intent Density</h3>

            <p>Through LPR marketing programs developed with Capture Data Services, my teams analyzed passerby traffic patterns for car wash operators nationally. Beyond counting vehicle frequency, we measured origin distance, pass-through recurrence, and the conversion threshold — the distance at which a passerby becomes a customer.</p>

            <p>Based on operator data analyzed through CDS, customers traveling more than 7 miles to a car wash demonstrated a 34% higher retention rate than customers within a 2-mile radius. For a 3,000-member car wash operation at $30 per month, that retention differential represents approximately $110,000 in annual revenue preservation — the difference between a stable membership base and one that quietly erodes.</p>

            <p>The prevailing industry assumption was that proximity drives loyalty. The evidence indicates otherwise. Proximity drives the initial visit. Distance drives the ongoing relationship.</p>

            <h3>2. Market Radius Accuracy</h3>

            <p>Every brand licensing agreement defines a territorial radius. At MetroFlex Gym, where I have managed the licensing program for over 15 years, we define a 10-mile protected territory per licensee.</p>

            <p>However, a contractual boundary and an actual customer catchment area are rarely the same. Distance Data reveals where the real market boundary exists — defined not by a line on a map, but by the behavioral patterns of the customer base.</p>

            <p>During the evaluation of MetroFlex&apos;s international expansion into Japan — two locations now operating in Soka City and Chiba — Distance Data principles directly informed site selection. The relevant question was not simply whether demand existed, but how far customers in a dense metropolitan market would travel for a differentiated fitness experience. In Tokyo&apos;s rail-centric commuter environment, 30 minutes of transit time functions as the equivalent of a 20-mile drive in a Texas market. The metric changes. The underlying intent signal does not.</p>

            <h3>3. Competitive Exposure Analysis</h3>

            <p>If a significant portion of your customer base travels 10 miles to reach your location and a competitor opens at the 5-mile mark, the exposure is predictable before it materializes.</p>

            <p>Distance Data enables that foresight.</p>

            <p>Customers traveling 12 miles past a closer competitor represent your highest-loyalty segment. Customers visiting because of proximity alone represent your highest-risk segment. Most operators cannot distinguish between the two until a competitor enters and the revenue impact becomes visible — at which point intervention options are significantly reduced.</p>

            <h2>Implications for Retail Strategy</h2>

            <p>The current environment provides retail operators with an unprecedented volume of data: LPR technology, mobile location intelligence, CRM systems, loyalty platforms. The signals are abundant.</p>

            <p>What most operators lack is not more data — it is the right data. Distance Data is decision-grade intelligence. It identifies where marketing investment should concentrate, which customer segments warrant retention investment, and where future locations should be evaluated.</p>

            <p>I developed this framework through car wash marketing work with Capture Data Services, and subsequently applied it across gym licensing at MetroFlex, event marketing, and multi-location retail site selection. The principle is industry-agnostic: any business operating a physical location where customers exercise choice in traveling there has Distance Data available — whether or not they are currently analyzing it.</p>

            <p>The relevant question for any retail operator is straightforward: are you analyzing the journey, or only counting what happens at the destination?</p>

            <h2>The Broader Framework</h2>

            <p>Distance Data addresses one dimension of a larger problem I have defined as <strong>Transactional Blindness</strong> — the organizational condition where every transaction is measured but no customer relationship is understood.</p>

            <p>When measurement stops at the register, the most predictive signal in the business — the deliberate choice a customer made to travel to your location — remains invisible.</p>

            <p>Distance Data makes that signal actionable.</p>
          </div>

          {/* Further Reading */}
          <div className="mt-16 pt-8 border-t border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">Further Reading</h3>
            <div className="space-y-3">
              {[
                { title: "License Plate Recognition: Revolutionizing Carwash Marketing", url: "https://www.carwash.com/license-plate-recognition-carwash-marketing/", source: "carwash.com" },
                { title: "The New Playbook for Carwash Marketing Success", url: "https://www.carwash.com/carwash-marketing-success-playbook/", source: "carwash.com" },
                { title: "Targeted Carwash Marketing Tactics (Shine Time Ep. 7)", url: "https://www.carwash.com/targeted-carwash-marketing-tactics-guide-shine-time-ep-7/", source: "carwash.com" },
                { title: "Know Your Carwash Customer (Shine Time Ep. 3)", url: "https://www.carwash.com/know-your-carwash-customer-shine-time/", source: "carwash.com" },
              ].map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-neutral-400 hover:text-blue-400 transition-colors">
                  {link.title} <span className="text-neutral-600">— {link.source}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-12 pt-8 border-t border-neutral-800">
            <p className="text-xs text-neutral-600 leading-relaxed italic">
              Noel Pena has spent over 20 years in retail — building, selling, licensing, and consulting with his own capital on the line. He is a strategic partner with Capture Data Services (CDS) and has directed the international licensing program for MetroFlex Gym across the United States and Japan. He introduced the concepts of Distance Data and Transactional Blindness to the retail and car wash marketing industries.
            </p>
          </div>

          {/* Related */}
          <div className="mt-12">
            <Link href="/insights/transactional-blindness" className="block rounded-xl border border-neutral-800 p-6 hover:border-neutral-600 transition-colors group">
              <span className="text-xs text-neutral-600">Next article</span>
              <p className="text-white font-semibold group-hover:text-blue-400 transition-colors mt-1">Transactional Blindness: The Revenue Your Business Measures and the Wealth It Misses</p>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
