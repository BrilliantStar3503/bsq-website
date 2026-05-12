'use client'

import { usePathname } from 'next/navigation'
import BsqFooter from '@/components/ui/bsq-footer'
import { MessengerChat } from '@/components/ui/messenger-chat'

/**
 * Renders the global footer + chat widget on all routes EXCEPT those
 * that run a dedicated focused layout (assessment, etc.).
 *
 * Why: The assessment page uses its own contained layout — no external
 * footer or floating chat bubble should compete for the user's attention.
 */
const EXCLUDED = ['/assessment']

export default function FooterWrapper() {
  const pathname = usePathname()
  const isExcluded = EXCLUDED.some(p => pathname.startsWith(p))

  if (isExcluded) return null

  return (
    <>
      <BsqFooter />
      <MessengerChat />
    </>
  )
}
