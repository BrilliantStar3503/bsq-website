'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, ClipboardList, Check, ShieldCheck, UserCheck, Globe2, HeartHandshake, Heart } from 'lucide-react'
import { financialGoals, getProductsForGoal } from '@/lib/products'
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button'
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

// One easing curve, used everywhere — the "signature feel" of this
// design system. A gentle expo-out: quick to start, settles softly,
// never bounces or overshoots.
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
  { icon: ShieldCheck,   title: 'Trusted Protection',  description: 'Backed by PRU Life UK, part of the Prudential plc network.' },
  { icon: UserCheck,     title: 'Tailored for You',     description: 'Solutions designed around your goals and life stage.' },
  { icon: Globe2,        title: 'Global Strength',      description: 'Backed by a leader in financial services, built for the long term.' },
  { icon: HeartHandshake,title: "We're Here for You",   description: "Your partner in life's journey, every step of the way." },
]

/* ══════════════════════════════════════════════════════════════════
   INSURANCE SOLUTIONS LANDING PAGE
   The homepage of the entire Insurance Solutions experience — not a
   product listing. Goal-first: visitors choose a financial goal before
   ever seeing a plan name. Sections render in the APPROVED order
   (Hero → Why Financial Planning Matters → Choose Your Goal →
   Recommended Solutions, grouped by goal → Not Sure? → Consultation) —
   this order is an architectural decision validated against the
   "I know I need security → why does planning matter → which goal →
   what solutions" conversation flow during the Phase 3/4 review, and
   is preserved here even though the visual-direction mockup happened
   to show goal cards before the "Why It Matters" panel.

   This file is a visual-craftsmanship pass on top of the prior visual
   redesign — same sections, same order, same data, same registry-
   driven rendering. Refinements: one consistent container width across
   every section (was 1320px in the hero/panel, 1152px in the goal
   section, 1024px in the CTA bar — now 1320px throughout, so margins
   line up site-wide), one shared easing curve, layered-surface shadows
   in place of heavier blurs, and generally more room to breathe.

   Fully registry-driven: every goal, every recommended product, and
   every anchor id comes from lib/products.ts. Adding a 6th financial
   goal or a 6th product requires no changes here.
══════════════════════════════════════════════════════════════════ */
export default function InsuranceSolutionsLanding() {
  const router = useRouter()

  return (
    <main style={{ background: '#fff' }}>

      {/* ══════════════════════════════════════════════════
          HERO — split layout, organic curve wrap, editorial serif
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#fff' }}>
        <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-10 items-center pt-20 pb-24 md:pt-28 md:pb-36`}>

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

          {/* Right — organic curve wrap + layered photo placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE_PREMIUM, delay: 0.15 }}
            className="relative aspect-[4/3] lg:aspect-[5/4]"
          >
            <OrganicBackground variant="hero-wrap" color="#E8392A" colorDark="#A8210F" />

            {/* Undertone card — a second surface offset behind the photo,
                visible at its lower-right edge, reinforcing depth. */}
            <div
              className="absolute z-[5]"
              style={{ inset: '11% 3% 3% 25%', borderRadius: 24, background: 'rgba(255,255,255,0.5)' }}
            />

            <div
              className="absolute z-10 overflow-hidden"
              style={{
                inset: '8% 6% 6% 22%',
                borderRadius: 24,
                background: 'linear-gradient(150deg, #fde8e8 0%, #f4b8b4 45%, #c94f47 100%)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 30px 50px -12px rgba(0,0,0,0.22)',
              }}
            >
              {/* PLACEHOLDER — swap for real photography (family, golden hour)
                  once an asset is provided. Caption is visual-only, removed
                  the moment a real <Image> replaces this div. */}
              <div className="w-full h-full flex items-end justify-center pb-6">
                <span className="text-[11px] font-semibold text-white/80 bg-black/15 px-3 py-1 rounded-full backdrop-blur-sm">
                  Photo placeholder — family imagery
                </span>
              </div>
            </div>

            {/* Floating accent badge — purely decorative, no new copy */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.6 }}
              className="absolute z-20 flex items-center justify-center"
              style={{
                left: '8%', bottom: '10%', width: 56, height: 56, borderRadius: '50%',
                background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 16px 32px -8px rgba(0,0,0,0.18)',
              }}
            >
              <Heart size={20} style={{ color: PRU_RED }} fill={PRU_RED} fillOpacity={0.12} strokeWidth={1.75} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHY FINANCIAL PLANNING MATTERS — red panel + featured quote
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: PRU_RED }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: 64, transform: 'translateY(-1px)' }}>
          <OrganicBackground variant="wave-divider" color="#ffffff" />
        </div>

        {/* Architectural depth layer — a soft, off-center glow rather than
            a flat color fill, so the panel reads as lit from one side
            instead of a solid poster-color block. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 900px 700px at 15% 15%, rgba(255,255,255,0.10), transparent 60%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 700px 600px at 90% 100%, rgba(0,0,0,0.14), transparent 55%)' }}
        />

        <div className={`${CONTAINER} relative py-24 md:py-32`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE_PREMIUM }}>
              <SectionEyebrow tone="white">Why It Matters</SectionEyebrow>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-white leading-[1.12] tracking-[-0.01em] mb-6">
                A plan today, peace of mind for a lifetime.
              </h2>
              <p className="text-base text-white/80 leading-relaxed max-w-md mb-9">
                Insurance is not about expecting the unexpected. It&apos;s about being ready for it.
              </p>
              <ul className="space-y-4">
                {['Protect your loved ones', 'Secure your financial future', 'Live life with confidence'].map((item, i) => (
                  <motion.li key={item} className="flex items-center gap-3.5 text-white"
                    initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE_PREMIUM, delay: 0.1 + i * 0.08 }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.16)' }}>
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span className="text-[15px] font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.12 }}>
              {/* DRAFT quote — placeholder copy for your review in the
                  dedicated copywriting pass, not final brand messaging. */}
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
          CHOOSE YOUR FINANCIAL GOAL → RECOMMENDED SOLUTIONS
          One continuous beat, not two separate chapters: picking a
          goal and seeing what helps are the same moment in the
          conversation, so there's no section/background break between
          them — only the per-goal heading below changes.
      ══════════════════════════════════════════════════ */}
      <section id="goals" style={{ background: '#fff', scrollMarginTop: 80 }}>
        <div className={`${CONTAINER} py-24 md:py-32`}>
          <motion.div className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE_PREMIUM }}>
            <SectionEyebrow align="center">Start Here</SectionEyebrow>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-[-0.01em]">
              What is your <span className="italic" style={{ color: PRU_RED }}>financial goal?</span>
            </h2>
            <p className="text-base text-gray-500">Everyone&apos;s journey is different. Choose the goal closest to your situation.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-40px' }} variants={stagger}
          >
            {financialGoals.map(goal => (
              <motion.div key={goal.id} variants={fadeUp}>
                <GoalCard goal={goal} />
              </motion.div>
            ))}
          </motion.div>

          {/* Recommended solutions — same beat, no new chapter heading.
              Each block answers "what solutions might help me?" for the
              goal just chosen above. */}
          <div className="mt-28 space-y-20">
            {financialGoals.map(goal => {
              const goalProducts = getProductsForGoal(goal.id)
              if (goalProducts.length === 0) return null
              return (
                <div key={goal.id} id={goal.id} style={{ scrollMarginTop: 80 }}>
                  <motion.div className="mb-8 pb-7" style={{ borderBottom: `1px solid ${GRAY_LINE}` }}
                    initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE_PREMIUM }}>
                    {/* h3, not p — this is a real section heading (one per
                        goal group) and needs to be heading-navigable for
                        screen readers, same level as each ProductCard's
                        own h3 below it. */}
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: PRU_RED }}>
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
          NOT SURE WHICH SOLUTION FITS YOU? — floating pill CTA bar
      ══════════════════════════════════════════════════ */}
      <section style={{ background: GRAY_BG }}>
        <div className={`${CONTAINER} py-24 md:py-28`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE_PREMIUM }}
            className="rounded-[28px] px-7 py-7 md:px-12 md:py-9 flex flex-col md:flex-row items-center justify-between gap-7"
            style={{ background: '#ffffff', boxShadow: '0 1px 2px rgba(16,24,40,0.04), 0 24px 48px -16px rgba(16,24,40,0.10)' }}
          >
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="hidden md:flex w-12 h-12 rounded-full items-center justify-center shrink-0" style={{ background: '#fef2f2' }}>
                <MessageCircle size={19} style={{ color: PRU_RED }} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[17px] font-bold text-gray-900 mb-1">Not sure where to start?</p>
                <p className="text-sm text-gray-500">Let&apos;s talk about your goals. We&apos;ll guide you to the right solution.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <AnimatedGradientButton
                onClick={() => router.push('/assessment')}
                preset="pru"
                duration={5}
                className="px-8 py-3.5 text-sm rounded-full"
              >
                <ClipboardList size={15} />Take the Financial Assessment
              </AnimatedGradientButton>
              <a
                href="#appointment"
                className="flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold"
                style={{ background: 'transparent', color: PRU_RED, border: `1.5px solid ${PRU_RED}`, borderRadius: 999, transition: `all 0.35s ${EASE_PREMIUM.join(',')}` }}
                onMouseEnter={e => { e.currentTarget.style.background = PRU_RED; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = PRU_RED }}
              >
                Book a Free Consultation
              </a>
            </div>
          </motion.div>

          {/* Trust strip — closing statement-based row, distinct from the
              logo-based TrustStrip used elsewhere on the site. */}
          <motion.div className="mt-20"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE_PREMIUM, delay: 0.1 }}>
            <IconTrustStrip items={TRUST_ITEMS} />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BOOK A COMPLIMENTARY CONSULTATION
          Goal-agnostic — no product pre-selected.
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
