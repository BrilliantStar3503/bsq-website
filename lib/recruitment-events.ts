/**
 * Recruitment Events — configuration
 *
 * Single source of truth for every event listed on the recruitment
 * landing page. A new BYB event, discovery call, or city preview only
 * requires adding an entry here — no rendering logic should ever need to
 * change. Both the Featured Events cards and the Book Briefing section
 * read from this same list, so the two stay in sync automatically.
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
  slots: number
  tag: string
  /** Only shown in the Book Briefing section when present */
  speaker?: string
  /** Book Briefing section's supporting paragraph for this event */
  description: string
}

export const RECRUITMENT_EVENTS: RecruitmentEvent[] = [
  {
    eventId: 'mega-byb-2026-04',
    title: 'Mega BYB — Build Your Business',
    date: 'April 13, 2026 · 7:00PM–8:30PM',
    day: '13',
    month: 'APR',
    location: 'Dusit Thani Hotel, Makati City',
    venue: 'Mayuree I & II, Dusit Thani Hotel, Makati City',
    format: 'In-person',
    slots: 12,
    tag: 'FEATURED',
    speaker: 'Chinkee Tan',
    description:
      "Fill in your details below. Your slot will be logged with BSQ and you'll be directed to PRU Life UK's official form — required to qualify for the raffle and secure your entry at the door.",
  },
  {
    eventId: 'online-discovery-call',
    title: 'Online Discovery Call',
    date: 'Rolling — Book anytime',
    day: '—',
    month: 'OPEN',
    location: 'Zoom / Google Meet',
    venue: 'Zoom / Google Meet',
    format: 'Virtual',
    slots: 5,
    tag: 'VIRTUAL',
    description:
      "Fill in your details below and we'll send you the video call link. No raffle, no door entry — just a direct conversation about the BSQ opportunity at a time that works for you.",
  },
  {
    eventId: 'visayas-expansion-preview-2026-05',
    title: 'Visayas Expansion Preview',
    date: 'May 10, 2026',
    day: '10',
    month: 'MAY',
    location: 'Cebu City',
    venue: 'Cebu City',
    format: 'In-person',
    slots: 8,
    tag: 'NEW CITY',
    description:
      "Fill in your details below. Your slot will be logged with BSQ and you'll be directed to PRU Life UK's official form to confirm your seat for this city's preview session.",
  },
]
