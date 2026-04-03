'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Search, ChevronDown, Menu, X } from 'lucide-react'

/* ══════════════════════════════════════════════════════════════════════
   PRU LIFE UK-STYLE HEADER
   Matches the official prulifeuk.com.ph layout:
     Row 1 — white bar: BSQ logo + brand text | right icons
     Row 2 — red bar:   primary nav links
   Used on /products/* pages only
══════════════════════════════════════════════════════════════════════ */

const PRU_RED = '#D92D20'

const NAV_LINKS = [
  { label: 'Home',             href: '/'           },
  { label: 'Products',         href: '/products',  hasDropdown: true },
  { label: 'Take Assessment',  href: '/assessment' },
  { label: 'About BSQ',        href: '/#about'     },
  { label: 'Contact Us',       href: '/#contact'   },
]

const PRODUCTS = [
  { label: 'PRUMillion Protect',             href: '/products/pru-million-protect'             },
  { label: 'Elite Series',                   href: '/products/elite-series'                   },
  { label: 'PRULifetime Income',             href: '/products/prulifetime-income'             },
  { label: 'PRULink Assurance Account Plus', href: '/products/prulink-assurance-account-plus' },
  { label: 'PRULove for Life',               href: '/products/prulove-for-life'               },
]

export function PruLifeHeader() {
  const pathname        = usePathname()
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [dropOpen,  setDropOpen]  = useState(false)
  const [imgError,  setImgError]  = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // One-way: fires immediately at 40px, never returns to red
      if (window.scrollY > 40) setScrolled(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Nav link color transitions with slight delay so text flips after bg settles
  const linkColor         = scrolled ? '#111827'              : '#fff'
  const activeBorderColor = scrolled ? PRU_RED                : 'rgba(255,255,255,0.9)'
  const activeLinkColor   = scrolled ? PRU_RED                : '#fff'
  const activeBg          = scrolled ? 'rgba(217,45,32,0.06)' : 'rgba(0,0,0,0.12)'
  const hoverBg           = scrolled ? 'rgba(217,45,32,0.06)' : 'rgba(0,0,0,0.12)'

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>

      {/* ── Row 1 — White brand bar ──────────────────────────────── */}
      <div style={{ background: '#fff' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 88,
        }}>
          {/* Logo + brand text */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              overflow: 'hidden', background: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {imgError ? (
                <span style={{ color: PRU_RED, fontWeight: 900, fontSize: 12 }}>BSQ</span>
              ) : (
                <Image
                  src="/images/bsq-logo.png"
                  alt="BSQ"
                  width={52} height={52}
                  onError={() => setImgError(true)}
                  style={{ objectFit: 'contain', width: 52, height: 52 }}
                />
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontWeight: 900, fontSize: 17, color: '#111827', letterSpacing: '0.01em' }}>
                Brilliant Star Quartz
              </span>
              <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4,
                display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700 }}>
                <span style={{ color: '#9ca3af' }}>Tied Branch &amp; Area</span>
                <span style={{ color: '#d1d5db' }}>·</span>
                <span style={{ color: PRU_RED, fontWeight: 900 }}>PRU&nbsp;LIFE&nbsp;UK</span>
              </span>
            </div>
          </a>

          {/* Right side: search + back to site */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#6b7280', padding: 6, borderRadius: 6,
              display: 'flex', alignItems: 'center',
            }}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <a href="/" style={{
              fontSize: 12, color: '#6b7280', textDecoration: 'none', fontWeight: 500,
              padding: '6px 12px', borderRadius: 6,
              border: '1px solid #e5e7eb',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = PRU_RED
                e.currentTarget.style.color = PRU_RED
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.color = '#6b7280'
              }}
            >
              ← Back to Site
            </a>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151', padding: 6 }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2 — Nav bar (desktop) — matches prulifeuk.com.ph exactly ── */}
      {/* transition: all 0.3s linear — simple linear bg sweep, no clip-path  */}
      <div
        className="hidden md:block"
        style={{
          background:   scrolled ? '#fff'  : PRU_RED,
          borderBottom: scrolled ? '1px solid #e5eaef' : 'none',
          boxShadow:    scrolled ? '0 2px 8px rgba(0,0,0,0.07)' : 'none',
          transition:   'all 0.3s linear',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center' }}>
          {NAV_LINKS.map(link => {
            const isActive = link.href !== '/' && pathname.startsWith(link.href)
            const isProducts = link.hasDropdown

            return (
              <div key={link.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => isProducts && setDropOpen(true)}
                onMouseLeave={() => isProducts && setDropOpen(false)}
              >
                <a
                  href={link.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    color: isActive ? activeLinkColor : linkColor,
                    fontWeight: isActive ? 800 : 600,
                    fontSize: 15,
                    padding: '15px 20px',
                    textDecoration: 'none',
                    letterSpacing: '0.01em',
                    borderBottom: isActive ? `3px solid ${activeBorderColor}` : '3px solid transparent',
                    transition: 'border-color 0.3s, background 0.3s, color 0.3s',
                    background: isActive ? activeBg : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = hoverBg
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {link.label}
                  {isProducts && <ChevronDown size={13} style={{ opacity: 0.8 }} />}
                </a>

                {/* Products dropdown */}
                {isProducts && dropOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0,
                    background: '#fff',
                    borderRadius: '0 0 8px 8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
                    minWidth: 280,
                    zIndex: 200,
                    overflow: 'hidden',
                  }}>
                    {PRODUCTS.map((p, i) => (
                      <a key={p.href} href={p.href} style={{
                        display: 'block',
                        padding: '11px 20px',
                        fontSize: 13.5,
                        color: pathname === p.href ? PRU_RED : '#111827',
                        fontWeight: pathname === p.href ? 700 : 500,
                        textDecoration: 'none',
                        borderBottom: i < PRODUCTS.length - 1 ? '1px solid #f3f4f6' : 'none',
                        transition: 'background 0.12s, color 0.12s',
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
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────── */}
      {menuOpen && (
        <div style={{ background: '#fff', borderBottom: '2px solid #e5e7eb' }}>
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} style={{
              display: 'block',
              padding: '13px 24px',
              fontSize: 14,
              fontWeight: 600,
              color: '#111827',
              borderBottom: '1px solid #f3f4f6',
              textDecoration: 'none',
            }}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
