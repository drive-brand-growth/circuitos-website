/**
 * NOT ACTIVE.
 *
 * This map is documentation in code form. Nothing imports it.
 * Do not reference it from next.config.js, middleware.ts, or vercel.json.
 * The prebuild check fails if those files gain a redirects key or a redirect response.
 *
 * Turn these on only when Noel attaches thecircuitmethod.com.
 * See docs/domain-switch.md.
 *
 * www hosts must use 301 (permanent), not 307 (temporary).
 */

export const REDIRECTS_ACTIVE = false as const

export type PendingRedirect = {
  from: string
  to: string
  status: 301
  note: string
}

export const PENDING_REDIRECTS: PendingRedirect[] = [
  {
    from: 'https://www.thecircuitmethod.com/:path*',
    to: 'https://thecircuitmethod.com/:path*',
    status: 301,
    note: 'www to apex. Permanent. Do not use 307.',
  },
  {
    from: 'https://www.usecircuitos.com/:path*',
    to: 'https://usecircuitos.com/:path*',
    status: 301,
    note: 'Old www to old apex first, or straight to the new host after the path map. Permanent. Do not use 307.',
  },
  {
    from: 'https://usecircuitos.com/',
    to: 'https://thecircuitmethod.com/',
    status: 301,
    note: 'Apex home.',
  },
  {
    from: 'https://usecircuitos.com/insights',
    to: 'https://thecircuitmethod.com/field-notes',
    status: 301,
    note: 'Field notes index.',
  },
  {
    from: 'https://usecircuitos.com/insights/:slug',
    to: 'https://thecircuitmethod.com/field-notes/:slug',
    status: 301,
    note: 'Each existing essay keeps its slug.',
  },
  {
    from: 'https://usecircuitos.com/playground',
    to: 'https://thecircuitmethod.com/practice',
    status: 301,
    note: 'Playground moved to /practice.',
  },
  {
    from: 'https://usecircuitos.com/demo',
    to: 'https://thecircuitmethod.com/work-with-me',
    status: 301,
    note: 'Demo page removed. Conversation page replaces it. No prices.',
  },
  {
    from: 'https://usecircuitos.com/receipts-test',
    to: 'https://thecircuitmethod.com/causal',
    status: 301,
    note: 'Receipts test removed. The attribution lesson lives on Proof.',
  },
  {
    from: 'https://usecircuitos.com/privacy',
    to: 'https://thecircuitmethod.com/privacy',
    status: 301,
    note: 'Same path.',
  },
  {
    from: 'https://usecircuitos.com/terms',
    to: 'https://thecircuitmethod.com/terms',
    status: 301,
    note: 'Same path.',
  },
]
