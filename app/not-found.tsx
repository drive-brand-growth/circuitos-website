import PageShell from '@/components/PageShell'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <PageShell>
      <section className="px-6 pb-28 pt-36 text-center hero-glow">
        <p className="text-sm font-medium text-blue-400">404</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-[-0.02em]">This page is not on the site</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-[#a1a1aa] leading-relaxed">
          The address does not match a page. The method and the Pipeline Autopsy are below.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/autopsy">Pipeline Autopsy</Button>
          <Button href="/method" variant="secondary">
            The method
          </Button>
        </div>
      </section>
    </PageShell>
  )
}
