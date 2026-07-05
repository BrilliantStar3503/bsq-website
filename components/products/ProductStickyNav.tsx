'use client'

import { useEffect, useState, useRef } from 'react'
import { useStickyOnScroll } from '@/hooks/useStickyOnScroll'

const PRU_RED   = '#D92D20'
const NAV_HEIGHT = 52

/* ── Section anchors for the in-page jump nav ─────────────────────────
   "compare" is a reserved placeholder for a future Product Comparison
   section — intentionally disabled, no target id exists yet.
──────────────────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: 'overview',    label: 'Overview'    },
  { id: 'benefits',    label: 'Benefits'    },
  { id: 'coverage',    label: 'Coverage'    },
  { id: 'compare',     label: 'Compare',     disabled: true },
  { id: 'appointment', label: 'Appointment' },
]

export default function ProductStickyNav() {
  const [active, setActive]   = useState('overview')
  const observerRef           = useRef<IntersectionObserver | null>(null)
  const { sentinelRef, stuck } = useStickyOnScroll(112)

  useEffect(() => {
    const targets = SECTIONS
      .filter(s => !s.disabled)
      .map(s => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)

    if (targets.length === 0) return

    observerRef.current = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    targets.forEach(el => observerRef.current!.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 170 // fixed header (60) + switcher nav (~52) + sticky nav (~52)
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" className="hidden md:block" />
      {stuck && <div style={{ height: NAV_HEIGHT }} aria-hidden="true" className="hidden md:block" />}
      <div
        className="z-30 hidden md:block"
        // Docks beneath the global header (60px) + ProductSwitcherNav (~52px).
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          ...(stuck
            ? { position: 'fixed', top: 112, left: 0, right: 0 }
            : { position: 'relative' }),
        }}
      >
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="flex items-center gap-1">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              disabled={s.disabled}
              onClick={() => !s.disabled && scrollTo(s.id)}
              title={s.disabled ? 'Coming soon' : undefined}
              className="border-0 bg-transparent"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '12px 16px',
                fontSize: 13,
                fontWeight: active === s.id ? 700 : 600,
                color: s.disabled ? '#c1c5cb' : active === s.id ? PRU_RED : '#6b7280',
                // inset box-shadow mimics a bottom border with no shorthand/longhand conflict
                boxShadow: active === s.id && !s.disabled
                  ? `inset 0 -2px 0 0 ${PRU_RED}`
                  : 'inset 0 -2px 0 0 transparent',
                cursor: s.disabled ? 'default' : 'pointer',
                transition: 'color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { if (!s.disabled && active !== s.id) e.currentTarget.style.color = PRU_RED }}
              onMouseLeave={e => { if (!s.disabled && active !== s.id) e.currentTarget.style.color = '#6b7280' }}
            >
              {s.label}
              {s.disabled && (
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.05em',
                  color: '#c1c5cb', border: '1px solid #e5e7eb', borderRadius: 3,
                  padding: '1px 5px', textTransform: 'uppercase',
                }}>
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      </div>
    </>
  )
}
