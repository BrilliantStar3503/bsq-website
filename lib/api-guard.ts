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

/** Allowlist for known source identifiers */
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
