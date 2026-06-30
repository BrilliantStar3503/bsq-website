import type { Metadata } from 'next'
import { products } from '@/lib/products'
import ProductCard from '@/components/products/ProductCard'

const PRU_RED = '#D92D20'

export const metadata: Metadata = {
  title: 'Insurance Solutions | BSQ · PRU Life UK',
  description: 'Explore PRU Life UK insurance and investment-linked plans — protection, income, and savings solutions for every life stage.',
}

export default function ProductsIndexPage() {
  return (
    <main style={{ background: '#fff' }}>
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div style={{ height: 2, width: 24, background: PRU_RED }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>
              PRU Life UK Plans
            </span>
            <div style={{ height: 2, width: 24, background: PRU_RED }} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Insurance Solutions</h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Protection, investment, and guaranteed income plans — built around your life stage and goals.
            Open any plan below to compare benefits and book a free consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  )
}
