'use client'

/* ── EditorialSection — PRUBSQ standard section wrapper ─────────────────
   Provides consistent vertical rhythm, background colour, and optional
   border treatment for any PRUBSQ editorial section.

   Reusable across Insurance Solutions, Assessment, Recruitment, Advisors,
   Products, and future landing pages.

   PRESENTATION ONLY — no logic, routing, navigation, data, or state.
──────────────────────────────────────────────────────────────────────── */

import type { ReactNode, CSSProperties } from 'react'

export interface EditorialSectionProps {
  children: ReactNode
  background?: string
  borderTop?: boolean
  borderBottom?: boolean
  borderColor?: string
  paddingY?: string
  style?: CSSProperties
  className?: string
  id?: string
}

export function EditorialSection({
  children,
  background   = '#ffffff',
  borderTop    = false,
  borderBottom = false,
  borderColor  = '#e5e7eb',
  paddingY     = '0',
  style,
  className = '',
  id,
}: EditorialSectionProps) {
  return (
    <section
      id={id}
      className={className}
      style={{
        background,
        borderTop:    borderTop    ? `1px solid ${borderColor}` : undefined,
        borderBottom: borderBottom ? `1px solid ${borderColor}` : undefined,
        paddingTop:    paddingY,
        paddingBottom: paddingY,
        ...style,
      }}
    >
      {children}
    </section>
  )
}
