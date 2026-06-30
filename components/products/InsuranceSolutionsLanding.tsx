'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, ClipboardList, Check, ShieldCheck, UserCheck, Globe2, HeartHandshake } from 'lucide-react'
import { financialGoals, getProductsForGoal } from '@/lib/products'
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button'
import { OrganicBackground } from '@/components/ui/organic-background'
import { FeaturedQuoteCard } from '@/components/ui/featured-quote-card'
import { IconTrustStrip } from '@/components/ui/icon-trust-strip'
import GoalCard from './GoalCard'
import ProductCard from './ProductCard'
import ProductAppointmentSection from './ProductAppointmentSection'

const PRU_RED   = '#D92D20'
const GRAY_BG   = '#f5f5f5'
const GRAY_LINE = '#e5e7eb'

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
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
   to show goal cards before the "Why It Matters" panel. This pass
   only changes the VISUAL TREATMENT of each section, not their order
   or the underlying registry-driven rendering.

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
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pt-14 pb-20 md:pt-20 md:pb-28">

          {/* Left — copy */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10">
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-5">
              <div style={{ height: 2, width: 24, background: PRU_RED }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>
                Insurance Solutions
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp}
              className="font-display text-5xl md:text-6xl font-semibold text-gray-900 leading-[1.08] mb-5">
              Solutions that protect<br />what matters{' '}
              <span className="italic" style={{ color: PRU_RED }}>most</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md mb-9">
              Life is full of uncertainties. The right protection today can secure your family&apos;s tomorrow.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
              <a
                href="#goals"
                className="flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white transition-all"
                style={{ background: PRU_RED, borderRadius: 999, boxShadow: '0 8px 20px rgba(217,45,32,0.30)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#B42318' }}
                onMouseLeave={e => { e.currentTarget.style.background = PRU_RED }}
              >
                Choose Your Financial Goal <ArrowRight size={14} />
              </a>
              <button
                onClick={() => router.push('/assessment')}
                className="flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold transition-all"
                style={{ background: 'transparent', color: PRU_RED, border: `1.5px solid ${PRU_RED}`, borderRadius: 999 }}
                onMouseEnter={e => { e.currentTarget.style.background = PRU_RED; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = PRU_RED }}
              >
                Take the Financial Assessment
              </button>
            </motion.div>
          </motion.div>

          {/* Right — organic curve wrap + photo placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative aspect-[4/3] lg:aspect-[5/4]"
          >
            <OrganicBackground variant="hero-wrap" color={PRU_RED} className="opacity-95" />
            <div
              className="absolute z-10 overflow-hidden"
              style={{
                inset: '8% 6% 6% 22%',
                borderRadius: 24,
                background: 'linear-gradient(150deg, #fde8e8 0%, #f4b8b4 45%, #c94f47 100%)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.18)',
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
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHY FINANCIAL PLANNING MATTERS — red panel + featured quote
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: PRU_RED }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: 60, transform: 'translateY(-1px)' }}>
          <OrganicBackground variant="wave-divider" color="#ffffff" />
        </div>
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 mb-5">
                <div style={{ height: 2, width: 24, background: '#fff' }} />
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">Why It Matters</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight mb-5">
                A plan today, peace of mind for a lifetime.
              </h2>
              <p className="text-base text-white/85 leading-relaxed max-w-md mb-7">
                Insurance is not about expecting the unexpected. It&apos;s about being ready for it.
              </p>
              <ul className="space-y-3">
                {['Protect your loved ones', 'Secure your financial future', 'Live life with confidence'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
                      <Check size={12} />
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
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
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <motion.div className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div style={{ width: 3, height: 20, background: PRU_RED, borderRadius: 2 }} />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>Start Here</p>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 mb-3">
              What is your <span className="italic" style={{ color: PRU_RED }}>financial goal?</span>
            </h2>
            <p className="text-base text-gray-600">Everyone&apos;s journey is different. Choose the goal closest to your situation.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
          <div className="mt-20 space-y-16">
            {financialGoals.map(goal => {
              const goalProducts = getProductsForGoal(goal.id)
              if (goalProducts.length === 0) return null
              return (
                <div key={goal.id} id={goal.id} style={{ scrollMarginTop: 80 }}>
                  <motion.div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${GRAY_LINE}` }}
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4 }}>
                    {/* h3, not p — this is a real section heading (one per
                        goal group) and needs to be heading-navigable for
                        screen readers, same level as each ProductCard's
                        own h3 below it. */}
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PRU_RED }}>
                      Recommended for: {goal.label}
                    </h3>
                    <p className="text-sm text-gray-600 max-w-xl">{goal.description}</p>
                  </motion.div>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45 }}
            className="rounded-3xl px-6 py-6 md:px-10 md:py-7 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: '#ffffff', boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
          >
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="hidden md:flex w-11 h-11 rounded-full items-center justify-center shrink-0" style={{ background: '#fef2f2' }}>
                <MessageCircle size={18} style={{ color: PRU_RED }} />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">Not sure where to start?</p>
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
                className="flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold transition-all"
                style={{ background: 'transparent', color: PRU_RED, border: `1.5px solid ${PRU_RED}`, borderRadius: 999 }}
                onMouseEnter={e => { e.currentTarget.style.background = PRU_RED; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = PRU_RED }}
              >
                Book a Free Consultation
              </a>
            </div>
          </motion.div>

          {/* Trust strip — closing statement-based row, distinct from the
              logo-based TrustStrip used elsewhere on the site. */}
          <motion.div className="mt-16"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}>
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
