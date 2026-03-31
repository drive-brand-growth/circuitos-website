"use client";

import Link from "next/link";

const articles = [
  {
    slug: "distance-data",
    title: "Distance Data: What Customer Drive Time Reveals That Transactions Never Will",
    description: "The marketing intelligence derived from analyzing how far a customer travels to reach a physical location — and why it predicts intent, loyalty, and lifetime value better than any metric on your POS screen.",
    tag: "LPR Marketing",
  },
  {
    slug: "transactional-blindness",
    title: "Transactional Blindness: The Revenue Your Business Measures and the Wealth It Misses",
    description: "The organizational condition where every transaction is measured with precision but no customer relationship is understood with depth. The $86,400-per-location problem hiding behind your dashboard.",
    tag: "Retail Intelligence",
  },
];

export default function InsightsPage() {
  return (
    <section className="relative pt-36 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-white tracking-tight">Insights</h1>
        <p className="text-neutral-500 text-lg mb-16">
          Two decades of retail data intelligence. Frameworks that name the problems operators feel but cannot articulate.
        </p>

        <div className="space-y-6">
          {articles.map((article) => (
            <Link key={article.slug} href={`/insights/${article.slug}`} className="block group">
              <article className="rounded-xl border border-neutral-800 p-8 transition-all hover:border-neutral-600 hover:translate-y-[-2px] bg-neutral-900/30">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                    {article.tag}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors mb-3 tracking-tight">
                  {article.title}
                </h2>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {article.description}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
