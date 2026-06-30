'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, ClipboardList } from 'lucide-react'
import { financialGoals, getProductsForGoal } from '@/lib/products'
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button'
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

/* ══════════════════════════════════════════════════════════════════
   INSURANCE SOLUTIONS LANDING PAGE
   The homepage of the entire Insurance Solutions experience — not a
   product listing. Goal-first: visitors choose a financial goal before
   ever seeing a plan name. Sections below render in the order set by
   the approved structure (Hero → Why It Matters → Choose Your Goal →
   Recommended Solutions, grouped by goal → Not Sure? → Consultation).

   Fully registry-driven: every goal, every recommended product, and
   every anchor id comes from lib/products.ts. Adding a 6th financial
   goal or a 6th product requires no changes here.

   Forward-compatible with Phase 5 (assessment handoff): each goal
   group below has a stable `id={goal.id}` and `scrollMarginTop`, so a
   future `/products#<goalId>` deep link — from the assessment results
   page or anywhere else — already lands correctly without any
   restructuring of this page.
══════════════════════════════════════════════════════════════════ */
export default function InsuranceSolutionsLanding() {
  const router = useRouter()

  return (
    <main style={{ background: '#fff' }}>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#fff' }}>
        <div className="max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-14 md:pt-24 md:pb-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-5">
              <div style={{ height: 2, width: 24, background: PRU_RED }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>
                Insurance Solutions
              </span>
              <div style={{ height: 2, width: 24, background: PRU_RED }} />
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-5">
              Helping You Protect<br className="hidden md:block" /> What Matters Most
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Every family&apos;s financial goals are different. Tell us what you&apos;re trying to achieve,
              and we&apos;ll guide you to the right insurance solution — no jargon, no pressure.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#goals"
                className="flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white transition-all"
                style={{ background: PRU_RED, borderRadius: 6, boxShadow: '0 4px 14px rgba(217,45,32,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#B42318' }}
                onMouseLeave={e => { e.currentTarget.style.background = PRU_RED }}
              >
                Choose Your Financial Goal <ArrowRight size={14} />
              </a>
              <button
                onClick={() => router.push('/assessment')}
                className="flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold transition-all"
                style={{ background: 'transparent', color: PRU_RED, border: `1.5px solid ${PRU_RED}`, borderRadius: 6 }}
                onMouseEnter={e => { e.currentTarget.style.background = PRU_RED; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = PRU_RED }}
              >
                Take the Financial Assessment
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHY FINANCIAL PLANNING MATTERS
      ══════════════════════════════════════════════════ */}
      <section style={{ background: GRAY_BG, borderTop: `1px solid ${GRAY_LINE}`, borderBottom: `1px solid ${GRAY_LINE}` }}>
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-14 md:py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div style={{ height: 2, width: 24, background: PRU_RED }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>
                Why Financial Planning Matters
              </span>
              <div style={{ height: 2, width: 24, background: PRU_RED }} />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-4">
              Most families don&apos;t lack the will to plan — they lack a clear starting point.
            </p>
            <p className="text-base text-gray-600 leading-relaxed max-w-xl mx-auto">
              A good plan isn&apos;t about buying insurance — it&apos;s about knowing exactly what you&apos;re
              protecting against, and choosing the right tool for it. That&apos;s what a licensed BSQ ·
              PRU Life UK advisor helps you do, starting with your goals, not a product brochure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CHOOSE YOUR FINANCIAL GOAL
      ══════════════════════════════════════════════════ */}
      <section id="goals" style={{ background: '#fff', scrollMarginTop: 80 }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <motion.div className="text-center max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div style={{ width: 3, height: 20, background: PRU_RED, borderRadius: 2 }} />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>Start Here</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">Choose Your Financial Goal</h2>
            <p className="text-base text-gray-600">What are you trying to achieve? Pick the goal closest to yours.</p>
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
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          RECOMMENDED INSURANCE SOLUTIONS — grouped by goal
      ══════════════════════════════════════════════════ */}
      <section style={{ background: GRAY_BG, borderTop: `1px solid ${GRAY_LINE}`, borderBottom: `1px solid ${GRAY_LINE}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <motion.div className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div style={{ width: 3, height: 20, background: PRU_RED, borderRadius: 2 }} />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>Recommended For You</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">Recommended Insurance Solutions</h2>
          </motion.div>

          <div className="space-y-16">
            {financialGoals.map(goal => {
              const goalProducts = getProductsForGoal(goal.id)
              if (goalProducts.length === 0) return null
              return (
                <div key={goal.id} id={goal.id} style={{ scrollMarginTop: 80 }}>
                  <motion.div className="mb-6"
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4 }}>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-1.5">{goal.label}</h3>
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
          NOT SURE WHICH SOLUTION FITS YOU? — Assessment CTA
      ══════════════════════════════════════════════════ */}
      <section style={{ background: '#1a1a1a' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: PRU_RED }}>
                Not Sure Which Solution Fits You?
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                Get Your Personalized<br />Financial Gap Report
              </h2>
              <p className="text-base text-gray-400 leading-relaxed max-w-md">
                Answer a few questions and we&apos;ll identify your protection gaps and match you with
                the right solutions — free, in about 3 minutes.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}
              className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
              <AnimatedGradientButton
                onClick={() => router.push('/assessment')}
                preset="pru"
                duration={5}
                className="px-10 py-4 text-sm rounded-sm"
                style={{ minWidth: 260 }}
              >
                <ClipboardList size={15} />Take the Financial Assessment
              </AnimatedGradientButton>
              <a
                href="#appointment"
                className="flex items-center justify-center gap-2 px-10 py-4 text-sm font-bold transition-all"
                style={{ background: 'transparent', color: '#e5e7eb', border: '1px solid #4b5563', borderRadius: 4 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#4b5563'; e.currentTarget.style.color = '#e5e7eb' }}
              >
                <MessageCircle size={15} />Talk to an Advisor Instead
              </a>
            </motion.div>
          </div>
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
