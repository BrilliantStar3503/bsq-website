'use client'

/**
 * PruLifeHeader — Premium scroll-aware sticky header
 *
 * STATE MACHINE (3 states):
 *   'top'     → At page top. Full two-row layout: white brand bar + red nav.
 *   'compact' → Scrolled + scrolling UP. Single slim bar, glass-morphism, logo + links + CTA.
 *   'hidden'  → Scrolled + scrolling DOWN. Slides up off screen, out of the way.
 *
 * TRANSITIONS:
 *   hide/show  → transform translateY, 0.35s cubic-bezier (premium feel)
 *   top→compact → all properties morph: height, background, blur, shadow
 *   scroll logic → rAF-optimised, delta threshold prevents jitter
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X, MessageCircle } from 'lucide-react'

/* ── Constants ────────────────────────────────────────────────────── */
const PRU_RED          = '#D92D20'
const SCROLL_THRESHOLD = 80   // px scrolled before compact mode kicks in
const DELTA_THRESHOLD  = 5    // min px per frame to register direction change
const BRAND_ROW_H      = 88   // white brand bar height (px)
const NAV_ROW_TOP_H    = 52   // red nav height at top (px)
const NAV_ROW_COMPACT  = 68   // compact nav height (px)
const FULL_HEADER_H    = BRAND_ROW_H + NAV_ROW_TOP_H  // 140px spacer

type ScrollState = 'top' | 'compact' | 'hidden'

/* ── Nav data ─────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',            href: '/'           },
  { label: 'Products',        href: '/products',  hasDropdown: true },
  { label: 'Take Assessment', href: '/assessment' },
  { label: 'About BSQ',       href: '/#about'     },
  { label: 'Contact Us',      href: '/#contact'   },
]

const PRODUCTS = [
  { label: 'PRUMillion Protect',             href: '/products/pru-million-protect'             },
  { label: 'Elite Series',                   href: '/products/elite-series'                   },
  { label: 'PRULifetime Income',             href: '/products/prulifetime-income'             },
  { label: 'PRULink Assurance Account Plus', href: '/products/prulink-assurance-account-plus' },
  { label: 'PRULove for Life',               href: '/products/prulove-for-life'               },
]

/* ══════════════════════════════════════════════════════════════════ */
export function PruLifeHeader() {
  const pathname = usePathname()

  /* ── Component state ── */
  const [scrollState, setScrollState] = useState<ScrollState>('top')
  const [dropOpen,    setDropOpen]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [imgError,    setImgError]    = useState(false)

  /* ── Scroll tracking refs (no re-renders during scroll) ── */
  const lastScrollY = useRef(0)
  const rafId       = useRef<number | null>(null)

  /* ── rAF-optimised scroll handler ───────────────────────────────
     Uses requestAnimationFrame to batch reads, avoids layout
     thrashing. Delta threshold prevents micro-jitter toggling.   */
  const handleScroll = useCallback(() => {
    if (rafId.current !== null) return  // frame already queued

    rafId.current = requestAnimationFrame(() => {
      const y     = window.scrollY
      const delta = y - lastScrollY.current

      // Ignore tiny movements — prevents jitter on trackpads
      if (Math.abs(delta) >= DELTA_THRESHOLD) {
        if (y < SCROLL_THRESHOLD) {
          setScrollState('top')
        } else if (delta > 0) {
          setScrollState('hidden')   // scrolling DOWN  → hide
        } else {
          setScrollState('compact')  // scrolling UP    → show compact
        }
        lastScrollY.current = y
      }

      rafId.current = null
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()  // set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [handleScroll])

  /* ── Derived booleans ── */
  const isTop     = scrollState === 'top'
  const isHidden  = scrollState === 'hidden'
  const isCompact = scrollState === 'compact'

  /* ── Shared transition string (matches prulifeuk.com.ph: .3s linear) ── */
  const T_ALL  = 'all 0.3s linear'
  const T_HIDE = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)'

  return (
    <>
      {/* ── Flow spacer ───────────────────────────────────────────────
          Reserves space equal to the initial two-row header height so
          page content starts below the fixed header on load.        */}
      <div aria-hidden="true" style={{ height: FULL_HEADER_H }} />

      {/* ══════════════════════════════════════════════════════════
          FIXED HEADER SHELL
          transform drives the hide/show animation
      ══════════════════════════════════════════════════════════ */}
      <header
        role="banner"
        style={{
          position:   'fixed',
          top: 0, left: 0, right: 0,
          zIndex:     1000,
          transform:  isHidden ? 'translateY(-100%)' : 'translateY(0)',
          transition: T_HIDE,
        }}
      >

        {/* ── ROW 1: Brand bar (collapses when compact) ────────────
            Clips to zero height smoothly via max-height + opacity.
            Content remains 88px tall so logo never distorts.      */}
        <div style={{
          maxHeight:  isTop ? `${BRAND_ROW_H}px` : '0px',
          opacity:    isTop ? 1 : 0,
          overflow:   'hidden',
          background: '#fff',
          transition: `max-height 0.3s cubic-bezier(0.4,0,0.2,1),
                       opacity    0.2s ease`,
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            padding:  '0 32px',
            height:   BRAND_ROW_H,
            display:  'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>

            {/* Logo + brand text */}
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                overflow: 'hidden', background: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {imgError
                  ? <span style={{ color: PRU_RED, fontWeight: 900, fontSize: 12 }}>BSQ</span>
                  : <Image src="/images/bsq-logo.png" alt="BSQ" width={52} height={52}
                      onError={() => setImgError(true)}
                      style={{ objectFit: 'contain', width: 52, height: 52 }} />
                }
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontWeight: 900, fontSize: 17, color: '#111827', letterSpacing: '0.01em' }}>
                  Brilliant Star Quartz
                </span>
                <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                  marginTop: 4, display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700 }}>
                  <span style={{ color: '#9ca3af' }}>Tied Branch &amp; Area</span>
                  <span style={{ color: '#d1d5db' }}>·</span>
                  <span style={{ color: PRU_RED, fontWeight: 900 }}>PRU&nbsp;LIFE&nbsp;UK</span>
                </span>
              </div>
            </a>

            {/* Right: back to site + mobile hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a href="/" style={{
                fontSize: 12, color: '#6b7280', textDecoration: 'none', fontWeight: 500,
                padding: '6px 14px', borderRadius: 6,
                border: '1px solid #e5e7eb',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.color = PRU_RED }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280' }}
              >
                ← Back to Site
              </a>

              <button className="md:hidden" onClick={() => setMenuOpen(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151', padding: 6 }}
                aria-label="Toggle menu">
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Nav bar — morphs between red (top) ↔ glass (compact) ──
            At top   : solid red, white text, full nav links
            Compact  : rgba white + backdrop blur, dark text, logo + links + CTA
            Transition: all 0.3s linear (exact match to prulifeuk.com.ph CSS)  */}
        <div
          className="hidden md:flex"
          style={{
            height:           isTop ? NAV_ROW_TOP_H : NAV_ROW_COMPACT,
            background:       isTop ? PRU_RED : 'rgba(255,255,255,0.92)',
            backdropFilter:   isTop ? 'none' : 'blur(12px)',
            WebkitBackdropFilter: isTop ? 'none' : 'blur(12px)',
            boxShadow:        isTop ? 'none' : '0 4px 20px rgba(0,0,0,0.08)',
            borderBottom:     isTop ? 'none' : '1px solid rgba(0,0,0,0.06)',
            alignItems:       'center',
            transition:       T_ALL,
          }}
        >
          <div style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 32px',
            width: '100%',
            display: 'flex', alignItems: 'center',
            justifyContent: isTop ? 'flex-start' : 'space-between',
            gap: 8,
          }}>

            {/* ── Compact logo (slides in when not at top) ── */}
            <div style={{
              maxWidth:   isTop ? '0px' : '220px',
              opacity:    isTop ? 0 : 1,
              overflow:   'hidden',
              flexShrink: 0,
              transition: `max-width 0.35s cubic-bezier(0.4,0,0.2,1),
                           opacity   0.25s ease`,
            }}>
              <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
                whiteSpace: 'nowrap', paddingRight: 24 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, overflow: 'hidden', background: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {imgError
                    ? <span style={{ color: PRU_RED, fontWeight: 900, fontSize: 10 }}>BSQ</span>
                    : <Image src="/images/bsq-logo.png" alt="BSQ" width={34} height={34}
                        style={{ objectFit: 'contain', width: 34, height: 34 }} />
                  }
                </div>
                <span style={{ fontWeight: 800, fontSize: 13.5, color: '#111827' }}>
                  BSQ <span style={{ color: '#d1d5db' }}>·</span>{' '}
                  <span style={{ color: PRU_RED }}>PRU Life UK</span>
                </span>
              </a>
            </div>

            {/* ── Nav links ── */}
            <nav style={{ display: 'flex', alignItems: 'center', flex: isTop ? 1 : 'unset' }}>
              {NAV_LINKS.map(link => {
                const isActive   = link.href !== '/' && pathname.startsWith(link.href)
                const isProducts = !!link.hasDropdown

                return (
                  <div key={link.label} style={{ position: 'relative' }}
                    onMouseEnter={() => isProducts && setDropOpen(true)}
                    onMouseLeave={() => isProducts && setDropOpen(false)}
                  >
                    <a href={link.href} style={{
                      display:        'flex',
                      alignItems:     'center',
                      gap:            4,
                      color:          isTop
                                        ? (isActive ? '#fff' : 'rgba(255,255,255,0.92)')
                                        : (isActive ? PRU_RED : '#374151'),
                      fontWeight:     isActive ? 700 : 600,
                      fontSize:       14,
                      padding:        isTop ? '0 18px' : '0 14px',
                      height:         isTop ? `${NAV_ROW_TOP_H}px` : `${NAV_ROW_COMPACT}px`,
                      textDecoration: 'none',
                      letterSpacing:  '0.01em',
                      borderBottom:   isTop && isActive
                                        ? '3px solid rgba(255,255,255,0.85)'
                                        : !isTop && isActive
                                          ? `3px solid ${PRU_RED}`
                                          : '3px solid transparent',
                      background:     'transparent',
                      transition:     T_ALL,
                      whiteSpace:     'nowrap',
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = isTop ? 'rgba(0,0,0,0.1)' : 'rgba(217,45,32,0.06)'
                        if (!isActive) e.currentTarget.style.color = isTop ? '#fff' : PRU_RED
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = isTop
                          ? (isActive ? '#fff' : 'rgba(255,255,255,0.92)')
                          : (isActive ? PRU_RED : '#374151')
                      }}
                    >
                      {link.label}
                      {isProducts && (
                        <ChevronDown size={12} style={{
                          opacity: 0.7,
                          transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }} />
                      )}
                    </a>

                    {/* Products flyout dropdown */}
                    {isProducts && dropOpen && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0,
                        background: '#fff',
                        borderRadius: '0 0 10px 10px',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                        minWidth: 290,
                        zIndex: 200,
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.06)',
                        borderTop: 'none',
                      }}>
                        {PRODUCTS.map((p, i) => (
                          <a key={p.href} href={p.href} style={{
                            display: 'block',
                            padding: '12px 20px',
                            fontSize: 13.5,
                            color: pathname === p.href ? PRU_RED : '#111827',
                            fontWeight: pathname === p.href ? 700 : 500,
                            textDecoration: 'none',
                            borderBottom: i < PRODUCTS.length - 1 ? '1px solid #f3f4f6' : 'none',
                            transition: 'background 0.12s, color 0.12s',
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = PRU_RED }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = pathname === p.href ? PRU_RED : '#111827' }}
                          >
                            {p.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* ── CTA button (appears in compact mode) ──────────────────
                Slides in from right with max-width trick.
                Slight scale on hover — premium SaaS feel.          */}
            <div style={{
              maxWidth:   isTop ? '0px' : '240px',
              opacity:    isTop ? 0 : 1,
              overflow:   'hidden',
              flexShrink: 0,
              transition: `max-width 0.35s cubic-bezier(0.4,0,0.2,1),
                           opacity   0.25s ease`,
            }}>
              <button
                onClick={() => {
                  const el = document.querySelector('[data-cta-consultation]') as HTMLButtonElement
                  el?.click()
                }}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          8,
                  background:   PRU_RED,
                  color:        '#fff',
                  border:       'none',
                  borderRadius: 6,
                  padding:      '10px 20px',
                  fontWeight:   700,
                  fontSize:     13,
                  cursor:       'pointer',
                  whiteSpace:   'nowrap',
                  marginLeft:   16,
                  boxShadow:    '0 2px 12px rgba(217,45,32,0.30)',
                  transition:   'transform 0.2s cubic-bezier(0.4,0,0.2,1), background 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform  = 'scale(1.03)'
                  e.currentTarget.style.background = '#B42318'
                  e.currentTarget.style.boxShadow  = '0 4px 18px rgba(217,45,32,0.45)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform  = 'scale(1)'
                  e.currentTarget.style.background = PRU_RED
                  e.currentTarget.style.boxShadow  = '0 2px 12px rgba(217,45,32,0.30)'
                }}
              >
                <MessageCircle size={14} />
                Free Consultation
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile hamburger menu ── */}
        {menuOpen && (
          <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '13px 24px',
                  fontSize: 14, fontWeight: 600,
                  color: '#111827',
                  borderBottom: '1px solid #f3f4f6',
                  textDecoration: 'none',
                }}>
                {link.label}
              </a>
            ))}
            {/* Mobile CTA */}
            <div style={{ padding: '12px 24px 16px' }}>
              <a href="/assessment" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: PRU_RED, color: '#fff', textDecoration: 'none',
                padding: '12px 20px', borderRadius: 6, fontWeight: 700, fontSize: 14,
              }}>
                <MessageCircle size={15} /> Get a Free Consultation
              </a>
            </div>
          </div>
        )}

      </header>
    </>
  )
}
