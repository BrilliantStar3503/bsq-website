'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle, MessageCircle, Shield, TrendingUp,
  Clock, Users, Star, ChevronDown, Phone, X, Send, Check
} from 'lucide-react'
import type { PruProduct } from '@/lib/products'

/* ─── Constants ────────────────────────────────────────────────────── */
const PRU_RED = '#ed1b2e'

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
}

/* ─── Category label ────────────────────────────────────────────────── */
const CATEGORY_LABEL: Record<string, string> = {
  vul:         'Variable Unit-Linked (VUL)',
  traditional: 'Traditional Whole Life',
  protection:  'Pure Protection',
  income:      'Income Plan',
}

/* ─── Benefit icon rotation ─────────────────────────────────────────── */
const BENEFIT_ICONS = [Shield, TrendingUp, Clock, Star, Users, CheckCircle]

/* ─── Lead Capture Modal ────────────────────────────────────────────── */
function LeadModal({
  open,
  onClose,
  product,
  agentHandle,
}: {
  open: boolean
  onClose: () => void
  product: PruProduct
  agentHandle: string
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
      const utmData = (() => {
        try { return JSON.parse(localStorage.getItem('bsq_utm') || '{}') } catch { return {} }
      })()
      await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, contact, contactType: type,
          source: `product_funnel_${product.slug}`,
          productInterest: product.name,
          attribution: {
            agent: utmData.utm_agent || agentHandle || '',
            utmSource: utmData.utm_source || 'facebook',
            utmMedium: utmData.utm_medium || 'product_page',
          },
        }),
      })
      setDone(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        {/* Top bar */}
        <div className="h-1 w-full" style={{ background: product.color }} />

        <div className="p-7 relative">
          <button onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>

          {!done ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${product.color}15` }}>
                  {product.emoji}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: product.color }}>
                    Get a Free Consultation
                  </p>
                  <h3 className="text-base font-black text-gray-900 leading-tight">{product.shortName}</h3>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Your Name</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Juan dela Cruz"
                    className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 outline-none transition-all duration-200"
                    style={{ border: '1.5px solid #e5e7eb', background: '#fafafa' }}
                    onFocus={e => { e.currentTarget.style.borderColor = product.color; e.currentTarget.style.boxShadow = `0 0 0 3px ${product.color}15` }}
                    onBlur={e  => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Contact</label>
                  <div className="flex gap-2 mb-2">
                    {(['phone', 'email'] as const).map(t => (
                      <button key={t} type="button"
                        onClick={() => { setType(t); setContact('') }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.97]"
                        style={type === t
                          ? { background: product.color, color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.10)' }
                          : { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' }
                        }>
                        <Phone size={10} /> {t === 'phone' ? 'Mobile' : 'Email'}
                      </button>
                    ))}
                  </div>
                  <input
                    key={type}
                    type={type === 'email' ? 'email' : 'tel'}
                    value={contact} onChange={e => setContact(e.target.value)}
                    placeholder={type === 'phone' ? '+63 9XX XXX XXXX' : 'you@example.com'}
                    className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 outline-none transition-all duration-200"
                    style={{ border: '1.5px solid #e5e7eb', background: '#fafafa' }}
                    onFocus={e => { e.currentTarget.style.borderColor = product.color; e.currentTarget.style.boxShadow = `0 0 0 3px ${product.color}15` }}
                    onBlur={e  => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
                  />
                </div>

                {error && <p className="text-xs text-center font-medium text-red-600">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-50"
                  style={{ background: product.color, boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.filter = 'brightness(0.9)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                  ) : (
                    <><Send size={14} /> Get My Free Consultation</>
                  )}
                </button>
                <p className="text-[10px] text-gray-400 text-center">🔒 Private & confidential. No spam, ever.</p>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}>
                <Check size={28} className="text-green-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">You&apos;re on the list! 🎉</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs mx-auto">
                A licensed BSQ advisor will reach out within 24 hours to walk you through {product.shortName}.
              </p>
              <button
                onClick={() => window.open(`https://m.me/Bstarquartzarea?ref=${messengerRef}`, '_blank')}
                className="w-full py-3.5 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-sm active:scale-[0.97]"
                style={{ background: product.color }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.9)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
              >
                <MessageCircle size={15} /> Message Us Now
              </button>
              <button onClick={onClose}
                className="w-full mt-3 py-3 rounded-xl font-semibold text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-150">
                Back to Page
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Main Funnel Page ──────────────────────────────────────────────── */
export default function ProductFunnelPage({ product }: { product: PruProduct }) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [agentHandle, setAgentHandle] = useState('')

  /* Read UTM agent from localStorage */
  useEffect(() => {
    try {
      const utm = JSON.parse(localStorage.getItem('bsq_utm') || '{}')
      if (utm.utm_agent) setAgentHandle(utm.utm_agent)
    } catch { /* silent */ }
  }, [])

  const hex       = product.color
  const bgTint    = `${hex}10`
  const bgMedium  = `${hex}18`
  const borderTint = `${hex}30`
  const messengerRef = `product_${product.slug}${agentHandle ? `_${agentHandle}` : ''}`
  const hasPhoto  = false // flip to true once real photos are added

  return (
    <main className="bg-white min-h-screen">

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24"
        style={{ background: `linear-gradient(160deg, ${bgTint} 0%, #fff 55%)` }}
      >
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: hex }} />

        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

            {/* ── Left: copy ── */}
            <motion.div
              className="flex-1"
              initial="hidden" animate="visible" variants={stagger}
            >
              {/* Category badge */}
              <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border"
                  style={{ color: hex, borderColor: borderTint, background: bgTint }}>
                  {CATEGORY_LABEL[product.category] ?? product.category}
                </span>
                {agentHandle && (
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    Shared by {agentHandle.replace(/_/g, ' ')}
                  </span>
                )}
              </motion.div>

              {/* Product name */}
              <motion.div variants={fadeUp} className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{ background: bgMedium, border: `1px solid ${borderTint}` }}>
                  {product.emoji}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl xl:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                    {product.name}
                  </h1>
                  <p className="text-base md:text-lg font-semibold mt-1" style={{ color: hex }}>
                    {product.tagline}
                  </p>
                </div>
              </motion.div>

              {/* What it is */}
              <motion.p variants={fadeUp}
                className="text-base text-gray-600 leading-relaxed mb-6 max-w-xl">
                {product.whatItIs}
              </motion.p>

              {/* Top 3 USPs */}
              <motion.div variants={stagger} className="space-y-2.5 mb-8">
                {product.usps.slice(0, 3).map((usp, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: bgMedium }}>
                      <CheckCircle size={12} style={{ color: hex }} />
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{usp}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-black text-sm text-white transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97]"
                  style={{ background: hex, boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}
                  onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.9)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                >
                  <MessageCircle size={16} /> Get a Free Consultation
                </button>
                <button
                  onClick={() => router.push('/assessment')}
                  className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-black text-sm border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97]"
                  style={{ background: '#fff', color: hex, borderColor: borderTint, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = hex; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = hex }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = hex; e.currentTarget.style.borderColor = borderTint }}
                >
                  Take Free Assessment <ArrowRight size={15} />
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeUp}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5">
                {['Licensed PRU Life UK Advisor', 'Free Consultation', 'No Obligation'].map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Check size={11} style={{ color: hex }} />
                    <span className="text-[11px] text-gray-500 font-medium">{t}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right: Product Photo ── */}
            <motion.div
              className="lg:w-[420px] xl:w-[480px] flex-shrink-0"
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            >
              <div
                className="relative w-full rounded-3xl overflow-hidden"
                style={{
                  aspectRatio: '4/3',
                  background: `linear-gradient(135deg, ${bgMedium} 0%, ${bgTint} 100%)`,
                  border: `1px solid ${borderTint}`,
                  boxShadow: `0 4px 40px ${hex}15`,
                }}
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
                  /* Placeholder — replace with real photo */
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                    <div className="text-7xl">{product.emoji}</div>
                    <div className="text-center">
                      <p className="text-sm font-black text-gray-800">{product.shortName}</p>
                      <p className="text-xs text-gray-400 mt-1">Photo coming soon</p>
                    </div>
                    {/* Decorative blobs */}
                    <div className="absolute top-8 right-8 w-20 h-20 rounded-full opacity-20"
                      style={{ background: hex, filter: 'blur(24px)' }} />
                    <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full opacity-15"
                      style={{ background: hex, filter: 'blur(20px)' }} />
                  </div>
                )}

                {/* PRU Life UK badge */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: hex }} />
                  <span className="text-[10px] font-black text-gray-700">PRU Life UK</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PROBLEM HOOK — emotional FB-style headline
      ══════════════════════════════════════════════════ */}
      <section className="py-10 md:py-14" style={{ background: bgTint }}>
        <div className="max-w-3xl mx-auto px-5 md:px-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-xl md:text-2xl font-black text-gray-900 leading-snug"
          >
            &ldquo;{product.fbHooks[0]}&rdquo;
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-sm text-gray-500 leading-relaxed max-w-xl mx-auto"
          >
            {product.problemItSolves}
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          KEY BENEFITS
      ══════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: hex }}>
              Why Choose {product.shortName}
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Key Benefits</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {product.keyBenefits.map((benefit, i) => {
              const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length]
              return (
                <motion.div key={i} variants={fadeUp}
                  className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{ background: bgTint, border: `1px solid ${borderTint}` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: bgMedium }}>
                    <Icon size={18} style={{ color: hex }} />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 mb-2 leading-snug">{benefit.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          IDEAL FOR
      ══════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20" style={{ background: '#fafafa' }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Who it's for */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: hex }}>
                This is for you if…
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">
                Is {product.shortName} Right For You?
              </h2>
              <div className="space-y-3.5">
                {product.idealFor.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: bgTint, border: `1px solid ${borderTint}` }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: bgMedium }}>
                      <Check size={12} style={{ color: hex }} />
                    </div>
                    <p className="text-sm text-gray-800 font-medium leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Specs panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 text-gray-400">
                Plan Details
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Quick Specs</h2>

              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                {[
                  ['Product Type',    product.specs.productType],
                  ['Payment Term',    product.specs.paymentTerms],
                  ['Issue Age',       product.specs.issueAge],
                  ['Entry Point',     product.specs.minPremium ?? product.specs.minSumAssured ?? 'Ask your advisor'],
                  ['Death Benefit',   product.specs.deathBenefit],
                  ['Benefit Until',   product.specs.benefitTerm],
                  ['Currency',        product.specs.currency],
                ].map(([label, value], i) => (
                  <div key={i}
                    className="flex items-start gap-4 px-5 py-4"
                    style={{ borderBottom: i < 6 ? '1px solid #f1f5f9' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa' }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 w-28 flex-shrink-0 mt-0.5">{label}</p>
                    <p className="text-xs font-semibold text-gray-800 flex-1 leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>

              {/* Riders teaser */}
              {product.riders.length > 0 && (
                <div className="mt-5 p-4 rounded-xl" style={{ background: bgTint, border: `1px solid ${borderTint}` }}>
                  <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: hex }}>
                    Available Riders ({product.riders.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.riders.slice(0, 5).map((r, i) => (
                      <span key={i} className="text-[9px] font-bold px-2 py-1 rounded-full bg-white border"
                        style={{ color: hex, borderColor: borderTint }}>
                        {r.split('(')[0].trim()}
                      </span>
                    ))}
                    {product.riders.length > 5 && (
                      <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-white border text-gray-400 border-gray-200">
                        +{product.riders.length - 5} more
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
          MORE FB HOOKS — social proof / emotional
      ══════════════════════════════════════════════════ */}
      {product.fbHooks.length > 1 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-5 md:px-10">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              initial="hidden" whileInView="visible"
              viewport={{ once: true }} variants={stagger}
            >
              {product.fbHooks.slice(1, 3).map((hook, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="p-6 rounded-2xl"
                  style={{ background: bgTint, border: `1px solid ${borderTint}` }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mb-3"
                    style={{ background: bgMedium }}>
                    <ChevronDown size={14} style={{ color: hex }} />
                  </div>
                  <p className="text-sm font-bold text-gray-800 leading-relaxed">&ldquo;{hook}&rdquo;</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          BOTTOM CTA — dark section
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24"
        style={{ background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)' }}>
        {/* Red top accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(to right, ${hex}, ${hex}60, transparent)` }} />
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 70% at 50% 50%, ${hex}18 0%, transparent 70%)` }} />

        <div className="relative max-w-3xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-4" style={{ color: hex }}>
              Take the Next Step
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              Ready to Learn More About<br />
              <span style={{ color: hex }}>{product.shortName}</span>?
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Talk to a licensed BSQ · PRU Life UK advisor. Free consultation, no commitment.
              We&apos;ll walk you through exactly how {product.shortName} works for your situation.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-black text-sm transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97]"
                style={{ background: '#fff', color: hex, boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
                onMouseEnter={e => { e.currentTarget.style.background = hex; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = hex }}
              >
                <MessageCircle size={16} /> Get a Free Consultation
              </button>
              <button
                onClick={() => window.open(`https://m.me/Bstarquartzarea?ref=${messengerRef}`, '_blank')}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-black text-sm border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.97]"
                style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
              >
                <MessageCircle size={16} /> Message on Facebook
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6">
              {['Free & no obligation', 'Licensed PRU Life UK advisor', 'Reply within 24 hrs'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={11} style={{ color: hex }} />
                  <span className="text-[11px] text-white/40">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER NOTE
      ══════════════════════════════════════════════════ */}
      <div className="bg-white px-5 py-5 text-center border-t border-gray-100">
        <p className="text-[10px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {product.name} is underwritten by PRU Life Insurance Corporation of UK.
          All product details are for informational purposes only. Benefits are subject to policy terms and conditions,
          eligibility, and underwriting approval. Brilliant Star Quartz (BSQ) is a licensed district of PRU Life UK.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════
          LEAD MODAL
      ══════════════════════════════════════════════════ */}
      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={product}
        agentHandle={agentHandle}
      />
    </main>
  )
}
