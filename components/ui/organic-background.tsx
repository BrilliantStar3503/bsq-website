'use client'

import { useId } from 'react'

/* ══════════════════════════════════════════════════════════════════
   OrganicBackground — layered, architectural curved backgrounds
   ──────────────────────────────────────────────────────────────────
   Two stacked shapes (a soft, lighter undertone offset behind the main
   gradient-filled ribbon) rather than one flat-fill sticker — this is
   what reads as "architectural" instead of "decorative SVG": real
   surfaces sitting at different depths, not a single cutout.

   Usage: place inside a `position: relative; overflow: hidden`
   container, behind your content (z-index 0), content at z-index 10+.

   Variants:
   - "hero-wrap"   — a ribbon sweeping from the top edge down the right
                     side, swelling near the middle. Built for a wide
                     split hero (text left, photo right).
   - "wave-divider"— a layered horizontal wave, for transitioning
                     between a white section and a solid-color section
                     below it (place at the top of the solid-color
                     section).
   ══════════════════════════════════════════════════════════════════ */

type OrganicBackgroundProps = {
  variant: 'hero-wrap' | 'wave-divider'
  color?: string
  colorDark?: string
  flip?: boolean
  className?: string
}

const PATHS: Record<OrganicBackgroundProps['variant'], { viewBox: string; main: string; under: string }> = {
  'hero-wrap': {
    viewBox: '0 0 1440 800',
    main:  'M1440,0 L1440,800 L800,800 C710,760 660,680 705,600 C770,485 645,430 600,345 C560,270 660,150 800,75 C900,25 1000,5 1440,0 Z',
    under: 'M1440,40 L1440,800 L860,800 C775,755 735,675 775,605 C835,500 720,440 685,360 C655,290 745,180 870,105 C955,55 1040,30 1440,40 Z',
  },
  'wave-divider': {
    viewBox: '0 0 1440 120',
    main:  'M0,0 C240,90 360,30 600,55 C840,80 960,10 1200,40 C1320,55 1380,45 1440,30 L1440,0 L0,0 Z',
    under: 'M0,18 C240,100 360,46 600,68 C840,90 960,28 1200,55 C1320,68 1380,58 1440,45 L1440,0 L0,0 Z',
  },
}

export function OrganicBackground({ variant, color = '#D92D20', colorDark = color, flip = false, className = '' }: OrganicBackgroundProps) {
  const { viewBox, main, under } = PATHS[variant]
  const gradientId = useId()

  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      viewBox={viewBox}
      preserveAspectRatio="none"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={colorDark} />
        </linearGradient>
      </defs>
      {/* Undertone — a second, offset surface sitting "behind" the main
          shape at low opacity. This is what creates the sense of two
          stacked planes rather than one flat cutout. */}
      <path d={under} fill={color} opacity={0.16} />
      <path d={main} fill={`url(#${gradientId})`} />
    </svg>
  )
}
