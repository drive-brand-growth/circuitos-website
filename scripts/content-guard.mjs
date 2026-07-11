#!/usr/bin/env node
/**
 * Content guard — runs as `prebuild`, so banned copy cannot reach any deploy
 * (local build, droplet docker build, Vercel). Operator law, mechanically
 * enforced after the 2026-07-10 QA pass found hand-fixed rules regressed.
 *
 * Rules:
 *  1. "MetroFlex" appears nowhere (operator: not my business, not the ICP).
 *  2. No unnamed "running live in production" claims (anti-hype contract).
 *  3. No fabricated-benchmark tells in the concierge prompt.
 *  4. No NEW em dashes in user-visible source. Files in EM_DASH_LEGACY carried
 *     them before the guard existed; sweep them and delete entries. No adds.
 *
 * False positive? Add a narrow allowlist entry with a reason. Never widen.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SCAN = ["app", "components", "lib", "middleware.ts"];
const EXTS = new Set([".ts", ".tsx"]);

/** files with pre-guard em dashes, pending a dedicated sweep. Do not add. */
const EM_DASH_LEGACY = new Set([
  "app/api/chat/route.ts", // system-prompt headings/instructions (model-read); output rule 6b bans dashes in replies
  "app/insights/deterministic-factory/page.tsx",
  "app/insights/governance-manifesto/page.tsx",
  "app/insights/honesty-gap/page.tsx",
  "app/insights/lead-walk-through/page.tsx",
  "app/insights/page.tsx",
  "app/playground/page.tsx",
  "app/receipts-test/page.tsx",
  "components/playground/DecisionPlayground.tsx",
  "app/demo/page.tsx", // '—' null-score placeholder + demo labels
  "components/playground/AutonomyPanel.tsx",
  "components/playground/ClutchStrike.tsx",
  "components/playground/PlaygroundHeader.tsx",
  "lib/ghl.ts",
  "lib/revenue-physics.ts",
  "lib/slack/commands/campaigns.ts", // internal ops-bot surfaces below
  "lib/slack/commands/content.ts",
  "lib/slack/commands/help.ts",
  "lib/slack/commands/leads.ts",
  "lib/slack/router.ts",
]);

const RULES = [
  {
    name: "no-metroflex",
    test: (line) => /metroflex/i.test(line),
    message: "MetroFlex must not appear on the CircuitOS site (operator law, 2026-07-10).",
  },
  {
    name: "no-unnamed-production-claim",
    test: (line) => /running live in production/i.test(line) && !/operating compan/i.test(line),
    message: "No 'running live in production' without naming the receipt (anti-hype contract).",
  },
  {
    name: "no-fabricated-benchmarks",
    test: (line) => /(typically (lose|see|cut) \d+%|by \d+% in the first (month|week))/i.test(line),
    message: "Fabricated-benchmark phrasing. No number without a source (no-fabrication law).",
  },
  {
    name: "no-new-em-dashes",
    test: (line) => /—/.test(line),
    message: "No em dashes in copy (operator law). Legacy files baselined in EM_DASH_LEGACY.",
    baseline: EM_DASH_LEGACY,
  },
];

function walk(p, acc = []) {
  const st = statSync(p);
  if (st.isFile()) {
    if (EXTS.has(extname(p))) acc.push(p);
    return acc;
  }
  for (const e of readdirSync(p)) {
    if (e === "node_modules" || e.startsWith(".")) continue;
    walk(join(p, e), acc);
  }
  return acc;
}

/** strip block comments, whole-line comments, and trailing // comments */
function copyLines(src) {
  const out = [];
  let inBlock = false;
  src.split("\n").forEach((raw, i) => {
    let line = raw;
    if (inBlock) {
      const end = line.indexOf("*/");
      if (end === -1) return;
      line = line.slice(end + 2);
      inBlock = false;
    }
    let s = line.indexOf("/*");
    while (s !== -1) {
      const e = line.indexOf("*/", s + 2);
      if (e === -1) {
        line = line.slice(0, s);
        inBlock = true;
        break;
      }
      line = line.slice(0, s) + line.slice(e + 2);
      s = line.indexOf("/*");
    }
    const t = line.trim();
    if (!t || t.startsWith("//") || t.startsWith("*")) return;
    const m = line.match(/(?<!:)\/\/(?!\/)/);
    if (m && m.index > 0) line = line.slice(0, m.index);
    if (line.trim()) out.push({ line, n: i + 1 });
  });
  return out;
}

const files = SCAN.flatMap((p) => walk(join(ROOT, p)));
let failed = false;

for (const rule of RULES) {
  const violations = [];
  for (const file of files) {
    const rel = relative(ROOT, file);
    if (rule.baseline?.has(rel)) continue;
    for (const { line, n } of copyLines(readFileSync(file, "utf8"))) {
      if (rule.test(line)) violations.push(`  ${rel}:${n}: ${line.trim().slice(0, 90)}`);
    }
  }
  if (violations.length) {
    failed = true;
    console.error(`\nCONTENT GUARD [${rule.name}] — ${rule.message}`);
    console.error(violations.join("\n"));
  }
}

if (failed) {
  console.error("\nBuild blocked by content guard. Fix the copy (or narrowly allowlist with a reason).\n");
  process.exit(1);
}
console.log("content-guard: clean");
