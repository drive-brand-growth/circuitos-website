# CircuitOS — Website Claims Audit

Adversarial claims audit of the live CircuitOS site. Scope: find every factual /
performance claim, classify against the ground-truth inventory, surgically remove
BANNED claims, retain APPROVED ones, and flag UNVERIFIED ones for Noel.

> Classification legend
> - **BANNED** — matches the banned list → removed.
> - **APPROVED** — matches the approved inventory → retained (wording tightened only if needed).
> - **UNVERIFIED** — neither list → flagged for Noel. **Not silently kept or deleted.**

---

## PHASE 0 — DISCOVER

### Stack
- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript, Tailwind, framer-motion.
- **Package name:** `circuitos-website` (root). Deployed via `fly.toml` / `Dockerfile`.
- **Live domain (per metadata/JSON-LD):** `https://usecircuitos.com`.

### Where copy lives (the CircuitOS site = root `app/`, `components/`, `public/`)
| Surface | Files |
|---|---|
| Page body copy / components | `components/Hero.tsx`, `Capabilities.tsx`, `Platform.tsx`, `HowItWorks.tsx`, `Pricing.tsx`, `IntegrationBar.tsx`, `DashboardPreview.tsx`, `BuildCalculator.tsx`, `Nav.tsx`, `Footer.tsx`, `ContactForm.tsx`, `AriaX.tsx` |
| Routes / long-form copy | `app/page.tsx`, `app/demo/page.tsx`, `app/playground/page.tsx`, `app/insights/page.tsx`, `app/insights/lead-walk-through/page.tsx`, `app/insights/governance-manifesto/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/not-found.tsx` |
| `<title>` / meta description / OG / Twitter | `app/layout.tsx`, `app/demo/layout.tsx`, `app/playground/layout.tsx`, `app/insights/layout.tsx`, each insights `page.tsx` |
| JSON-LD structured data | `app/page.tsx` (SoftwareApplication, FAQPage, HowTo), `app/layout.tsx` (Organization, WebSite), both insights pages (Article) |
| OG image (rendered text) | `app/opengraph-image.tsx` |
| Machine-readable / AI copy | `public/llms.txt` |
| Chatbot copy served to visitors | `app/api/chat/route.ts` (`SYSTEM_PROMPT` + local fallback answers), `components/AriaX.tsx` (fallback KB) |
| Engine data backing playground | `lib/revenue-physics.ts` (SIGNALS array — no hardcoded count claim) |
| robots / sitemap | `public/robots.txt`, `app/sitemap.ts` |

**Downloadable PDFs / one-pagers:** none found in `/public` (only `.svg` logos/icons + `llms.txt` + `robots.txt`). SVGs scanned — no factual claims, only logo art.

### Out of scope (separate property)
`applications/drive-brand-growth-site/**` is the **Drive Brand Growth** marketing site (Distance Data / MetroFlex / Capture Data Services), a different brand/domain — **not** the CircuitOS Pro site. It was scanned for the banned CircuitOS claims; it carries **no** `23%`, no `72/84/43` signal-count, and no causal/calibration production-validation claim. Its own performance claims (e.g. "34% higher retention", "$2.4M commit at 87% confidence", "rep accuracy 84%") belong to that brand and were left untouched. Flagged here only for awareness — see UNVERIFIED note U-13.

---

## PHASE 1 — CLAIMS INVENTORY

### A. BANNED claims found & removed

All occurrences below are signal-count claims (`72` / "72+" / "Seventy-two") or a
measured forecast/accuracy-improvement number — both explicitly on the banned list.
Real counts (29 lead-scoring / 76 content) were **not** substituted; per guidance the
count was **dropped** (counts age badly).

| # | file:line (pre-edit) | Exact claim | Class | Action taken |
|---|---|---|---|---|
| 1 | `public/llms.txt:9` | "Predictive lead scoring across **72+ signals** with Bayesian inference" | BANNED | Count dropped → "Predictive lead scoring with a validated Bayesian inference engine" (approved capability framing) |
| 2 | `public/llms.txt:22` | "Every lead evaluated across **72+ signals** for fit, intent, and timing" | BANNED | Count dropped → "Every lead evaluated for fit, intent, and timing" |
| 3 | `public/llms.txt:60` | "The Bayesian scoring model evaluates **72+ signals** across fit, intent, and timing" | BANNED | Count dropped → "evaluates signals across fit, intent, and timing" |
| 4 | `components/DashboardPreview.tsx:132` | "**72 signals** · ICP-configured · Decision logic active" | BANNED | Count dropped → "ICP-configured · Decision logic active" |
| 5 | `components/Pricing.tsx:22` | "Predictive lead scoring (**72+ signals**)" | BANNED | Count dropped → "Predictive lead scoring" |
| 6 | `components/BuildCalculator.tsx:52` | "Predictive scoring across **72+ signals** with multi-source enrichment" | BANNED | Count dropped → "Predictive scoring with multi-source enrichment" |
| 7 | `app/insights/governance-manifesto/page.tsx:166` | "**Seventy-two signals** fire. Revenue fit scores 0.82…" | BANNED | Count dropped → "Signals fire. Revenue fit scores 0.82…" |
| 8 | `app/insights/lead-walk-through/page.tsx:8` (meta description) | "In **4.2 seconds, 72 signals** fire, a conviction score calculates…" | BANNED | Signal count + specific latency dropped → "Signals fire, a conviction score calculates…" |
| 9 | `app/insights/lead-walk-through/page.tsx:11` (OG description) | "In **4.2 seconds, 72 signals** fire, a conviction score calculates…" | BANNED | Signal count + latency dropped → "Signals fire, a conviction score calculates…" |
| 10 | `app/insights/lead-walk-through/page.tsx:18` (Twitter description) | "In **4.2 seconds, 72 signals** fire and an autonomous decision executes" | BANNED | Signal count + latency dropped → "Signals fire and an autonomous decision executes" |
| 11 | `app/insights/lead-walk-through/page.tsx:27` (Article JSON-LD) | "In **4.2 seconds, 72 signals** fire, a conviction score calculates…" | BANNED | Signal count + latency dropped → "Signals fire, a conviction score calculates…" |
| 12 | `app/insights/lead-walk-through/page.tsx:106` (body) | "**Seventy-two signals** fire simultaneously." | BANNED | Count dropped → "Signals fire simultaneously." (kept "five dimensions" — structural, not a banned signal count) |
| 13 | `app/insights/lead-walk-through/page.tsx:202` (body) | "scored her across **72 signals**" | BANNED | Count dropped → "scored her across every signal that fired"; "At 2:47 PM and 4.2 seconds" → "Seconds later" |
| 14 | `app/insights/page.tsx:16` (card description) | "In **4.2 seconds, 72 signals** fire, a conviction score calculates…" | BANNED | Signal count + latency dropped → "Signals fire, a conviction score calculates…" |
| 15 | `app/demo/page.tsx:192` (step headline) | "Bayesian model applies **72+ signals**" | BANNED | Count dropped → "Bayesian model scores every incoming signal" |
| 16 | `app/demo/page.tsx:197` (narrative) | "combines them with **72+ additional data points**" | BANNED | Count dropped → "combines them with the rest of the signal set" |
| 17 | `app/demo/page.tsx:201` (metric tile) | `{ label: 'Signals Active', base: 72 }` | BANNED | Count tile replaced → `{ label: 'Dimensions', base: 5 }` (reflects the 5 scoring dimensions already depicted; no signal-count claim) |
| 18 | `app/demo/page.tsx:377` (metric tile) | `{ label: 'Accuracy Δ', base: 4.2, suffix: '%' }` | BANNED | Measured accuracy-improvement number removed → `{ label: 'Priors Updated', base: 12 }` (neutral, on-theme for the closed-loop/retrain step) |

**Note on `23%`:** searched the entire content tree (`grep -rin "23%"` and forecast/accuracy/ROI paraphrase patterns) — **the `23%` claim does not appear anywhere on the live site.** Nothing to remove; confirmed clean. (See self-check below.)

---

### B. APPROVED claims found & retained (audit-backed)

These match the approved inventory and were kept. Wording already conforms; no rewrite needed.

| # | Representative location(s) | Claim (theme) | Maps to approved item |
|---|---|---|---|
| A1 | `Hero.tsx:45`, `Capabilities.tsx:34`, `HowItWorks.tsx:57/60`, `Platform.tsx:17`, `app/layout.tsx:20/41`, `app/page.tsx` JSON-LD | "Signed, tamper-evident audit trail" on every score/action/outcome | #2 (append-only, hash-chained, tamper-evident SHA-256 ledger) |
| A2 | `Capabilities.tsx:17/18`, `HowItWorks.tsx:33`, `app/page.tsx` FAQ, chat KB | "Calibrated win-probability scoring" / validated Bayesian engine (priors, likelihood ratios, posteriors) | #5 (validated Bayesian engine vs. known answers) |
| A3 | `Capabilities.tsx:29/30`, `HowItWorks.tsx:56/57`, "Decision-Quality Calibration" (`app/page.tsx:33`) | Proof of decision quality / calibration (ECE, Brier referenced in chat fallback) | #7 (calibration instrumentation built & verified) |
| A4 | `Capabilities.tsx:33/34`, `HowItWorks.tsx:44/45`, `governance-manifesto` | "Governed by rules; escalates by design" — confidence-mapped-to-risk gate, human-in-the-loop | #1 (execution gated by authorization scope, enforced structurally) |
| A5 | Positioning lines: "Governed AI decisioning" (`app/layout.tsx`, Hero, OG image), "decision intelligence", "provable" | Allowed positioning language (non-factual framing) | Approved positioning set |
| A6 | `Capabilities.tsx:37/38`, `HowItWorks.tsx:62`, FAQ | "Closed-loop learning — outcomes feed back" (capability statement, no measured-improvement number attached) | Supporting capability (kept; no banned perf number) |

> Tightening note: A2/A3 wording stays at the capability level (calibrated/validated) and does **not** assert any production-data validation — consistent with banned item 3. Left as-is.

---

### C. UNVERIFIED claims — FLAGGED FOR NOEL (not removed, not endorsed)

These are factual/performance claims that match **neither** list. Per the rules they
were **left in place and flagged** — Noel to confirm, substitute, or kill. None were
silently kept or silently deleted.

| # | file:line | Claim | Why flagged |
|---|---|---|---|
| U-1 | `app/demo/page.tsx` simulator tiles (e.g. `:470` Accuracy 94%, `:508` Accuracy 99.2%, `:609` Accuracy 94%, `:616/630` Forecast Acc 87%, `:515/536/557` Uptime 99.9%, `:484` Reply Rate 34%, `:522/524` Success Rate 99.7%, `:477/484` Pipeline $384K) | Animated demo dashboard shows absolute performance numbers (accuracy, uptime, reply/win rate, pipeline $). These are **simulated UI**, but read as performance claims and are not in the approved inventory. Recommend Noel decide: add a visible "simulated data" disclaimer, or neutralize the figures. |
| U-2 | `app/demo/page.tsx:596` "Win Rate 34% (+2%)"; `:603` "Win Rate ↑ 12% (good)" | Simulated **improvement deltas** on win rate — same family as banned forecast-accuracy improvement. Confirm/neutralize. |
| U-3 | `components/DashboardPreview.tsx:6-11` "847 Leads Scored +12%", "73% Route Rate +4%", "0.91 Model Confidence +0.03" | Hero dashboard mockup shows performance + improvement deltas. Simulated, but reads as measured. |
| U-4 | `app/api/chat/route.ts:142` "lose **40%** of qualified leads to timing gaps alone"; `:157` "200 leads/month and **30%** misrouted = 60 lost"; `:169` "cut their lead-to-meeting time by **60%**" | `SYSTEM_PROMPT` instructs the concierge to state these benchmark numbers to visitors. Generic sales-methodology illustrations, but presented as fact. Recommend reframing as explicitly hypothetical or removing. |
| U-5 | `components/Pricing.tsx:60` "Security controls informed by NIST CSF 2.0" | Compliance/standard alignment claim — not in approved inventory. Verify before keeping. |
| U-6 | `components/Pricing.tsx:61` "AI threat detection mapped to MITRE ATLAS" | Security framework claim — verify. |
| U-7 | `components/Pricing.tsx:62-63` "Automated PII redaction before model processing", "LLM cost circuit breaker & budget controls" | Capability claims — verify build status. |
| U-8 | `components/Pricing.tsx:66` "SLA & uptime guarantees"; `app/terms/page.tsx:66` SLA reference | Guarantee claim — verify contractual backing. |
| U-9 | `public/llms.txt:52` "Production-deployed across **6 live verticals** with **1,200+ automated tests**" | Specific deployment + test-count performance numbers — not in approved inventory (approved set carries no perf numbers). Strongly recommend removal/neutralization; flagged rather than deleted per rules. |
| U-10 | `public/llms.txt:3/5` "Enterprise-grade revenue intelligence"; `:28` "5+ AI models"; `:78` "Each cycle makes predictions more accurate" | "Enterprise-grade" puffery, a model-count, and a measured-improvement implication. Verify/neutralize. |
| U-11 | Hero badge `Hero.tsx:30` "running live in production"; chat KB `route.ts:119` "running live in production today" | Deployment claim. True per first-party framing (run on own businesses) but not in approved inventory and could be read as production-validation. Confirm wording. |
| U-12 | `app/page.tsx:105` FAQ "Roughly **four weeks** from contract to live decisioning" | Specific onboarding-timeline claim — verify. |
| U-13 | Worked-example internals in `lead-walk-through` (`:8/11/18/27` latency now removed from meta; body still has "4.2 seconds", `T+0.8s…T+4.2s`, conviction 78.4%, thresholds) and `governance-manifesto` (0.82 / 0.71 / 0.89 / 78.4% / thresholds) | Fictional single-decision narratives (illustrative mechanism, not aggregate outcomes). Left intact as storytelling — removing them would exceed claim surgery. The **latency framing** ("4.2 seconds") reads as a speed claim; flagged for Noel to keep/cut. |
| U-14 | Retention inconsistency: site says audit-trail "retention: **indefinite**" (`HowItWorks.tsx:61`, `Capabilities.tsx:34`, chat KB) vs. demo simulator "**90-day** retention" (`app/demo/page.tsx:550/552`) | Inconsistent retention claim. Noel to set the true value. |
| U-15 | `applications/drive-brand-growth-site/**` | Separate brand/site (Drive Brand Growth). Carries its own performance claims (34% retention, $2.4M/87% confidence, rep accuracy 84%, etc.) and "Circuit OS" forecast examples in its chat KB. **Out of scope** for the CircuitOS audit; flagged only so Noel knows it exists and may want the same treatment. |

---

## PHASE 2 — EDIT SUMMARY

- **18 BANNED claim instances removed** (17× the `72`/"72+"/"Seventy-two" signal count, 1× the `Accuracy Δ +4.2%` measured improvement). Where the same line carried the specific "4.2 seconds" latency in meta/OG/Twitter/JSON-LD, that latency was dropped in the same edit (clean, neutral).
- Substitutions used the **nearest approved claim or neutral copy**, smallest viable edit, layout preserved. No new factual claims introduced.
- **No** voice rewrite, page restructure, redesign, dependency change, or styling change.
- New positioning ideas are **not** shipped here — see `SITE_COPY_PROPOSALS.md` (all marked REQUIRES NOEL APPROVAL).

---

## SELF-CHECK / HONESTY GATE

**1. Does `23%` or any measured-improvement paraphrase survive (incl. meta, JSON-LD, PDFs)?** **NO.**
```
$ grep -rin -E "23\s*%|23 percent|forecast.{0,20}(improv|accuracy|lift)|accuracy.{0,10}(lift|improv|Δ|delta|gain)" app components public lib
# (no claim matches — only false positives: Android UA regex, the word "ROI-driven", "ROI questions" classifier, playground "ROI calculator" signal label)
```
The banned `Accuracy Δ` improvement tile was the only measured-accuracy-improvement artifact and it was removed.

**2. Do `72`, `84`, `43` survive as signal-count claims?** **NO.**
```
$ grep -rin -E "(72|84|43)\+?\s*(signal|data point|additional|signals)" app components public lib
(no signal-count matches)
$ grep -rin -E "72\+?\s*(signal|data point|additional)|Seventy-two|Signals Active|Accuracy Δ|72 signals" app components public  (excl. lock files)
No matches found
```

**3. Did I add any factual claim not in the approved inventory?** **NO.** Substitutions are either approved-capability framing (validated Bayesian engine) or neutral, non-numeric structural copy ("Dimensions: 5" reflects the 5 scoring dimensions already shown; "Priors Updated" is a neutral closed-loop label).

**4. Are all UNVERIFIED claims flagged for Noel rather than silently resolved?** **YES.** 15 items (U-1…U-15) flagged above; none deleted, none endorsed.

**5. Did I rewrite voice/structure beyond claim surgery?** **NO.** Only the specific banned tokens were edited; surrounding sentences, layout, and components are unchanged.

---

`Site claims — BANNED REMOVED: 18 | APPROVED RETAINED: 6 | UNVERIFIED FLAGGED FOR NOEL: 15 | NEW CLAIMS ADDED: 0.`
