'use client'

import { useRouter } from 'next/navigation'
import { SplineScene } from './ui/splite'
import { GlowButton } from './ui/glow-button'

export default function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative bg-gradient-to-b from-[#05060a] to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10">

        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 min-w-0">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Know Exactly How Financially Protected{' '}
            <span className="text-red-500">Your Family Is</span>
          </h1>

          <p className="text-gray-400 mt-5 max-w-lg">
            Our system analyzes your income, coverage, and goals to detect gaps —
            and show what needs attention.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {/* PRIMARY — go to assessment */}
            <GlowButton
              variant="primary"
              spread={38}
              proximity={70}
              inactiveZone={0.25}
              borderWidth={2}
              onClick={() => {
                console.log('Assessment CTA clicked')
                router.push('/assessment')
              }}
            >
              Run Your 3-Minute Assessment →
            </GlowButton>

            {/* SECONDARY — open Messenger */}
            <GlowButton
              variant="secondary"
              spread={32}
              proximity={60}
              inactiveZone={0.3}
              borderWidth={1}
              onClick={() => {
                window.open('https://calendly.com/brilliantstarquartz/30min', '_blank')
              }}
            >
              Book a Consultation
            </GlowButton>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Free • No obligation • Confidential
          </p>
        </div>

        {/* RIGHT SIDE — ROBOT */}
        <div className="w-full md:w-1/2 min-w-0 flex justify-end">
          <div className="w-full h-[320px] md:h-[480px]">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>

      </div>
    </section>
  )
}
