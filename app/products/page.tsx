import type { Metadata } from 'next'
import InsuranceSolutionsLanding from '@/components/products/InsuranceSolutionsLanding'

const SITE_URL = 'https://prubsq.com'
const TITLE = 'Insurance Solutions | BSQ · PRU Life UK'
const DESCRIPTION = 'Tell us your financial goal — protect your family, prepare for retirement, grow your wealth — and we\'ll guide you to the right PRU Life UK insurance solution.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: `${SITE_URL}/products`,
    siteName: 'Brilliant Star Quartz · PRU Life UK',
    images: [
      {
        url: `${SITE_URL}/images/products/pru-million-protect-hero.jpg`,
        width: 1536,
        height: 1024,
        alt: 'BSQ Insurance Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function ProductsIndexPage() {
  return <InsuranceSolutionsLanding />
}
