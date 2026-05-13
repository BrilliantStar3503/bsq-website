'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type TColorProp = string | string[]

interface ShineBorderProps {
  /**
   * Border-radius of the outer wrapper (px).
   */
  borderRadius?: number
  /** Width of the animated shine border (px). */
  borderWidth?: number
  /** Duration of one full shine cycle (seconds). */
  duration?: number
  /**
   * One or more colours for the radial-gradient shine.
   * BSQ default: deep crimson → red → white flash → red → deep crimson.
   */
  color?: TColorProp
  className?: string
  children: React.ReactNode
}

/**
 * ShineBorder (Aceternity-style)
 * ─────────────────────────────────────────────────────────────────────
 * Animated border effect via CSS mask-composite on a ::before element.
 * The radial gradient sweeps continuously around the border ring.
 *
 * Compatible with Tailwind v4 — uses `animate-shine` utility defined
 * in globals.css via `@utility animate-shine { … }`.
 *
 * Usage:
 *   <ShineBorder
 *     color={["#C8102E", "#D92D20", "#ffffff", "#D92D20", "#C8102E"]}
 *     borderRadius={16}
 *     borderWidth={1}
 *     duration={10}
 *     className="w-full min-w-0 p-0 bg-transparent"
 *   >
 *     <YourCard />
 *   </ShineBorder>
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration    = 14,
  color       = ['#7f0000', '#B42318', '#D92D20', '#ffffff', '#D92D20', '#B42318', '#7f0000'],
  className,
  children,
}: ShineBorderProps) {
  const colorValue = Array.isArray(color) ? color.join(',') : color

  return (
    <div
      style={{ '--border-radius': `${borderRadius}px` } as React.CSSProperties}
      className={cn(
        'relative w-fit min-w-[300px] place-items-center rounded-[--border-radius] bg-white p-3',
        className,
      )}
    >
      {/* Shine ring — absolute ::before via Tailwind, clipped to border-ring only */}
      <div
        style={{
          '--border-width':               `${borderWidth}px`,
          '--border-radius':              `${borderRadius}px`,
          '--duration':                   `${duration}s`,
          '--mask-linear-gradient':       `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          '--background-radial-gradient': `radial-gradient(transparent, transparent, ${colorValue}, transparent, transparent)`,
        } as React.CSSProperties}
        className={[
          'before:absolute',
          'before:inset-0',
          'before:aspect-square',
          'before:size-full',
          'before:rounded-[--border-radius]',
          'before:p-[--border-width]',
          'before:will-change-[background-position]',
          'before:content-[""]',
          'before:![-webkit-mask-composite:xor]',
          'before:![mask-composite:exclude]',
          'before:[background-image:--background-radial-gradient]',
          'before:[background-size:300%_300%]',
          'before:[mask:--mask-linear-gradient]',
          'motion-safe:before:animate-shine',
        ].join(' ')}
      />
      {children}
    </div>
  )
}
