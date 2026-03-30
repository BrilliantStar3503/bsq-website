'use client'

import { usePathname } from 'next/navigation'
import { BsqHeader }      from '@/components/ui/bsq-header'
import { PruLifeHeader }  from '@/components/ui/pru-life-header'

/**
 * Renders the correct header based on the current route:
 *   /products/*  → PRU Life UK-style header (white + red nav bar)
 *   everything else → dark BSQ header
 */
export default function HeaderWrapper() {
  const pathname = usePathname()
  const isProductPage = pathname.startsWith('/products')
  return isProductPage ? <PruLifeHeader /> : <BsqHeader />
}
