// Defense for strings the engine echoes: formula neutralizing, truncation, HTML escaping.

const MAX_ECHO = 40;
const TRIGGERS = new Set(['=', '+', '-', '@', '\t', '\r', '＝', '＋', '－', '＠']);

// A cell that starts with a spreadsheet formula trigger gets a single quote in front.
export function neutralize(s: string): string {
  return s.length > 0 && TRIGGERS.has(s[0]) ? `'${s}` : s;
}

// Neutralize first, then cap at 40 characters so the quote prefix always survives.
export function safeText(s: string): string {
  return Array.from(neutralize(s)).slice(0, MAX_ECHO).join('');
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
