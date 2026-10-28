import Link from 'next/link'
import PageShell from '@/components/PageShell'
import { getSite, listSteps } from '@/lib/content'

function SetupText() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-20 pt-36">
      <p className="text-sm font-medium text-blue-400">Editor</p>
      <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-[-0.02em]">The hosted editor is not signed in yet</h1>
      <p className="mt-6 text-lg leading-[1.6] text-[#a1a1aa]">
        On your own machine, run the site and open /admin. Saving writes the files in this repo. Nothing else is required.
      </p>
      <p className="mt-4 text-lg leading-[1.6] text-[#a1a1aa]">
        On the deployed site, the editor talks to GitHub and needs a GitHub App that you create. This deployment does not have that configuration, so the editor stays closed instead of trying to write a disk it cannot change.
      </p>
      <p className="mt-4 text-lg leading-[1.6] text-[#a1a1aa]">
        The steps, and the variable names, are in docs/cms.md. No paid editor account is required.
      </p>
      <p className="mt-8">
        <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium max-sm:inline-block max-sm:py-2">
          Back to the site
        </Link>
      </p>
    </section>
  )
}

export default async function EditorSetup() {
  // If the content files cannot be read, show the setup text alone instead of crashing.
  const contentReadable = await Promise.all([getSite(), listSteps()]).then(
    () => true,
    () => false,
  )
  if (!contentReadable) return <SetupText />
  return (
    <PageShell>
      <SetupText />
    </PageShell>
  )
}
