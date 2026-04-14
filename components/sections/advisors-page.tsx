'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Brain,
  ShieldCheck,
  TrendingUp,
  Users,
  Lightbulb,
  BarChart2,
  CalendarCheck,
  Presentation,
} from 'lucide-react'

/* ─── Design tokens ─────────────────────────────────────────────────── */
const RED = '#ed1b2e'

/* ─── Reusable fade-up animation ────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Advisor data ───────────────────────────────────────────────────── */
/* Replace `photo` paths with actual advisor images in /public/images/advisors/ */
const ADVISORS = [
  {
    name: 'Chris Garcia',
    role: 'Founder & Senior Financial Advisor',
    initials: 'CG',
    photo: '/images/advisors/chris-garcia.jpg',
    accent: RED,
  },
  {
    name: 'Virginia Garcia',
    role: 'Licensed Financial Advisor',
    initials: 'VG',
    photo: '/images/advisors/virginia-garcia.jpg',
    accent: '#1a1a1a',
  },
  {
    name: 'Samantha Alonso',
    role: 'Licensed Financial Advisor',
    initials: 'SA',
    photo: '/images/advisors/samantha-alonso.jpg',
    accent: '#1a1a1a',
  },
]

/* ─── Activity data ──────────────────────────────────────────────────── */
const ACTIVITIES = [
  {
    icon: CalendarCheck,
    label: 'Client Consultations',
    sub: 'One-on-one sessions tailored to each client\'s goals.',
    bg: '#0f0f0f',
  },
  {
    icon: Presentation,
    label: 'Financial Presentations',
    sub: 'Clear, data-backed plans presented with confidence.',
    bg: '#111827',
  },
  {
    icon: BarChart2,
    label: 'Portfolio Reviews',
    sub: 'Regular check-ins to keep financial plans on track.',
    bg: '#0f0f0f',
  },
  {
    icon: Users,
    label: 'Team Strategy',
    sub: 'Collaborative planning sessions across the advisory team.',
    bg: '#111827',
  },
]

/* ─── Advisor card ───────────────────────────────────────────────────── */
function AdvisorCard({
  name,
  role,
  initials,
  photo,
  accent,
  delay,
}: (typeof ADVISORS)[0] & { delay: number }) {
  return (
    <FadeUp delay={delay}>
      <div
        className="group rounded-2xl overflow-hidden bg-white transition-all duration-300"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.07)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'translateY(-4px)'
          el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.10)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
        }}
      >
        {/* Photo / Monogram */}
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '1 / 1', background: '#f3f4f6' }}
        >
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover object-top"
            onError={(e) => {
              // hide broken image — monogram shows underneath
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
          {/* Monogram fallback — hidden when photo loads */}
          <div
            className="absolute inset-0 flex items-center justify-center select-none"
            style={{ background: `linear-gradient(135deg, ${accent === RED ? '#7f0000' : '#18181b'}, ${accent})` }}
          >
            <span
              className="font-semibold tracking-widest text-white/80"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.12em' }}
            >
              {initials}
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="px-5 py-4">
          <p className="text-gray-900 font-semibold text-[15px] leading-snug">{name}</p>
          <p className="text-gray-400 text-[13px] mt-0.5 font-medium">{role}</p>
        </div>
      </div>
    </FadeUp>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function AdvisorsPage() {
  return (
    <div style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-center min-h-screen overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #1a0505 100%)',
        }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Red accent glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${RED}22 0%, transparent 70%)`,
            top: '-10%',
            right: '-5%',
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-32">
          <FadeUp delay={0.1}>
            <span
              className="inline-block text-xs font-semibold tracking-[0.22em] uppercase mb-6"
              style={{ color: RED }}
            >
              BSQ Financial Advisory
            </span>
          </FadeUp>

          <FadeUp delay={0.2}>
            <h1
              className="font-bold text-white leading-[1.08] tracking-tight"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', maxWidth: 700 }}
            >
              Human Expertise.{' '}
              <span style={{ color: RED }}>Powered by</span>{' '}
              Intelligence.
            </h1>
          </FadeUp>

          <FadeUp delay={0.35}>
            <p
              className="text-white/55 mt-6 font-light leading-relaxed"
              style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', maxWidth: 480 }}
            >
              Meet the advisors behind the system — licensed professionals
              who combine deep financial knowledge with AI-powered insights.
            </p>
          </FadeUp>

          <FadeUp delay={0.5}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:gap-3"
                style={{ background: RED, boxShadow: `0 4px 24px ${RED}55` }}
              >
                Start Your Assessment
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <a
                href="#advisors"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white/70 border border-white/15 hover:border-white/30 hover:text-white transition-all duration-200"
              >
                Meet the Team
              </a>
            </div>
          </FadeUp>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #fff)' }}
        />
      </section>

      {/* ── 2. TRUST / POSITIONING ─────────────────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <FadeIn>
          <div className="max-w-[700px] mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ background: `${RED}10`, color: RED }}
            >
              <Brain size={12} />
              Human + AI Advisory
            </div>

            <h2
              className="font-bold text-gray-900 tracking-tight leading-snug"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}
            >
              Great financial decisions start with the right people.
            </h2>

            <p
              className="text-gray-500 mt-5 leading-relaxed font-light"
              style={{ fontSize: '1.05rem' }}
            >
              Every BSQ advisor is a licensed PRU Life UK professional trained to understand your
              complete financial picture. Our proprietary assessment engine surfaces insights humans
              alone would miss — but it&apos;s always a real advisor who guides your next step.
            </p>

            {/* Stat row */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { value: 'MDRT', label: 'Qualified Advisors' },
                { value: '500+', label: 'Clients Served' },
                { value: '100%', label: 'Licensed & Regulated' },
              ].map((s, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="text-center">
                    <p
                      className="font-bold text-gray-900"
                      style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}
                    >
                      {s.value}
                    </p>
                    <p className="text-gray-400 text-xs font-medium mt-1 tracking-wide uppercase">
                      {s.label}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── 3. FEATURED ADVISORS ───────────────────────────────────────── */}
      <section
        id="advisors"
        className="py-24 px-6"
        style={{ background: '#fafafa' }}
      >
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="mb-14 text-center">
              <p
                className="text-xs font-semibold tracking-[0.22em] uppercase mb-3"
                style={{ color: RED }}
              >
                Our Team
              </p>
              <h2
                className="font-bold text-gray-900 tracking-tight"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
              >
                The advisors behind your plan.
              </h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ADVISORS.map((advisor, i) => (
              <AdvisorCard key={advisor.name} {...advisor} delay={i * 0.1} />
            ))}
          </div>

          <FadeIn delay={0.4}>
            <p className="text-center text-gray-400 text-sm mt-10">
              All advisors are licensed professionals under PRU Life UK.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 4. REAL WORK / ACTIVITY ────────────────────────────────────── */}
      <section className="bg-white py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="mb-12 text-center">
              <p
                className="text-xs font-semibold tracking-[0.22em] uppercase mb-3"
                style={{ color: RED }}
              >
                How We Work
              </p>
              <h2
                className="font-bold text-gray-900 tracking-tight"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
              >
                Advice that shows up in real life.
              </h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ACTIVITIES.map(({ icon: Icon, label, sub, bg }, i) => (
              <FadeUp key={label} delay={i * 0.08}>
                <div
                  className="rounded-2xl p-6 flex flex-col gap-4 h-full transition-transform duration-300 hover:-translate-y-1"
                  style={{ background: bg }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${RED}20` }}
                  >
                    <Icon size={18} style={{ color: RED }} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm leading-snug">{label}</p>
                    <p className="text-white/45 text-xs mt-1.5 leading-relaxed font-light">{sub}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HUMAN + AI ──────────────────────────────────────────────── */}
      <section
        className="py-24 px-6"
        style={{ background: '#fafafa' }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — visual mock */}
          <FadeUp delay={0.1}>
            <div
              className="rounded-3xl overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0505 100%)',
                aspectRatio: '4 / 3',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Subtle grid */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              {/* Mock UI */}
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-5 p-8">
                {/* Assessment card mock */}
                <div
                  className="w-full rounded-2xl p-5"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${RED}25` }}
                    >
                      <BarChart2 size={14} style={{ color: RED }} />
                    </div>
                    <div>
                      <div className="w-24 h-2.5 rounded-full bg-white/20" />
                      <div className="w-16 h-2 rounded-full bg-white/10 mt-1.5" />
                    </div>
                  </div>

                  {/* Bar chart mock */}
                  <div className="flex items-end gap-2 h-16">
                    {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background:
                            i === 5
                              ? RED
                              : 'rgba(255,255,255,0.12)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Score badge */}
                <div className="flex gap-3 w-full">
                  {[
                    { label: 'Risk Score', value: 'Low', color: '#22c55e' },
                    { label: 'Coverage', value: '87%', color: RED },
                    { label: 'Readiness', value: 'Good', color: '#f59e0b' },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex-1 rounded-xl p-3 text-center"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <p style={{ color, fontSize: 13, fontWeight: 700 }}>{value}</p>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 2 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Right — text */}
          <div className="flex flex-col gap-6">
            <FadeUp delay={0.15}>
              <span
                className="text-xs font-semibold tracking-[0.22em] uppercase"
                style={{ color: RED }}
              >
                AI-Powered Insight
              </span>
            </FadeUp>

            <FadeUp delay={0.25}>
              <h2
                className="font-bold text-gray-900 tracking-tight leading-snug"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}
              >
                Every recommendation is backed by your data.
              </h2>
            </FadeUp>

            <FadeUp delay={0.35}>
              <p className="text-gray-500 leading-relaxed font-light text-[1.02rem]">
                Our financial assessment engine analyzes your income, goals, risk tolerance, and
                coverage gaps — in minutes. Your advisor then uses these insights to craft a plan
                that&apos;s genuinely built around you, not a template.
              </p>
            </FadeUp>

            <FadeUp delay={0.45}>
              <div className="flex flex-col gap-3 mt-2">
                {[
                  { icon: Brain, text: 'AI-analyzed financial profile' },
                  { icon: ShieldCheck, text: 'Coverage gap identification' },
                  { icon: TrendingUp, text: 'Goal-aligned product matching' },
                  { icon: Lightbulb, text: 'Human advisor final review' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${RED}12` }}
                    >
                      <Icon size={13} style={{ color: RED }} strokeWidth={2} />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.55}>
              <Link
                href="/assessment"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold transition-gap duration-200 hover:gap-3"
                style={{ color: RED }}
              >
                Take the assessment
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 6. CTA ─────────────────────────────────────────────────────── */}
      <section
        className="py-32 px-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #18080a 60%, #0f0f0f 100%)',
        }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${RED}18 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <FadeUp delay={0.1}>
            <p
              className="text-xs font-semibold tracking-[0.22em] uppercase mb-5"
              style={{ color: RED }}
            >
              Begin Today
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <h2
              className="font-bold text-white tracking-tight leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)' }}
            >
              Start Your Financial Clarity.
            </h2>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p
              className="text-white/45 mt-5 font-light leading-relaxed"
              style={{ fontSize: '1.05rem' }}
            >
              A free, AI-powered assessment. A real advisor to walk you through it.
              No pressure. No obligation.
            </p>
          </FadeUp>

          <FadeUp delay={0.45}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:gap-3 hover:scale-[1.02]"
                style={{
                  background: RED,
                  boxShadow: `0 6px 32px ${RED}55`,
                }}
              >
                Take Assessment
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
