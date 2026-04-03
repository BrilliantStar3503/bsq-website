'use client'

/**
 * PruLifeHeader — Scroll-aware sticky header
 *
 * BEHAVIOUR (matches prulifeuk.com.ph exactly):
 *   TOP STATE    (scrollY < 10px)  — White brand bar + solid-red nav, overlays hero
 *   SCROLLED STATE (scrollY ≥ 10px) — Brand bar slides up, nav turns plain white, stays fixed
 *
 * No hide-on-scroll-down. Nav is ALWAYS visible once you start scrolling.
 * Transition: all 0.3s linear  (exact CSS from prulifeuk.com.ph DevTools)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X, MessageCircle } from 'lucide-react'

/* ── Constants ────────────────────────────────────────────────────── */
const PRU_RED          = '#D92D20'
const SCROLL_THRESHOLD = 10    // px — transition fires almost immediately
const BRAND_ROW_H      = 88    // white brand bar height (px)
const NAV_H_TOP        = 52    // nav height at top (red state)
const NAV_H_SCROLLED   = 60    // nav height when scrolled (white state)
const FULL_HEADER_H    = BRAND_ROW_H + NAV_H_TOP  // 140px flow spacer

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

  const [scrolled,  setScrolled]  = useState(false)
  const [dropOpen,  setDropOpen]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [imgError,  setImgError]  = useState(false)

  const rafId = useRef<number | null>(null)

  /* ── rAF-optimised scroll handler ─────────────────────────────── */
  const handleScroll = useCallback(() => {
    if (rafId.current !== null) return
    rafId.current = requestAnimationFrame(() => {
      setScrolled(window.scrollY >= SCROLL_THRESHOLD)
      rafId.current = null
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()   // set correct initial state
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [handleScroll])

  /* ── Shared transition ───────────────────────────────────────── */
  const T = 'all 0.2s linear'

  return (
    <>
      {/* ── Flow spacer ───────────────────────────────────────────────
          Reserves space equal to the full two-row header on load,
          so page content starts below the fixed header.            */}
      <div aria-hidden="true" style={{
        height:     scrolled ? NAV_H_SCROLLED : FULL_HEADER_H,
        background: '#ffffff',
        transition: T,
      }} />

      {/* ══════════════════════════════════════════════════════════
          FIXED HEADER SHELL — never hides, always at top
      ══════════════════════════════════════════════════════════ */}
      <header
        role="banner"
        style={{
          position:  'fixed',
          top: 0, left: 0, right: 0,
          zIndex:    1000,
        }}
      >

        {/* ── ROW 1: Brand bar ─────────────────────────────────────
            Slides up and out via translateY + height:0 clip.
            translateY keeps it in sync with the nav colour change. */}
        <div style={{
          height:    `${BRAND_ROW_H}px`,
          overflow:  'hidden',
          background: '#fff',
          transform:  scrolled ? `translateY(-${BRAND_ROW_H}px)` : 'translateY(0)',
          opacity:    scrolled ? 0 : 1,
          marginBottom: scrolled ? `-${BRAND_ROW_H}px` : '0px',
          transition: T,
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
                <span style={{
                  fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                  marginTop: 4, display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700,
                }}>
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

        {/* ── ROW 2: Nav bar ───────────────────────────────────────────
            TOP     → solid red (#D92D20), white text, 52px tall
            SCROLLED → plain white, dark text, 60px tall, subtle shadow
            Transition: all 0.3s linear  (from prulifeuk.com.ph CSS)  */}
        <div
          className="hidden md:flex"
          style={{
            height:     scrolled ? NAV_H_SCROLLED : NAV_H_TOP,
            background: scrolled ? '#ffffff' : PRU_RED,
            boxShadow:  scrolled ? '0 2px 16px rgba(0,0,0,0.10)' : 'none',
            alignItems: 'center',
            transition: T,
          }}
        >
          <div style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 32px',
            width: '100%',
            display: 'flex', alignItems: 'center',
            gap: 4,
          }}>

            {/* ── Nav links ── */}
            <nav style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
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
                      color:          scrolled
                                        ? (isActive ? PRU_RED : '#374151')
                                        : (isActive ? '#fff'  : 'rgba(255,255,255,0.92)'),
                      fontWeight:     isActive ? 700 : 600,
                      fontSize:       14,
                      padding:        scrolled ? '0 16px' : '0 18px',
                      height:         scrolled ? `${NAV_H_SCROLLED}px` : `${NAV_H_TOP}px`,
                      textDecoration: 'none',
                      letterSpacing:  '0.01em',
                      borderBottom:   isActive
                                        ? scrolled
                                          ? `3px solid ${PRU_RED}`
                                          : '3px solid rgba(255,255,255,0.85)'
                                        : '3px solid transparent',
                      background:     'transparent',
                      transition:     T,
                      whiteSpace:     'nowrap',
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = scrolled
                          ? 'rgba(217,45,32,0.06)'
                          : 'rgba(0,0,0,0.10)'
                        if (!isActive) {
                          e.currentTarget.style.color = scrolled ? PRU_RED : '#fff'
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = scrolled
                          ? (isActive ? PRU_RED : '#374151')
                          : (isActive ? '#fff'  : 'rgba(255,255,255,0.92)')
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
                        position:     'absolute', top: '100%', left: 0,
                        background:   '#fff',
                        borderRadius: '0 0 10px 10px',
                        boxShadow:    '0 12px 32px rgba(0,0,0,0.12)',
                        minWidth:     290,
                        zIndex:       200,
                        overflow:     'hidden',
                        border:       '1px solid rgba(0,0,0,0.06)',
                        borderTop:    'none',
                      }}>
                        {PRODUCTS.map((p, i) => (
                          <a key={p.href} href={p.href} style={{
                            display:      'block',
                            padding:      '12px 20px',
                            fontSize:     13.5,
                            color:        pathname === p.href ? PRU_RED : '#111827',
                            fontWeight:   pathname === p.href ? 700 : 500,
                            textDecoration: 'none',
                            borderBottom: i < PRODUCTS.length - 1 ? '1px solid #f3f4f6' : 'none',
                            transition:   'background 0.12s, color 0.12s',
                          }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#fef2f2'
                              e.currentTarget.style.color = PRU_RED
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent'
                              e.currentTarget.style.color = pathname === p.href ? PRU_RED : '#111827'
                            }}
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

            {/* ── Get a Quote CTA (always visible, morphs with nav) ── */}
            <a href="/assessment" style={{
              display:      'flex',
              alignItems:   'center',
              gap:          8,
              background:   scrolled ? PRU_RED : 'rgba(255,255,255,0.15)',
              color:        '#fff',
              border:       scrolled ? 'none' : '1px solid rgba(255,255,255,0.5)',
              borderRadius: 6,
              padding:      '9px 18px',
              fontWeight:   700,
              fontSize:     13,
              textDecoration: 'none',
              whiteSpace:   'nowrap',
              flexShrink:   0,
              boxShadow:    scrolled ? '0 2px 10px rgba(217,45,32,0.28)' : 'none',
              transition:   T,
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background  = scrolled ? '#B42318' : 'rgba(255,255,255,0.25)'
                e.currentTarget.style.boxShadow   = scrolled ? '0 4px 16px rgba(217,45,32,0.40)' : 'none'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background  = scrolled ? PRU_RED : 'rgba(255,255,255,0.15)'
                e.currentTarget.style.boxShadow   = scrolled ? '0 2px 10px rgba(217,45,32,0.28)' : 'none'
              }}
            >
              <MessageCircle size={14} />
              Free Consultation
            </a>

          </div>
        </div>

        {/* ── Mobile nav bar (always shows hamburger) ───────────────── */}
        <div
          className="flex md:hidden"
          style={{
            height:     56,
            background: scrolled ? '#ffffff' : PRU_RED,
            alignItems: 'center',
            padding:    '0 20px',
            justifyContent: 'space-between',
            boxShadow:  scrolled ? '0 2px 12px rgba(0,0,0,0.10)' : 'none',
            transition: T,
          }}
        >
          {/* Mobile logo (always visible) */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              overflow: 'hidden', background: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {imgError
                ? <span style={{ color: PRU_RED, fontWeight: 900, fontSize: 9 }}>BSQ</span>
                : <Image src="/images/bsq-logo.png" alt="BSQ" width={30} height={30}
                    style={{ objectFit: 'contain', width: 30, height: 30 }} />
              }
            </div>
            <span style={{
              fontWeight: 800, fontSize: 13,
              color: scrolled ? '#111827' : '#fff',
              transition: T,
            }}>
              BSQ · PRU Life UK
            </span>
          </a>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(v => !v)}
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', padding: 6,
              color: scrolled ? '#374151' : '#fff',
              transition: T,
            }}
            aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Mobile dropdown menu ── */}
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
            {PRODUCTS.map(p => (
              <a key={p.href} href={p.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '11px 24px 11px 40px',
                  fontSize: 13, fontWeight: 500,
                  color: pathname === p.href ? PRU_RED : '#6b7280',
                  borderBottom: '1px solid #f3f4f6',
                  textDecoration: 'none',
                }}>
                {p.label}
              </a>
            ))}
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
