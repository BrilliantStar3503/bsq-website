import type { Metadata } from 'next'
import RecruitmentPage from '@/components/sections/recruitment-page'
import { fetchRecruitmentEvents } from '@/lib/recruitment-events'

export const metadata: Metadata = {
  title: 'Join the Team | BSQ Financial Advisory',
  description:
    'Build a licensed financial advisory career backed by AI, digital systems, and a proven team. Reserve your seat at the next BSQ Opportunity Night.',
}

// Fetched server-side from BSQ AIMP's public API (never client-side) —
// see lib/recruitment-events/client.ts. Never throws; degrades to an
// empty array on any failure, which RecruitmentPage renders as an
// empty state rather than crashing.
export default async function Recruitment() {
  const events = await fetchRecruitmentEvents()

  return (
    <main>
      <RecruitmentPage events={events} />
    </main>
  )
}
