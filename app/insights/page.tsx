import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const articles = [
  {
    slug: 'honesty-gap',
    title: 'The Honesty Gap: Your Attribution Dashboard Is Flattering You',
    description: 'Every marketing tool shows you credit. Credit is not causation. Here is the gap between them, and the engine that refuses to show any number it can\'t prove.',
    tag: 'Measurement',
    readTime: '7 min read',
  },
  {
    slug: 'deterministic-factory',
    title: 'Stochastic Models Propose. Factories Commit. Ledgers Prove.',
    description:
      'The market ships demos. CircuitOS ships demonstrable governance: what, why, how, cost, and risk on every job.',
    tag: 'Platform',
    readTime: '6 min read',
  },
  {
    slug: 'governance-manifesto',
    title: 'Your AI Is Making Decisions It Can\'t Explain. That Should Terrify You.',
    description: 'Every company is deploying AI agents. Almost none can explain why the AI did what it did. This is not a technology problem. It is a governance problem.',
    tag: 'Governance',
    readTime: '8 min read',
  },
  {
    slug: 'lead-walk-through',
    title: 'A Lead Enters CircuitOS at 2:47 PM. Here\'s What Happened Next.',
    description: 'In seconds, registered signals fire, a conviction score calculates, a governance gate evaluates, and a governed decision executes. This is what it looks like.',
    tag: 'Product',
    readTime: '5 min read',
  },
  {
    slug: 'agentforce-gap',
    title: 'The Agentforce Gap: What Enterprise AI Agents Still Do Not Give You',
    description: 'I build with Agentforce professionally. It is genuinely good at CRM automation. Here are three things it structurally cannot give you, and why the difference is a product category, not a feature gap.',
    tag: 'Governance',
    readTime: '6 min read',
  },
]

export default function InsightsPage() {
  return (
    <main className="min-h-screen grid-bg">
      <Nav />
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">Insights</h1>
          <p className="text-[#a1a1aa] text-lg mb-16">
            How governed AI decisioning works and why provable decision quality changes everything.
          </p>

          <div className="space-y-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/insights/${article.slug}`}
                className="block group"
              >
                <article className="card rounded-xl p-5 md:p-8 transition-all hover:border-blue-500/30 hover:translate-y-[-2px]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                      {article.tag}
                    </span>
                    <span className="text-xs text-[#71717a]">{article.readTime}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3">
                    {article.title}
                  </h2>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed">
                    {article.description}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
