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

        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10 relative">

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
