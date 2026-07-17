/**
 * Shared prompt-injection / untrusted-text defenses for public AI surfaces.
 *
 * Doctrine: deterministic dispose before the model. Regex is not perfect —
 * layer with gates, output leak filter, and Type-1 side-effect walls.
 * Never claim "injection-proof."
 */

export const PROMPT_SECURITY_VERSION = 'ps-v2-2026-07-17'

/** Cyrillic homoglyphs → Latin (scan-only fold for ignore/system obfuscation). */
const HOMOGLYPH_FOLD: Readonly<Record<string, string>> = {
  '\u0430': 'a', // а
  '\u0435': 'e', // е
  '\u0456': 'i', // і (Ukrainian)
  '\u043e': 'o', // о
  '\u0440': 'r', // р
  '\u0441': 'c', // с
  '\u0445': 'x', // х
  '\u0443': 'y', // у
  '\u0410': 'A',
  '\u0415': 'E',
  '\u041e': 'O',
  '\u0420': 'R',
  '\u0421': 'C',
  '\u0425': 'X',
}

/** Bidi / embedding overrides used to visually reorder injection payloads. */
const BIDI_OVERRIDE = /[\u202A-\u202E\u2066-\u2069]/g

/** Direct + common jailbreak / XSS markers used across Aria + MetroFlex. */
export const INJECTION_PATTERNS: readonly RegExp[] = [
  /ignore\s+(all\s+|any\s+)?(previous\s+|prior\s+|above\s+|system\s+|original\s+|your\s+|the\s+|these\s+|my\s+|earlier\s+)?(instructions|rules|prompts?|directives)/i,
  /disregard\s+(all\s+|any\s+)?(previous|prior|above|system|original)/i,
  /forget\s+(everything|all|your)\s+(you\s+|that\s+)?(know|learned|were\s+told)/i,
  /system\s*:/i,
  /system\s+prompt\s*:/i,
  /new\s+instructions\s*:/i,
  /you\s+are\s+now\b/i,
  /pretend\s+(you|to\s+be)/i,
  /act\s+as\s+(a\s+|an\s+)?(?!potential|interested|prospective|gym|fitness|member)/i,
  /\brole\s*:\s*(system|developer|admin)\b/i,
  /\boverride\b.*\b(system|prompt|instructions)\b/i,
  /reveal\s+(your|the)\s+(system|initial|original)\s+(prompt|instructions|message)/i,
  /what\s+(is|are)\s+your\s+(system\s+|initial\s+|original\s+)?(prompt|instructions|rules)/i,
  /output\s+(your|the)\s+(system|original)\s+(prompt|message|instructions)/i,
  /repeat\s+(your|the)\s+(system|initial)\s+(prompt|message)/i,
  /translate\s+(your|the)\s+(system|initial)\s+(prompt|instructions)/i,
  /\bjailbreak\b/i,
  /\bDAN\b/,
  /developer\s+mode/i,
  /sudo\s+mode/i,
  /god\s+mode/i,
  /bypass\s+(safety|content|filter|restriction)/i,
  /<script[\s>]/i,
  /<\/script>/i,
  /<iframe[\s>]/i,
  /<img\s[^>]*onerror/i,
  /javascript\s*:/i,
  /data\s*:\s*text\/html/i,
  /\[INST\]/i,
  /<<SYS>>/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /###\s*System\b/i,
  /<\|system\|>/i,
  /<\|assistant\|>/i,
  /\b(?:decode|atob)\s*(?:\(|and\s+(?:run|execute))/i,
  /\bbase64\s+(?:decode|payload|command)/i,
  /\bdecode\s+(?:this|the|following)\s+(?:base64|payload)/i,
]

/** Markers that suggest the model leaked system / policy text. */
const OUTPUT_LEAK_PATTERNS: readonly RegExp[] = [
  /CRITICAL\s+SECURITY\s+RULES/i,
  /NEVER\s+VIOLATE/i,
  /you\s+are\s+ONLY\s+Aria\s+X/i,
  /##\s*YOUR\s+IDENTITY/i,
  /GATE_TABLE_VERSION/i,
  /PROMPT_SECURITY_VERSION/i,
  /BEGIN\s+SYSTEM\s+PROMPT/i,
  /\[SYSTEM\]/i,
  /anthropic-version/i,
  /x-api-key/i,
]

export type InjectionCheck = {
  readonly blocked: boolean
  readonly matched: string[]
}

function foldHomoglyphs(text: string): string {
  let out = ''
  for (const ch of text) {
    out += HOMOGLYPH_FOLD[ch] ?? ch
  }
  return out
}

/** Normalize common obfuscation before pattern match. */
export function normalizeForInjectionScan(text: string): string {
  return foldHomoglyphs(
    text
      .normalize('NFKC')
      .replace(BIDI_OVERRIDE, '')
      .replace(/[\u200B-\u200F\u2028-\u202F\uFEFF\u00AD]/g, ' ')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
  )
}

export function detectInjection(text: string): InjectionCheck {
  const normalized = normalizeForInjectionScan(text)
  if (!normalized) return { blocked: false, matched: [] }
  const matched: string[] = []
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(normalized) || pattern.test(text)) {
      matched.push(pattern.source.slice(0, 48))
    }
  }
  return { blocked: matched.length > 0, matched }
}

/** OR-scan many untrusted strings (RAG snippets, history, email bodies). */
export function scanUntrustedCorpus(texts: readonly string[]): InjectionCheck {
  const matched: string[] = []
  for (const raw of texts) {
    if (typeof raw !== 'string' || !raw.trim()) continue
    const check = detectInjection(raw)
    if (check.blocked) matched.push(...check.matched)
  }
  const unique = Array.from(new Set(matched))
  return { blocked: unique.length > 0, matched: unique }
}

/** True if any history turn is an injection attempt. */
export function historyHasInjection(turns: readonly string[] | undefined | null): boolean {
  if (!turns?.length) return false
  return turns.some((t) => typeof t === 'string' && detectInjection(t).blocked)
}

/**
 * Strip injection / HTML markers from free text.
 * Prefer blocking via detectInjection on public chat; use when you must keep a remnant.
 */
export function scrubInjectionMarkers(text: string, maxLen = 2000): string {
  let s = normalizeForInjectionScan(text).slice(0, maxLen)
  for (let pass = 0; pass < 8; pass++) {
    const before = s
    for (const pattern of INJECTION_PATTERNS) {
      const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`
      s = s.replace(new RegExp(pattern.source, flags), ' ')
    }
    s = s.replace(BIDI_OVERRIDE, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    if (s === before) break
  }
  return s
}

/** Trim, cap length, strip control / invisible / bidi chars for inbound chat text. */
export function sanitizeUserMessage(text: string, maxLen = 1000): string {
  return text
    .trim()
    .slice(0, maxLen)
    .replace(BIDI_OVERRIDE, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\u200B-\u200F\u2028-\u202F\uFEFF\u00AD]/g, '')
}

/** Sanitize attribution / UTM / referrer strings before prompt inject or CRM sync. */
export function sanitizeAttrString(value: string | undefined | null, maxLen = 120): string | undefined {
  if (!value || typeof value !== 'string') return undefined
  const cleaned = scrubInjectionMarkers(value, maxLen)
    .replace(BIDI_OVERRIDE, '')
    .replace(/[^\w.\-/:?=&%+#@\s]/g, '')
    .slice(0, maxLen)
    .trim()
  return cleaned || undefined
}

/** Sanitize lead name / company before CRM sync. */
export function sanitizeLeadField(value: string | undefined | null, maxLen = 120): string | undefined {
  if (!value || typeof value !== 'string') return undefined
  const cleaned = scrubInjectionMarkers(value, maxLen)
    .replace(BIDI_OVERRIDE, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .slice(0, maxLen)
    .trim()
  return cleaned || undefined
}

/** Sanitize email before CRM sync (keeps @ and common email chars). */
export function sanitizeLeadEmail(value: string | undefined | null, maxLen = 254): string | undefined {
  if (!value || typeof value !== 'string') return undefined
  const cleaned = scrubInjectionMarkers(value, maxLen)
    .replace(BIDI_OVERRIDE, '')
    .replace(/[^\w.\-+@]/g, '')
    .slice(0, maxLen)
    .trim()
    .toLowerCase()
  return cleaned || undefined
}

export type OutputFilterResult = {
  readonly text: string
  readonly leaked: boolean
}

/** Block / replace model replies that look like system-prompt exfiltration. */
export function filterModelOutputLeak(
  text: string,
  fallback = "I'm Aria X, the CircuitOS concierge. I can help with questions about the platform, pricing, or booking a demo. What can I help with?",
): OutputFilterResult {
  if (!text || typeof text !== 'string') return { text: fallback, leaked: false }
  for (const pattern of OUTPUT_LEAK_PATTERNS) {
    if (pattern.test(text)) return { text: fallback, leaked: true }
  }
  const lines = text.split('\n').filter((l) => l.trim().length > 0)
  const imperative = lines.filter((l) => /^(NEVER|ALWAYS|CRITICAL|RULE\s*\d)/i.test(l.trim())).length
  if (lines.length >= 12 && imperative >= 5) {
    return { text: fallback, leaked: true }
  }
  return { text, leaked: false }
}

/** Safe markdown → HTML for chat widgets (no raw href / script). */
export function formatChatHtmlSafe(content: string): string {
  const withoutBadLinks = content.replace(
    /\[([^\]]+)\]\((?!(?:https?:\/\/|\/))[^)]+\)/gi,
    '$1',
  )
  const escaped = withoutBadLinks
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g,
      '<a href="$2" class="text-blue-400 underline hover:text-blue-300" rel="noopener noreferrer">$1</a>',
    )
    .replace(/\n/g, '<br/>')
}
