'use client'

import { cn } from '@/lib/utils'

type TColorProp = string | string[]

interface ShineBorderProps {
  borderRadius?: number
  borderWidth?: number
  duration?: number
  color?: TColorProp
  className?: string
  children: React.ReactNode
}

/**
 * ShineBorder
 * ──────────────────────────────────────────────────────────────────────
 * Spinning conic-gradient border using @property --shine-angle.
 * The colour beam visibly rotates 360° around the button edge.
 *
 *  Outer div  — conic-gradient background + padding = border thickness
 *  Inner div  — solid background, slightly smaller radius
 *  The gap between them reveals the spinning gradient = the border
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 3,
  duration = 4,
  color = ['#7f0000', '#D92D20', '#ff6b35', '#ffb347', '#ffffff', '#ffb347', '#D92D20', '#7f0000'],
  className,
  children,
}: ShineBorderProps) {
  const stops = Array.isArray(color) ? color : [color]

  // Build conic-gradient colour stops evenly spaced around 360°
  const step   = 360 / stops.length
  const conicStops = stops
    .map((c, i) => `${c} ${i * step}deg`)
    .concat(`${stops[0]} 360deg`)   // close the loop
    .join(', ')

  return (
    <div
      className={cn('shine-border-spin relative', className)}
      style={{
        '--shine-spin-duration': `${duration}s`,
        padding:      `${borderWidth}px`,
        borderRadius: `${borderRadius + borderWidth}px`,
        background:   `conic-gradient(from var(--shine-angle, 0deg), ${conicStops})`,
      } as React.CSSProperties}
    >
      <div
        style={{
          borderRadius: `${borderRadius}px`,
          overflow:     'hidden',
          position:     'relative',
          width:        '100%',
          height:       '100%',
        }}
      >
        {children}
      </div>
    </div>
  )
}
