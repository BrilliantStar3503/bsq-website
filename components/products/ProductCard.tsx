'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PruProduct } from '@/lib/products'

const PRU_RED   = '#D92D20'
const GRAY_LINE = '#e5e7eb'

/* ── Shared product card — used by the Insurance Solutions Landing
   Page's goal groups and the RelatedProducts rail.

   Deliberately carries no plan-mechanics kicker (VUL / Traditional —
   that's `category`, an implementation detail) — these cards always
   appear under a goal-based heading ("Recommended for: ...") or in a
   goal-ranked rail, so the only classification visitors should read
   here is the goal context already given above the grid. Plan-type
   disclosure still belongs on the product's own detail page hero,
   where it's accurate spec information rather than a competing
   recommendation taxonomy. ──────────────────────────────────────── */
export default function ProductCard({ product }: { product: PruProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col h-full p-6 transition-all"
      style={{ borderRadius: 10, border: `1px solid ${GRAY_LINE}`, background: '#fff' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.boxShadow = '0 8px 28px rgba(217,45,32,0.10)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = GRAY_LINE; e.currentTarget.style.boxShadow = 'none' }}
    >
      <h3 className="text-lg font-black text-gray-900 mb-2 leading-snug">{product.name}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{product.tagline}</p>
      <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: PRU_RED }}>
        Learn More
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
      </div>
    </Link>
  )
}
