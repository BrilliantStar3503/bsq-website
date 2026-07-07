/**
 * Derives a human-readable acquisition channel from UTM params + referrer.
 * Heuristic, not authoritative — safe to refine later without touching the
 * contract shape or the connector.
 */
export function deriveChannel(utmSource?: string, utmMedium?: string, referrer?: string): string {
  const source = utmSource?.toLowerCase()
  const medium = utmMedium?.toLowerCase()
  const isPaid = medium === 'cpc' || medium === 'paid' || medium === 'ads'

  if (source === 'facebook' || source === 'fb') return isPaid ? 'facebook_ads' : 'facebook_organic'
  if (source === 'instagram' || source === 'ig') return isPaid ? 'instagram_ads' : 'instagram'
  if (source === 'linkedin') return 'linkedin'
  if (source === 'google') return isPaid ? 'google_ads' : 'google'
  if (source) return source
  if (referrer) return 'referral'
  return 'direct'
}
