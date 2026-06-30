'use client'

import Link from 'next/link'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import type { PruProduct } from '@/lib/products'

const PRU_RED = '#D92D20'

const REST_SHADOW  = '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.05)'
const HOVER_SHADOW = '0 4px 8px -2px rgba(16,24,40,0.06), 0 16px 32px -8px rgba(217,45,32,0.14)'
const EASE_PREMIUM = 'cubic-bezier(0.16, 1, 0.3, 1)'

/* ── Shared product card — used by the Insurance Solutions Landing
   Page's goal groups and the RelatedProducts rail.

   Styled to read as an advisor's recommendation, not a product
   listing: a left accent rule (not a full border-box), a small
   "recommended" badge instead of a category/price chip, and a soft
   layered-surface shadow instead of a hard card outline. These cards
   always appear under a goal-based heading ("Recommended for: ..."),
   so the only classification visitors should read here is the goal
   context already given above the grid — no plan-mechanics kicker
   (VUL / Traditional, an implementation detail). Plan-type disclosure
   still belongs on the product's own detail page hero. ───────────── */
export default function ProductCard({ product }: { product: PruProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col h-full pl-6 pr-7 py-7"
      style={{
        borderRadius: 16,
        borderLeft: `3px solid ${PRU_RED}`,
        background: '#fff',
        boxShadow: REST_SHADOW,
        transition: `box-shadow 0.35s ${EASE_PREMIUM}, transform 0.35s ${EASE_PREMIUM}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = HOVER_SHADOW; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = REST_SHADOW; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div className="flex items-center gap-1.5 mb-3 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: PRU_RED }}>
        <BadgeCheck size={13} strokeWidth={2.25} />
        Advisor Recommended
      </div>
      <h3 className="text-[17px] font-bold text-gray-900 mb-2.5 leading-snug tracking-[-0.01em]">{product.name}</h3>
      <p className="text-[14px] text-gray-500 leading-relaxed mb-6 flex-1">{product.tagline}</p>
      <div className="flex items-center gap-1.5 text-[13px] font-bold" style={{ color: PRU_RED }}>
        Learn More
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
