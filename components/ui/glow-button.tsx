'use client'

/**
 * GlowButton — CTA wrapper that composes <GlowingEffect>.
 *
 * Renders a <button> (or <a> when href is supplied) inside a relative
 * container so GlowingEffect can position itself correctly.
 * All existing Tailwind classes on the button are preserved.
 *
 * Usage
 * ─────
 * <GlowButton variant="primary" onClick={...}>
 *   Run Your Assessment →
 * </GlowButton>
 *
 * <GlowButton variant="secondary" href="/booking">
 *   Book a Consultation
 * </GlowButton>
 */

import { type ReactNode, type MouseEvent } from 'react'
import { GlowingEffect } from './glowing-effect'

interface GlowButtonProps {
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  href?: string
  /** Extra classes on the outer position:relative wrapper */
  className?: string
  /** Extra classes forwarded to the inner <button> or <a> */
  btnClassName?: string
  variant?: 'primary' | 'secondary'
  /* GlowingEffect knobs — safe defaults match the spec */
  spread?: number
  proximity?: number
  inactiveZone?: number
  borderWidth?: number
  blur?: number
  glow?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

/* Colour per variant */
const GLOW_COLOR = {
  primary:   'rgba(239,68,68,0.7)',
  secondary: 'rgba(255,255,255,0.4)',
}

/* Base button styles per variant */
const BASE_BTN = {
  primary:
    'bg-red-600 hover:bg-red-700 text-white font-semibold',
  secondary:
    'bg-transparent border border-white/20 text-gray-300 hover:border-white/40 font-medium',
}

export function GlowButton({
  children,
  onClick,
  href,
  className = '',
  btnClassName = '',
  variant = 'primary',
  spread      = 30,
  proximity   = 60,
  inactiveZone = 0.3,
  borderWidth  = 2,
  blur         = 0,
  glow         = true,
  disabled     = false,
  type         = 'button',
}: GlowButtonProps) {

  const sharedCls = [
    'relative z-10 inline-flex items-center justify-center gap-2',
    'px-7 py-3.5 rounded-full text-sm',
    'transition-all duration-200 cursor-pointer select-none',
    'active:scale-95',
    BASE_BTN[variant],
    btnClassName,
  ].join(' ')

  const inner = href ? (
    <a
      href={href}
      className={sharedCls}
      onClick={onClick as (e: MouseEvent<HTMLAnchorElement>) => void}
    >
      {children}
    </a>
  ) : (
    <button
      type={type}
      disabled={disabled}
      className={sharedCls}
      onClick={onClick as (e: MouseEvent<HTMLButtonElement>) => void}
    >
      {children}
    </button>
  )

  return (
    /* position:relative is required so GlowingEffect (position:absolute) aligns */
    <div className={`relative inline-flex rounded-full ${className}`}>
      <GlowingEffect
        glow={glow}
        color={GLOW_COLOR[variant]}
        spread={spread}
        proximity={proximity}
        inactiveZone={inactiveZone}
        borderWidth={borderWidth}
        blur={blur}
      />
      {inner}
    </div>
  )
}
