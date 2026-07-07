/**
 * Recruitment Events — types.
 *
 * `RecruitmentEvent` is the UI-facing shape — unchanged from the previous
 * static-config version, so components/sections/recruitment-page.tsx never
 * has to know its data now comes from BSQ AIMP instead of a local constant.
 *
 * `BsqAimpEvent` is the raw shape returned by BSQ AIMP's public API
 * (GET /api/public/recruitment-events). It is a subset of the documented
 * contract — see docs/RECRUITMENT_EVENTS_DESIGN.md §7 in the BSQ AIMP repo.
 * Only adapter.ts is allowed to know this shape exists.
 */

export interface RecruitmentEvent {
  eventId: string
  title: string
  date: string
  day: string
  month: string
  location: string
  venue: string
  format: 'In-person' | 'Virtual'
  /** Absent = unlimited capacity. Never fabricate a number — the UI must
   *  hide the seats indicator entirely rather than invent a seat count. */
  slots?: number
  tag: string
  /** Only shown in the Book Briefing section when present */
  speaker?: string
  /** Book Briefing section's supporting paragraph for this event */
  description: string
}

export interface BsqAimpSpeaker {
  name: string
  title: string | null
}

export interface BsqAimpEvent {
  id: string
  slug: string
  title: string
  description: string | null
  venue: string | null
  venueAddress: string | null
  eventDate: string
  startTime: string | null
  endTime: string | null
  timezone: string
  speakers: BsqAimpSpeaker[]
  capacity: number | null
  registrationOpen: string | null
  registrationClose: string | null
  isRegistrationOpen: boolean
  status: 'published' | 'closed' | 'completed' | 'cancelled'
  cancellationNotice: string | null
  featured: boolean
  displayOrder: number
  bannerImageUrl: string | null
}
