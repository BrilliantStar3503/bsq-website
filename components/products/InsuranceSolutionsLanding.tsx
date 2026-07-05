'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, Check, ShieldCheck, UserCheck, TrendingUp, HeartHandshake } from 'lucide-react'
import { financialGoals, getProductsForGoal } from '@/lib/products'
import { OrganicBackground } from '@/components/ui/organic-background'
import { FeaturedQuoteCard } from '@/components/ui/featured-quote-card'
import { IconTrustStrip } from '@/components/ui/icon-trust-strip'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
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

/* ══════════════════════════════════════════════════════════════════
   INSURANCE SOLUTIONS LANDING PAGE — design-spec implementation
   Sections in approved design order:
     Hero → Financial Goals (5-col) → Recommended Products
     → Why It Matters → CTA Bar → Trust Strip → Consultation
   All business logic, data registry, anchor IDs, and integrations
   are 100% preserved from the prior implementation.
══════════════════════════════════════════════════════════════════ */
export default function InsuranceSolutionsLanding() {
  const router = useRouter()

  return (
    <main style={{ background: '#fff' }}>

      {/* ══════════════════════════════════════════════════
          HERO — text left, family photo right, red organic shape
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#fff' }}>
        <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-20 pb-24 md:pt-28 md:pb-36`}>

          {/* Left — copy */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10">
            <motion.div variants={fadeUp}>
              <SectionEyebrow>Insurance Solutions</SectionEyebrow>
            </motion.div>
            <motion.h1 variants={fadeUp}
              className="font-display text-5xl md:text-[64px] font-semibold text-gray-900 leading-[1.07] tracking-[-0.01em] mb-6">
              Solutions that protect<br />what matters{' '}
              <span className="italic" style={{ color: PRU_RED }}>most</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-gray-500 leading-relaxed max-w-md mb-10">
              Life is full of uncertainties. The right protection today can secure your family&apos;s tomorrow.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3.5">
              <a
                href="#goals"
                className="flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white"
                style={{
                  background: PRU_RED, borderRadius: 999,
                  boxShadow: '0 1px 2px rgba(217,45,32,0.15), 0 12px 24px -6px rgba(217,45,32,0.35)',
                  transition: `all 0.35s ${EASE_PREMIUM.join(',')}`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#B42318'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = PRU_RED; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Choose Your Financial Goal <ArrowRight size={14} />
              </a>
              <button
                onClick={() => router.push('/assessment')}
                className="flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold"
                style={{ background: 'transparent', color: PRU_RED, border: `1.5px solid ${PRU_RED}`, borderRadius: 999, transition: `all 0.35s ${EASE_PREMIUM.join(',')}` }}
                onMouseEnter={e => { e.currentTarget.style.background = PRU_RED; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = PRU_RED; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Take the Financial Assessment
              </button>
            </motion.div>
          </motion.div>

          {/* Right — photo with red organic shape */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE_PREMIUM, delay: 0.15 }}
            className="relative aspect-[4/3] lg:aspect-[5/4]"
          >
            {/* Desktop: organic shape behind + photo card on top */}
            <div className="hidden lg:block absolute inset-0">
              <OrganicBackground variant="hero-wrap" color="#D92D20" colorDark="#9A1D13" />
              <div
                className="absolute z-10 overflow-hidden"
                style={{
                  inset: '5% 4% 5% 16%',
                  borderRadius: 20,
                  background: 'linear-gradient(160deg, #b83232 0%, #7a1515 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.10), 0 32px 56px -12px rgba(0,0,0,0.32)',
                }}
              >
                {/* PLACEHOLDER — swap for <Image> once family photo asset is provided */}
                <div className="w-full h-full flex items-end justify-center pb-6">
                  <span className="text-[11px] font-semibold text-white/70 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    Photo placeholder — family imagery
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile/tablet: standalone card */}
            <div
              className="lg:hidden absolute inset-0 overflow-hidden"
              style={{
                borderRadius: 24,
                background: 'linear-gradient(160deg, #b83232 0%, #7a1515 100%)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 24px 40px -12px rgba(0,0,0,0.22)',
              }}
            >
              <div className="w-full h-full flex items-end justify-center pb-6">
                <span className="text-[11px] font-semibold text-white/70 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  Photo placeholder — family imagery
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FINANCIAL GOALS — 5-column grid, two-col heading
      ══════════════════════════════════════════════════ */}
      <section id="goals" style={{ background: '#fff', scrollMarginTop: 80 }}>
        <div className={`${CONTAINER} py-24 md:py-32`}>

          {/* Section heading: H2 left, description right */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-14"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE_PREMIUM }}
          >
            <div>
              <SectionEyebrow>Start Here</SectionEyebrow>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 tracking-[-0.01em]">
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
          <div className="mt-28 space-y-20">
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
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHY IT MATTERS — red panel, quote card right
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: PRU_RED }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: 64, transform: 'translateY(-1px)' }}>
          <OrganicBackground variant="wave-divider" color="#ffffff" />
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 900px 700px at 15% 15%, rgba(255,255,255,0.10), transparent 60%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 700px 600px at 90% 100%, rgba(0,0,0,0.14), transparent 55%)' }} />

        <div className={`${CONTAINER} relative py-24 md:py-32`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE_PREMIUM }}>
              <SectionEyebrow tone="white">Why It Matters</SectionEyebrow>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-white leading-[1.12] tracking-[-0.01em] mb-6">
                A plan today, peace of mind for a lifetime.
              </h2>
              <p className="text-base text-white leading-relaxed max-w-md mb-9 font-medium">
                Insurance is not about expecting the unexpected. It&apos;s about being ready for it.
              </p>
              <ul className="space-y-4">
                {['Protect your loved ones', 'Secure your financial future', 'Live life with confidence'].map((item, i) => (
                  <motion.li key={item} className="flex items-center gap-3.5 text-white"
                    initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE_PREMIUM, delay: 0.1 + i * 0.08 }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(255,255,255,0.16)' }}>
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span className="text-[15px] font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.12 }}>
              <FeaturedQuoteCard
                quote="The best time to plan for tomorrow is today. Let's build a plan that protects what matters most to you."
                name="Christopher Garcia"
                title="Area Manager, Pru Life UK"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BAR — single "Book a Free Consultation" button
      ══════════════════════════════════════════════════ */}
      <section style={{ background: GRAY_BG }}>
        <div className={`${CONTAINER} py-16 md:py-20`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE_PREMIUM }}
            className="rounded-2xl px-7 py-6 lg:px-10 lg:py-7 flex flex-col lg:flex-row items-center justify-between gap-6"
            style={{ background: '#ffffff', boxShadow: '0 1px 2px rgba(16,24,40,0.04), 0 8px 24px -8px rgba(16,24,40,0.08)' }}
          >
            <div className="flex items-center gap-4 text-center lg:text-left">
              <div className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center shrink-0"
                style={{ background: '#fef2f2' }}>
                <MessageCircle size={18} style={{ color: PRU_RED }} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900 mb-0.5">Not sure where to start?</p>
                <p className="text-sm text-gray-500">Let&apos;s talk about your goals. We&apos;ll guide you to the right solution.</p>
              </div>
            </div>
            <a
              href="#appointment"
              className="flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white shrink-0 w-full lg:w-auto"
              style={{
                background: PRU_RED, borderRadius: 8,
                boxShadow: '0 1px 2px rgba(217,45,32,0.15), 0 8px 20px -4px rgba(217,45,32,0.28)',
                transition: `background 0.2s`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#B42318' }}
              onMouseLeave={e => { e.currentTarget.style.background = PRU_RED }}
            >
              Book a Free Consultation <ArrowRight size={14} />
            </a>
          </motion.div>

          {/* Trust strip — 4-item icon row */}
          <motion.div className="mt-16"
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
