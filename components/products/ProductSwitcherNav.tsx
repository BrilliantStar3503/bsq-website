'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { products, getGoalsForProduct, type PruProduct } from '@/lib/products'
import { useStickyOnScroll } from '@/hooks/useStickyOnScroll'

const PRU_RED   = '#D92D20'
const GRAY_LINE = '#e5e7eb'
const NAV_HEIGHT = 52

/* internalCategory groups the row visually (via dividers only, no text
   label — see Phase 4.5 note below) so it stays a layout aid, never a
   second taxonomy competing with the goal context shown to its left. */
const CATEGORY_ORDER: PruProduct['internalCategory'][] = ['protection', 'investment', 'retirement']

/* ── Horizontal switcher across all products ────────────────────────
   Rendered once in app/products/layout.tsx so it persists while
   visitors move between product pages — no full reload, no return
   trip to /products required.

   Also carries the goal-context breadcrumb (Insurance Solutions /
   <primary goal>) as a leading segment in this same bar, instead of a
   separate full-width Breadcrumb bar — Phase 4.5: a first-time visitor
   was hitting three stacked orientation bars (switcher, breadcrumb,
   then hero) before any content. Folding them into one bar removes a
   full strip of chrome without losing the "where am I" context, and
   stops internalCategory's old text labels ("Protection" / "Investment"
   / "Retirement") from visually competing with the goal-first language
   right next to them — internalCategory now only groups the row via
   thin dividers, never as visible category text.

   Docks beneath the global header's scrolled height (60px) once
   scrolled past its natural position. See useStickyOnScroll for why
   this isn't plain CSS `position: sticky`.
──────────────────────────────────────────────────────────────────── */
export default function ProductSwitcherNav() {
  const pathname = usePathname()
  const { sentinelRef, stuck } = useStickyOnScroll(60)

  // Hide on the landing page itself — it's the goal-first entry point,
  // and a product-name switcher here would compete with that message.
  // Detail pages (/products/[slug]) still get the full switcher.
  if (pathname === '/products') return null

  const currentSlug = pathname.replace('/products/', '')
  const currentProduct = products.find(p => p.slug === currentSlug)
  const primaryGoal = currentProduct ? getGoalsForProduct(currentProduct.id)[0] : undefined

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />
      {stuck && <div style={{ height: NAV_HEIGHT }} aria-hidden="true" />}
      <nav
        aria-label="Insurance Solutions navigation"
        style={{
          background: '#fff',
          borderBottom: `1px solid ${GRAY_LINE}`,
          ...(stuck
            ? { position: 'fixed', top: 60, left: 0, right: 0 }
            : { position: 'relative' }),
        }}
        className="z-40"
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">

            {/* Goal-context breadcrumb — folded in, not a separate bar */}
            {currentProduct && (
              <div className="flex items-center gap-1.5 pr-3 mr-2 flex-shrink-0" style={{ borderRight: `1px solid ${GRAY_LINE}` }}>
                {/* #6b7280, not the lighter #9ca3af — 4.83:1 contrast on
                    white meets WCAG AA for normal-size text (2.54:1 didn't). */}
                <Link href="/products" className="text-xs font-semibold whitespace-nowrap transition-colors"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={e => (e.currentTarget.style.color = PRU_RED)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
                >
                  Insurance Solutions
                </Link>
                {primaryGoal && (
                  <>
                    <ChevronRight size={11} className="text-gray-300 flex-shrink-0" />
                    <Link href={`/products#${primaryGoal.id}`} className="text-xs font-bold whitespace-nowrap transition-colors"
                      style={{ color: PRU_RED }}
                    >
                      {primaryGoal.label}
                    </Link>
                  </>
                )}
              </div>
            )}

            {CATEGORY_ORDER.map((category, groupIndex) => {
              const groupProducts = products.filter(p => p.internalCategory === category)
              if (groupProducts.length === 0) return null
              return (
                <div key={category} className="flex items-center gap-1">
                  {groupIndex > 0 && (
                    <div style={{ width: 1, height: 18, background: GRAY_LINE, margin: '0 4px' }} aria-hidden="true" />
                  )}
                  {groupProducts.map(p => {
                    const href = `/products/${p.slug}`
                    const isActive = pathname === href
                    return (
                      <Link
                        key={p.slug}
                        href={href}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          whiteSpace: 'nowrap',
                          padding: '14px 16px',
                          fontSize: 13.5,
                          fontWeight: isActive ? 700 : 600,
                          color: isActive ? PRU_RED : '#4b5563',
                          borderBottom: isActive ? `2.5px solid ${PRU_RED}` : '2.5px solid transparent',
                          transition: 'color 0.15s, border-color 0.15s',
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = PRU_RED }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#4b5563' }}
                      >
                        {p.name}
                      </Link>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
