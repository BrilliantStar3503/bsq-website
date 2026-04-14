import type { Metadata } from 'next'
import AboutSection from '@/components/sections/about-section'

export const metadata: Metadata = {
  title: 'About BSQ — Brilliant Star Quartz · Licensed PRU Life UK Advisor',
  description:
    'BSQ is dedicated to helping individuals and families build a strong, secure financial future through trusted insurance and investment solutions in partnership with Pru Life UK.',
}

export default function AboutPage() {
  return (
    <main>
      <AboutSection />
    </main>
  )
}
