import type { Metadata } from 'next'
import AdvisorsPage from '@/components/sections/advisors-page'

export const metadata: Metadata = {
  title: 'Our Advisors | BSQ Financial Advisory',
  description:
    'Meet the human advisors behind the AI-powered financial assessment system. Expert guidance from licensed PRU Life UK professionals.',
}

export default function Advisors() {
  return (
    <main>
      <AdvisorsPage />
    </main>
  )
}
