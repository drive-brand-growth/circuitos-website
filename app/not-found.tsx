import PageShell from '@/components/PageShell'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <PageShell>
      <section className="px-6 pb-28 pt-24 text-center">
        <p className="kicker">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">This page is not on the loop</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-[var(--muted)]">
          The address does not match a page on this site. The method, the field notes, and a way to write are below.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/">Home</Button>
          <Button href="/method" variant="secondary">
            The method
          </Button>
          <Button href="/work-with-me" variant="quiet">
            Work with me
          </Button>
        </div>
      </section>
    </PageShell>
  )
}
