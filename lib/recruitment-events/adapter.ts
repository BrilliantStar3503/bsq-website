/**
 * Recruitment Events — adapter.
 *
 * Pure mapping from BSQ AIMP's public API shape to the RecruitmentEvent
 * shape this website's UI already expects. No network, no env access — so
 * the rendering layer (components/sections/recruitment-page.tsx) never
 * changes when the backend contract evolves; only this file would.
 */

import type { BsqAimpEvent, RecruitmentEvent } from './types'

const DEFAULT_DESCRIPTION =
  "Fill in your details below. Your slot will be logged with BSQ and you'll be directed to PRU Life UK's official form to confirm your seat."

function formatTime12h(time: string | null): string | null {
  if (!time) return null
  const [hStr, mStr] = time.split(':')
  const h = Number(hStr)
  const m = Number(mStr)
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')}${period}`
}

function formatEventDate(apiEvent: BsqAimpEvent): string {
  const parsed = new Date(`${apiEvent.eventDate}T00:00:00`)
  const datePart = parsed.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const start = formatTime12h(apiEvent.startTime)
  const end = formatTime12h(apiEvent.endTime)

  if (start && end) return `${datePart} · ${start}–${end}`
  if (start) return `${datePart} · ${start}`
  return datePart
}

function dayAndMonth(eventDate: string): { day: string; month: string } {
  const parsed = new Date(`${eventDate}T00:00:00`)
  return {
    day: String(parsed.getDate()),
    month: parsed.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
  }
}

/** No explicit virtual/hybrid flag in BSQ AIMP yet (documented future
 *  extensibility) — inferred from the absence of any venue information. */
function deriveFormat(apiEvent: BsqAimpEvent): 'In-person' | 'Virtual' {
  return apiEvent.venue || apiEvent.venueAddress ? 'In-person' : 'Virtual'
}

/** Reuses the existing `tag` badge slot (already rendered on every event
 *  card) to surface status — no new UI element needed. Priority: a
 *  cancellation or closure is more important information than "featured". */
function deriveTag(apiEvent: BsqAimpEvent, format: 'In-person' | 'Virtual'): string {
  if (apiEvent.status === 'cancelled') return 'CANCELLED'
  if (apiEvent.status === 'closed') return 'REGISTRATION CLOSED'
  if (apiEvent.featured) return 'FEATURED'
  if (format === 'Virtual') return 'VIRTUAL'
  return 'UPCOMING'
}

function deriveLocation(apiEvent: BsqAimpEvent): string {
  return apiEvent.venue || apiEvent.venueAddress || 'Online / Virtual'
}

function deriveVenue(apiEvent: BsqAimpEvent): string {
  const parts = [apiEvent.venue, apiEvent.venueAddress].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'Online / Virtual'
}

function deriveDescription(apiEvent: BsqAimpEvent): string {
  const base = apiEvent.description || DEFAULT_DESCRIPTION
  return apiEvent.cancellationNotice ? `${apiEvent.cancellationNotice} ${base}` : base
}

export function mapApiEventToRecruitmentEvent(apiEvent: BsqAimpEvent): RecruitmentEvent {
  const format = deriveFormat(apiEvent)
  const { day, month } = dayAndMonth(apiEvent.eventDate)

  return {
    eventId: apiEvent.slug,
    title: apiEvent.title,
    date: formatEventDate(apiEvent),
    day,
    month,
    location: deriveLocation(apiEvent),
    venue: deriveVenue(apiEvent),
    format,
    // null capacity = unlimited — passed through as undefined, never
    // fabricated, so the UI can hide the seats indicator entirely.
    slots: apiEvent.capacity ?? undefined,
    tag: deriveTag(apiEvent, format),
    speaker: apiEvent.speakers[0]?.name,
    description: deriveDescription(apiEvent),
  }
}
