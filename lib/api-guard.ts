/**
 * BSQ API Guard — shared helpers for all API routes
 *
 * • sanitize()       — strips HTML/script tags from strings
 * • validateCalendlyUri() — prevents SSRF on Calendly endpoints
 * • isValidScore()   — ensures score is a number 0–100
 * • isValidRating()  — ensures rating is 1–5
 */

/** Strip all HTML tags and trim whitespace to prevent XSS / injection */
export function sanitize(value: unknown, maxLen = 500): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<[^>]*>/g, '')          // strip HTML tags
    .replace(/[<>"'`]/g, '')          // strip remaining dangerous chars
    .trim()
    .slice(0, maxLen)
}

/** Only allow real Calendly API URIs — prevents SSRF */
export function validateCalendlyUri(uri: unknown): string {
  if (typeof uri !== 'string') throw new Error('Invalid URI')
  const allowed = 'https://api.calendly.com/'
  if (!uri.startsWith(allowed)) throw new Error(`URI must start with ${allowed}`)
  // No query strings that could alter the Calendly request
  const url = new URL(uri)
  if (url.search) throw new Error('URI must not contain query params')
  return uri
}

/** Score must be 0–100 */
export function isValidScore(score: unknown): boolean {
  return typeof score === 'number' && score >= 0 && score <= 100
}

/** Rating must be integer 1–5 */
export function isValidRating(rating: unknown): boolean {
  return typeof rating === 'number' && Number.isInteger(rating) && rating >= 1 && rating <= 5
}

/** Allowlist for known UTM/lead source identifiers (small, closed marketing
 *  vocabulary — facebook, google, direct, etc.). Used for `utmSource` in
 *  /api/capture-lead and /api/appointments. Do not widen this for event
 *  telemetry — see sanitizeEventSource below for that. */
const ALLOWED_SOURCES = new Set([
  'advisor_btn', 'chat_launcher', 'call_btn', 'nav_consult', 'nav_contact',
  'mobile_consult', 'hero_cta', 'footer_cta', 'assessment_complete',
  'assessment_cta', 'bsq_assessment_form', 'bsq_financial_assessment',
  'calendly_booking', 'direct',
])

export function sanitizeSource(source: unknown): string {
  const s = sanitize(source, 64)
  return ALLOWED_SOURCES.has(s) ? s : 'unknown'
}

/**
 * Canonical registry of event-source prefixes for interaction telemetry
 * (/api/track-click's `source` field). Each prefix names a UI surface;
 * the suffix after `<prefix>_` carries contextual detail — a product
 * slug, a goal id, a numeric score — sourced from lib/products.ts or
 * numeric values, never raw user text. The security boundary is
 * sanitize()'s charset stripping plus EVENT_SOURCE_SUFFIX below, not
 * this list — this list exists to keep the taxonomy meaningful and
 * closed to known UI surfaces, not to block injection by itself.
 *
 * Adding a new experience (Business Solutions, Health & Protection,
 * ...) needs no change here as long as it reuses an existing prefix
 * (e.g. 'advisor_btn' via openContact()) — only add a prefix here if a
 * genuinely new *kind* of UI surface is introduced.
 */
export const EVENT_SOURCE_PREFIXES = [
  'advisor_btn', 'chat_launcher', 'call_btn', 'nav_consult', 'nav_contact',
  'mobile_consult', 'hero_cta', 'footer_cta', 'assessment_cta', 'direct',
] as const

/** Suffix charset for event sources — product slugs and goal ids are
 *  kebab-case, scores are numeric; this covers both, nothing else. */
const EVENT_SOURCE_SUFFIX = /^[a-z0-9_-]{1,48}$/i

/**
 * Validates /api/track-click's `source` field: exact prefix match, or
 * `<prefix>_<safe suffix>`. Distinct from sanitizeSource()/ALLOWED_SOURCES
 * on purpose — utmSource is a closed marketing vocabulary that should
 * stay closed; event sources are an open, structured taxonomy that
 * needs to carry contextual detail to be useful in the CRM.
 */
export function sanitizeEventSource(source: unknown): string {
  const s = sanitize(source, 64)
  for (const prefix of EVENT_SOURCE_PREFIXES) {
    if (s === prefix) return s
    if (s.startsWith(`${prefix}_`) && EVENT_SOURCE_SUFFIX.test(s.slice(prefix.length + 1))) {
      return s
    }
  }
  return 'unknown'
}
