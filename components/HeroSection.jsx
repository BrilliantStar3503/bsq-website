'use client'

import { useRouter } from 'next/navigation'
import { SplineScene } from '@/components/ui/spline-scene'
import RotatingHook from '@/components/ui/rotating-hook'

const SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

export default function HeroSection() {
  const router = useRouter()

  return (
    <>
      {/*
        ── Preload hint ───────────────────────────────────────────────────
        Tells the browser to fetch the Spline scene in the background
        as early as possible, cutting perceived load time significantly.
      */}
      <link rel="preload" href={SCENE_URL} as="fetch" crossOrigin="anonymous" />

      <section className="relative bg-gradient-to-b from-[#05060a] to-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10">

          {/* ── LEFT — Text content ──────────────────────────────────── */}
          <div className="w-full md:w-1/2 min-w-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <RotatingHook />
            </h1>

            <p className="text-gray-400 mt-5 max-w-lg">
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
                  boxShadow: '0 6px 28px rgba(237,27,46,0.40)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 36px rgba(237,27,46,0.60)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(237,27,46,0.40)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Run Your 3-Minute Assessment →
              </button>

              {/* SECONDARY CTA */}
              <button
                onClick={() => window.open('https://calendly.com/brilliantstarquartz/30min', '_blank')}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm text-white/80 transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.10)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.30)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                }}
              >
                Book a Consultation
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
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
