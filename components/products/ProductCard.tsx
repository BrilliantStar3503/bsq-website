'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PruProduct } from '@/lib/products'

const PRU_RED = '#D92D20'

const REST_SHADOW  = '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.05)'
const HOVER_SHADOW = '0 4px 8px -2px rgba(16,24,40,0.06), 0 16px 32px -8px rgba(217,45,32,0.15)'
const EASE_PREMIUM = 'cubic-bezier(0.16, 1, 0.3, 1)'

/* ── Shared product card — used by the Insurance Solutions Landing
   Page's goal groups and the RelatedProducts rail.

   Reads as an advisor's recommendation, not a product listing, through
   composition alone — no "Recommended" label. The signal is the left
   accent rule (an annotation mark, not a price tag) plus the context
   already established by the "Recommended for: <goal>" heading these
   cards always sit beneath; repeating that claim on every card would
   be the page insisting on something its own layout already shows.
   No plan-mechanics kicker either (VUL / Traditional — that's
   `category`, an implementation detail); plan-type disclosure belongs
   on the product's own detail page hero, not here. ─────────────────── */
export default function ProductCard({ product }: { product: PruProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col h-full pl-6 pr-7 py-7"
      style={{
        borderRadius: 20,
        borderLeft: `3px solid ${PRU_RED}`,
        background: '#fff',
        boxShadow: REST_SHADOW,
        transition: `box-shadow 0.35s ${EASE_PREMIUM}, transform 0.35s ${EASE_PREMIUM}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = HOVER_SHADOW; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = REST_SHADOW; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <h3 className="text-[17px] font-bold text-gray-900 mb-2.5 leading-snug tracking-[-0.01em]">{product.name}</h3>
      <p className="text-[14px] text-gray-500 leading-relaxed mb-6 flex-1">{product.tagline}</p>
      <div className="flex items-center gap-1.5 text-[13px] font-bold" style={{ color: PRU_RED }}>
        Learn More
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
