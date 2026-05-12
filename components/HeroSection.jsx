'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SplineScene } from '@/components/ui/spline-scene'
import RotatingHook from '@/components/ui/rotating-hook'
import { HeroStatsPills } from '@/components/ui/assessment-stats'

const SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'
const CALENDLY_URL = 'https://calendly.com/brilliantstarquartz/30min'

export default function HeroSection() {
  const router = useRouter()

  // Listen for Calendly booking confirmation → send to CRM
  useEffect(() => {
    const handleCalendlyEvent = async (e) => {
      if (e.data?.event === 'calendly.event_scheduled') {
        try {
          await fetch('/api/calendly-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              invitee_uri: e.data.payload?.invitee?.uri || '',
              event_uri: e.data.payload?.event?.uri || '',
            }),
          })
        } catch (err) {
          // Silent fail — never break the user experience
          console.error('[BSQ] Calendly tracking error:', err)
        }
      }
    }

    window.addEventListener('message', handleCalendlyEvent)
    return () => window.removeEventListener('message', handleCalendlyEvent)
  }, [])

  // Open Calendly popup — fallback to new tab if script not yet loaded
  const openCalendly = () => {
    if (typeof window !== 'undefined' && window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL })
    } else {
      window.open(CALENDLY_URL, '_blank')
    }
  }

  return (
    <>
      {/*
        ── Preload hint ───────────────────────────────────────────────────
        Tells the browser to fetch the Spline scene in the background
        as early as possible, cutting perceived load time significantly.
      */}
      <link rel="preload" href={SCENE_URL} as="fetch" crossOrigin="anonymous" />

      {/* ── Glass-white hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #ffffff 0%, #f5f7ff 55%, #eef1ff 100%)',
        }}
      >
        {/* Subtle decorative radial glow — top-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(237,27,46,0.07) 0%, transparent 70%)' }}
        />
        {/* Subtle decorative radial glow — bottom-left */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(100,116,255,0.06) 0%, transparent 70%)' }}
        />

        {/* ── PRU ribbon — bottom edge, behind all content ── */}
        <svg
          className="absolute left-0 w-full pointer-events-none"
          style={{ bottom: 0, height: 160, zIndex: 0, opacity: 0.80 }}
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heroRMain" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#C40022" stopOpacity="0"/>
              <stop offset="5%"   stopColor="#C40022" stopOpacity="1"/>
              <stop offset="40%"  stopColor="#E60028" stopOpacity="1"/>
              <stop offset="60%"  stopColor="#E60028" stopOpacity="1"/>
              <stop offset="95%"  stopColor="#C40022" stopOpacity="1"/>
              <stop offset="100%" stopColor="#C40022" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="heroRHL" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#FF5070" stopOpacity="0"/>
              <stop offset="5%"   stopColor="#FF5070" stopOpacity="0.65"/>
              <stop offset="50%"  stopColor="#FF2244" stopOpacity="0.55"/>
              <stop offset="95%"  stopColor="#FF5070" stopOpacity="0.55"/>
              <stop offset="100%" stopColor="#FF5070" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="heroRShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#880018" stopOpacity="0"/>
              <stop offset="5%"   stopColor="#880018" stopOpacity="0.40"/>
              <stop offset="50%"  stopColor="#9C001C" stopOpacity="0.35"/>
              <stop offset="95%"  stopColor="#880018" stopOpacity="0.30"/>
              <stop offset="100%" stopColor="#880018" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="heroGMain" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#C8C8C8" stopOpacity="0"/>
              <stop offset="5%"   stopColor="#C8C8C8" stopOpacity="0.45"/>
              <stop offset="50%"  stopColor="#E0E0E0" stopOpacity="0.40"/>
              <stop offset="95%"  stopColor="#C8C8C8" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#C8C8C8" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* Paths shifted down so ribbon sits in the bottom quarter only */}
          <path d="M0,90  C360,90  560,148 720,142 S1080,100 1440,100"
                fill="none" stroke="url(#heroGMain)"   strokeWidth="18" strokeLinecap="round"/>
          <path d="M0,84  C360,84  560,142 720,136 S1080,94  1440,94"
                fill="none" stroke="url(#heroRShadow)" strokeWidth="22" strokeLinecap="round"/>
          <path d="M0,78  C360,78  560,136 720,130 S1080,88  1440,88"
                fill="none" stroke="url(#heroRMain)"   strokeWidth="18" strokeLinecap="round"/>
          <path d="M0,72  C360,72  560,130 720,124 S1080,82  1440,82"
                fill="none" stroke="url(#heroRHL)"     strokeWidth="5"  strokeLinecap="round"/>
        </svg>

        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10 relative" style={{ zIndex: 2 }}>

          {/* ── LEFT — Text content ──────────────────────────────────── */}
          <div className="w-full md:w-1/2 min-w-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              <RotatingHook theme="light" />
            </h1>

            <p className="text-gray-500 mt-5 max-w-lg">
              Our system analyzes your income, coverage, and goals to detect gaps —
              and show what needs attention.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">

              {/* PRIMARY CTA */}
              <button
                onClick={() => router.push('/assessment')}
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm text-white transition-all duration-200 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #ed1b2e, #c1121f)',
                  boxShadow: '0 6px 28px rgba(237,27,46,0.35)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 36px rgba(237,27,46,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(237,27,46,0.35)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Run Your 3-Minute Assessment →
              </button>

              {/* SECONDARY CTA — glass light */}
              <button
                onClick={openCalendly}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.70)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(0,0,0,0.10)',
                  color: '#374151',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.90)'
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.18)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.70)'
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
                }}
              >
                Book a Consultation
              </button>
            </div>

            <HeroStatsPills className="mt-5" />

            <p className="text-xs text-gray-400 mt-4">
              Free &nbsp;·&nbsp; No obligation &nbsp;·&nbsp; Confidential
            </p>
          </div>

          {/* ── RIGHT — Optimized Spline Robot ──────────────────────── */}
          <div className="w-full md:w-1/2 min-w-0 flex justify-end">
            <div className="w-full h-[320px] md:h-[480px]">
              <SplineScene
                scene={SCENE_URL}
                className="w-full h-full"
              />
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
