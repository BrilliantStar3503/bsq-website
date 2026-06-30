'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { products, type PruProduct } from '@/lib/products'
import { useStickyOnScroll } from '@/hooks/useStickyOnScroll'

const PRU_RED = '#D92D20'
const NAV_HEIGHT = 52

/* internalCategory is a navigation-grouping aid only (see lib/products.ts) —
   the labels below stay deliberately quiet/secondary so they never read as
   the visitor's primary taxonomy. Order is fixed for a stable, predictable
   row regardless of registry array order. */
const CATEGORY_ORDER: { key: PruProduct['internalCategory']; label: string }[] = [
  { key: 'protection', label: 'Protection' },
  { key: 'investment',  label: 'Investment' },
  { key: 'retirement',  label: 'Retirement' },
]

/* ── Horizontal switcher across all products ────────────────────────
   Rendered once in app/products/layout.tsx so it persists while
   visitors move between product pages — no full reload, no return
   trip to /products required.

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

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />
      {stuck && <div style={{ height: NAV_HEIGHT }} aria-hidden="true" />}
      <nav
        aria-label="Browse insurance solutions"
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          ...(stuck
            ? { position: 'fixed', top: 60, left: 0, right: 0 }
            : { position: 'relative' }),
        }}
        className="z-40"
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {CATEGORY_ORDER.map(({ key, label }, groupIndex) => {
              const groupProducts = products.filter(p => p.internalCategory === key)
              if (groupProducts.length === 0) return null
              return (
                <div key={key} className="flex items-center gap-1">
                  {groupIndex > 0 && (
                    <div style={{ width: 1, height: 18, background: '#e5e7eb', margin: '0 4px' }} aria-hidden="true" />
                  )}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#c1c5cb',
                      whiteSpace: 'nowrap',
                      padding: '0 4px',
                    }}
                  >
                    {label}
                  </span>
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
