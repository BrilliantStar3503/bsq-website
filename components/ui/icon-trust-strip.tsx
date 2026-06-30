'use client'

import type { LucideIcon } from 'lucide-react'

const PRU_RED = '#D92D20'

export interface TrustItem {
  icon: LucideIcon
  title: string
  description: string
}

/* ── 4-column icon trust strip — distinct from the existing logo-based
   TrustStrip (components/sections/trust-strip.tsx), which shows partner
   certifications (GAMA/IARFC/MDRT). This is a statement-based closer,
   reusable by any future experience's landing page. ─────────────── */
export function IconTrustStrip({ items }: { items: TrustItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
      {items.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex flex-col gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: '#fef2f2' }}>
            <Icon size={20} style={{ color: PRU_RED }} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 mb-1">{title}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
