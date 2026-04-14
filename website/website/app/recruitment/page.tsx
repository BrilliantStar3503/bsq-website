import type { Metadata } from 'next'
import RecruitmentPage from '@/components/sections/recruitment-page'

export const metadata: Metadata = {
  title: 'Join the Team | BSQ Financial Advisory',
  description:
    'Build a licensed financial advisory career backed by AI, digital systems, and a proven team. Reserve your seat at the next BSQ Opportunity Night.',
}

export default function Recruitment() {
  return (
    <main>
      <RecruitmentPage />
    </main>
  )
}
