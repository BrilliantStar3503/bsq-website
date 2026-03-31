'use client'

import { cn } from '@/lib/utils'

type TColorProp = string | string[]

interface ShineBorderProps {
  borderRadius?: number
  borderWidth?: number
  duration?: number
  color?: TColorProp
  className?: string
  /** Extra classes forwarded to the inner content wrapper */
  innerClassName?: string
  children: React.ReactNode
}

/**
 * ShineBorder
 * ──────────────────────────────────────────────────────────────────────
 * The "padding-as-border" trick:
 *   1. Outer div  — animated linear-gradient background (300% × 300%)
 *   2. Inner div  — full-width, solid background, slightly smaller radius
 *   3. The gap between outer and inner = borderWidth → shows the gradient = the animated border
 *
 * This approach works in every browser without mask-composite tricks.
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 2,
  duration = 6,
  color = ['#7f0000', '#D92D20', '#ff6b35', '#ffb347', '#D92D20', '#7f0000'],
  className,
  innerClassName,
  children,
}: ShineBorderProps) {
  const colors = Array.isArray(color) ? color.join(', ') : color
  const gradient = `linear-gradient(135deg, ${colors})`

  return (
    <div
      className={cn('relative', className)}
      style={{
        padding:          `${borderWidth}px`,
        borderRadius:     `${borderRadius + borderWidth}px`,
        background:       gradient,
        backgroundSize:   '300% 300%',
        animation:        `shine-pulse-border ${duration}s linear infinite`,
      }}
    >
      <div
        className={cn('relative w-full h-full', innerClassName)}
        style={{ borderRadius: `${borderRadius}px`, overflow: 'hidden' }}
      >
        {children}
      </div>
    </div>
  )
}
