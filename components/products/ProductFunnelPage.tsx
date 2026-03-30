'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle, MessageCircle, Shield, TrendingUp,
  Clock, Users, Star, Phone, X, Send, Check
} from 'lucide-react'
import type { PruProduct } from '@/lib/products'

/* ─── Brand constants ─────────────────────────────────────────────── */
const PRU_RED   = '#D92D20'   // primary red
const GRAY_BG   = '#f5f5f5'   // light section bg
const GRAY_LINE = '#e5e7eb'   // divider

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ─── Benefit icon pool ──────────────────────────────────────────── */
const ICONS = [Shield, TrendingUp, Clock, Star, Users, CheckCircle]

/* ─── Utility: split "PRU..." product name into red PRU + black rest ── */
function ProductTitle({ name, className = '' }: { name: string; className?: string }) {
  if (name.startsWith('PRU')) {
    return (
      <span className={className}>
        <span style={{ color: PRU_RED }}>PRU</span>{name.slice(3)}
      </span>
    )
  }
  return <span className={className}>{name}</span>
}

/* ══════════════════════════════════════════════════════════════════
   LEAD CAPTURE MODAL
══════════════════════════════════════════════════════════════════ */
function LeadModal({
  open, onClose, product, agentHandle,
}: {
  open: boolean; onClose: () => void; product: PruProduct; agentHandle: string
}) {
  const [name, setName]       = useState('')
  const [contact, setContact] = useState('')
  const [type, setType]       = useState<'email' | 'phone'>('phone')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')

  const messengerRef = `product_${product.slug}${agentHandle ? `_${agentHandle}` : ''}`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    try {
      const utmData = (() => { try { return JSON.parse(localStorage.getItem('bsq_utm') || '{}') } catch { return {} } })()
      await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, contact, contactType: type,
          source: `product_funnel_${product.slug}`,
          productInterest: product.name,
          attribution: {
            agent:     utmData.utm_agent  || agentHandle || '',
            utmSource: utmData.utm_source || 'facebook',
            utmMedium: utmData.utm_medium || 'product_page',
          },
        }),
      })
      setDone(true)
    } catch { setError('Something went wrong. Please try again.') }
    finally  { setLoading(false) }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' as const }}
        className="bg-white w-full max-w-md overflow-hidden"
        style={{ borderRadius: 4, boxShadow: '0 8px 48px rgba(0,0,0,0.18)' }}
      >
        {/* Top red bar */}
        <div style={{ height: 4, background: PRU_RED }} />

        <div className="p-7 relative">
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
            <X size={16} />
          </button>

          {!done ? (
            <>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: PRU_RED }}>Free Consultation</p>
              <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">
                Talk to a <span style={{ color: PRU_RED }}>PRU</span> Life UK Advisor
              </h3>
              <p className="text-xs text-gray-500 mb-6">About {product.shortName}. No cost, no obligation.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Juan dela Cruz"
                    className="w-full px-4 py-3 text-sm text-gray-900 outline-none transition-all"
                    style={{ border: '1px solid #d1d5db', borderRadius: 4 }}
                    onFocus={e => (e.currentTarget.style.borderColor = PRU_RED)}
                    onBlur={e  => (e.currentTarget.style.borderColor = '#d1d5db')} />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Contact</label>
                  <div className="flex gap-2 mb-2">
                    {(['phone', 'email'] as const).map(t => (
                      <button key={t} type="button" onClick={() => { setType(t); setContact('') }}
                        className="px-4 py-2 text-xs font-bold transition-all"
                        style={type === t
                          ? { background: PRU_RED, color: '#fff', borderRadius: 4, border: `1px solid ${PRU_RED}` }
                          : { background: '#fff', color: '#6b7280', borderRadius: 4, border: '1px solid #d1d5db' }}>
                        <Phone size={10} className="inline mr-1" />{t === 'phone' ? 'Mobile' : 'Email'}
                      </button>
                    ))}
                  </div>
                  <input key={type} type={type === 'email' ? 'email' : 'tel'}
                    value={contact} onChange={e => setContact(e.target.value)}
                    placeholder={type === 'phone' ? '+63 9XX XXX XXXX' : 'you@example.com'}
                    className="w-full px-4 py-3 text-sm text-gray-900 outline-none transition-all"
                    style={{ border: '1px solid #d1d5db', borderRadius: 4 }}
                    onFocus={e => (e.currentTarget.style.borderColor = PRU_RED)}
                    onBlur={e  => (e.currentTarget.style.borderColor = '#d1d5db')} />
                </div>

                {error && <p className="text-xs text-center font-medium" style={{ color: PRU_RED }}>{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
                  style={{ background: loading ? '#aaa' : PRU_RED, borderRadius: 4, border: 'none' }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.background = '#B42318')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.background = PRU_RED)}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                    : <><Send size={14} />Get My Free Consultation</>}
                </button>
                <p className="text-[10px] text-gray-400 text-center">🔒 Private & confidential. No spam, ever.</p>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <Check size={24} className="text-green-500" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">You&apos;re all set!</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                A licensed BSQ · PRU Life UK advisor will reach out within 24 hours.
              </p>
              <button onClick={() => window.open(`https://m.me/Bstarquartzarea?ref=${messengerRef}`, '_blank')}
                className="w-full py-3.5 text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
                style={{ background: PRU_RED, borderRadius: 4, border: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#B42318')}
                onMouseLeave={e => (e.currentTarget.style.background = PRU_RED)}>
                <MessageCircle size={14} />Message Us on Facebook
              </button>
              <button onClick={onClose}
                className="w-full mt-2 py-3 text-sm text-gray-400 hover:text-gray-700 transition-colors">
                Back to page
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN FUNNEL PAGE
══════════════════════════════════════════════════════════════════ */
export default function ProductFunnelPage({ product }: { product: PruProduct }) {
  const router      = useRouter()
  const [modal, setModal]           = useState(false)
  const [agentHandle, setAgent]     = useState('')
  const hasPhoto = false // ← flip to true once real photo is in /public/images/products/

  useEffect(() => {
    try {
      const utm = JSON.parse(localStorage.getItem('bsq_utm') || '{}')
      if (utm.utm_agent) setAgent(utm.utm_agent)
    } catch { /* silent */ }
  }, [])

  return (
    <main style={{ background: '#fff', color: '#111' }}>

      {/* ══════════════════════════════════════════════════
          HERO — split layout, white bg, photo on right
      ══════════════════════════════════════════════════ */}
      <section className="relative" style={{ borderBottom: `1px solid ${GRAY_LINE}` }}>
        {/* thin red top stripe */}
        <div style={{ height: 4, background: PRU_RED }} />

        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row lg:items-stretch min-h-[520px]">

            {/* Left — text */}
            <motion.div
              className="flex-1 flex flex-col justify-center py-14 lg:py-16 lg:pr-16"
              initial="hidden" animate="visible" variants={stagger}
            >
              {/* Category tag */}
              <motion.div variants={fadeUp} className="flex items-center gap-2 mb-5">
                <div style={{ width: 3, height: 16, background: PRU_RED, borderRadius: 2 }} />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  PRU Life UK · {product.category === 'vul' ? 'Investment-Linked' : product.category === 'traditional' ? 'Traditional' : 'Insurance'} Plan
                </span>
              </motion.div>

              {/* Product name — PRU in red */}
              <motion.h1 variants={fadeUp}
                className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-3"
                style={{ color: '#111' }}>
                <ProductTitle name={product.name} />
              </motion.h1>

              {/* Tagline */}
              <motion.p variants={fadeUp}
                className="text-base md:text-lg font-semibold mb-5"
                style={{ color: '#555' }}>
                {product.tagline}
              </motion.p>

              {/* What it is */}
              <motion.p variants={fadeUp}
                className="text-sm text-gray-600 leading-relaxed mb-8 max-w-lg">
                {product.whatItIs}
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setModal(true)}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white transition-all"
                  style={{ background: PRU_RED, borderRadius: 4, border: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#B42318')}
                  onMouseLeave={e => (e.currentTarget.style.background = PRU_RED)}>
                  <MessageCircle size={15} />Get a Free Consultation
                </button>
                <button onClick={() => router.push('/assessment')}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold transition-all"
                  style={{ background: '#fff', color: PRU_RED, border: `1.5px solid ${PRU_RED}`, borderRadius: 4 }}
                  onMouseEnter={e => { e.currentTarget.style.background = PRU_RED; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = PRU_RED }}>
                  Take Free Assessment <ArrowRight size={14} />
                </button>
              </motion.div>

              {/* Trust strip */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
                {['Licensed PRU Life UK Advisor', 'Free Consultation', 'No Obligation'].map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Check size={12} style={{ color: PRU_RED }} />
                    <span className="text-xs text-gray-500">{t}</span>
                  </div>
                ))}
              </motion.div>

              {/* Agent attribution */}
              {agentHandle && (
                <motion.div variants={fadeUp}
                  className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Shared by {agentHandle.replace(/_/g, ' ')}
                </motion.div>
              )}
            </motion.div>

            {/* Right — Photo */}
            <motion.div
              className="lg:w-[480px] xl:w-[520px] flex-shrink-0 relative"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {hasPhoto ? (
                <Image
                  src={`/images/products/${product.slug}.jpg`}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                /* Placeholder — clean gray, matches PRU Life UK style */
                <div className="w-full h-full min-h-[320px] lg:min-h-0 flex flex-col items-center justify-center gap-4"
                  style={{ background: GRAY_BG, borderLeft: `1px solid ${GRAY_LINE}` }}>
                  <div className="text-6xl opacity-30">{product.emoji}</div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-400">{product.shortName}</p>
                    <p className="text-xs text-gray-400 mt-1">Photo coming soon</p>
                  </div>
                  {/* PRU Life UK badge */}
                  <div className="absolute bottom-5 right-5 bg-white px-3 py-1.5 flex items-center gap-2"
                    style={{ border: `1px solid ${GRAY_LINE}`, borderRadius: 4 }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: PRU_RED }} />
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">PRU Life UK</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PROBLEM HOOK — gray bg, centered
      ══════════════════════════════════════════════════ */}
      <section style={{ background: GRAY_BG, borderBottom: `1px solid ${GRAY_LINE}` }}>
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-12 md:py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div style={{ height: 2, width: 24, background: PRU_RED }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>
                The Problem
              </span>
              <div style={{ height: 2, width: 24, background: PRU_RED }} />
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-4">
              &ldquo;{product.fbHooks[0]}&rdquo;
            </p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
              {product.problemItSolves}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          KEY BENEFITS — white bg
      ══════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', borderBottom: `1px solid ${GRAY_LINE}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20">
          <motion.div className="mb-10"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 3, height: 20, background: PRU_RED, borderRadius: 2 }} />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>
                Why {product.shortName}
              </p>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Key Benefits</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{ border: `1px solid ${GRAY_LINE}` }}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-40px' }} variants={stagger}
          >
            {product.keyBenefits.map((benefit, i) => {
              const Icon = ICONS[i % ICONS.length]
              return (
                <motion.div key={i} variants={fadeUp}
                  className="p-7 bg-white hover:bg-gray-50 transition-colors duration-200 group"
                  style={{ borderRight: (i + 1) % 3 !== 0 ? `1px solid ${GRAY_LINE}` : 'none' }}>
                  <div className="w-10 h-10 flex items-center justify-center mb-5"
                    style={{ background: '#fef2f2', borderRadius: 4 }}>
                    <Icon size={18} style={{ color: PRU_RED }} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug">{benefit.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
                  <div className="mt-4 h-0.5 w-8 transition-all duration-300 group-hover:w-12"
                    style={{ background: PRU_RED }} />
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          IS IT RIGHT FOR YOU — gray bg, 2 col
      ══════════════════════════════════════════════════ */}
      <section style={{ background: GRAY_BG, borderBottom: `1px solid ${GRAY_LINE}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Ideal For */}
            <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 3, height: 20, background: PRU_RED, borderRadius: 2 }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>This Is For You</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">
                Is <ProductTitle name={product.shortName} /> Right For You?
              </h2>
              <div className="space-y-3">
                {product.idealFor.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-4"
                    style={{ border: `1px solid ${GRAY_LINE}`, borderRadius: 4 }}>
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#fef2f2', borderRadius: '50%' }}>
                      <Check size={11} style={{ color: PRU_RED }} />
                    </div>
                    <p className="text-sm text-gray-700 leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Specs */}
            <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.05 }}>
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 3, height: 20, background: PRU_RED, borderRadius: 2 }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>Plan Details</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">Quick Specs</h2>

              <div className="bg-white overflow-hidden" style={{ border: `1px solid ${GRAY_LINE}`, borderRadius: 4 }}>
                {[
                  ['Product Type',  product.specs.productType],
                  ['Payment Term',  product.specs.paymentTerms],
                  ['Issue Age',     product.specs.issueAge],
                  ['Entry Point',   product.specs.minPremium ?? product.specs.minSumAssured ?? 'Ask your advisor'],
                  ['Death Benefit', product.specs.deathBenefit],
                  ['Benefit Until', product.specs.benefitTerm],
                  ['Currency',      product.specs.currency],
                ].map(([label, value], i, arr) => (
                  <div key={i} className="flex gap-4 px-5 py-4"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid ${GRAY_LINE}` : 'none' }}>
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 w-24 flex-shrink-0 pt-0.5">{label}</p>
                    <p className="text-xs text-gray-800 leading-relaxed font-medium flex-1">{value}</p>
                  </div>
                ))}
              </div>

              {/* Riders */}
              {product.riders.length > 0 && (
                <div className="mt-5 bg-white p-5" style={{ border: `1px solid ${GRAY_LINE}`, borderRadius: 4 }}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: PRU_RED }}>
                    Optional Riders ({product.riders.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.riders.slice(0, 6).map((r, i) => (
                      <span key={i} className="text-[10px] font-medium px-2.5 py-1 text-gray-600"
                        style={{ background: GRAY_BG, border: `1px solid ${GRAY_LINE}`, borderRadius: 4 }}>
                        {r.split('(')[0].trim()}
                      </span>
                    ))}
                    {product.riders.length > 6 && (
                      <span className="text-[10px] font-medium px-2.5 py-1 text-gray-400"
                        style={{ background: GRAY_BG, border: `1px solid ${GRAY_LINE}`, borderRadius: 4 }}>
                        +{product.riders.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MORE HOOKS — white bg, clean quote cards
      ══════════════════════════════════════════════════ */}
      {product.fbHooks.length > 1 && (
        <section style={{ background: '#fff', borderBottom: `1px solid ${GRAY_LINE}` }}>
          <div className="max-w-4xl mx-auto px-6 md:px-10 py-14 md:py-16">
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial="hidden" whileInView="visible"
              viewport={{ once: true }} variants={stagger}>
              {product.fbHooks.slice(1, 3).map((hook, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="p-6 bg-white"
                  style={{ border: `1px solid ${GRAY_LINE}`, borderRadius: 4 }}>
                  <div style={{ width: 24, height: 3, background: PRU_RED, borderRadius: 2, marginBottom: 16 }} />
                  <p className="text-sm font-semibold text-gray-800 leading-relaxed">&ldquo;{hook}&rdquo;</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          BOTTOM CTA — dark section, PRU Life UK style
      ══════════════════════════════════════════════════ */}
      <section style={{ background: '#1a1a1a' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: PRU_RED }}>
                Next Step
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4">
                Ready to learn more about<br />
                <ProductTitle name={product.name} className="text-white" />?
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                Talk to a licensed BSQ · PRU Life UK advisor. Free consultation, no commitment.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                {['Free & no obligation', 'Licensed PRU Life UK advisor', 'Reply within 24 hrs'].map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Check size={11} style={{ color: PRU_RED }} />
                    <span className="text-xs text-gray-500">{t}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}
              className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
              <button onClick={() => setModal(true)}
                className="flex items-center justify-center gap-2 px-10 py-4 text-sm font-bold text-white transition-all"
                style={{ background: PRU_RED, borderRadius: 4, border: 'none', minWidth: 240 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#B42318')}
                onMouseLeave={e => (e.currentTarget.style.background = PRU_RED)}>
                <MessageCircle size={15} />Get a Free Consultation
              </button>
              <button
                onClick={() => window.open(`https://m.me/Bstarquartzarea?ref=product_${product.slug}`, '_blank')}
                className="flex items-center justify-center gap-2 px-10 py-4 text-sm font-bold transition-all"
                style={{ background: 'transparent', color: '#e5e7eb', border: '1px solid #4b5563', borderRadius: 4 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#4b5563'; e.currentTarget.style.color = '#e5e7eb' }}>
                <MessageCircle size={15} />Message on Facebook
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          COMPLIANCE FOOTER NOTE
      ══════════════════════════════════════════════════ */}
      <div style={{ background: '#f9f9f9', borderTop: `1px solid ${GRAY_LINE}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            {product.name} is underwritten by PRU Life Insurance Corporation of UK.
            All product details are for informational purposes only. Benefits are subject to policy
            terms and conditions, eligibility, and underwriting approval. Brilliant Star Quartz (BSQ)
            is a licensed district of PRU Life UK.
          </p>
        </div>
      </div>

      {/* Lead Modal */}
      <LeadModal open={modal} onClose={() => setModal(false)} product={product} agentHandle={agentHandle} />
    </main>
  )
}
