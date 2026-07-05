'use client'

import { ArrowRight } from 'lucide-react'
import type { FinancialGoal } from '@/lib/products'
import { GOAL_ICONS } from '@/lib/goal-icons'

const PRU_RED = '#D92D20'

const REST_SHADOW  = '0 6px 28px rgba(0,0,0,0.09)'
const HOVER_SHADOW = '0 12px 40px rgba(0,0,0,0.15)'
const EASE_PREMIUM = 'cubic-bezier(0.16, 1, 0.3, 1)'

/* ── Goal card — visual sibling of ProductCard, used on the Insurance
   Solutions Landing Page's "Choose Your Financial Goal" section.
   Links to #<goalId>, which the Recommended Solutions section below
   renders as a matching anchor — no router/JS scroll logic needed. ── */
export default function GoalCard({ goal, compact = false }: { goal: FinancialGoal; compact?: boolean }) {
  // Direct object index (not the getGoalIcon() wrapper) — keeps this a
  // statically analyzable expression for the static-components lint rule.
  const Icon = GOAL_ICONS[goal.icon] ?? GOAL_ICONS.Shield
  return (
    <a
      href={`#${goal.id}`}
      className={`group relative flex flex-col h-full overflow-hidden ${compact ? 'p-5' : 'p-7'}`}
      style={{
        borderRadius: 10,
        background: '#fff',
        border: '1px solid #e5e7eb',
        boxShadow: REST_SHADOW,
        transition: `box-shadow 0.35s ${EASE_PREMIUM}, transform 0.35s ${EASE_PREMIUM}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = HOVER_SHADOW; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = REST_SHADOW; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Accent rule — reveals on hover, replaces a border as the card's
          "active" cue */}
      <span
        className="absolute top-0 left-0 right-0 origin-left scale-x-0 group-hover:scale-x-100"
        style={{ height: 3, background: PRU_RED, transition: `transform 0.45s ${EASE_PREMIUM}` }}
      />

      <div
        className={`flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${compact ? 'w-10 h-10 mb-4' : 'w-12 h-12 mb-5'}`}
        style={{ background: 'linear-gradient(150deg, #fef2f2, #fde0df)', borderRadius: compact ? 11 : 14 }}
      >
        <Icon size={compact ? 18 : 20} style={{ color: PRU_RED }} strokeWidth={1.75} />
      </div>
      <h3 className={`font-bold text-gray-900 leading-snug tracking-[-0.01em] ${compact ? 'text-[15px] mb-2' : 'text-[17px] mb-2.5'}`}>{goal.label}</h3>
      <p className={`text-gray-500 leading-relaxed flex-1 ${compact ? 'text-[13px] mb-4' : 'text-[14px] mb-6'}`}>{goal.description}</p>
      <div className="flex items-center gap-1.5 text-[13px] font-bold" style={{ color: PRU_RED }}>
        See Solutions
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </a>
  )
}
