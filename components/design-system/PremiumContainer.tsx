'use client'

/* ── PremiumContainer — PRUBSQ floating content card ────────────────────
   Wraps any section content in a white elevated card with premium shadow
   and large border-radius. Creates the signature floating-card aesthetic
   used across PRUBSQ editorial sections.

   Reusable across Insurance Solutions, Assessment, Recruitment, Advisors,
   Products, and future landing pages.

   PRESENTATION ONLY — no logic, routing, navigation, data, or state.
──────────────────────────────────────────────────────────────────────── */

import type { ReactNode } from 'react'

export interface PremiumContainerProps {
  children: ReactNode
  className?: string
  /** Negative top offset (px) to overlap the preceding section */
  overlapTop?: number
  maxWidth?: string | number
  padding?: string
}

export function PremiumContainer({
  children,
  className = '',
  overlapTop = 0,
  maxWidth = '1320px',
  padding = '48px',
}: PremiumContainerProps) {
  return (
    <div
      className={className}
      style={{
        maxWidth,
        margin: `${overlapTop > 0 ? `-${overlapTop}px` : '0'} auto 0`,
        padding: `0 24px`,
      }}
    >
      <div
        style={{
          background:   '#ffffff',
          borderRadius: 24,
          boxShadow:    '0 2px 4px rgba(0,0,0,0.04), 0 12px 36px rgba(0,0,0,0.10), 0 48px 100px rgba(0,0,0,0.11)',
          padding,
          overflow:     'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
