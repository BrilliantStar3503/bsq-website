'use client'

import { ArrowRight } from 'lucide-react'
import type { FinancialGoal } from '@/lib/products'
import { GOAL_ICONS } from '@/lib/goal-icons'

const PRU_RED = '#D92D20'

// Two-tier elevation — a tight "contact" shadow plus a soft, diffused
// ambient shadow — rather than one heavy blur. This reads as a surface
// resting just above the page, not a card wearing a drop-shadow.
const REST_SHADOW  = '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.05)'
const HOVER_SHADOW = '0 4px 8px -2px rgba(16,24,40,0.06), 0 16px 32px -8px rgba(217,45,32,0.15)'
const EASE_PREMIUM = 'cubic-bezier(0.16, 1, 0.3, 1)'

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
      className="group relative flex flex-col h-full p-7 overflow-hidden"
      style={{
        borderRadius: 20,
        background: '#fff',
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
        className="w-12 h-12 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105"
        style={{ background: 'linear-gradient(150deg, #fef2f2, #fde0df)', borderRadius: 14 }}
      >
        <Icon size={20} style={{ color: PRU_RED }} strokeWidth={1.75} />
      </div>
      <h3 className="text-[17px] font-bold text-gray-900 mb-2.5 leading-snug tracking-[-0.01em]">{goal.label}</h3>
      <p className="text-[14px] text-gray-500 leading-relaxed mb-6 flex-1">{goal.description}</p>
      <div className="flex items-center gap-1.5 text-[13px] font-bold" style={{ color: PRU_RED }}>
        See Recommended Solutions
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </a>
  )
}
