import { products } from '@/lib/products'
import ProductFunnelPage from '@/components/products/ProductFunnelPage'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

/* ─── Static params — pre-render all 5 product slugs ──────────────── */
export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }))
}

/* ─── Dynamic metadata + Open Graph for Facebook ads ─────────────── */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const product = products.find(p => p.slug === slug)
  if (!product) return {}

  const siteUrl = 'https://prubsq.com'

  return {
    title: `${product.name} | BSQ · PRU Life UK`,
    description: product.fbHooks[0],
    keywords: ['PRU Life UK', product.name, 'life insurance Philippines', 'BSQ', 'financial advisor'],
    openGraph: {
      title: product.name,
      description: product.fbHooks[0],
      type: 'website',
      url: `${siteUrl}/products/${product.slug}`,
      siteName: 'Brilliant Star Quartz · PRU Life UK',
      images: [
        {
          url: `${siteUrl}/images/products/${product.slug}-og.jpg`,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.fbHooks[0],
    },
  }
}

/* ─── Page component ──────────────────────────────────────────────── */
export default async function ProductPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const product = products.find(p => p.slug === slug)
  if (!product) notFound()

  return <ProductFunnelPage product={product} />
}
