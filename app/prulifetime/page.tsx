import type { Metadata } from 'next'
import PruLifetimePlanner from '@/components/pli/PruLifetimePlanner'

/* ─── Open Graph / Facebook share metadata ─────────────────────────────
   When prubsq.com/prulifetime is posted on Facebook, this controls the
   preview card: image, title, and description.
──────────────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'PRULifetime Income Planner | BSQ · PRU Life UK',
  description:
    'Calculate your guaranteed lifetime income in 60 seconds. Pay 5 or 10 years — then collect forever. 200% death benefit. Zero market risk.',
  keywords: [
    'PRULifetime Income',
    'guaranteed income Philippines',
    'PRU Life UK',
    'BSQ',
    'Brilliant Star Quartz',
    'retirement income planner',
    'lifetime income insurance',
  ],
  openGraph: {
    title: "Never Outlive Your Money — See Exactly What You'll Receive",
    description:
      'Calculate your guaranteed lifetime income in 60 seconds. Pay 5 or 10 years. Collect forever. 200% death benefit — guaranteed.',
    type: 'website',
    url: 'https://prubsq.com/prulifetime',
    siteName: 'Brilliant Star Quartz · PRU Life UK',
    images: [
      {
        url: 'https://prubsq.com/images/products/prulifetime-income-2.jpg',
        width: 1200,
        height: 630,
        alt: 'PRULifetime Income — Guaranteed income for life. Never outlive your money.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRULifetime Income Planner | BSQ · PRU Life UK',
    description:
      'Calculate your guaranteed lifetime income in 60 seconds. Pay 5–10 years. Collect forever.',
  },
}

export default function PruLifetimePage() {
  return <PruLifetimePlanner />
}
