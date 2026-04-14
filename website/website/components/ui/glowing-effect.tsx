'use client'

/**
 * GlowingEffect — proximity-aware animated border glow.
 *
 * Drop this inside any `position: relative` container.
 * It paints a conic-gradient ring that smoothly rotates to follow
 * the nearest pointer, using `motion` (framer-motion v11 API).
 *
 * Props
 * ─────
 * blur         blur radius of the glow in px (default 0)
 * inactiveZone fraction of element half-diagonal that suppresses glow (default 0.3)
 * proximity    px distance from element edge at which glow is fully opaque (default 60)
 * spread       conic arc width in degrees (default 30)
 * glow         enable / disable entirely (default true)
 * borderWidth  ring thickness in px (default 2)
 * color        any CSS colour string for the glow arc (default red)
 * disabled     disables all pointer handling
 */

import { useRef, useEffect, useCallback } from 'react'
import { motion, animate, useMotionValue, useMotionTemplate } from 'motion/react'

interface GlowingEffectProps {
  blur?: number
  inactiveZone?: number
  proximity?: number
  spread?: number
  glow?: boolean
  borderWidth?: number
  color?: string
  disabled?: boolean
  className?: string
}

export function GlowingEffect({
  blur = 0,
  inactiveZone = 0.3,
  proximity = 60,
  spread = 30,
  glow = true,
  borderWidth = 2,
  color = 'rgba(239,68,68,0.75)',
  disabled = false,
  className = '',
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  /* ── Motion values (reactively update the rendered output) ─────────── */
  const angle   = useMotionValue(0)
  const opacity = useMotionValue(0)

  /* Live conic-gradient string bound to the motion value */
  const background = useMotionTemplate`conic-gradient(
    from calc(${angle}deg - ${spread / 2}deg),
    transparent 0deg,
    ${color} ${spread}deg,
    transparent ${spread * 2}deg
  )`

  /* ── Pointer move ───────────────────────────────────────────────────── */
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const el = containerRef.current
      if (!el || !glow || disabled) return

      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width  / 2
      const cy = rect.top  + rect.height / 2

      /* Angle from element centre to pointer */
      const deg =
        (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90
      animate(angle, deg, { duration: 0.1, ease: 'linear' })

      /* Nearest-edge distance → controls opacity outside the element */
      const nearestEdge = Math.max(0, Math.min(
        Math.abs(e.clientX - rect.left),
        Math.abs(e.clientX - rect.right),
        Math.abs(e.clientY - rect.top),
        Math.abs(e.clientY - rect.bottom),
      ))

      /* Dead-zone: suppress when pointer hovers over the element interior */
      const halfDiag  = Math.hypot(rect.width, rect.height) / 2
      const fromCentre = Math.hypot(e.clientX - cx, e.clientY - cy)
      const inDead    = fromCentre < halfDiag * inactiveZone

      const target = inDead ? 0 : Math.max(0, 1 - nearestEdge / proximity)
      animate(opacity, target, { duration: 0.15, ease: 'easeOut' })
    },
    [angle, opacity, glow, disabled, proximity, inactiveZone],
  )

  const handlePointerLeave = useCallback(() => {
    animate(opacity, 0, { duration: 0.3, ease: 'easeOut' })
  }, [opacity])

  /* ── Global listeners (tracks pointer even outside the element) ──────── */
  useEffect(() => {
    if (!glow || disabled) return
    window.addEventListener('pointermove',  handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)
    return () => {
      window.removeEventListener('pointermove',  handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [handlePointerMove, handlePointerLeave, glow, disabled])

  if (!glow) return null

  return (
    <motion.div
      ref={containerRef}
      aria-hidden
      className={className}
      style={{
        position:     'absolute',
        inset:        -borderWidth,
        borderRadius: 'inherit',
        padding:      borderWidth,
        /* motion-template keeps this live */
        background,
        opacity,
        filter:       blur ? `blur(${blur}px)` : undefined,
        /* mask cuts out the fill — only the border ring glows */
        WebkitMask:          'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite:  'xor',
        maskComposite:        'exclude',
        pointerEvents:        'none',
      }}
    />
  )
}
