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
 * Rotating conic-gradient border using transform: rotate() on an
 * oversized absolute div — no @property needed, works in all browsers.
 *
 *  Outer div       — relative, overflow:hidden, padding = border width
 *  Spinning layer  — absolute, 300%×300%, conic-gradient, rotates 360°
 *  Inner wrapper   — relative z-1, solid background, clips the spinner
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 3,
  duration = 4,
  color = ['#7f0000', '#B42318', '#D92D20', '#ffffff', '#D92D20', '#B42318', '#7f0000'],
  className,
  children,
}: ShineBorderProps) {
  const stops = Array.isArray(color) ? color : [color]
  const step  = 360 / stops.length
  const conicStops = [
    ...stops.map((c, i) => `${c} ${i * step}deg`),
    `${stops[0]} 360deg`,
  ].join(', ')

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        padding:      `${borderWidth}px`,
        borderRadius: `${borderRadius + borderWidth}px`,
      }}
    >
      {/* Rotating gradient layer — oversized so corners stay filled */}
      <div
        style={{
          position:   'absolute',
          inset:      '-100%',
          width:      '300%',
          height:     '300%',
          background: `conic-gradient(${conicStops})`,
          animation:  `shine-border-rotate ${duration}s linear infinite`,
        }}
      />

      {/* Content layer — solid bg blocks the spinner, shows only the border gap */}
      <div
        style={{
          position:     'relative',
          zIndex:       1,
          borderRadius: `${borderRadius}px`,
          overflow:     'hidden',
          width:        '100%',
          height:       '100%',
        }}
      >
        {children}
      </div>
    </div>
  )
}
