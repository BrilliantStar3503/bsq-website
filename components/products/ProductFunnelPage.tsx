'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button'
import { useAgentContact } from '@/hooks/useAgentContact'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle, MessageCircle, Shield, TrendingUp,
  Clock, Users, Star, Phone, X, Send, Check, ChevronLeft, ChevronRight
} from 'lucide-react'
import type { PruProduct } from '@/lib/products'

/* ─── Brand constants ─────────────────────────────────────────────── */
const PRU_RED   = '#D92D20'   // primary red
const GRAY_BG   = '#f5f5f5'   // light section bg
const GRAY_LINE = '#e5e7eb'   // divider

/* ─── Per-product photo config ─────────────────────────────────────────
   hero[]    — carousel photos in the hero section
   benefits[] — one photo per key benefit card (in order)
────────────────────────────────────────────────────────────────────── */
type HeroPhoto = { src: string; pos?: string }
type ProductPhotoConfig = { hero: HeroPhoto[]; benefits: string[] }

const PRODUCT_PHOTOS: Record<string, ProductPhotoConfig> = {
  'prulifetime-income': {
    hero: [
      { src: '/images/products/prulifetime-income.jpg' },
      { src: '/images/products/prulifetime-income-2.jpg' },
      { src: '/images/products/prulifetime-income-3.jpg' },
      { src: '/images/products/prulifetime-income-4.jpg' },
    ],
    benefits: [
      '/images/products/prulifetime-benefit-1.jpg',
      '/images/products/prulifetime-benefit-2.jpg',
      '/images/products/prulifetime-benefit-3.jpg',
      '/images/products/prulifetime-benefit-4.jpg',
    ],
  },
  'pru-million-protect': {
    hero: [
      { src: '/images/products/pru-million-protect.jpg',   pos: '75% center' }, // woman at laptop — crop left text
      { src: '/images/products/pru-million-protect-2.jpg', pos: 'center 25%' }, // 3 people in resto — crop bottom text
      { src: '/images/products/pru-million-protect-3.jpg', pos: 'center 30%' }, // father & daughter — crop bottom strip
      { src: '/images/products/pru-million-protect-4.jpg', pos: 'center 60%' }, // family at table — crop top & bottom text
    ],
    benefits: [],
  },
  'elite-series': { hero: [], benefits: [] },
  'prulink-assurance-account-plus': {
    hero: [
      { src: '/images/products/prulink-assurance-account-plus.jpg', pos: 'center 20%' }, // family — crop bottom text block
    ],
    benefits: [],
  },
  'prulove-for-life': { hero: [], benefits: [] },
}

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
   HERO CAROUSEL — auto-rotates every 4 s, fade transition
   Falls back to branded placeholder when no photos are provided.
══════════════════════════════════════════════════════════════════ */
function HeroCarousel({ photos, product, current, hovered, onPrev, onNext, onDot, onMouseEnter, onMouseLeave }: {
  photos: HeroPhoto[]
  product: PruProduct
  current: number
  hovered: boolean
  onPrev: () => void
  onNext: () => void
  onDot: (i: number) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  /* No photos — plain dark gradient fallback */
  if (photos.length === 0) return null

  return (
    <>
      {/* Background slides */}
      {photos.map(({ src, pos }, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`${product.name} — photo ${i + 1}`}
            fill
            className="object-cover"
            style={{ objectPosition: pos ?? 'center center' }}
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Prev / Next arrows */}
      {photos.length > 1 && (
        <>
          <button onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
            style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.2)', opacity: hovered ? 1 : 0 }}
            aria-label="Previous photo">
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
            style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.2)', opacity: hovered ? 1 : 0 }}
            aria-label="Next photo">
            <ChevronRight size={16} className="text-white" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 z-30">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => onDot(i)}
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
      )}
    </>
  )
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
  const { openContact }       = useAgentContact()

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
              <button onClick={() => openContact(messengerRef)}
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
  const router                      = useRouter()
  const [modal, setModal]           = useState(false)
  const [agentHandle, setAgent]     = useState('')
  const { openContact }             = useAgentContact()
  const photoConfig   = PRODUCT_PHOTOS[product.slug] ?? { hero: [], benefits: [] }
  const photos        = photoConfig.hero
  const benefitPhotos = photoConfig.benefits

  /* ── Carousel state lifted up ── */
  const [current, setCurrent]   = useState(0)
  const [hovered, setHovered]   = useState(false)
  const hasPhotos               = photos.length > 0

  useEffect(() => {
    if (photos.length <= 1) return
    if (hovered) return
    const timer = setInterval(() => setCurrent(p => (p + 1) % photos.length), 4000)
    return () => clearInterval(timer)
  }, [photos.length, hovered])

  useEffect(() => {
    try {
      const utm = JSON.parse(localStorage.getItem('bsq_utm') || '{}')
      if (utm.utm_agent) setAgent(utm.utm_agent)
    } catch { /* silent */ }
  }, [])

  return (
    <main style={{ background: '#fff', color: '#111' }}>

      {/* ══════════════════════════════════════════════════
          HERO — full-width background carousel
      ══════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden"
        style={{ borderBottom: `1px solid ${GRAY_LINE}` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Background: carousel images or dark gradient fallback ── */}
        {hasPhotos ? (
          <HeroCarousel
            photos={photos}
            product={product}
            current={current}
            hovered={hovered}
            onPrev={() => setCurrent(c => (c - 1 + photos.length) % photos.length)}
            onNext={() => setCurrent(c => (c + 1) % photos.length)}
            onDot={i => setCurrent(i)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          />
        ) : (
          /* No photos — solid dark bg */
          <div className="absolute inset-0" style={{ background: '#1a1a2e' }} />
        )}

        {/* Dark gradient overlay — left heavy so text is always readable */}
        <div className="absolute inset-0 z-10"
          style={{ background: hasPhotos
            ? 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.52) 55%, rgba(0,0,0,0.18) 100%)'
            : 'transparent'
          }} />

        {/* thin red top stripe */}
        <div className="absolute top-0 left-0 right-0 z-20" style={{ height: 4, background: PRU_RED }} />

        {/* ── Text content ── */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 md:px-10 py-20 lg:py-24">
          <motion.div
            className="max-w-xl"
            initial="hidden" animate="visible" variants={stagger}
          >
            {/* Category tag */}
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-5">
              <div style={{ width: 3, height: 16, background: PRU_RED, borderRadius: 2 }} />
              <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                PRU Life UK · {product.category === 'vul' ? 'Investment-Linked' : product.category === 'traditional' ? 'Traditional' : 'Insurance'} Plan
              </span>
            </motion.div>

            {/* Product name */}
            <motion.h1 variants={fadeUp}
              className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-3 text-white">
              <ProductTitle name={product.name} />
            </motion.h1>

            {/* Tagline */}
            <motion.p variants={fadeUp}
              className="text-base md:text-lg font-semibold mb-5"
              style={{ color: 'rgba(255,255,255,0.85)' }}>
              {product.tagline}
            </motion.p>

            {/* What it is */}
            <motion.p variants={fadeUp}
              className="text-sm md:text-base leading-relaxed mb-8"
              style={{ color: 'rgba(255,255,255,0.70)' }}>
              {product.whatItIs}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
              <AnimatedGradientButton
                onClick={() => setModal(true)}
                preset="pru"
                duration={5}
                className="px-8 py-3.5 text-sm rounded-sm"
              >
                <MessageCircle size={15} />Get a Free Consultation
              </AnimatedGradientButton>
              <button onClick={() => router.push('/assessment')}
                className="flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold transition-all"
                style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.6)', borderRadius: 4 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)' }}>
                Take Free Assessment <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Trust strip */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
              {['Licensed PRU Life UK Advisor', 'Free Consultation', 'No Obligation'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <Check size={12} style={{ color: PRU_RED }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{t}</span>
                </div>
              ))}
            </motion.div>

            {/* Agent attribution */}
            {agentHandle && (
              <motion.div variants={fadeUp}
                className="flex items-center gap-2 mt-4 text-xs"
                style={{ color: 'rgba(255,255,255,0.5)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Shared by {agentHandle.replace(/_/g, ' ')}
              </motion.div>
            )}
          </motion.div>
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
            <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-4">
              &ldquo;{product.fbHooks[0]}&rdquo;
            </p>
            <p className="text-base text-gray-600 leading-relaxed max-w-xl mx-auto">
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
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">Key Benefits</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-40px' }} variants={stagger}
          >
            {product.keyBenefits.map((benefit, i) => {
              const Icon = ICONS[i % ICONS.length]
              const benefitPhoto = benefitPhotos[i] ?? null
              return (
                <motion.div key={i} variants={fadeUp}
                  className="bg-white group overflow-hidden transition-all duration-300"
                  style={{
                    borderRadius: 10,
                    boxShadow: '0 6px 28px rgba(0,0,0,0.09)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.09)')}
                >
                  {/* Photo or placeholder */}
                  <div className="relative w-full overflow-hidden" style={{ height: 280 }}>
                    {benefitPhoto ? (
                      <Image
                        src={benefitPhoto}
                        alt={benefit.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: GRAY_BG, borderRadius: '10px 10px 0 0' }}>
                        <Icon size={36} style={{ color: '#d1d5db' }} />
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                    <div className="mt-5 h-0.5 w-8 transition-all duration-300 group-hover:w-14"
                      style={{ background: PRU_RED }} />
                  </div>
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
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
                Is <ProductTitle name={product.shortName} /> Right For You?
              </h2>
              <div className="space-y-3">
                {product.idealFor.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-5"
                    style={{ border: `1px solid ${GRAY_LINE}`, borderRadius: 4 }}>
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#fef2f2', borderRadius: '50%' }}>
                      <Check size={13} style={{ color: PRU_RED }} />
                    </div>
                    <p className="text-base text-gray-700 leading-snug">{item}</p>
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
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">Quick Specs</h2>

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
                    <p className="text-xs font-black uppercase tracking-wider text-gray-400 w-28 flex-shrink-0 pt-0.5">{label}</p>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium flex-1">{value}</p>
                  </div>
                ))}
              </div>

              {/* Riders */}
              {product.riders.length > 0 && (
                <div className="mt-5 bg-white p-5" style={{ border: `1px solid ${GRAY_LINE}`, borderRadius: 4 }}>
                  <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: PRU_RED }}>
                    Optional Riders ({product.riders.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.riders.slice(0, 6).map((r, i) => (
                      <span key={i} className="text-xs font-medium px-3 py-1.5 text-gray-600"
                        style={{ background: GRAY_BG, border: `1px solid ${GRAY_LINE}`, borderRadius: 4 }}>
                        {r.split('(')[0].trim()}
                      </span>
                    ))}
                    {product.riders.length > 6 && (
                      <span className="text-xs font-medium px-3 py-1.5 text-gray-400"
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
                  <p className="text-base font-semibold text-gray-800 leading-relaxed">&ldquo;{hook}&rdquo;</p>
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
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                Ready to learn more about<br />
                <ProductTitle name={product.name} className="text-white" />?
              </h2>
              <p className="text-base text-gray-400 leading-relaxed max-w-md">
                Talk to a licensed BSQ · PRU Life UK advisor. Free consultation, no commitment.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                {['Free & no obligation', 'Licensed PRU Life UK advisor', 'Reply within 24 hrs'].map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Check size={11} style={{ color: PRU_RED }} />
                    <span className="text-sm text-gray-500">{t}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}
              className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
              <AnimatedGradientButton
                onClick={() => setModal(true)}
                preset="pru"
                duration={5}
                className="px-10 py-4 text-sm rounded-sm"
                style={{ minWidth: 240 }}
              >
                <MessageCircle size={15} />Get a Free Consultation
              </AnimatedGradientButton>
              <button
                onClick={() => openContact(`product_${product.slug}`)}
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
            is a tied-branch and area of PRU Life UK with its headquarters located at PRU House, Ortigas Center, Pasig City.
          </p>
        </div>
      </div>

      {/* Lead Modal */}
      <LeadModal open={modal} onClose={() => setModal(false)} product={product} agentHandle={agentHandle} />
    </main>
  )
}
