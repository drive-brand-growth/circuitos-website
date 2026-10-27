# Domain switch

This file is the redirect plan. It is live.

`middleware.ts` answers every request on `usecircuitos.com` and `www.usecircuitos.com` with a 301 to `https://thecircuitmethod.com`, after the path map below. The map lives in `lib/redirects.ts`. Paths not in the map keep their path, and the query string carries over. Requests on any other host, `thecircuitmethod.com` and previews included, are never redirected. `npm test` covers every row.

The prebuild content check allows exactly that one host based redirect. It fails the build on a redirects key in `next.config.js` or `vercel.json`, a Location header, a 30x status, any other redirect in `middleware.ts`, or a change to the old host list.

The middleware matcher skips `/_next/static`, `/_next/image`, `favicon.ico`, `mark.svg`, `logo-lockup.svg`, `robots.txt`, `sitemap.xml`, `llms.txt`, and `llms-full.txt`. Those paths skip the redirect and are served on the old host as before.

## www is 301, not 307

- `https://www.thecircuitmethod.com/*` → `https://thecircuitmethod.com/*` with **301**. Set on the Vercel domain, not in code.
- `https://www.usecircuitos.com/*` → the path map on `https://thecircuitmethod.com`, with **301**, once the domain is attached to this project with no domain redirect. The middleware handles it in one hop.

Do not point `www.usecircuitos.com` at `thecircuitmethod.com` with a Vercel domain redirect. That keeps the old path and skips the map, so `/demo` lands on a 404. A domain redirect to `usecircuitos.com` with 301 also works, in two hops.

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

- When the old host starts its 301s. That happens when this change merges to `main`, which deploys production.
- `www.usecircuitos.com`. On 2026-10-27 it answered 307 to the same path on `https://usecircuitos.com`, so it never reaches this middleware. Attach it to `circuitos-website` with no domain redirect so the middleware answers with one 301.
- Callbacks on the old host. If the Slack app's event request URL or the Keystatic GitHub app callback names `usecircuitos.com`, move it to `thecircuitmethod.com` before merging. After the move those requests get a 301 instead of reaching the route.
- Google Search Console. Once the 301s are live, a Change of Address from `usecircuitos.com` to `thecircuitmethod.com` tells Google the move is deliberate.
- The mailbox. The contact path on the site is still `hello@usecircuitos.com` because that address already exists. A `thecircuitmethod.com` mailbox is not assumed.
- Whether DriveBrandGrowth LLC remains the legal name on the privacy page and the terms.
- Analytics. The script loads only when `NEXT_PUBLIC_GA_ID` is set. This change does not add or edit that variable. A new GA4 stream for the new host is a separate choice.
- The chat widget. It was removed from the site. The old concierge route was removed with it. Say if it should return in some other form.
- Final copy, especially the legal pages, which were rewritten to match a teaching site and should be read before they are treated as current terms.
