'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, Check, ShieldCheck, UserCheck, TrendingUp, HeartHandshake, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { financialGoals, getProductsForGoal } from '@/lib/products'
import { IconTrustStrip } from '@/components/ui/icon-trust-strip'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { SectionBridge } from '@/components/design-system/SectionBridge'
import { PremiumContainer } from '@/components/design-system/PremiumContainer'
import GoalCard from './GoalCard'
import ProductCard from './ProductCard'
import ProductAppointmentSection from './ProductAppointmentSection'

const PRU_RED   = '#D92D20'
const GRAY_BG   = '#f5f5f5'
const GRAY_LINE = '#e5e7eb'
const CONTAINER = 'max-w-[1320px] mx-auto px-6 md:px-10'

const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_PREMIUM } },
}
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const TRUST_ITEMS = [
  { icon: ShieldCheck,    title: 'Trusted by Millions',  description: 'Pru Life UK has been protecting lives for over 175 years.' },
  { icon: UserCheck,      title: 'Tailored for You',      description: 'Solutions designed around your goals and life stage.' },
  { icon: TrendingUp,     title: 'Global Strength',       description: 'Backed by Prudential plc, a leader in financial services.' },
  { icon: HeartHandshake, title: "We're Here for You",    description: "Your partner in life's journey, every step of the way." },
]

const HERO_SLIDES = [
  { src: '/images/products/pru-million-protect-hero.jpg',            pos: 'center center' },
  { src: '/images/products/pru-million-protect-3-hero.jpg',          pos: 'center center' },
  { src: '/images/products/pru-million-protect-4-hero.jpg',          pos: 'center center' },
  { src: '/images/products/prulink-assurance-account-plus-hero.jpg', pos: 'center center' },
  { src: '/images/products/prulifetime-income-2.jpg',                pos: 'center center' },
]

function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [hovered, setHovered] = useState(false)

  const prev = useCallback(() => setCurrent(c => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), [])
  const next = useCallback(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), [])

  useEffect(() => {
    if (hovered) return
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [hovered, next])

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ borderRadius: 32, aspectRatio: '4/5', boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {HERO_SLIDES.map(({ src, pos }, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`Insurance solutions — photo ${i + 1}`}
            fill
            className="object-cover"
            style={{ objectPosition: pos }}
            priority={i === 0}
            quality={90}
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>
      ))}

      {/* Soft red accent in bottom-right corner */}
      <div className="absolute bottom-0 right-0 w-2/3 h-2/3 pointer-events-none" style={{ zIndex: 2,
        background: 'radial-gradient(ellipse at bottom right, rgba(217,45,32,0.22) 0%, transparent 70%)' }} />

      {/* Prev / Next */}
      <button onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
        style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.2)', opacity: hovered ? 1 : 0 }}
        aria-label="Previous photo">
        <ChevronLeft size={18} className="text-white" />
      </button>
      <button onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
        style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.2)', opacity: hovered ? 1 : 0 }}
        aria-label="Next photo">
        <ChevronRight size={18} className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2 z-30">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Photo ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? 22 : 6,
              height: 6,
              borderRadius: 3,
              background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   INSURANCE SOLUTIONS LANDING PAGE — design-spec implementation
   Sections in approved design order:
     Hero → Financial Goals (5-col) → Recommended Products
     → Why It Matters → CTA Bar → Trust Strip → Consultation
   All business logic, data registry, anchor IDs, and integrations
   are 100% preserved from the prior implementation.
══════════════════════════════════════════════════════════════════ */

function WhyItMattersAvatar() {
  return (
    <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-base font-black text-white"
      style={{ background: `linear-gradient(135deg, #D92D20, #c1121f)` }}>
      CG
    </div>
  )
}

export default function InsuranceSolutionsLanding() {
  const router = useRouter()

  return (
    <main style={{ background: '#fff' }}>

      {/* ══════════════════════════════════════════════════
          HERO — premium editorial: text left, carousel right
      ══════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background accent — large soft circle behind carousel */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', right: '-8%', top: '5%',
            width: 680, height: 680, borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(217,45,32,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className={`${CONTAINER} pt-24 pb-20 md:pt-32 md:pb-28`}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-14 lg:gap-20 items-center">

            {/* ── Left: editorial text ── */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp}>
                <SectionEyebrow>Insurance Solutions</SectionEyebrow>
              </motion.div>
              <motion.h1 variants={fadeUp}
                className="font-display text-5xl md:text-[62px] font-black text-gray-900 leading-[1.05] tracking-[-0.02em] mb-8 mt-6">
                Solutions that protect<br />what matters{' '}
                <span className="italic" style={{ color: PRU_RED }}>most</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base md:text-[17px] text-gray-500 leading-relaxed max-w-[420px] mb-12">
                Life is full of uncertainties. The right protection today can secure your family&apos;s tomorrow.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#goals"
                  className="flex items-center justify-center gap-2 px-8 py-4 text-[13px] font-bold text-white"
                  style={{
                    background: PRU_RED, borderRadius: 999,
                    boxShadow: '0 1px 2px rgba(217,45,32,0.15), 0 12px 24px -6px rgba(217,45,32,0.35)',
                    transition: `all 0.35s ${EASE_PREMIUM.join(',')}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#B42318'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = PRU_RED; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  Choose Your Financial Goal <ArrowRight size={14} />
                </a>
                <button
                  onClick={() => router.push('/assessment')}
                  className="flex items-center justify-center gap-2 px-8 py-4 text-[13px] font-bold"
                  style={{ background: 'transparent', color: PRU_RED, border: `1.5px solid ${PRU_RED}`, borderRadius: 999, transition: `all 0.35s ${EASE_PREMIUM.join(',')}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = PRU_RED; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = PRU_RED; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  Take the Financial Assessment
                </button>
              </motion.div>
            </motion.div>

            {/* ── Right: carousel card ── */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18, ease: EASE_PREMIUM }}
            >
              <HeroCarousel />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SIGNATURE RED BRIDGE — hero → financial goals
          Red background band with white→red curve at top,
          red→gray curve at bottom. PremiumContainer floats
          on the red background as the PRUBSQ signature.
      ══════════════════════════════════════════════════ */}
      <div style={{ background: PRU_RED }}>

        {/* Top: hero white curves seamlessly into red */}
        <SectionBridge fromColor="#ffffff" toColor={PRU_RED} height={80} accent accentColor="rgba(255,255,255,0.18)" />

        {/* Goals container anchored inside red band */}
        <div id="goals" style={{ scrollMarginTop: 80, paddingTop: 16, paddingBottom: 48 }}>
          <PremiumContainer overlapTop={0} padding="56px 52px 72px" maxWidth="1320px">

          {/* Section heading: H2 left, description right */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-end mb-14"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE_PREMIUM }}
          >
            <div>
              <SectionEyebrow>Start Here</SectionEyebrow>
              <h2 className="font-display text-4xl md:text-5xl font-black text-gray-900 tracking-[-0.01em]">
                What is your{' '}
                <span className="italic" style={{ color: PRU_RED }}>financial goal?</span>
              </h2>
            </div>
            <p className="text-base text-gray-500 leading-relaxed">
              Everyone&apos;s journey is different. Choose the goal closest to your situation so we can recommend the right solutions for you.
            </p>
          </motion.div>

          {/* 5 goal cards — single row at desktop */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-40px' }} variants={stagger}
          >
            {financialGoals.map(goal => (
              <motion.div key={goal.id} variants={fadeUp}>
                <GoalCard goal={goal} compact />
              </motion.div>
            ))}
          </motion.div>

          {/* Recommended solutions — continuous beat, anchored by goal id */}
          <div className="mt-20 space-y-20">
            {financialGoals.map(goal => {
              const goalProducts = getProductsForGoal(goal.id)
              if (goalProducts.length === 0) return null
              return (
                <div key={goal.id} id={goal.id} style={{ scrollMarginTop: 80 }}>
                  <motion.div className="mb-8 pb-7" style={{ borderBottom: `1px solid ${GRAY_LINE}` }}
                    initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE_PREMIUM }}>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: PRU_RED }}>
                      Recommended for: {goal.label}
                    </h3>
                    <p className="text-sm text-gray-500 max-w-xl">{goal.description}</p>
                  </motion.div>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-7"
                    initial="hidden" whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }} variants={stagger}
                  >
                    {goalProducts.map(product => (
                      <motion.div key={product.id} variants={fadeUp}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )
            })}
          </div>

        </PremiumContainer>
        </div>{/* /goals */}

        {/* Bottom: red curves seamlessly into gray */}
        <SectionBridge fromColor={PRU_RED} toColor={GRAY_BG} height={80} />

      </div>{/* /red bridge */}

      {/* ══════════════════════════════════════════════════
          WHY IT MATTERS — one premium editorial composition
      ══════════════════════════════════════════════════ */}
      <section style={{ background: GRAY_BG }}>
        <div className={`${CONTAINER} pt-20 pb-10 md:pt-28 md:pb-14`}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE_PREMIUM }}
            className="overflow-hidden"
            style={{
              borderRadius: 24,
              boxShadow: '0 4px 8px rgba(0,0,0,0.04), 0 16px 56px rgba(0,0,0,0.12), 0 64px 120px rgba(0,0,0,0.08)',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 420 }}>

              {/* ── Left: red editorial panel ── */}
              <div className="relative flex flex-col justify-center p-14 md:p-20" style={{ background: PRU_RED }}>
                {/* Subtle grid texture */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                  backgroundSize: '36px 36px',
                }} />
                {/* Soft radial vignette for depth */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'radial-gradient(ellipse 80% 70% at 20% 30%, rgba(255,255,255,0.07) 0%, transparent 60%)',
                }} />
                <div className="relative">
                  <SectionEyebrow tone="white">Why It Matters</SectionEyebrow>
                  <h2 className="font-display text-4xl md:text-5xl lg:text-[54px] font-black text-white leading-[1.07] tracking-[-0.02em] mb-8">
                    A plan today, peace of mind for a lifetime.
                  </h2>
                  <p className="text-[15px] text-white/75 leading-relaxed mb-12 max-w-sm">
                    Insurance is not about expecting the unexpected. It&apos;s about being ready for it.
                  </p>
                  <ul className="space-y-5">
                    {['Protect your loved ones', 'Secure your financial future', 'Live life with confidence'].map((item, i) => (
                      <motion.li key={item} className="flex items-center gap-4 text-white"
                        initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE_PREMIUM, delay: 0.15 + i * 0.08 }}>
                        <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(255,255,255,0.18)' }}>
                          <Check size={14} strokeWidth={2.5} />
                        </span>
                        <span className="text-[15px] font-medium">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── Right: white testimonial panel — vertically centered ── */}
              <div className="flex items-center p-14 md:p-20" style={{ background: '#ffffff' }}>
                <motion.div className="w-full"
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE_PREMIUM, delay: 0.12 }}
                >
                  {/* Oversized quote mark */}
                  <svg width="52" height="39" viewBox="0 0 32 24" fill="none" style={{ color: PRU_RED }} className="mb-9" aria-hidden="true">
                    <path d="M0 24V13.714C0 9.143 1.143 5.714 3.429 3.429C5.714 1.143 8.571 0 12 0V5.143C9.714 5.143 8 5.714 6.857 6.857C5.714 8 5.143 9.714 5.143 12H12V24H0ZM20 24V13.714C20 9.143 21.143 5.714 23.429 3.429C25.714 1.143 28.571 0 32 0V5.143C29.714 5.143 28 5.714 26.857 6.857C25.714 8 25.143 9.714 25.143 12H32V24H20Z" fill="currentColor" />
                  </svg>

                  {/* Quote */}
                  <p className="text-2xl md:text-[28px] lg:text-3xl font-bold text-gray-900 leading-[1.32] mb-12 tracking-[-0.015em]">
                    The best time to plan for tomorrow is today. Let&apos;s build a plan that protects what matters most to you.
                  </p>

                  {/* Author — separated with a fine rule */}
                  <div className="pt-7" style={{ borderTop: '1px solid #f0f0f0' }}>
                    <div className="flex items-center gap-5">
                      <WhyItMattersAvatar />
                      <div>
                        <p className="text-[15px] font-bold text-gray-900 mb-0.5">Christopher Garcia</p>
                        <p className="text-[13px] text-gray-400 mb-1">Area Manager</p>
                        <p className="text-[13px] font-bold tracking-[0.01em]" style={{ color: PRU_RED }}>Pru Life UK</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BAR + TRUST STRIP
      ══════════════════════════════════════════════════ */}
      <section style={{ background: GRAY_BG }}>
        <div className={`${CONTAINER} pt-10 pb-20 md:pt-12 md:pb-28`}>

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE_PREMIUM }}
            className="overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 px-8 py-7 lg:px-12 lg:py-9"
            style={{
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 2px 4px rgba(0,0,0,0.03), 0 8px 32px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.05)',
              border: `1px solid ${GRAY_LINE}`,
              position: 'relative',
            }}
          >
            {/* Left red accent bar */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: 4, background: PRU_RED, borderRadius: '4px 0 0 4px',
              }}
            />

            <div className="flex items-center gap-5 text-center lg:text-left">
              <div className="hidden lg:flex w-12 h-12 rounded-[14px] items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(150deg, #fef2f2, #fde0df)' }}>
                <MessageCircle size={20} style={{ color: PRU_RED }} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900 mb-1">Not sure where to start?</p>
                <p className="text-sm text-gray-500 leading-relaxed">Let&apos;s talk about your goals. We&apos;ll guide you to the right solution.</p>
              </div>
            </div>

            <a
              href="#appointment"
              className="flex items-center justify-center gap-2 px-8 py-3.5 text-[13px] font-bold text-white shrink-0 w-full lg:w-auto"
              style={{
                background: PRU_RED,
                borderRadius: 999,
                boxShadow: '0 1px 2px rgba(217,45,32,0.15), 0 8px 20px -4px rgba(217,45,32,0.32)',
                transition: `all 0.25s ${EASE_PREMIUM.join(',')}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#B42318'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = PRU_RED; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Book a Free Consultation <ArrowRight size={14} />
            </a>
          </motion.div>

          {/* Trust strip — separated with a line and extra breathing room */}
          <motion.div
            className="mt-16 pt-16"
            style={{ borderTop: `1px solid ${GRAY_LINE}` }}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE_PREMIUM, delay: 0.1 }}>
            <IconTrustStrip items={TRUST_ITEMS} />
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CONSULTATION FORM — goal-agnostic booking
      ══════════════════════════════════════════════════ */}
      <ProductAppointmentSection />

      {/* ══════════════════════════════════════════════════
          COMPLIANCE FOOTER NOTE
      ══════════════════════════════════════════════════ */}
      <div style={{ background: '#f9f9f9', borderTop: `1px solid ${GRAY_LINE}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Insurance solutions referenced on this page are underwritten by PRU Life Insurance
            Corporation of UK. All product details are for informational purposes only. Benefits
            are subject to policy terms and conditions, eligibility, and underwriting approval.
            Brilliant Star Quartz (BSQ) is a tied-branch and area of PRU Life UK with its
            headquarters located at PRU House, Ortigas Center, Pasig City.
          </p>
        </div>
      </div>
    </main>
  )
}
