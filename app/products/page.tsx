import { redirect } from 'next/navigation'

// /products now redirects to the dedicated Insurance Solutions landing page.
// Individual product routes (/products/[slug]) are unaffected.
export default function ProductsIndexPage() {
  redirect('/insurance-solutions')
}
