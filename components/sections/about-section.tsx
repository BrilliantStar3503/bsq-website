'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Heart,
  Target,
  Eye,
  Users,
  Banknote,
  GraduationCap,
  Sunset,
  Activity,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
} from 'lucide-react'

/* ══════════════════════════════════════════════════════════════════════════
   ABOUT SECTION — BSQ · PRU Life UK Modern Design
   ══════════════════════════════════════════════════════════════════════════ */

const PRU_RED = '#ed1b2e'

/* ─── Animation helpers ─────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Why Choose BSQ cards ──────────────────────────────────────────── */
const WHY_CARDS = [
  {
    icon: Target,
    title: 'Personalized Financial Game Plan',
    body: 'No one-size-fits-all. We assess your unique situation and design solutions tailored precisely to your needs and goals.',
    accent: PRU_RED,
  },
  {
    icon: ShieldCheck,
    title: 'Protection + Investment in One',
    body: 'Through Pru Life UK, we offer plans that protect your life while simultaneously growing your money over time.',
    accent: '#0369a1',
  },
  {
    icon: MessageSquare,
    title: 'Simple, Clear Guidance',
    body: 'We remove confusion and explain everything in plain language — no jargon, no pressure, just honest clarity.',
    accent: '#059669',
  },
  {
    icon: Heart,
    title: 'Long-Term Relationship',
    body: 'We stay with you — from your first policy to your future milestones. Your success is our commitment.',
    accent: '#7c3aed',
  },
]

/* ─── Solutions list ────────────────────────────────────────────────── */
const SOLUTIONS = [
  { icon: Activity,     text: 'Income protection in case of unexpected events' },
  { icon: ShieldCheck,  text: 'Financial security for your family' },
  { icon: TrendingUp,   text: 'Savings and investment discipline' },
  { icon: Sunset,       text: 'Retirement planning' },
  { icon: GraduationCap,text: 'Education funding for your children' },
  { icon: Banknote,     text: 'Emergency fund and liquidity buffer' },
]

/* ─── Stats ─────────────────────────────────────────────────────────── */
const STATS = [
  { value: 'PRU Life UK', label: 'Licensed Partner' },
  { value: '5-Star',      label: 'Client Service' },
  { value: '₱0',         label: 'Consultation Fee' },
  { value: '3 min',      label: 'Assessment Time' },
]

/* ══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════════════════════════ */
export default function AboutSection() {
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #060810 0%, #0d1117 60%, #111827 100%)' }}
      >
        {/* PRU red top stripe */}
        <div style={{ height: 3, background: `linear-gradient(to right, ${PRU_RED}, #f87171 50%, transparent)` }} />

        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 55% 70% at 15% 60%, ${PRU_RED}14 0%, transparent 65%)`,
        }} />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
          <FadeUp>
            <div className="flex items-center gap-2 mb-6">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: PRU_RED, display: 'inline-block', boxShadow: `0 0 8px ${PRU_RED}` }} />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: PRU_RED }}>About BSQ</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 max-w-3xl">
              Your Partner in<br />
              <span style={{ color: PRU_RED }}>Financial Security</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl mb-10">
              Brilliant Star Quartz (BSQ) is dedicated to helping individuals and families build a
              strong, secure financial future through trusted insurance and investment solutions —
              in partnership with Pru Life UK.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://m.me/Bstarquartzarea?ref=about_cta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm text-white transition-all duration-200 hover:scale-[1.03]"
                style={{ background: `linear-gradient(135deg, ${PRU_RED}, #c1121f)`, boxShadow: `0 8px 32px ${PRU_RED}45` }}
              >
                Talk to an Advisor <ArrowRight size={15} />
              </a>
              <a
                href="/assessment"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-sm text-white/70 hover:text-white border transition-all duration-200 hover:bg-white/05"
                style={{ borderColor: 'rgba(255,255,255,0.12)' }}
              >
                Start Free Assessment
              </a>
            </div>
          </FadeUp>

          {/* Stats row */}
          <FadeUp delay={0.2} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl px-5 py-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xl md:text-2xl font-black text-white mb-1">{value}</p>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35">{label}</p>
              </div>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ── ABOUT BODY ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28">

        {/* Intro paragraph */}
        <FadeUp className="max-w-3xl mb-20">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: PRU_RED }}>Our Philosophy</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6">
            We don&apos;t just sell insurance.<br />
            <span className="text-gray-400 font-light">We guide smarter decisions.</span>
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            We believe that financial planning should be simple, personalized, and accessible.
            That&apos;s why we take the time to understand your goals — whether it&apos;s protecting your
            income, securing your family, or preparing for long-term wealth. At BSQ, we guide
            you toward smarter financial decisions with clarity, honesty, and care.
          </p>
        </FadeUp>

        {/* Why Choose BSQ */}
        <FadeUp>
          <div className="flex items-center gap-3 mb-10">
            <div style={{ width: 3, height: 22, background: PRU_RED, borderRadius: 2 }} />
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-0.5">Why Choose Us</p>
              <h2 className="text-2xl font-black text-gray-900">4 Reasons Clients Trust BSQ</h2>
            </div>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-24">
          {WHY_CARDS.map(({ icon: Icon, title, body, accent }, i) => (
            <FadeUp key={title} delay={i * 0.08}>
              <div
                className="group relative bg-white rounded-3xl p-8 h-full transition-all duration-300 hover:-translate-y-1"
                style={{
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px rgba(0,0,0,0.1)` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)' }}
              >
                {/* Colored accent left bar */}
                <div className="absolute left-0 top-8 bottom-8 w-[3px] rounded-r-full transition-all duration-300"
                  style={{ background: accent }} />

                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${accent}12` }}>
                    <Icon size={20} style={{ color: accent }} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900 mb-2 leading-snug">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </div>

                {/* Check badge */}
                <div className="absolute top-5 right-5">
                  <CheckCircle size={16} style={{ color: accent, opacity: 0.4 }} />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Mission + Vision */}
        <FadeUp>
          <div className="flex items-center gap-3 mb-10">
            <div style={{ width: 3, height: 22, background: PRU_RED, borderRadius: 2 }} />
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-0.5">Direction</p>
              <h2 className="text-2xl font-black text-gray-900">Mission &amp; Vision</h2>
            </div>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-24">
          {/* Mission */}
          <FadeUp delay={0.05}>
            <div className="relative overflow-hidden rounded-3xl p-8 h-full"
              style={{ background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)' }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `linear-gradient(to right, ${PRU_RED}, transparent)` }} />
              <div className="absolute inset-0 pointer-events-none" style={{
                background: `radial-gradient(ellipse 80% 60% at 10% 90%, ${PRU_RED}14 0%, transparent 60%)`,
              }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${PRU_RED}20`, border: `1px solid ${PRU_RED}30` }}>
                    <Target size={18} style={{ color: PRU_RED }} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: PRU_RED }}>Our Mission</span>
                </div>
                <p className="text-white/80 text-base leading-relaxed font-medium">
                  To empower individuals and families to take control of their finances through
                  proper protection, disciplined investing, and informed decision-making.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Vision */}
          <FadeUp delay={0.12}>
            <div className="relative overflow-hidden rounded-3xl p-8 h-full"
              style={{ background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)' }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: 'linear-gradient(to right, #7c3aed, transparent)' }} />
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse 80% 60% at 10% 90%, rgba(124,58,237,0.1) 0%, transparent 60%)',
              }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                    <Eye size={18} className="text-purple-400" />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-purple-400">Our Vision</span>
                </div>
                <p className="text-white/80 text-base leading-relaxed font-medium">
                  To become a trusted name in financial guidance — helping thousands of Filipinos
                  achieve security, stability, and peace of mind.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* What We Help You Solve */}
        <FadeUp>
          <div className="flex items-center gap-3 mb-10">
            <div style={{ width: 3, height: 22, background: PRU_RED, borderRadius: 2 }} />
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-0.5">Coverage Areas</p>
              <h2 className="text-2xl font-black text-gray-900">What We Help You Solve</h2>
            </div>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
          {SOLUTIONS.map(({ icon: Icon, text }, i) => (
            <FadeUp key={text} delay={i * 0.06}>
              <div
                className="flex items-center gap-4 rounded-2xl p-5 bg-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${PRU_RED}30`
                  ;(e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.08)`
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#f1f5f9'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 1px 6px rgba(0,0,0,0.04)'
                }}
              >
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: '#fef2f2' }}>
                  <Icon size={17} style={{ color: PRU_RED }} />
                </div>
                <p className="text-sm font-semibold text-gray-700 leading-snug">{text}</p>
              </div>
            </FadeUp>
          ))}
        </div>

      </section>

      {/* ── PRU LIFE UK PARTNER STRIP ─────────────────────────────────── */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <FadeUp>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${PRU_RED}12`, border: `1px solid ${PRU_RED}25` }}>
                <Award size={22} style={{ color: PRU_RED }} />
              </div>
              <div>
                <p className="text-sm font-black text-gray-900">Licensed PRU Life UK Partner</p>
                <p className="text-xs text-gray-400">Authorized Financial Advisor · Ortigas, Pasig City</p>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="flex items-center gap-6">
              {['Life Insurance', 'Investment-Linked', 'VUL Plans', 'Health Coverage'].map(badge => (
                <span key={badge} className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-gray-400">{badge}</span>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={PRU_RED} style={{ color: PRU_RED }} />
              ))}
              <span className="text-[11px] text-gray-400 ml-2">Trusted Advisor</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #060810 0%, #0d1117 60%, #111827 100%)' }}>
        {/* PRU red top stripe */}
        <div style={{ height: 3, background: `linear-gradient(to right, ${PRU_RED}, #f87171 50%, transparent)` }} />
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 50% 80% at 50% 100%, ${PRU_RED}18 0%, transparent 65%)`,
        }} />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-24 text-center">
          <FadeUp>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: PRU_RED }}>Take Action Today</p>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">
              Not sure if your finances<br />
              <span style={{ color: PRU_RED }}>are fully protected?</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-10 max-w-xl mx-auto">
              Start with a simple conversation — and take the first step toward peace of mind.
              A BSQ advisor will review your situation at no cost, no obligation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/assessment"
                className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl font-black text-sm text-white transition-all duration-200 hover:scale-[1.04]"
                style={{ background: `linear-gradient(135deg, ${PRU_RED}, #c1121f)`, boxShadow: `0 8px 32px ${PRU_RED}50` }}
              >
                Fix your financial gaps today
                <ArrowRight size={15} />
              </a>
              <a
                href="https://m.me/Bstarquartzarea?ref=about_cta2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl font-semibold text-sm text-white/65 hover:text-white border transition-all duration-200 hover:bg-white/05"
                style={{ borderColor: 'rgba(255,255,255,0.12)' }}
              >
                <Users size={15} />
                Talk to a trusted advisor
              </a>
            </div>

            <div className="flex items-center justify-center gap-8 mt-10">
              {['Free consultation', 'No obligation', 'Licensed advisor'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={12} style={{ color: PRU_RED }} />
                  <span className="text-[11px] text-white/35">{t}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
