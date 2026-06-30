'use client'

import { motion } from 'framer-motion'
import { products, getGoalsForProduct, type PruProduct } from '@/lib/products'
import ProductCard from './ProductCard'

const PRU_RED   = '#D92D20'
const GRAY_LINE = '#e5e7eb'

/* ── Related Solutions ─────────────────────────────────────────────────
   Ranks the other products by shared financial-goal coverage with the
   current one (via the financialGoals registry), not shared category
   or shared assessment gaps — two solutions surface together here
   because they serve the same goal a visitor is trying to achieve,
   reading as a professional recommendation rather than a cross-sell.
   Purely registry-derived: no hardcoded product relationships.
──────────────────────────────────────────────────────────────────── */
function getRelated(current: PruProduct, count = 3): PruProduct[] {
  const currentGoalIds = new Set(getGoalsForProduct(current.id).map(g => g.id))
  const others = products.filter(p => p.id !== current.id)
  const scored = others
    .map(p => ({
      product: p,
      score: getGoalsForProduct(p.id).filter(g => currentGoalIds.has(g.id)).length,
    }))
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, count).map(s => s.product)
}

export default function RelatedProducts({ product }: { product: PruProduct }) {
  const related = getRelated(product)

  return (
    <section style={{ background: '#fff', borderBottom: `1px solid ${GRAY_LINE}` }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20">
        <motion.div className="mb-8"
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 3, height: 20, background: PRU_RED, borderRadius: 2 }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>Explore More</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Other Solutions for Your Goals</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
