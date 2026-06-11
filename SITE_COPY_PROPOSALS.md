# CircuitOS — Site Copy Proposals

> **REQUIRES NOEL APPROVAL — NOTHING IN THIS FILE SHIPS.**
> None of the copy below is live. It is proposed positioning to fill the holes left by
> the banned-claim removals. Every line is drafted to map to the **approved inventory**
> only (no `23%`, no signal counts, no performance numbers, no production-validation
> claims). Approve / edit / reject per item.

---

## Why this file exists
Removing the `72-signal` count and the `Accuracy Δ +4.2%` tile leaves a few spots where
a number used to carry the "credibility weight." The strongest replacement is the
governance/audit story, which is **adversarially audited and provable** — not a number
that ages or can't be reproduced. Proposals lean into that.

---

## 1. Hero sub-headline (currently fine; optional sharpen)
**Live now (kept):** "CircuitOS scores every decision with calibrated confidence, acts within governed rules, and proves the call was sound — before the outcome is in. A signed audit trail, every time."

**Optional proposal (REQUIRES APPROVAL):**
> "AI that can act on your pipeline — and prove every action was authorized. Calibrated scoring, governed execution, a signed audit trail every time."

*Maps to:* approved positioning line + approved items #1/#2. No numbers.

---

## 2. Replace the retired signal-count credibility with the governance proof
Where copy used to say "72 signals," consider leading with the **structural guarantee**
instead of any count:

**Proposal A (capability bullet, REQUIRES APPROVAL):**
> "Every agent action is gated by a signed, time-valid authorization contract — actions outside its permitted scope can't execute. Enforced structurally, not by policy."

**Proposal B (capability bullet, REQUIRES APPROVAL):**
> "Every action and every blocked attempt is written to an append-only, hash-chained, tamper-evident ledger (SHA-256) — enforced at the database layer."

**Proposal C (capability bullet, REQUIRES APPROVAL):**
> "Proven under concurrent load: zero lost attestations, zero duplicate executions, a strictly linear evidence chain."

*Maps to:* approved items #1, #2, #3. These are the audited, defensible claims that can
carry the weight the count used to fake.

---

## 3. Scoring section (replace any lingering "predictive accuracy" implication)
**Proposal (REQUIRES APPROVAL):**
> "Scoring is a validated Bayesian engine — explicit priors, likelihood ratios, posterior updates — verified against hand-computed known answers."

*Maps to:* approved item #5. Avoids any measured-accuracy claim.

---

## 4. Causal / advanced-method mention (ONLY if Noel wants to surface it)
If a causal-inference line is ever added, it **must** carry the synthetic-validation
framing (approved item #6) and must **not** imply production-data validation:

**Proposal (REQUIRES APPROVAL):**
> "Causal inference on Pearl's framework — DAG modeling, backdoor-criterion adjustment sets, FWL residualization — validated on synthetic known-answer tests."

*Do not* pair this with "validated on real/production data" (banned item 3).

---

## 5. Calibration line
**Proposal (REQUIRES APPROVAL):**
> "Calibration instrumentation — ECE, Brier, drift — built and verified."

*Maps to:* approved item #7. State it as built/verified, not as a measured outcome.

---

## 6. Demo & dashboard mockups (decision needed — see audit U-1…U-3)
The interactive demo and the hero `DashboardPreview` show invented performance figures
(94% accuracy, 99.9% uptime, 87% forecast accuracy, +12% deltas, etc.). Two clean options:

- **Option 1 (recommended):** Add a small, persistent "Illustrative — simulated data" label to the demo/dashboard surfaces so the numbers can't be read as measured results.
- **Option 2:** Replace numeric tiles with qualitative states (e.g. "Scoring", "Within rules", "Signed") so no performance number is asserted.

*Neither is implemented* — awaiting Noel's call.

---

## 7. `llms.txt` cleanup (decision needed — see audit U-9/U-10)
Recommend removing the unbacked performance line "Production-deployed across 6 live
verticals with 1,200+ automated tests" and "Enterprise-grade" puffery, replacing the
status line with a neutral, audit-backed statement:

**Proposal (REQUIRES APPROVAL):**
> "Status: governed AI decisioning with a signed, tamper-evident audit ledger; execution gate and ledger adversarially audited under concurrent load."

---

## Guardrails honored in every proposal
- No `23%`, no `72/84/43` (or any) signal count, no specific performance number.
- No production/real-data validation claim for causal or calibration layers.
- Only approved capability/governance claims and approved positioning language used.
