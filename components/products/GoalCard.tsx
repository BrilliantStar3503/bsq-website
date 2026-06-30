'use client'

import { ArrowRight } from 'lucide-react'
import type { FinancialGoal } from '@/lib/products'
import { GOAL_ICONS } from '@/lib/goal-icons'

const PRU_RED   = '#D92D20'
const GRAY_LINE = '#e5e7eb'

/* ── Goal card — visual sibling of ProductCard, used on the Insurance
   Solutions Landing Page's "Choose Your Financial Goal" section.
   Links to #<goalId>, which the Recommended Solutions section below
   renders as a matching anchor — no router/JS scroll logic needed. ── */
export default function GoalCard({ goal }: { goal: FinancialGoal }) {
  // Direct object index (not the getGoalIcon() wrapper) — keeps this a
  // statically analyzable expression for the static-components lint rule.
  const Icon = GOAL_ICONS[goal.icon] ?? GOAL_ICONS.Shield
  return (
    <a
      href={`#${goal.id}`}
      className="group flex flex-col h-full p-6 transition-all"
      style={{ borderRadius: 10, border: `1px solid ${GRAY_LINE}`, background: '#fff' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.boxShadow = '0 8px 28px rgba(217,45,32,0.10)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = GRAY_LINE; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div className="w-11 h-11 flex items-center justify-center mb-4" style={{ background: '#fef2f2', borderRadius: 8 }}>
        <Icon size={20} style={{ color: PRU_RED }} />
      </div>
      <h3 className="text-lg font-black text-gray-900 mb-2 leading-snug">{goal.label}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{goal.description}</p>
      <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: PRU_RED }}>
        See Recommended Solutions
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
      </div>
    </a>
  )
}
