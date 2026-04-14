'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, MapPin, Mail, Phone } from 'lucide-react'
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button'

/* ══════════════════════════════════════════════════════════════════════════
   BSQ FOOTER — Compact, professional AI-grade design
   ══════════════════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: 'Start Assessment', href: '/assessment'      },
  { label: 'How It Works',     href: '/#how'            },
  { label: 'Solutions',        href: '/#solutions'      },
  { label: 'Privacy Policy',   href: '/privacy-policy'  },
  { label: 'Contact Advisor',  href: 'https://m.me/Bstarquartzarea' },
]

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/Bstarquartzarea',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/brilliant-star-quartz',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:bstarquartz@gmail.com',
    icon: <Mail size={15} />,
  },
]

const PARTNER_LOGOS = [
  { src: '/logos/gama-logo.png',  alt: 'GAMA International',                       w: 72,  h: 24 },
  { src: '/logos/mdrt-logo.png',  alt: 'Million Dollar Round Table',                w: 28,  h: 28 },
  { src: '/logos/luap-logo.png',  alt: 'Life Underwriters Association Philippines',  w: 28,  h: 28 },
  { src: '/logos/iarfc-logo.png', alt: 'IARFC',                                     w: 48,  h: 24 },
]

function PartnerLogo({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  const [err, setErr] = useState(false)
  if (err) return <span className="text-[9px] font-bold tracking-widest uppercase text-white/40">{alt}</span>
  return (
    <Image
      src={src} alt={alt} width={w} height={h}
      onError={() => setErr(true)}
      style={{ objectFit: 'contain', opacity: 0.55, filter: 'grayscale(1) brightness(2)' }}
    />
  )
}

export default function BsqFooter() {
  return (
    <footer
      className="relative"
      style={{ background: 'linear-gradient(180deg, #16161a 0%, #0f0f12 100%)' }}
    >
      {/* Top accent line */}
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(220,38,38,0.5), rgba(220,38,38,0.2), transparent)' }} />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-10">

        {/* ── Main 4-column grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* Col 1 — Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.92)' }}>
                <Image src="/images/bsq-logo.png" alt="BSQ" width={28} height={28} style={{ objectFit: 'contain' }} />
              </div>
              <div className="leading-none">
                <p className="text-white text-xs font-black tracking-wide">Brilliant Star Quartz</p>
                <p className="text-white/75 text-[9px] tracking-widest uppercase">Financial System</p>
              </div>
            </div>
            <p className="text-white/80 text-xs leading-relaxed mb-4 max-w-[200px]">
              AI-powered financial gap analysis. Licensed PRU Life UK advisor.
            </p>
            {/* Social icons */}
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={s.label}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background   = 'rgba(220,38,38,0.18)'
                    el.style.borderColor  = 'rgba(220,38,38,0.35)'
                    el.style.color        = '#f87171'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background   = 'rgba(255,255,255,0.07)'
                    el.style.borderColor  = 'rgba(255,255,255,0.12)'
                    el.style.color        = 'rgba(255,255,255,0.85)'
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Navigate */}
          <div>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/70 mb-3">Navigate</p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-xs text-white/70 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-600/50 shrink-0 group-hover:bg-red-500 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/70 mb-3">Contact</p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin size={10} className="text-white/40 shrink-0 mt-0.5" />
                <p className="text-[11px] text-white/80 leading-relaxed">18th Floor, Exquadra Tower<br />Ortigas, Pasig City, PH</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={10} className="text-white/40 shrink-0" />
                <p className="text-[11px] text-white/80">+63 917 823 2799</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={10} className="text-white/40 shrink-0" />
                <p className="text-[11px] text-white/80">bstarquartz@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Col 4 — CTA */}
          <div className="flex flex-col justify-between gap-4">
            <div>
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/70 mb-3">Get Started</p>
              <p className="text-xs text-white/80 leading-relaxed mb-4">
                Know your gaps.<br />Fix them with a plan.
              </p>
              <AnimatedGradientButton
                preset="pru"
                duration={5}
                className="text-xs font-bold px-4 py-2.5 rounded-lg"
                onClick={() => window.location.href = '/assessment'}
              >
                Free Assessment
                <ArrowRight size={12} />
              </AnimatedGradientButton>
            </div>
            {/* PRU affiliation tag */}
            <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/70 mb-0.5">Affiliated with</p>
              <p className="text-xs font-semibold text-white/80">PRU Life UK</p>
            </div>
          </div>

        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.10)', marginBottom: '1.25rem' }} />

        {/* ── Legal ── */}
        <p className="text-[10px] text-white/75 text-center">
          © {new Date().getFullYear()} Brilliant Star Quartz · PRU Life UK Licensed · Advisory purposes only ·{' '}
          <a href="/privacy-policy" className="hover:text-white/80 transition-colors duration-150 underline underline-offset-2">Privacy Policy</a>
        </p>

      </div>
    </footer>
  )
}
