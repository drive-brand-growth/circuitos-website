#!/usr/bin/env node
/**
 * Slack events signature check. Read only probes against POST /api/slack/events.
 *
 *   node scripts/check-slack-events.mjs <base-url>
 *
 * Every probe body is {"type":"signature_probe"} or a url_verification body.
 * Neither reaches an event handler, so nothing posts to Slack and no API is called.
 *
 * Cases:
 *  A. No signature headers.                         Expect 401.
 *  B. Wrong signature with a current timestamp.     Expect 401.
 *  C. Unsigned url_verification.                    Expect 401 and no challenge echo.
 *  D. Stale timestamp (10 minutes) signed for it.   Expect 401.
 *  E. Valid signature over the signature probe.     Expect 200 {"ok":true}.
 *  F. Valid signed url_verification.                Expect 200 and the challenge.
 *
 * A to C need no secret. A 503 there means the server has no signing secret and
 * refuses everything, reported as CLOSED_NO_SECRET.
 * D to F sign with SLACK_SIGNING_SECRET from this shell and only run against
 * http://localhost or http://127.0.0.1. The secret is never printed.
 * Exits 1 on any FAIL.
 */
import crypto from "node:crypto";

const PROBE_BODY = JSON.stringify({ type: "signature_probe" });
const STALE_SECONDS = 10 * 60;

function usage(message) {
  console.error(message);
  console.error("Usage: node scripts/check-slack-events.mjs <base-url>");
  process.exit(2);
}

if (!process.argv[2]) usage("Missing base URL.");
let base;
try {
  base = new URL(process.argv[2]);
} catch {
  usage(`Not a URL: ${process.argv[2]}`);
}
if (base.protocol !== "http:" && base.protocol !== "https:") usage("Base URL must be http or https.");

const endpoint = new URL("/api/slack/events", base);
const isLocal = base.protocol === "http:" && (base.hostname === "localhost" || base.hostname === "127.0.0.1");
const secret = process.env.SLACK_SIGNING_SECRET || "";

function now() {
  return Math.floor(Date.now() / 1000);
}

function signedHeaders(timestamp, body) {
  const hmac = crypto.createHmac("sha256", secret).update(`v0:${timestamp}:${body}`).digest("hex");
  return { "x-slack-request-timestamp": String(timestamp), "x-slack-signature": `v0=${hmac}` };
}

function challengeProbe() {
  const challenge = `probe_${crypto.randomBytes(12).toString("hex")}`;
  return { challenge, body: JSON.stringify({ type: "url_verification", challenge }) };
}

async function post(body, headers = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
    redirect: "manual",
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // Not JSON, the checks below fall back to the status and raw text
  }
  return { status: res.status, text, json };
}

/** A to C: refused by the signature check, or refused because the server has no secret */
function refused(res, challenge) {
  if (challenge && res.text.includes(challenge)) return "FAIL";
  if (res.status === 401) return "PASS";
  if (res.status === 503) return "CLOSED_NO_SECRET";
  return "FAIL";
}

const CASES = [
  {
    id: "A",
    what: "no signature headers",
    run: async () => {
      const res = await post(PROBE_BODY);
      return { verdict: refused(res), status: res.status };
    },
  },
  {
    id: "B",
    what: "wrong signature with a current timestamp",
    run: async () => {
      const res = await post(PROBE_BODY, {
        "x-slack-request-timestamp": String(now()),
        "x-slack-signature": `v0=${"0".repeat(64)}`,
      });
      return { verdict: refused(res), status: res.status };
    },
  },
  {
    id: "C",
    what: "unsigned url_verification, challenge must not echo",
    run: async () => {
      const { challenge, body } = challengeProbe();
      const res = await post(body);
      return { verdict: refused(res, challenge), status: res.status };
    },
  },
  {
    id: "D",
    what: "stale timestamp (10 minutes) signed for it",
    signed: true,
    run: async () => {
      const res = await post(PROBE_BODY, signedHeaders(now() - STALE_SECONDS, PROBE_BODY));
      return { verdict: res.status === 401 ? "PASS" : "FAIL", status: res.status };
    },
  },
  {
    id: "E",
    what: "valid signature over the signature probe",
    signed: true,
    run: async () => {
      const res = await post(PROBE_BODY, signedHeaders(now(), PROBE_BODY));
      return { verdict: res.status === 200 && res.json?.ok === true ? "PASS" : "FAIL", status: res.status };
    },
  },
  {
    id: "F",
    what: "valid signed url_verification returns the challenge",
    signed: true,
    run: async () => {
      const { challenge, body } = challengeProbe();
      const res = await post(body, signedHeaders(now(), body));
      return { verdict: res.status === 200 && res.json?.challenge === challenge ? "PASS" : "FAIL", status: res.status };
    },
  },
];

function skipReason(c) {
  if (!c.signed) return "";
  if (!secret) return "SLACK_SIGNING_SECRET not set in this shell";
  if (!isLocal) return "refused, signed cases only run against http://localhost or http://127.0.0.1";
  return "";
}

console.log(`check-slack-events: ${endpoint.origin}${endpoint.pathname}`);
let failed = false;
for (const c of CASES) {
  let verdict = "SKIP";
  let status = "n/a";
  let note = skipReason(c);
  if (!note) {
    try {
      ({ verdict, status } = await c.run());
    } catch (err) {
      verdict = "FAIL";
      note = `request error: ${err.cause?.code || err.message}`;
    }
  }
  if (verdict === "FAIL") failed = true;
  console.log(`${c.id}  ${verdict.padEnd(16)}  HTTP ${String(status).padEnd(3)}  ${c.what}${note ? ` (${note})` : ""}`);
}
process.exitCode = failed ? 1 : 0;
