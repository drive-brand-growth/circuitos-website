import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import { getSite, listSteps } from '@/lib/content'

export default async function PageShell({ children }: { children: React.ReactNode }) {
  const [site, steps] = await Promise.all([getSite(), listSteps()])

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <a href="#main-content" className="sr-only skip-link">
        Skip to main content
      </a>
      <Nav items={[...site.nav]} ctaLabel={site.navCtaLabel} ctaHref={site.navCtaHref} />
      <main id="main-content">{children}</main>
      <Footer site={site} steps={steps} />
    </div>
  )
}
