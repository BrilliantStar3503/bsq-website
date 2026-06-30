'use client'

/* ══════════════════════════════════════════════════════════════════
   OrganicBackground — premium curved/flowing background shapes
   ──────────────────────────────────────────────────────────────────
   Reusable visual primitive for the editorial, flowing-curve language
   established by the Insurance Solutions visual redesign. Hand-tuned
   SVG ribbons rather than a generic blob generator — these are
   intentionally art-directed shapes, not random noise.

   Usage: place inside a `position: relative; overflow: hidden`
   container, behind your content (z-index 0), content at z-index 10+.

   Variants:
   - "hero-wrap"   — a ribbon sweeping from the top edge down the right
                     side, swelling near the middle. Built for a wide
                     split hero (text left, photo right) where the
                     photo sits "inside" the curve.
   - "wave-divider"— a thin horizontal wave, for transitioning between
                     a white section and a solid-color section below it
                     (place at the top of the solid-color section).
   ══════════════════════════════════════════════════════════════════ */

type OrganicBackgroundProps = {
  variant: 'hero-wrap' | 'wave-divider'
  color?: string
  flip?: boolean
  className?: string
}

const PATHS: Record<OrganicBackgroundProps['variant'], { viewBox: string; d: string }> = {
  'hero-wrap': {
    viewBox: '0 0 1440 800',
    d: 'M1440,0 L1440,800 L800,800 C710,760 660,680 705,600 C770,485 645,430 600,345 C560,270 660,150 800,75 C900,25 1000,5 1440,0 Z',
  },
  'wave-divider': {
    viewBox: '0 0 1440 120',
    d: 'M0,0 C240,90 360,30 600,55 C840,80 960,10 1200,40 C1320,55 1380,45 1440,30 L1440,0 L0,0 Z',
  },
}

export function OrganicBackground({ variant, color = '#D92D20', flip = false, className = '' }: OrganicBackgroundProps) {
  const { viewBox, d } = PATHS[variant]
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      viewBox={viewBox}
      preserveAspectRatio="none"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <path d={d} fill={color} />
    </svg>
  )
}
