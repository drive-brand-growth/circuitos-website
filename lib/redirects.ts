/**
 * LIVE. middleware.ts imports this.
 *
 * Every request on an old host answers with a 301 to thecircuitmethod.com,
 * after the path map below. Paths not in the map keep their path.
 * The query string carries over. Fragments never reach the server.
 *
 * The prebuild check allows this one host based redirect and fails on any other.
 * See docs/domain-switch.md.
 *
 * www hosts must use 301 (permanent), not 307 (temporary).
 */
import { SITE_URL } from './site'

export const OLD_HOSTS: readonly string[] = ['usecircuitos.com', 'www.usecircuitos.com']

export type PathRedirect = {
  from: string
  to: string
  note: string
}

export const PATH_REDIRECTS: PathRedirect[] = [
  {
    from: '/',
    to: '/',
    note: 'Apex home.',
  },
  {
    from: '/insights',
    to: '/field-notes',
    note: 'Field notes index.',
  },
  {
    from: '/insights/:slug',
    to: '/field-notes/:slug',
    note: 'Each existing essay keeps its slug.',
  },
  {
    from: '/playground',
    to: '/practice',
    note: 'Playground moved to /practice.',
  },
  {
    from: '/demo',
    to: '/work-with-me',
    note: 'Demo page removed. Conversation page replaces it. No prices.',
  },
  {
    from: '/receipts-test',
    to: '/causal',
    note: 'Receipts test removed. The attribution lesson lives on Proof.',
  },
  {
    from: '/privacy',
    to: '/privacy',
    note: 'Same path.',
  },
  {
    from: '/terms',
    to: '/terms',
    note: 'Same path.',
  },
]

const SLUG = ':slug'

/** New path for an old path. Unknown paths keep their path. */
export function mapOldPath(pathname: string): string {
  for (const { from, to } of PATH_REDIRECTS) {
    if (from.endsWith(SLUG)) {
      const base = from.slice(0, -SLUG.length)
      const slug = pathname.startsWith(base) ? pathname.slice(base.length) : ''
      if (slug && !slug.includes('/')) return to.slice(0, -SLUG.length) + slug
    } else if (pathname === from) {
      return to
    }
  }
  return pathname
}

/** The 301 target for a request on an old host (a trailing dot names the same host). Null for every other host. */
export function oldHostRedirect(url: Pick<URL, 'hostname' | 'pathname' | 'search'>): URL | null {
  if (!OLD_HOSTS.includes(url.hostname.replace(/\.$/, ''))) return null
  // Set the path on the fixed origin. Joining strings would let a path like //example.com pick the host.
  const target = new URL(SITE_URL)
  target.pathname = mapOldPath(url.pathname)
  target.search = url.search
  return target
}
