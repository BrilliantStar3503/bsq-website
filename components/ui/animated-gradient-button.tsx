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
  /** PRU red → crimson → gold flash → back — on-brand but visible */
  pru:    ['#7f0000', '#D92D20', '#ff6b35', '#ffb347', '#D92D20', '#7f0000'],
  /** Neon — magenta → lime → cyan */
  neon:   ['#FF007F', '#39FF14', '#00FFFF', '#FF007F'],
  /** Ocean — deep navy → teal → sky */
  ocean:  ['#1e3a8a', '#0ea5e9', '#06b6d4', '#0ea5e9', '#1e3a8a'],
  /** Sunset — deep orange → pink → purple */
  sunset: ['#7c2d12', '#f97316', '#ec4899', '#8b5cf6', '#f97316', '#7c2d12'],
  /** Gold — dark amber → bright gold → warm yellow */
  gold:   ['#78350f', '#d97706', '#fbbf24', '#fef08a', '#d97706', '#78350f'],
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
