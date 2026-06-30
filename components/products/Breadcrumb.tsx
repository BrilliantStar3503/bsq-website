'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getGoalsForProduct, type PruProduct } from '@/lib/products'

const PRU_RED = '#D92D20'

/* ── Breadcrumb — reinforces "still inside Insurance Solutions" ──────
   Insurance Solutions / [Primary Goal] / [Product Name]

   The middle crumb is the product's PRIMARY financial goal (the first
   entry in financialGoals that recommends it — see lib/products.ts),
   not internalCategory. Goal-first stays the taxonomy visitors see
   everywhere, breadcrumbs included. Falls back to a generic middle
   crumb if a product is ever added to the registry before it's
   assigned to a goal, so this never breaks for an unmapped product.
──────────────────────────────────────────────────────────────────── */
export default function Breadcrumb({ product }: { product: PruProduct }) {
  const primaryGoal = getGoalsForProduct(product.id)[0]

  return (
    <nav aria-label="Breadcrumb" className="border-b" style={{ borderColor: '#e5e7eb', background: '#fff' }}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-2.5">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-gray-500">
          <li>
            <Link href="/products" className="hover:underline" style={{ transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = PRU_RED)}
              onMouseLeave={e => (e.currentTarget.style.color = '')}
            >
              Insurance Solutions
            </Link>
          </li>
          {primaryGoal && (
            <>
              <ChevronRight size={12} className="text-gray-300" />
              <li>
                <Link href={`/products#${primaryGoal.id}`} className="hover:underline"
                  onMouseEnter={e => (e.currentTarget.style.color = PRU_RED)}
                  onMouseLeave={e => (e.currentTarget.style.color = '')}
                >
                  {primaryGoal.label}
                </Link>
              </li>
            </>
          )}
          <ChevronRight size={12} className="text-gray-300" />
          <li className="font-semibold text-gray-700" aria-current="page">
            {product.shortName}
          </li>
        </ol>
      </div>
    </nav>
  )
}
