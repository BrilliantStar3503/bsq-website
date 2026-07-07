import { TENANT_CONFIG } from '@/lib/lead-intake/tenant-config'
import { mapApiEventToRecruitmentEvent } from './adapter'
import type { BsqAimpEvent, RecruitmentEvent } from './types'

/**
 * Recruitment Events — client.
 *
 * This is the ONLY place in the codebase allowed to know that recruitment
 * events come from BSQ AIMP's public API — mirrors lib/lead-intake/connector.ts's
 * role for leads. The route/page that calls fetchRecruitmentEvents() only
 * ever gets back a RecruitmentEvent[]; it doesn't know or care that the
 * data was fetched, from where, or how failures are handled.
 *
 * Same tenant identity as the lead-intake pipeline (TENANT_CONFIG.tenant) —
 * a future tenant (ABC Agency, XYZ Financial) is a different env var value,
 * not a code fork.
 *
 * Server-only: reads BSQ_AIMP_API_URL, which is never exposed to the client.
 */

const BSQ_AIMP_API_URL = process.env.BSQ_AIMP_API_URL ?? 'https://prubsq-aimp.vercel.app'

/** Matches BSQ AIMP's own edge cache TTL for this endpoint (60s,
 *  stale-while-revalidate) — publishing an event becomes visible here on
 *  the same timescale, with no separate caching layer introduced. */
const REVALIDATE_SECONDS = 60

export async function fetchRecruitmentEvents(): Promise<RecruitmentEvent[]> {
  const url = `${BSQ_AIMP_API_URL}/api/public/recruitment-events?tenant=${encodeURIComponent(TENANT_CONFIG.tenant)}`

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })

    if (!res.ok) {
      console.error(`[recruitment-events] BSQ AIMP returned ${res.status} for ${url}`)
      return []
    }

    const data: unknown = await res.json()
    if (!Array.isArray(data)) {
      console.error('[recruitment-events] Unexpected response shape from BSQ AIMP (expected an array)')
      return []
    }

    return (data as BsqAimpEvent[]).map(mapApiEventToRecruitmentEvent)
  } catch (err) {
    console.error('[recruitment-events] Failed to reach BSQ AIMP:', err)
    return []
  }
}
