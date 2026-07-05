'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { PruProduct } from '@/lib/products'

const PRU_RED   = '#D92D20'
const GRAY_LINE = '#e5e7eb'

const REST_SHADOW  = '0 6px 28px rgba(0,0,0,0.09)'
const HOVER_SHADOW = '0 12px 40px rgba(0,0,0,0.15)'
const EASE_PREMIUM = 'cubic-bezier(0.16, 1, 0.3, 1)'

/* Presentational-only slug→image map — no data model changes.
   Falls back to a gradient placeholder for any unmatched slug. */
const PRODUCT_IMAGES: Record<string, string> = {
  'pru-million-protect':             '/images/products/pru-million-protect.jpg',
  'elite-series':                    '/images/products/pru-million-protect-3-hero.jpg',
  'prulifetime-income':              '/images/products/prulifetime-income-2.jpg',
  'prulink-assurance-account-plus':  '/images/products/prulink-assurance-account-plus.jpg',
  'prulove-for-life':                '/images/products/prulifetime-benefit-1.jpg',
}

/* ── Premium product card — Insurance Solutions Landing Page goal groups
   and RelatedProducts rail.

   Reads as an advisor's recommendation through composition alone.
   All links, slugs, event handlers, and analytics are preserved exactly.
──────────────────────────────────────────────────────────────────────── */
export default function ProductCard({ product }: { product: PruProduct }) {
  const imageSrc = PRODUCT_IMAGES[product.slug]

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col h-full overflow-hidden"
      style={{
        borderRadius: 16,
        background: '#fff',
        border: `1px solid ${GRAY_LINE}`,
        boxShadow: REST_SHADOW,
        transition: `box-shadow 0.35s ${EASE_PREMIUM}, transform 0.35s ${EASE_PREMIUM}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = HOVER_SHADOW
        e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = REST_SHADOW
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Red top accent — reveals on hover */}
      <span
        className="absolute top-0 left-0 right-0 origin-left scale-x-0 group-hover:scale-x-100"
        style={{ height: 3, background: PRU_RED, zIndex: 2, transition: `transform 0.45s ${EASE_PREMIUM}` }}
        aria-hidden="true"
      />

      {/* Product image area */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', flexShrink: 0 }}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

          />
        ) : (
          /* Tasteful placeholder — no image data needed */
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${PRU_RED} 0%, #9b1b12 60%, #6b1208 100%)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
                backgroundSize: '28px 28px',
              }}
            />
          </div>
        )}
        {/* Soft gradient overlay to blend image into card body */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 48, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.08))' }}
          aria-hidden="true"
        />
      </div>

      {/* Card content */}
      <div className="flex flex-col flex-1 px-6 py-6">
        <h3 className="text-[16px] font-bold text-gray-900 mb-2 leading-snug tracking-[-0.01em]">
          {product.name}
        </h3>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-5 flex-1">
          {product.tagline}
        </p>
        <div className="flex items-center gap-1.5 text-[13px] font-bold" style={{ color: PRU_RED }}>
          Learn More
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
