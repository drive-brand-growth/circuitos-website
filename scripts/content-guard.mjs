#!/usr/bin/env node
/**
 * Content guard. Runs as `prebuild`, so banned copy cannot reach a build.
 *
 * Rules:
 *  1. "MetroFlex" appears nowhere on this site.
 *  2. No unnamed "running live in production" claims.
 *  3. No fabricated benchmark phrasing.
 *  4. No new em dashes or en dashes. Legacy files are listed below. Do not add.
 *  5. No ® on The Circuit Method (the mark is ™). No ® anywhere in scanned copy.
 *  6. The word franchise does not appear.
 *  7. No DRN, no Motorola.
 *  8. No hype words from the 2026-10-24 steer: revolutionary, autonomous,
 *     agentic, game changing, 10x, magic.
 *  9. No CircuitOS, AgentOps, or "book a demo" on the public site.
 *     Internal Slack and CRM glue is skipped for that product name rule only.
 * 10. The old four stage slogan does not return.
 * 11. Domain redirects stay unwired. See docs/domain-switch.md.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SCAN = ["app", "components", "lib", "middleware.ts"];
const TEXT_SCAN = ["public"];
const EXTS = new Set([".ts", ".tsx"]);
const TEXT_EXTS = new Set([".txt"]);

/** files with pre-guard em dashes, pending a dedicated sweep. Do not add. */
const EM_DASH_LEGACY = new Set([
  "lib/ghl.ts",
  "lib/slack/commands/campaigns.ts",
  "lib/slack/commands/content.ts",
  "lib/slack/commands/help.ts",
  "lib/slack/commands/leads.ts",
  "lib/slack/router.ts",
]);

function isInternalOps(rel) {
  return rel.startsWith("lib/slack/") || rel.startsWith("app/api/slack/") || rel === "lib/ghl.ts";
}

const RULES = [
  {
    name: "no-metroflex",
    test: (line) => /metroflex/i.test(line),
    message: "MetroFlex must not appear.",
  },
  {
    name: "no-unnamed-production-claim",
    test: (line) => /running live in production/i.test(line) && !/operating compan/i.test(line),
    message: "No 'running live in production' without naming the receipt (anti-hype contract).",
  },
  {
    name: "no-fabricated-benchmarks",
    test: (line) => /(typically (lose|see|cut) \d+%|by \d+% in the first (month|week))/i.test(line),
    message: "Fabricated benchmark phrasing. No number without a source (no fabrication law).",
  },
  {
    name: "no-new-em-dashes",
    test: (line) => /—/.test(line),
    message: "No em dashes in copy (operator law). Legacy files baselined in EM_DASH_LEGACY.",
    baseline: EM_DASH_LEGACY,
  },
  {
    name: "no-new-en-dashes",
    test: (line) => /–/.test(line),
    message: "No en dashes in copy.",
    baseline: EM_DASH_LEGACY,
  },
  {
    name: "no-registered-mark",
    test: (line) => /®/.test(line),
    message: "Never use ®. The Circuit Method™ uses ™.",
  },
  {
    name: "no-franchise",
    test: (line) => /franchis/i.test(line),
    message: "The word franchise must not appear. A license is not that word.",
  },
  {
    name: "no-drn",
    test: (line) => /\bDRN\b/.test(line),
    message: "DRN must not appear.",
  },
  {
    name: "no-motorola",
    test: (line) => /motorola/i.test(line),
    message: "Motorola must not appear.",
  },
  {
    name: "no-hype-words",
    test: (line) => /\b(revolutionary|autonomous|agentic|magic)\b|game[\s-]?changing|\b10x\b|10×/i.test(line),
    message: "Hype word banned (2026-10-24 steer). Lead with the operating discipline. A model is a tool, not the headline.",
  },
  {
    name: "no-old-product-name",
    test: (line) => /\b(circuitos|agentops)\b|book a demo/i.test(line),
    message: "Old product name, AgentOps, or a demo call to action. This site teaches the method.",
    skip: isInternalOps,
  },
  {
    name: "no-old-four-stages",
    test: (line) => /observe\.\s*decide\.\s*act\.\s*prove/i.test(line),
    message: "The loop is Signal, Switch, Current, Breaker, Ground.",
  },
];

function walk(p, exts, acc = []) {
  const st = statSync(p);
  if (st.isFile()) {
    if (exts.has(extname(p))) acc.push(p);
    return acc;
  }
  for (const e of readdirSync(p)) {
    if (e === "node_modules" || e.startsWith(".")) continue;
    walk(join(p, e), exts, acc);
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

function assertRedirectsInactive() {
  const hits = [];
  for (const file of ["next.config.js", "vercel.json", "middleware.ts"]) {
    const src = readFileSync(join(ROOT, file), "utf8");
    if (/redirects\s*:/.test(src) || /NextResponse\.redirect/.test(src) || /redirects\.pending/.test(src)) {
      hits.push(file);
    }
  }
  if (hits.length) {
    console.error(`\nCONTENT GUARD [redirects-inactive] — domain redirects must stay unwired (${hits.join(", ")}). See docs/domain-switch.md.`);
    return true;
  }
  return false;
}

const files = [
  ...SCAN.flatMap((p) => walk(join(ROOT, p), EXTS)),
  ...TEXT_SCAN.flatMap((p) => walk(join(ROOT, p), TEXT_EXTS)),
  ...walk(join(ROOT, "content"), new Set([".yaml", ".yml", ".mdoc", ".md"])),
];
let failed = assertRedirectsInactive();

for (const rule of RULES) {
  const violations = [];
  for (const file of files) {
    const rel = relative(ROOT, file);
    if (rule.baseline?.has(rel)) continue;
    if (rule.skip?.(rel)) continue;
    for (const { line, n } of copyLines(readFileSync(file, "utf8"))) {
      if (rule.test(line)) violations.push(`  ${rel}:${n}: ${line.trim().slice(0, 140)}`);
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
