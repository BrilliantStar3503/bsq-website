import type { Metadata } from 'next'
import InsuranceSolutionsLanding from '@/components/products/InsuranceSolutionsLanding'

export const metadata: Metadata = {
  title: 'Insurance Solutions | BSQ · PRU Life UK',
  description: 'Tell us your financial goal — protect your family, prepare for retirement, grow your wealth — and we\'ll guide you to the right PRU Life UK insurance solution.',
}

export default function ProductsIndexPage() {
  return <InsuranceSolutionsLanding />
}
