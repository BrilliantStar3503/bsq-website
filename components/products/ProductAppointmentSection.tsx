'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Clock, MessageCircle, Phone, ClipboardList, Send, Check, ArrowRight } from 'lucide-react'
import { products, type PruProduct } from '@/lib/products'
import { useAgentContact, getPhoneUrl } from '@/hooks/useAgentContact'

const PRU_RED     = '#D92D20'
const GRAY_BG     = '#f5f5f5'
const GRAY_LINE   = '#e5e7eb'
const EASE_OUT    = 'cubic-bezier(0.16, 1, 0.3, 1)'
const CARD_SHADOW = '0 2px 4px rgba(0,0,0,0.04), 0 12px 36px rgba(0,0,0,0.10), 0 48px 100px rgba(0,0,0,0.11)'

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  fontSize: 14,
  color: '#111',
  background: '#fff',
  border: `1px solid ${GRAY_LINE}`,
  borderRadius: 8,
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  fontFamily: 'inherit',
}

const labelBase: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: '#6b7280',
  display: 'block',
  marginBottom: 7,
}

/* ══════════════════════════════════════════════════════════════════
   PRIMARY CONVERSION SECTION — id="appointment"
   Embedded booking form (pre-selected product, when known) + Messenger
   / Call / Financial Assessment as equal-weight alternative actions.

   `product` is optional so this same section can be reused goal-
   agnostically on the Insurance Solutions Landing Page ("Book a
   Complimentary Consultation") — there it defaults the Interested
   Product field to the first registry entry rather than pre-selecting
   one. `goalId`, when provided, is forwarded as appointment context —
   reserved for the Phase 5 assessment handoff (deep-linking a visitor's
   matched goal into this form without restructuring the component).

   Submits to the shared /api/appointments endpoint with
   type: 'product_consultation' — the same intake other appointment
   flows (recruitment, financial review) will reuse.
══════════════════════════════════════════════════════════════════ */
export default function ProductAppointmentSection({ product, goalId }: { product?: PruProduct; goalId?: string }) {
  const router = useRouter()
  const { contact, agentId, openContact } = useAgentContact()
  const refSlug = product?.slug ?? 'landing'

  const [form, setForm] = useState({
    name: '', mobile: '', email: '',
    preferredDate: '', preferredTime: '',
    questions: '',
    productInterest: product?.id ?? products[0].id,
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim())   e.name   = 'Required'
    if (!form.mobile.trim()) e.mobile = 'Required'
    return e
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStatus('submitting')

    const interested = products.find(p => p.id === form.productInterest) ?? product ?? products[0]
    const utmData = (() => { try { return JSON.parse(localStorage.getItem('bsq_utm') || '{}') } catch { return {} } })()

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'product_consultation',
          lead: { name: form.name, mobile: form.mobile, email: form.email },
          schedule: { preferredDate: form.preferredDate, preferredTime: form.preferredTime },
          questions: form.questions,
          context: {
            productInterest: interested.name,
            productSlug: interested.slug,
            ...(goalId ? { goalId } : {}),
          },
          attribution: {
            agent:     utmData.utm_agent  || agentId || '',
            utmSource: utmData.utm_source || 'facebook',
            utmMedium: utmData.utm_medium || 'product_page',
          },
        }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  // scrollMarginTop: 112 = global header (60, scrolled) + ProductSwitcherNav
  // (52, fixed) — matches ProductStickyNav's docking offset, since by the
  // time a visitor scrolls/deep-links this far down a product page, both
  // bars are in their fixed state. On the landing page (no switcher nav),
  // this section sits near the bottom anyway, so the extra margin is
  // harmless overscroll, not a misalignment.
  return (
    <section id="appointment" style={{ background: GRAY_BG, borderBottom: `1px solid ${GRAY_LINE}`, scrollMarginTop: 112 }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">

        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          {/* Eyebrow — vertical bar + label, matching section-eyebrow design system */}
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <span style={{ width: 3, height: 20, background: PRU_RED, borderRadius: 2, flexShrink: 0 }} aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: PRU_RED }}>
              Next Step
            </span>
          </div>
          <h2 className="text-3xl md:text-[40px] font-black text-gray-900 mb-4 tracking-tight leading-tight">
            Book a Complimentary Consultation
          </h2>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            {product
              ? <>Speak with a licensed BSQ · PRU Life UK advisor about {product.shortName}. No cost, no obligation — just honest, expert guidance.</>
              : <>Speak with a licensed BSQ · PRU Life UK advisor about your financial goals. No cost, no obligation — just honest, expert guidance.</>}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">

          {/* ── Appointment form ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white"
            style={{
              borderRadius: 20,
              border: `1px solid ${GRAY_LINE}`,
              boxShadow: CARD_SHADOW,
              padding: '40px 44px 48px',
              overflow: 'hidden',
            }}
          >
            {status === 'done' ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ background: '#fef2f2', border: `2px solid rgba(217,45,32,0.25)` }}
                >
                  <Check size={28} style={{ color: PRU_RED }} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">You&apos;re booked in!</h3>
                <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                  A licensed BSQ · PRU Life UK advisor will confirm your {form.preferredDate ? `appointment on ${form.preferredDate}` : 'appointment'} within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelBase}>Name</label>
                    <input style={inputBase} value={form.name} onChange={e => update('name', e.target.value)}
                      placeholder="Juan dela Cruz"
                      onFocus={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(217,45,32,0.08)` }}
                      onBlur={e  => { e.currentTarget.style.borderColor = GRAY_LINE; e.currentTarget.style.boxShadow = 'none' }} />
                    {errors.name && <p className="text-xs mt-1.5" style={{ color: PRU_RED }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={labelBase}>Mobile Number</label>
                    <input style={inputBase} type="tel" value={form.mobile} onChange={e => update('mobile', e.target.value)}
                      placeholder="+63 9XX XXX XXXX"
                      onFocus={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(217,45,32,0.08)` }}
                      onBlur={e  => { e.currentTarget.style.borderColor = GRAY_LINE; e.currentTarget.style.boxShadow = 'none' }} />
                    {errors.mobile && <p className="text-xs mt-1.5" style={{ color: PRU_RED }}>{errors.mobile}</p>}
                  </div>
                </div>

                <div>
                  <label style={labelBase}>Email (optional)</label>
                  <input style={inputBase} type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder="you@example.com"
                    onFocus={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(217,45,32,0.08)` }}
                    onBlur={e  => { e.currentTarget.style.borderColor = GRAY_LINE; e.currentTarget.style.boxShadow = 'none' }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelBase}><Calendar size={11} className="inline mr-1 -mt-0.5" />Preferred Date</label>
                    <input style={inputBase} type="date" value={form.preferredDate} onChange={e => update('preferredDate', e.target.value)}
                      onFocus={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(217,45,32,0.08)` }}
                      onBlur={e  => { e.currentTarget.style.borderColor = GRAY_LINE; e.currentTarget.style.boxShadow = 'none' }} />
                  </div>
                  <div>
                    <label style={labelBase}><Clock size={11} className="inline mr-1 -mt-0.5" />Preferred Time</label>
                    <input style={inputBase} type="time" value={form.preferredTime} onChange={e => update('preferredTime', e.target.value)}
                      onFocus={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(217,45,32,0.08)` }}
                      onBlur={e  => { e.currentTarget.style.borderColor = GRAY_LINE; e.currentTarget.style.boxShadow = 'none' }} />
                  </div>
                </div>

                <div>
                  <label style={labelBase}>Interested Product</label>
                  <select style={inputBase} value={form.productInterest} onChange={e => update('productInterest', e.target.value)}
                    onFocus={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(217,45,32,0.08)` }}
                    onBlur={e  => { e.currentTarget.style.borderColor = GRAY_LINE; e.currentTarget.style.boxShadow = 'none' }}>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelBase}>Questions (optional)</label>
                  <textarea style={{ ...inputBase, minHeight: 96, resize: 'vertical' }}
                    value={form.questions} onChange={e => update('questions', e.target.value)}
                    placeholder="Anything specific you'd like your advisor to cover?"
                    onFocus={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(217,45,32,0.08)` }}
                    onBlur={e  => { e.currentTarget.style.borderColor = GRAY_LINE; e.currentTarget.style.boxShadow = 'none' }} />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-center font-medium" style={{ color: PRU_RED }}>
                    Something went wrong. Please try again.
                  </p>
                )}

                <button type="submit" disabled={status === 'submitting'}
                  className="w-full py-4 text-sm font-bold text-white flex items-center justify-center gap-2"
                  style={{
                    background: status === 'submitting' ? '#aaa' : PRU_RED,
                    borderRadius: 999,
                    border: 'none',
                    transition: `background 0.2s ${EASE_OUT}, box-shadow 0.2s ${EASE_OUT}`,
                    boxShadow: status === 'submitting' ? 'none' : '0 4px 18px rgba(217,45,32,0.30)',
                  }}
                  onMouseEnter={e => {
                    if (status !== 'submitting') {
                      e.currentTarget.style.background = '#B42318'
                      e.currentTarget.style.boxShadow = '0 6px 24px rgba(217,45,32,0.40)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (status !== 'submitting') {
                      e.currentTarget.style.background = PRU_RED
                      e.currentTarget.style.boxShadow = '0 4px 18px rgba(217,45,32,0.30)'
                    }
                  }}>
                  {status === 'submitting'
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Booking…</>
                    : <><Send size={14} />Book Appointment</>}
                </button>
              </form>
            )}
          </motion.div>

          {/* ── Alternative actions — equal-weight conversion paths ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <ActionCard
              icon={MessageCircle}
              title="Chat on Messenger"
              sub="Get a quick answer now"
              onClick={() => openContact(`product_${refSlug}`)}
            />
            <ActionCard
              icon={Phone}
              title="Call Me"
              sub="Speak to an advisor directly"
              onClick={() => {
                const phoneUrl = getPhoneUrl(contact)
                if (phoneUrl) window.location.href = phoneUrl
                else openContact(`product_${refSlug}_call`)
              }}
            />
            <ActionCard
              icon={ClipboardList}
              title="Take Financial Assessment"
              sub="Find your protection gaps in 3 minutes"
              onClick={() => router.push('/assessment')}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ActionCard({ icon: Icon, title, sub, onClick }: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  title: string; sub: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 text-left bg-white w-full"
      style={{
        borderRadius: 16,
        border: `1px solid ${GRAY_LINE}`,
        padding: '20px 22px',
        transition: `border-color 0.25s, box-shadow 0.25s, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = PRU_RED
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(217,45,32,0.12)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = GRAY_LINE
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 48, height: 48, background: '#fef2f2', borderRadius: 12 }}
      >
        <Icon size={20} style={{ color: PRU_RED }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      </div>
      <ArrowRight size={14} className="text-gray-300 group-hover:text-red-400 flex-shrink-0 transition-colors duration-200" />
    </button>
  )
}
