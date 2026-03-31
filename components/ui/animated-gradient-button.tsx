'use client'

import React from 'react'
import { cn } from '@/lib/utils'

/* ══════════════════════════════════════════════════════════════════
   AnimatedGradientButton
   ──────────────────────────────────────────────────────────────────
   Flowing radial-gradient background that endlessly shifts position.
   Extracted animation logic from ShineBorder — ZERO mask/border tricks.

   HOW IT WORKS:
     1. A radial-gradient is built from the `colors` array.
     2. background-size: 300% 300% makes the gradient larger than
        the element — so shifting background-position actually moves
        the visible portion of the gradient.
     3. The `shine-pulse` keyframe animates background-position
        from (0%,0%) → (100%,100%) → (0%,0%), creating a smooth
        flowing / pulsing effect.

   PROPS:
     colors    — array of CSS color strings (min 2, can chain many)
     duration  — animation cycle length in seconds (default 6)
     className — extra Tailwind classes (size, padding, radius…)
     children  — button label / content
══════════════════════════════════════════════════════════════════ */

/* ─── Preset palettes ───────────────────────────────────────────── */
export const GRADIENT_PRESETS = {
  /** PRU Life UK brand — red pulse */
  pru:    ['#D92D20', '#ff4d3d', '#ff7a60', '#D92D20'],
  /** Neon pop — magenta → lime → cyan */
  neon:   ['#FF007F', '#39FF14', '#00FFFF', '#FF007F'],
  /** Ocean — deep blue → teal → sky */
  ocean:  ['#0ea5e9', '#06b6d4', '#3b82f6', '#0ea5e9'],
  /** Sunset — orange → pink → purple */
  sunset: ['#f97316', '#ec4899', '#8b5cf6', '#f97316'],
  /** Gold — amber → yellow → gold */
  gold:   ['#d97706', '#fbbf24', '#f59e0b', '#d97706'],
} as const

export type GradientPreset = keyof typeof GRADIENT_PRESETS

interface AnimatedGradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Array of CSS colors — the gradient cycles through all of them */
  colors?: string[]
  /** Use a named preset instead of a custom colors array */
  preset?: GradientPreset
  /** Animation cycle duration in seconds (default: 6) */
  duration?: number
  /** Extra Tailwind or CSS classes */
  className?: string
  children: React.ReactNode
}

export function AnimatedGradientButton({
  colors,
  preset,
  duration = 6,
  className,
  children,
  style,
  ...props
}: AnimatedGradientButtonProps) {
  /* Resolve colors — explicit array > preset > default PRU red */
  const resolvedColors =
    colors ??
    (preset ? GRADIENT_PRESETS[preset] : GRADIENT_PRESETS.pru)

  /*
   * Build the gradient.
   * radial-gradient(ellipse at 50% 50%, color1, color2, …)
   *
   * Because background-size is 300%×300% and the keyframe shifts
   * background-position, the "hot spot" of the ellipse travels
   * across the button, creating the flowing color effect.
   */
  const gradientImage = `radial-gradient(ellipse at 50% 50%, ${resolvedColors.join(', ')})`

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

/* ══════════════════════════════════════════════════════════════════
   SHADCN BUTTON INTEGRATION
   ──────────────────────────────────────────────────────────────────
   If you want to wrap shadcn <Button> instead of a plain <button>,
   use the `asChild` prop to delegate rendering:

   import { Button } from '@/components/ui/button'

   <Button asChild>
     <AnimatedGradientButton preset="neon">
       Get Started
     </AnimatedGradientButton>
   </Button>

   Or just apply the class directly on <Button>:

   <Button
     className="animated-gradient-btn"
     style={{
       backgroundImage: 'radial-gradient(ellipse at 50% 50%, #FF007F, #39FF14, #00FFFF, #FF007F)',
       '--shine-duration': '4s',
     } as React.CSSProperties}
   >
     Get Started
   </Button>
══════════════════════════════════════════════════════════════════ */
