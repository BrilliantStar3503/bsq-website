'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TestimonialCard } from '@/components/ui/testimonial-card'
import { Star } from 'lucide-react'

/* ══════════════════════════════════════════════════════════════════════════
   TESTIMONIALS WITH MARQUEE — BSQ Financial · PRU Life UK Brand
   ══════════════════════════════════════════════════════════════════════════ */

const PRU_RED = '#ed1b2e'

/* ─── BSQ Testimonials ──────────────────────────────────────────────── */
const testimonials = [
  {
    author: {
      name: 'Maria Santos',
      handle: 'Young Professional',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    },
    text: "I didn't realize how unprotected I was until I had my financial gap analysis. Now I have peace of mind knowing my family is secured.",
  },
  {
    author: {
      name: 'James Cruz',
      handle: 'Business Owner',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    text: 'Clear, honest, and very professional. I finally understand how insurance actually works for my long-term goals.',
  },
  {
    author: {
      name: 'Angela Reyes',
      handle: 'OFW',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    },
    text: "Being away from my family is hard, but having the right protection gives me confidence that they're safe no matter what happens.",
  },
  {
    author: {
      name: 'Mark De Leon',
      handle: 'Father of Two',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
    text: "This isn't just insurance — it's a real financial plan. I now have a clear path for my children's future.",
  },
  {
    author: {
      name: 'Carla Mendoza',
      handle: 'Nurse Abroad',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    text: 'The advisor took the time to explain everything clearly. I trust BSQ to protect my future even while I work overseas.',
  },
  {
    author: {
      name: 'Paolo Villanueva',
      handle: 'Freelancer',
      avatar:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
    },
    text: 'As a freelancer with no employer benefits, BSQ helped me build the protection I always needed but never had.',
  },
]

/* ─── Duplicate for seamless infinite loop ──────────────────────────── */
const DOUBLED = [...testimonials, ...testimonials]

/* ─── FadeUp helper ─────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════════════════════════ */
export default function TestimonialsWithMarquee() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: '#f8fafc' }}
    >
      {/* Subtle top/bottom fade masks */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28"
        style={{ background: 'linear-gradient(to right, #f8fafc, transparent)' }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28"
        style={{ background: 'linear-gradient(to left, #f8fafc, transparent)' }}
      />

      {/* ── Section header ─────────────────────────────────────────── */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 md:px-12 text-center mb-14">
        <FadeUp>
          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={PRU_RED} style={{ color: PRU_RED }} />
            ))}
          </div>

          <p
            className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3"
            style={{ color: PRU_RED }}
          >
            Client Stories
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
            Trusted by Filipinos.<br />
            <span className="text-gray-400 font-light">Proven by results.</span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg mx-auto">
            Real people. Real protection. See how BSQ has helped individuals and
            families secure their financial future with Pru Life UK.
          </p>
        </FadeUp>
      </div>

      {/* ── Marquee row 1 (left → right pause on hover) ─────────────── */}
      <FadeUp delay={0.1}>
        <div className="relative mb-5 flex overflow-hidden">
          <div className="flex gap-5 animate-marquee hover:[animation-play-state:paused]">
            {DOUBLED.map((t, i) => (
              <TestimonialCard key={`r1-${i}`} author={t.author} text={t.text} />
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Marquee row 2 (right → left) ─────────────────────────────── */}
      <FadeUp delay={0.18}>
        <div className="relative flex overflow-hidden">
          <div className="flex gap-5 animate-marquee-reverse hover:[animation-play-state:paused]">
            {[...DOUBLED].reverse().map((t, i) => (
              <TestimonialCard key={`r2-${i}`} author={t.author} text={t.text} />
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <FadeUp delay={0.25}>
        <div className="relative z-20 text-center mt-14">
          <p className="text-xs text-gray-400 mb-5">
            Join hundreds of Filipinos who took control of their financial future
          </p>
          <a
            href="/assessment"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm text-white transition-all duration-200 hover:scale-[1.04]"
            style={{
              background: `linear-gradient(135deg, ${PRU_RED}, #c1121f)`,
              boxShadow: `0 8px 28px ${PRU_RED}45`,
            }}
          >
            Start Your Free Assessment →
          </a>
        </div>
      </FadeUp>
    </section>
  )
}
