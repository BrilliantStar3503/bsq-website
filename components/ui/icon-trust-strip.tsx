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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
      {items.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex flex-col gap-4">
          {/* Same soft gradient chip language as GoalCard's icon, for
              visual consistency across the page. */}
          <div className="w-12 h-12 flex items-center justify-center"
            style={{ background: 'linear-gradient(150deg, #fef2f2, #fde0df)', borderRadius: 14 }}>
            <Icon size={20} style={{ color: PRU_RED }} strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 mb-1.5 tracking-[-0.005em]">{title}</p>
            <p className="text-[13px] text-gray-500 leading-relaxed">{description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
