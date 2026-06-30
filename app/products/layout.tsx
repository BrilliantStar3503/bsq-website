import ProductSwitcherNav from '@/components/products/ProductSwitcherNav'

/* ── Persistent shell for every /products/* route ─────────────────────
   ProductSwitcherNav renders once here, so moving between products is
   a client-side nav within the same shell instead of a full page reset.
──────────────────────────────────────────────────────────────────── */
export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSwitcherNav />
      {children}
    </>
  )
}
