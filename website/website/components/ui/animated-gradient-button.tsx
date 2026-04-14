'use client'

import React from 'react'
import { cn } from '@/lib/utils'

/* ══════════════════════════════════════════════════════════════════
   AnimatedGradientButton
   ──────────────────────────────────────────────────────────────────
   Uses a LINEAR gradient (135°) + background-size 300% 300% +
   shine-pulse keyframe — the color bands sweep diagonally across
   the button endlessly. Always animating (not hover-only).

   PROPS:
     colors    — array of CSS color strings (min 2)
     preset    — named palette shortcut
     duration  — cycle length in seconds (default 5)
     className — extra classes (padding, radius, etc.)
     children  — button content
══════════════════════════════════════════════════════════════════ */

/* ─── Preset palettes (high contrast = clearly visible sweep) ─── */
export const GRADIENT_PRESETS = {
  /** PRU red → crimson → deep red → back — strictly PRU Life UK brand */
  pru:    ['#7f0000', '#B42318', '#D92D20', '#c0291f', '#B42318', '#7f0000'],
  /** Neon — magenta → lime → cyan */
  neon:   ['#7f0000', '#B42318', '#D92D20', '#c0291f', '#B42318', '#7f0000'],
  /** Depth — deep charcoal → dark red (PRU-safe dark variant) */
  ocean:  ['#111827', '#1f2937', '#374151', '#D92D20', '#374151', '#111827'],
  /** Sunset — deep orange → pink → purple */
  sunset: ['#7f0000', '#B42318', '#D92D20', '#c0291f', '#B42318', '#7f0000'],
  /** Navy — deep navy → steel blue (PRU-safe neutral) */
  gold:   ['#111827', '#374151', '#D92D20', '#374151', '#111827'],
} as const

export type GradientPreset = keyof typeof GRADIENT_PRESETS

interface AnimatedGradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  colors?:    string[]
  preset?:    GradientPreset
  duration?:  number
  className?: string
  children:   React.ReactNode
}

export function AnimatedGradientButton({
  colors,
  preset,
  duration = 5,
  className,
  children,
  style,
  ...props
}: AnimatedGradientButtonProps) {
  const resolvedColors =
    colors ??
    (preset ? [...GRADIENT_PRESETS[preset]] : [...GRADIENT_PRESETS.pru])

  /*
   * LINEAR gradient at 135° — the high-contrast color bands sweep
   * diagonally across the button as background-position animates.
   * background-size: 300% 300% means the gradient canvas is 3×
   * the button size, so there's always off-screen color to reveal.
   */
  const gradientImage = `linear-gradient(135deg, ${resolvedColors.join(', ')})`

  return (
    <button
      className={cn('animated-gradient-btn', className)}
      style={{
        backgroundImage: gradientImage,
        '--shine-duration': `${duration}s`,
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </button>
  )
}
