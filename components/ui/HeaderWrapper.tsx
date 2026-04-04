'use client'

import { usePathname } from 'next/navigation'
import { BsqHeader }      from '@/components/ui/bsq-header'
import { PruLifeHeader }  from '@/components/ui/pru-life-header'

/**
 * Renders the correct header based on the current route:
 *   /products/*  → PRU Life UK-style header (white + red nav bar, has own spacer)
 *   everything else → dark BSQ header (fixed, spacer injected here)
 *
 * WHY the spacer?
 *   BsqHeader uses `position: fixed` so it is removed from the document
 *   flow.  Without compensation, all page content would start at y=0 and
 *   render behind the header.  The spacer is exactly h-14 (56 px) — the
 *   single, never-changing height of BsqHeader — so content always begins
 *   flush below the header on every route and every screen size.
 *
 *   PruLifeHeader manages its own collapsing spacer internally, so no
 *   extra div is needed there.
 */

/** BsqHeader height in px — must stay in sync with the `h-14` nav class */
export const BSQ_HEADER_H = 56

export default function HeaderWrapper() {
  const pathname      = usePathname()
  const isProductPage = pathname.startsWith('/products')

  if (isProductPage) return <PruLifeHeader />

  return (
    <>
      <BsqHeader />
      {/*
        Flow-spacer: reserves the exact vertical space the fixed header
        occupies so page content is never hidden behind it.
        aria-hidden — presentational only, no semantic meaning.
      */}
      <div
        aria-hidden="true"
        style={{ height: BSQ_HEADER_H, flexShrink: 0 }}
      />
    </>
  )
}
