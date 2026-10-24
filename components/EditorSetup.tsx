import Link from 'next/link'
import PageShell from '@/components/PageShell'

export default function EditorSetup() {
  return (
    <PageShell>
      <main className="mx-auto max-w-prose px-6 py-24">
        <p className="kicker">Editor</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">The hosted editor is not signed in yet</h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">
          On your own machine, run the site and open /admin. Saving writes the files in this repo. Nothing else is required.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          On the deployed site, the editor talks to GitHub and needs a GitHub App that you create. This deployment does not have that configuration, so the editor stays closed instead of trying to write a disk it cannot change.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          The steps, and the variable names, are in docs/cms.md. No paid editor account is required.
        </p>
        <p className="mt-8">
          <Link href="/" className="link">
            Back to the site
          </Link>
        </p>
      </main>
    </PageShell>
  )
}
