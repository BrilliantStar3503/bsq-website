import type { Metadata } from 'next'
import ContactPage from '@/components/sections/contact-page'

export const metadata: Metadata = {
  title: 'Contact Us — Brilliant Star Quartz · PRU Life UK Advisor',
  description:
    'Get in touch with Brilliant Star Quartz. Call, text, or email us — we are here to help you build a stronger financial future.',
}

export default function Contact() {
  return (
    <main>
      <ContactPage />
    </main>
  )
}
