# Domain switch

This file is the redirect plan. It is not live.

Nothing in `next.config.js`, `vercel.json`, or `middleware.ts` redirects traffic. The prebuild content check fails the build if a redirects key or a redirect response shows up in those files. The data copy of the map lives in `lib/redirects.pending.ts` and is not imported.

Do not attach domains, change Vercel project settings, or turn these on until Noel says the host is moving.

Canonical URLs, the sitemap, `robots.txt`, and `llms.txt` already name `https://thecircuitmethod.com`. Merging this branch onto the current production host before the domain move would publish those canonicals early. Leave the pull request in draft until that choice is made.

## www is 301, not 307

When the domains are attached:

- `https://www.thecircuitmethod.com/*` → `https://thecircuitmethod.com/*` with **301**
- `https://www.usecircuitos.com/*` → the apex, then the path map, with **301**

Do not use 307. A 307 is temporary. A domain move should be permanent so browsers and crawlers cache the new host.

## Path map

All of these are 301, from `https://usecircuitos.com` to `https://thecircuitmethod.com`.

| From | To |
| --- | --- |
| `/` | `/` |
| `/insights` | `/field-notes` |
| `/insights/:slug` | `/field-notes/:slug` |
| `/playground` | `/practice` |
| `/demo` | `/work-with-me` |
| `/receipts-test` | `/causal` |
| `/privacy` | `/privacy` |
| `/terms` | `/terms` |

Slugs that already exist and should keep their names:

- `/insights/honesty-gap` → `/field-notes/honesty-gap`
- `/insights/deterministic-factory` → `/field-notes/deterministic-factory`
- `/insights/governance-manifesto` → `/field-notes/governance-manifesto`
- `/insights/lead-walk-through` → `/field-notes/lead-walk-through`

## Fragments

Old home sections were anchors, not pages: `#platform`, `#how-it-works`, `#capabilities`, `#pricing`, `#contact`, `#build-calculator`, `#the-truth`. Servers do not reliably redirect fragments. After the move those addresses open the home page, which no longer has those sections.

## What Noel still decides

- When to attach `thecircuitmethod.com` and when the old host starts 301s.
- That www uses 301 rather than the host default of 307.
- The mailbox. The contact path on the site is still `hello@usecircuitos.com` because that address already exists. A `thecircuitmethod.com` mailbox is not assumed.
- Whether DriveBrandGrowth LLC remains the legal name on the privacy page and the terms.
- Analytics. The script loads only when `NEXT_PUBLIC_GA_ID` is set. This change does not add or edit that variable. A new GA4 stream for the new host is a separate choice.
- The chat widget. It was removed from the site. The old concierge route was removed with it. Say if it should return in some other form.
- Final copy, especially the legal pages, which were rewritten to match a teaching site and should be read before they are treated as current terms.
