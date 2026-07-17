/**
 * Shared prompt-injection / untrusted-text defenses for public AI surfaces.
 *
 * Doctrine: deterministic dispose before the model. Regex is not perfect —
 * layer with gates, output leak filter, and Type-1 side-effect walls.
 * Never claim "injection-proof."
 */

export const PROMPT_SECURITY_VERSION = 'ps-v1-2026-07-17'

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

/** Normalize common obfuscation before pattern match. */
export function normalizeForInjectionScan(text: string): string {
  return text
    .normalize('NFKC')
    // Replace zero-width with space so "ignore​all" → "ignore all"
    .replace(/[\u200B-\u200F\u2028-\u202F\uFEFF\u00AD]/g, ' ')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
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
  // Heuristic: huge dump of imperative policy lines
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
