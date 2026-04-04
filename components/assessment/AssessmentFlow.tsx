'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Shield, TrendingUp, Clock, ArrowRight, Info, Zap, CheckCircle, BarChart2, RotateCcw, Home, Mail, Phone, X, Send, MessageCircle, Check, Sparkles, User } from 'lucide-react'
import { questions } from '@/lib/assessment-questions'
import { computeScore, type Answers, type ScoreResult } from '@/lib/assessment-scoring'
import { getRecommendationsFromAnswers, type RecommendationResult } from '@/lib/recommendation-engine'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { ShineBorder } from '@/components/ui/shine-border'
import { AssessmentTrustStrip, ResultsStatsBanner } from '@/components/ui/assessment-stats'
import { useAgentContact } from '@/hooks/useAgentContact'
import TestimonialForm from '@/components/ui/testimonial-form'

/* ─── Constants ────────────────────────────────────────────────────── */
const SCAN_STEPS = [
  'Scanning your financial profile...',
  'Analyzing income stability...',
  'Evaluating risk exposure...',
  'Identifying financial gaps...',
  'Generating recommendations...',
]

const RADIUS = 64
const CIRC   = 2 * Math.PI * RADIUS

/* ─── Score Ring ────────────────────────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const [display, setDisplay] = useState(0)
  const [offset, setOffset]   = useState(CIRC)
  const gradId = useRef(`sg-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    let start: number | null = null
    const dur = 1800
    const tick = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / dur, 1)
      const e = 1 - Math.pow(1 - p, 4)
      setDisplay(Math.round(e * score))
      setOffset(CIRC - e * (score / 100) * CIRC)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [score])

  const c1 = score < 35 ? '#ff3b3b' : score < 55 ? '#D92D20' : score < 75 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.7)'
  const c2 = score < 35 ? '#b30000' : score < 55 ? '#B42318' : score < 75 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)'
  const statusColor = score < 35 ? '#ff5b5b' : score < 55 ? '#ff8a8a' : score < 75 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.8)'

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full" style={{
          background: `radial-gradient(circle, ${statusColor}14 0%, transparent 70%)`,
        }} />
        <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id={gradId.current} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={c1} />
              <stop offset="100%" stopColor={c2} />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          {/* Fill */}
          <circle
            cx="100" cy="100" r={RADIUS} fill="none"
            stroke={`url(#${gradId.current})`} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.04s linear', filter: `drop-shadow(0 0 8px ${statusColor}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-black tabular-nums leading-none" style={{ color: statusColor }}>{display}</span>
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>out of 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Financial Risk Score</p>
      </div>
    </div>
  )
}

/* ─── Progress Bar ─────────────────────────────────────────────────── */
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="w-full mb-10">
      <div className="flex justify-between text-xs mb-3">
        <span className="font-medium tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>Step {step + 1} of {total}</span>
        <span className="font-medium tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>{pct}%</span>
      </div>
      <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #ff3b3b, #b30000)',
            boxShadow: '0 0 8px rgba(255,59,59,0.6), 0 0 16px rgba(179,0,0,0.3)',
          }}
        />
      </div>
    </div>
  )
}

/* ─── Question Screen ──────────────────────────────────────────────── */
function QuestionScreen({ step, onAnswer }: { step: number; onAnswer: (val: string) => void }) {
  const q = questions[step]
  const [selected, setSelected] = useState<string | null>(null)

  const choose = (opt: string) => {
    setSelected(opt)
    setTimeout(() => onAnswer(opt), 300)
  }

  return (
    <div className="af-fade w-full">
      {/* Question */}
      <div className="mb-10 text-center">
        <p className="text-3xl md:text-4xl font-bold text-white leading-snug mb-3 tracking-tight">{q.question}</p>
        {q.subtitle && (
          <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-xl mx-auto">{q.subtitle}</p>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-4">
        {q.options.map((opt) => {
          const isSelected = selected === opt
          return (
            <div key={opt} className="relative rounded-2xl">
              <GlowingEffect
                proximity={90}
                spread={isSelected ? 55 : 38}
                inactiveZone={0}
                borderWidth={1}
                color={isSelected ? 'rgba(239,68,68,0.95)' : 'rgba(220,38,38,0.55)'}
              />
              <button
                onClick={() => choose(opt)}
                className="relative w-full text-left px-6 py-5 rounded-2xl transition-all duration-250 active:scale-[0.98]"
                style={{
                  background:  isSelected ? 'rgba(220,0,0,0.08)' : 'rgba(255,255,255,0.04)',
                  border:      `1px solid ${isSelected ? 'rgba(220,0,0,0.8)' : 'rgba(255,255,255,0.09)'}`,
                  boxShadow:   isSelected ? '0 0 25px rgba(220,0,0,0.35)' : 'none',
                  transform:   isSelected ? 'translateY(-2px)' : 'translateY(0)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    const el = e.currentTarget
                    el.style.background = 'rgba(255,255,255,0.07)'
                    el.style.borderColor = 'rgba(220,0,0,0.35)'
                    el.style.transform = 'translateY(-2px)'
                    el.style.boxShadow = '0 4px 20px rgba(220,0,0,0.12)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    const el = e.currentTarget
                    el.style.background = 'rgba(255,255,255,0.04)'
                    el.style.borderColor = 'rgba(255,255,255,0.09)'
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = 'none'
                  }
                }}
              >
                <span className="flex items-center gap-4">
                  {/* Custom radio */}
                  <span
                    className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{
                      width: 22, height: 22,
                      border: `2px solid ${isSelected ? '#ef4444' : 'rgba(255,255,255,0.25)'}`,
                      background: isSelected ? '#dc2626' : 'transparent',
                      boxShadow: isSelected ? '0 0 10px rgba(220,38,38,0.4)' : 'none',
                    }}
                  >
                    {isSelected && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                    )}
                  </span>
                  <span
                    className="text-sm md:text-base font-medium transition-colors duration-200"
                    style={{ color: isSelected ? '#fca5a5' : 'rgba(255,255,255,0.75)' }}
                  >
                    {opt}
                  </span>
                </span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Scanning Screen (self-contained — drives its own step counter) ─ */
function ScanningScreen() {
  const [activeStep, setActiveStep]     = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(t)
  }, [])

  // Drive steps on mount — runs ONCE, no external dependency
  useEffect(() => {
    let idx = 0
    const interval = setInterval(() => {
      idx++
      setActiveStep(idx)
      if (idx >= SCAN_STEPS.length) clearInterval(interval)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="af-fade flex flex-col items-center justify-center py-20 px-4 w-full max-w-sm mx-auto">
      <div className="w-full rounded-2xl overflow-hidden" style={{
        background: '#0d1117',
        border: '1px solid rgba(220,0,0,0.22)',
        boxShadow: '0 0 32px rgba(220,0,0,0.08)',
      }}>
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-1.5">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D92D20', display: 'inline-block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B42318', display: 'inline-block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7f0000', display: 'inline-block' }} />
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginLeft: 4 }}>
            bsq-ai-scanner — running
          </span>
          <span className="scan-pulse ml-auto" style={{
            width: 6, height: 6, borderRadius: '50%', background: '#D92D20', display: 'inline-block',
          }} />
        </div>

        {/* Steps */}
        <div className="px-5 py-5 space-y-3">
          {SCAN_STEPS.map((label, i) => {
            const isDone    = i < activeStep
            const isCurrent = i === activeStep
            return (
              <div
                key={i}
                className="flex items-center gap-3"
                style={{ opacity: isDone || isCurrent ? 1 : 0.25, transition: 'opacity 0.4s ease' }}
              >
                <span style={{
                  width: 18, height: 18, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: isDone ? 'rgba(220,0,0,0.15)' : isCurrent ? 'rgba(220,0,0,0.10)' : 'rgba(255,255,255,0.04)',
                  border: isDone ? '1px solid rgba(255,59,59,0.5)' : isCurrent ? '1px solid rgba(220,0,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease',
                }}>
                  {isDone ? (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : isCurrent ? (
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D92D20', display: 'inline-block' }} />
                  ) : (
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
                  )}
                </span>
                <p style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.01em',
                  color: isDone ? '#ffffff' : isCurrent ? '#fca5a5' : 'rgba(255,255,255,0.25)',
                  transition: 'color 0.3s ease',
                }}>
                  {isDone ? `✓ ${label}` : label}
                  {isCurrent && (
                    <span style={{
                      display: 'inline-block', width: 6, height: 12,
                      background: '#D92D20', marginLeft: 3, verticalAlign: 'text-bottom',
                      opacity: cursorVisible ? 1 : 0, transition: 'opacity 0.1s',
                    }} />
                  )}
                </p>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="px-5 pb-5">
          <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 9999,
              background: 'linear-gradient(to right, #7f0000, #D92D20)',
              width: `${Math.min((activeStep / SCAN_STEPS.length) * 100, 100)}%`,
              transition: 'width 0.45s cubic-bezier(0.34,1.2,0.64,1)',
            }} />
          </div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginTop: 8, textAlign: 'right' }}>
            {Math.min(Math.round((activeStep / SCAN_STEPS.length) * 100), 100)}% complete
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-6 text-center">AI analysis complete in a moment…</p>
    </div>
  )
}

/* ─── Lead Capture Modal ────────────────────────────────────────────── */
interface LeadCaptureModalProps {
  open: boolean
  onClose: () => void
  result: ScoreResult
}

function LeadCaptureModal({ open, onClose, result }: LeadCaptureModalProps) {
  const [contactType, setContactType] = useState<'email' | 'phone'>('email')
  const [name, setName]               = useState('')
  const [contact, setContact]         = useState('')
  const [submitted, setSubmitted]     = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const { openContact }               = useAgentContact()

  const score       = result.total
  const statusLabel = result.status === 'good' ? 'Well Protected'
                    : result.status === 'moderate' ? 'Moderate Risk'
                    : result.status === 'at-risk'  ? 'At Risk'
                    : 'Critical Risk'

  const RED = '#ed1b2e'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) return
    setLoading(true)
    setError('')

    // ── Read UTM attribution saved on page load ──
    const agent     = localStorage.getItem('bsq_utm_agent')  || 'direct'
    const utmSource = localStorage.getItem('bsq_utm_source') || 'direct'
    const utmMedium = localStorage.getItem('bsq_utm_medium') || 'organic'

    try {
      const res = await fetch('/api/capture-lead', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contactType,
          contact,
          score,
          statusLabel,
          riskLevel:       result.riskLevel,
          gaps:            result.gaps,
          recommendations: result.recommendations,
          agent,
          utmSource,
          utmMedium,
        }),
      })

      if (!res.ok) throw new Error('Request failed')

      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Reset on close
  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setSubmitted(false)
      setLoading(false)
      setName('')
      setContact('')
    }, 300)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md rounded-3xl overflow-hidden pointer-events-auto"
              style={{ background: '#fff', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}
            >
              {/* Red top stripe */}
              <div style={{ height: 4, background: `linear-gradient(to right, ${RED}, #f87171 60%, transparent)` }} />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                <X size={16} />
              </button>

              <div className="px-7 pt-6 pb-8">
                {!submitted ? (
                  <>
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: '#fef2f2' }}>
                          <Send size={16} style={{ color: RED }} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: RED }}>
                            Save Your Results
                          </p>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 leading-tight mb-2">
                        Get a Free Copy of<br />Your Financial Report
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        We&apos;ll send your personalised financial gap report and tailored
                        recommendations directly to you — completely free.
                      </p>
                    </div>

                    {/* Score summary pill */}
                    <div className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-6"
                      style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shrink-0"
                        style={{ background: score < 40 ? '#fef2f2' : score < 65 ? '#f9fafb' : '#f3f4f6',
                                 color: score < 40 ? RED : score < 65 ? '#374151' : '#111827' }}>
                        {score}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{statusLabel}</p>
                        <p className="text-[10px] text-gray-400">Your Financial Risk Score</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5">
                          Your Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Maria Santos"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 outline-none transition-all duration-200"
                          style={{
                            border: '1.5px solid #e5e7eb',
                            background: '#fafafa',
                          }}
                          onFocus={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = `0 0 0 3px ${RED}15` }}
                          onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
                        />
                      </div>

                      {/* Contact type toggle */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5">
                          Send via
                        </label>
                        <div className="flex gap-2 mb-3">
                          {(['email', 'phone'] as const).map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => { setContactType(type); setContact('') }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1 active:scale-[0.97]"
                              style={contactType === type
                                ? { background: RED, color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.10)' }
                                : { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' }
                              }
                            >
                              {type === 'email' ? <Mail size={12} /> : <Phone size={12} />}
                              {type === 'email' ? 'Email' : 'SMS / Mobile'}
                            </button>
                          ))}
                        </div>

                        {/* Contact input */}
                        <input
                          key={contactType}
                          type={contactType === 'email' ? 'email' : 'tel'}
                          placeholder={contactType === 'email' ? 'you@example.com' : '+63 9XX XXX XXXX'}
                          value={contact}
                          onChange={e => setContact(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 outline-none transition-all duration-200"
                          style={{ border: '1.5px solid #e5e7eb', background: '#fafafa' }}
                          onFocus={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = `0 0 0 3px ${RED}15` }}
                          onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
                        />
                      </div>

                      {/* Error */}
                      {error && (
                        <p className="text-xs text-center font-medium" style={{ color: RED }}>{error}</p>
                      )}

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.97 }}
                        className="ar-btn-primary w-full py-4 text-sm"
                        style={{ opacity: loading ? 0.7 : 1 }}
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending your report…
                          </>
                        ) : (
                          <>
                            <Send size={14} /> Send My Results
                          </>
                        )}
                      </motion.button>

                      <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                        🔒 Your information is kept private. No spam, ever.
                      </p>
                    </form>
                  </>
                ) : (
                  /* ── Success state ──────────────────────────────── */
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                      style={{ background: '#fef2f2', border: '2px solid #fca5a5' }}>
                      <CheckCircle size={28} style={{ color: '#D92D20' }} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">
                      Report Sent, {name.split(' ')[0]}! 🎉
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs mx-auto">
                      A licensed BSQ advisor will review your results and reach out
                      within 24 hours with a personalised plan.
                    </p>

                    <div className="space-y-3">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openContact(`results_lead_score${score}`)}
                        className="ar-btn-primary w-full py-3.5 text-sm"
                      >
                        <MessageCircle size={15} />
                        Talk to an Advisor Now
                      </motion.button>
                      <button
                        onClick={handleClose}
                        className="ar-btn-tertiary w-full py-3 text-sm"
                      >
                        Back to My Results
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── Results Screen — PRU Life UK Modern ──────────────────────────── */
const PRU_RED = '#ed1b2e'

function ResultsScreen({ result, engineResult }: { result: ScoreResult; engineResult: RecommendationResult }) {
  const [leadModalOpen, setLeadModalOpen] = useState(false)
  const { openContact, contactUrl }       = useAgentContact()

  /* ── Design tokens ── */
  const RED_SOFT  = `${PRU_RED}12`
  const RED_MED   = `${PRU_RED}30`

  const gapIcon: Record<string, React.ReactNode> = {
    income:       <Shield size={15} />,
    medical:      <AlertTriangle size={15} />,
    savings:      <TrendingUp size={15} />,
    retirement:   <Clock size={15} />,
    awareness:    <Zap size={15} />,
    optimization: <BarChart2 size={15} />,
  }

  const sevStyle = {
    high:   { color: '#ff5b5b', bg: 'rgba(220,0,0,0.10)',  border: 'rgba(255,59,59,0.35)',   label: 'High Risk'     },
    medium: { color: 'rgba(255,255,255,0.55)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', label: 'Moderate Risk' },
    low:    { color: 'rgba(255,255,255,0.40)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.09)', label: 'Low Risk'      },
  }

  const statusColor = result.status === 'good' ? 'rgba(255,255,255,0.75)' : result.status === 'moderate' ? 'rgba(255,255,255,0.55)' : '#ff5b5b'
  const statusLabel = result.status === 'good' ? 'Well Protected' : result.status === 'moderate' ? 'Moderate Risk' : result.status === 'at-risk' ? 'At Risk' : 'Critical Risk'

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
  const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } } }

  const subScores = [
    { label: 'Protection', val: result.protectionScore,  icon: <Shield size={13} /> },
    { label: 'Savings',    val: result.savingsScore,     icon: <TrendingUp size={13} /> },
    { label: 'Retirement', val: result.retirementScore,  icon: <Clock size={13} /> },
    { label: 'Awareness',  val: result.awarenessScore,   icon: <Zap size={13} /> },
  ]

  const tierLabel =
    engineResult.incomeTier === 'entry'   ? 'Entry Income Tier'
    : engineResult.incomeTier === 'mid'   ? 'Mid Income Tier'
    : engineResult.incomeTier === 'high'  ? 'High Income Tier'
    : 'Premium Income Tier'

  const catColor: Record<string, { text: string; bg: string; border: string }> = {
    Protection: { text: PRU_RED,   bg: RED_SOFT,  border: RED_MED  },
    Health:     { text: '#ff5b5b', bg: 'rgba(220,0,0,0.10)', border: 'rgba(255,59,59,0.3)' },
    Investment: { text: '#ff8a8a', bg: 'rgba(220,0,0,0.08)', border: 'rgba(255,59,59,0.2)' },
    Retirement: { text: 'rgba(255,255,255,0.55)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)' },
    Wealth:     { text: 'rgba(255,255,255,0.45)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.09)' },
  }

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto px-4 md:px-8 pb-24 space-y-8"
      variants={stagger} initial="hidden" animate="show"
    >

      {/* ══ Stats Banner ════════════════════════════════════════════════ */}
      <motion.div variants={fadeUp}>
        <ResultsStatsBanner />
      </motion.div>

      {/* ══ SECTION 1 — Score Overview ═══════════════════════════════ */}
      <motion.div variants={fadeUp}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg, #ff3b3b, #b30000 60%, transparent)', boxShadow: '0 0 6px rgba(255,59,59,0.4)' }} />
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Score ring */}
          <div className="flex flex-col items-center justify-center p-8 gap-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} >
            <ScoreRing score={result.total} />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: `${statusColor}18`, border: `1px solid ${statusColor}40` }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
              <span className="text-xs font-semibold tracking-wide" style={{ color: statusColor }}>{statusLabel}</span>
            </div>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>Financial Risk Score</p>
            <div className="w-full mt-1 pt-3 flex items-center justify-center gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {subScores.map(({ label, val }) => {
                const c = val < 40 ? '#ff5b5b' : val < 65 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.7)'
                return (
                  <div key={label} className="flex flex-col items-center gap-0.5">
                    <span style={{ fontSize: 16, fontWeight: 600, color: c, fontVariantNumeric: 'tabular-nums' }}>{val}</span>
                    <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>{label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sub-scores */}
          <div className="p-8 md:p-10 flex flex-col justify-center gap-5">
            <div>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: '#ff5b5b', marginBottom: 6 }}>Assessment Summary</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{result.explanation}</p>
            </div>
            <div className="space-y-4">
              {subScores.map(({ label, val, icon }) => {
                const barColor = val < 40 ? '#ff5b5b' : val < 65 ? '#f97316' : val < 85 ? 'rgba(255,255,255,0.6)' : '#4ade80'
                const grade    = val < 40 ? 'Needs attention' : val < 65 ? 'Fair' : val < 85 ? 'Good' : 'Excellent'
                return (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>{icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{grade}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: barColor, fontVariantNumeric: 'tabular-nums', minWidth: 24, textAlign: 'right' }}>{val}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <motion.div className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 1.1, delay: 0.4, ease: 'easeOut' as const }}
                        style={{
                          background: val < 40
                            ? 'linear-gradient(90deg, #ff3b3b, #b30000)'
                            : val < 65
                            ? 'linear-gradient(90deg, #f97316, #c2410c)'
                            : val < 85
                            ? 'rgba(255,255,255,0.35)'
                            : 'linear-gradient(90deg, #4ade80, #16a34a)',
                          boxShadow: val < 40
                            ? '0 0 6px rgba(255,59,59,0.45)'
                            : val < 65
                            ? '0 0 6px rgba(249,115,22,0.35)'
                            : val >= 85
                            ? '0 0 6px rgba(74,222,128,0.3)'
                            : 'none',
                        }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </motion.div>

      {/* ══ SECTION 2 — Emergency Fund (conditional) ════════════════════ */}
      {result.emergencyFundTarget > 0 && (
        <motion.div variants={fadeUp}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,59,59,0.2)',
            boxShadow: '0 4px 24px rgba(220,0,0,0.08)',
          }}>
          <div style={{ height: 2, background: 'linear-gradient(90deg, #ff3b3b, #b30000, transparent)', boxShadow: '0 0 6px rgba(255,59,59,0.3)' }} />
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: '#ff5b5b' }}>Emergency Fund Target</p>
              <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 999, fontWeight: 500, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)' }}>Industry Grade</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginBottom: 4 }}>Recommended Target</p>
                <p style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  ₱{result.emergencyFundTarget.toLocaleString('en-PH')}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
                  {result.emergencyFundMonths.toFixed(1)} months × ₱{result.emergencyFundMonthlyExp.toLocaleString('en-PH')}/mo
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(220,0,0,0.1)', border: '1px solid rgba(255,59,59,0.2)' }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff5b5b', fontWeight: 600, marginBottom: 4 }}>Months Coverage</p>
                <p style={{ fontSize: 22, fontWeight: 600, color: '#ffffff' }}>{result.emergencyFundMonths.toFixed(1)}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Based on your income type &amp; dependents</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 4 }}>Monthly Expenses</p>
                <p style={{ fontSize: 22, fontWeight: 600, color: '#ffffff' }}>₱{result.emergencyFundMonthlyExp.toLocaleString('en-PH')}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Essential expenses only</p>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <Info size={12} className="shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }} />
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
                <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Industry standard:</span> Keep 1–2 months liquid in cash or savings. Park the remainder in a high-yield money market fund — not locked in long-term investments.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ══ SECTION 3 — Financial Gaps ══════════════════════════════════ */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-widest font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>Risk Analysis</p>
            <h2 className="text-xl font-semibold tracking-tight" style={{ color: 'rgba(255,255,255,0.85)' }}>Financial Gaps Identified</h2>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: 'rgba(220,0,0,0.15)', color: '#ff5b5b', border: '1px solid rgba(255,59,59,0.3)' }}>
            {result.gaps.length} found
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.gaps.map((gap, i) => {
            const sv = sevStyle[gap.severity]
            return (
              <motion.div key={gap.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: 'easeOut' as const }}
                whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
                className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200"
                style={{
                  background: sv.bg,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `1px solid ${sv.border}`,
                  borderLeft: `3px solid ${sv.color}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                }}>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)', color: sv.color, border: `1px solid ${sv.border}` }}>
                    {gapIcon[gap.id] ?? <AlertTriangle size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.85)' }}>{gap.title}</h4>
                    <span className="text-xs font-medium" style={{ color: sv.color }}>{sv.label}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{gap.description}</p>
                <div className="flex items-start gap-2 rounded-xl px-3 py-2.5"
                  style={{ background: sv.bg }}>
                  <ArrowRight size={11} className="shrink-0 mt-0.5" style={{ color: sv.color }} />
                  <p className="text-xs font-medium leading-relaxed" style={{ color: sv.color }}>{gap.consequence}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ══ SECTION 4 — Advisor Recommendation ═════════════════════════ */}
      <motion.div variants={fadeUp}
        className="rounded-2xl p-6 flex gap-4 items-start"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}>
        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(220,0,0,0.15)', border: '1px solid rgba(255,59,59,0.3)' }}>
          <User size={16} style={{ color: '#ff5b5b' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#ff5b5b', letterSpacing: '0.15em' }}>Your BSQ Advisor</p>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {engineResult.segment} · {tierLabel}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            &ldquo;{engineResult.positioning_message}&rdquo;
          </p>
        </div>
      </motion.div>

      {/* ══ SECTION 5 — Recommended Plans ══════════════════════════════ */}
      <motion.div variants={fadeUp}>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>Personalised to your profile</p>
          <h2 className="text-xl font-semibold tracking-tight" style={{ color: 'rgba(255,255,255,0.85)' }}>Recommended Plans</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.recommendations.map((rec, i) => {
            const hex          = rec.color ?? PRU_RED
            const engineMatch  = engineResult.recommended_products.find(e => e.slug === rec.slug)
            const isTopPick    = engineMatch?.priority === 1
            const isIncomeFit  = !!engineMatch
            const cc           = catColor[rec.category] ?? { text: hex, bg: `${hex}10`, border: `${hex}25` }

            return (
              <motion.div key={rec.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.08, duration: 0.4, ease: 'easeOut' as const }}
                className="h-full">
              <ShineBorder
                color={['#1a0000', '#6b0000', '#B42318', '#D92D20', '#B42318', '#6b0000', '#1a0000']}
                borderRadius={16}
                borderWidth={1}
                duration={8 + i * 2}
                className="h-full"
              >
                <div
                  className="rounded-2xl flex flex-col relative h-full overflow-hidden transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: isTopPick ? '0 4px 32px rgba(220,0,0,0.2)' : '0 2px 16px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = isTopPick ? '0 8px 40px rgba(220,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.45)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = isTopPick ? '0 4px 32px rgba(220,0,0,0.2)' : '0 2px 16px rgba(0,0,0,0.3)' }}
                  >

                {/* Advisor's Pick badge */}
                {isTopPick && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: RED_SOFT, color: PRU_RED, border: `1px solid ${RED_MED}` }}>
                    <Sparkles size={10} />
                    Advisor&apos;s Pick
                  </div>
                )}

                {/* Top accent */}
                <div style={{ height: 3, background: isTopPick ? PRU_RED : hex, borderRadius: '12px 12px 0 0' }} />

                {/* Card header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                      style={{ background: cc.bg }}>
                      {rec.emoji}
                    </div>
                    <div className="flex-1 pt-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                          style={{ color: cc.text, background: cc.bg, border: `1px solid ${cc.border}` }}>
                          {rec.category}
                        </span>
                        {isIncomeFit && !isTopPick && (
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                            style={{ color: '#ff8a8a', background: 'rgba(220,0,0,0.10)', border: '1px solid rgba(255,59,59,0.25)' }}>
                            ✓ Income Fit
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.85)' }}>{rec.shortName ?? rec.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{rec.what}</p>
                </div>

                {/* Divider */}
                <div className="mx-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

                {/* Key benefits */}
                <div className="p-6 pt-4 flex flex-col flex-1 gap-4">
                  {rec.keyBenefits && rec.keyBenefits.slice(0, 2).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>Key Benefits</p>
                      {rec.keyBenefits.slice(0, 2).map((b, bi) => (
                        <div key={bi} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: cc.bg, border: `1px solid ${cc.border}` }}>
                            <Check size={9} style={{ color: cc.text }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{b.title}</p>
                            <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{b.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Why this fits */}
                  <div className="rounded-xl p-3.5 mt-auto" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-xs uppercase tracking-widest font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.13em' }}>Why this fits you</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{rec.why}</p>
                    {engineMatch && (
                      <p className="text-xs leading-relaxed mt-2 pt-2 italic" style={{ color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        {engineMatch.reason}
                      </p>
                    )}
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-2 pt-1">
                    <a href={`/products/${rec.slug}`}
                      className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.97]"
                      style={{ color: cc.text, border: `1px solid ${cc.border}`, background: cc.bg }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = cc.text; el.style.color = '#fff'; el.style.borderColor = cc.text }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = cc.bg; el.style.color = cc.text; el.style.borderColor = cc.border }}>
                      Learn More <ArrowRight size={12} />
                    </a>
                    <button onClick={() => openContact(`rec_${rec.slug}`)}
                      className="h-10 px-3 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
                      style={{ color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
                      <MessageCircle size={12} /> Advisor
                    </button>
                  </div>
                </div>
              </div>
              </ShineBorder>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ══ SECTION 6 — CTA ═════════════════════════════════════════════ */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Save Report */}
        <div className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}>
          {/* Red top stripe */}
          <div className="absolute top-0 left-0 right-0" style={{ height: 2, background: 'linear-gradient(90deg, #ff3b3b, #b30000 60%, transparent)', boxShadow: '0 0 6px rgba(255,59,59,0.3)' }} />
          <div className="flex items-center gap-3 mt-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(220,0,0,0.15)', border: '1px solid rgba(255,59,59,0.25)' }}>
              <Mail size={15} style={{ color: '#ff5b5b' }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#ff5b5b', letterSpacing: '0.13em' }}>Save Your Report</p>
              <h3 className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>Get it via Email or SMS</h3>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Receive a personalised copy of your financial gap report with tailored recommendations — free and instant.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {['Instant delivery', 'Free & private', 'No spam'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check size={11} style={{ color: '#ff5b5b' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{t}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setLeadModalOpen(true)}
            className="ar-btn-primary h-12 w-full rounded-xl text-sm">
            <Send size={14} />
            Send My Results
          </button>
        </div>

        {/* Talk to Advisor */}
        <div className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 10% 50%, rgba(220,0,0,0.12) 0%, transparent 60%)' }} />
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(220,0,0,0.15)', border: '1px solid rgba(255,59,59,0.25)' }}>
              <MessageCircle size={15} style={{ color: '#ff5b5b' }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#ff5b5b', letterSpacing: '0.13em' }}>Talk to an Expert</p>
              <h3 className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>Free Consultation</h3>
            </div>
          </div>
          <p className="relative text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            A licensed BSQ · PRU Life UK advisor will review your results and build a personalised plan — no cost, no obligation.
          </p>
          <div className="relative flex flex-wrap gap-x-4 gap-y-1">
            {['Free consultation', 'No obligation', 'Licensed advisor'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check size={11} style={{ color: '#ff5b5b' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{t}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => openContact(`results_score${result.total}`)}
            className="ar-btn-secondary-dark relative h-12 w-full rounded-xl text-sm">
            <MessageCircle size={14} />
            Talk to an Advisor
          </button>
        </div>
      </motion.div>

      {/* ── Lead Capture Modal ────────────────────────────────── */}
      <LeadCaptureModal
        open={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        result={result}
      />

      {/* ── Testimonial Form ─────────────────────────────────────── */}
      <motion.div variants={fadeUp}
        className="rounded-2xl p-8 md:p-10"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}>
        <TestimonialForm />
      </motion.div>

      {/* ── Disclaimer ───────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex items-start gap-2.5">
        <Info size={12} className="shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }} />
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Results are based on financial planning models assessing risk exposure, savings behavior, and long-term readiness. Advisory purposes only — not financial advice. PRU Life UK products subject to eligibility and underwriting.
        </p>
      </motion.div>

    </motion.div>
  )
}

/* ─── Header height constants ──────────────────────────────────────── */
/**
 * BSQ_H — the one source of truth for the main site header height.
 * BsqHeader uses `position: fixed` with a constant h-14 (56 px) — it
 * never collapses or resizes on scroll, so every fixed sub-header in
 * this page simply starts at top: BSQ_H.
 *
 * Keep this value in sync with BSQ_HEADER_H in HeaderWrapper.tsx.
 */
const BSQ_H         = 56   // BsqHeader fixed height (h-14)

const TRUST_H       = 32   // Layer 1 — announcement bar (trust strip)
const BSQ_NAV_H     = 44   // Layer 2 — main nav (Apple standard)
const ACCENT_H      = 2    // Results phase accent line

/* ─── Main AssessmentFlow — phase state machine ────────────────────── */
export default function AssessmentFlow() {
  const router = useRouter()
  const [phase, setPhase]       = useState<'question' | 'analyzing' | 'results'>('question')
  const [step, setStep]         = useState(0)
  const [answers, setAnswers]   = useState<Answers>({})
  const [result, setResult]     = useState<ScoreResult | null>(null)
  const [engineResult, setEngineResult] = useState<RecommendationResult | null>(null)

  /* Track scroll for visual effects (backdrop opacity, etc.) */
  const [pageScrolled, setPageScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setPageScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])


  const handleRetake = () => {
    setAnswers({})
    setResult(null)
    setEngineResult(null)
    setStep(0)
    setPhase('question')
  }

  const handleAnswer = (value: string) => {
    const key     = questions[step].id as keyof Answers
    const updated = { ...answers, [key]: value }
    setAnswers(updated)

    if (step < questions.length - 1) {
      // More questions remain
      setStep(step + 1)
    } else {
      // Last question — compute gap score + engine recommendations, then show results
      const computed = computeScore(updated)
      const engine   = getRecommendationsFromAnswers(updated)
      setResult(computed)
      setEngineResult(engine)
      setPhase('analyzing')
      setTimeout(() => setPhase('results'), 2500)

      // Track completion silently — fire and forget, never blocks UX
      fetch('/api/track-assessment', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score:     computed.total,
          segment:   engine.segment,
          riskLevel: computed.riskLevel,
        }),
      }).catch(() => { /* silent fail */ })
    }
  }

  // ── Render — single source of truth ──────────────────────────────
  if (phase === 'analyzing') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #000000 0%, #05070d 50%, #0a0f1c 100%)' }}>
        <style>{`
          @keyframes af-fade-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
          @keyframes scan-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.35; transform:scale(0.75); } }
          .af-fade { animation: af-fade-in 0.45s ease both; }
          .scan-pulse { animation: scan-pulse 1.2s ease-in-out infinite; }
        `}</style>
        {/* Fixed scanning header */}
        <div style={{
          position: 'fixed', top: BSQ_H, left: 0, right: 0, zIndex: 999,
          background: pageScrolled ? 'rgba(10,10,10,0.95)' : 'rgba(11,11,15,0.88)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          transition: 'top 0.2s linear, background 0.3s ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}>
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px', height: BSQ_NAV_H, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#dc2626', boxShadow: '0 0 6px #dc2626', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.01em' }}>
              BSQ Financial Assessment
            </span>
          </div>
        </div>
        <div style={{ height: BSQ_NAV_H, flexShrink: 0 }} />{/* spacer */}
        <div className="flex-1 flex flex-col items-center justify-start py-10">
          <ScanningScreen />
        </div>
        <div className="py-5 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[11px] text-white/20">Brilliant Star Quartz · Licensed PRU Life UK Advisor · Ortigas, Manila</p>
        </div>
      </div>
    )
  }

  if (phase === 'results') {
    return (
      <div id="assessment-results" className="assessment-results min-h-screen flex flex-col" style={{
        background: `
          radial-gradient(circle at 15% 10%, rgba(220,0,0,0.15), transparent 35%),
          radial-gradient(circle at 85% 20%, rgba(255,255,255,0.04), transparent 35%),
          radial-gradient(circle at 50% 90%, rgba(180,0,0,0.08), transparent 50%),
          #0b0b0f
        `,
      }}>
        {/* ── Scoped button design system — ONLY affects .assessment-results ── */}
        <style>{`
          /* ═══════════════════════════════════════════════════════════════
             Assessment Results — Scoped Button System
             Inspired by Prudential Singapore (prudential.com.sg)
             Scope: .assessment-results only — zero global side-effects
             ═══════════════════════════════════════════════════════════════ */

          /* PRIMARY — animated gradient sweep */
          .assessment-results .ar-btn-primary {
            background-image: linear-gradient(135deg, #7f0000, #B42318, #D92D20, #c0291f, #B42318, #7f0000);
            background-size: 300% 100%;
            animation: shine-pulse 5s linear infinite;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            box-shadow: none;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .assessment-results .ar-btn-primary:hover:not(:disabled) {
            filter: brightness(1.08);
          }
          .assessment-results .ar-btn-primary:focus-visible {
            outline: 2px solid #FCA5A5;
            outline-offset: 2px;
          }
          .assessment-results .ar-btn-primary:disabled {
            opacity: 0.55;
            cursor: not-allowed;
          }

          /* SECONDARY — white base, strong red border */
          .assessment-results .ar-btn-secondary {
            background-color: #ffffff;
            color: #D92D20;
            border: 1.5px solid #D92D20;
            border-radius: 6px;
            box-shadow: none;
            font-weight: 700;
            transition: background-color 0.2s ease, color 0.2s ease;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .assessment-results .ar-btn-secondary:hover:not(:disabled) {
            background-color: #D92D20;
            color: #ffffff;
          }
          .assessment-results .ar-btn-secondary:focus-visible {
            outline: 2px solid #FCA5A5;
            outline-offset: 2px;
          }

          /* SECONDARY-DARK — animated gradient on dark backgrounds */
          .assessment-results .ar-btn-secondary-dark {
            background-image: linear-gradient(135deg, #7f0000, #B42318, #D92D20, #c0291f, #B42318, #7f0000);
            background-size: 300% 100%;
            animation: shine-pulse 5s linear infinite;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            box-shadow: none;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .assessment-results .ar-btn-secondary-dark:hover:not(:disabled) {
            filter: brightness(1.08);
          }
          .assessment-results .ar-btn-secondary-dark:focus-visible {
            outline: 2px solid rgba(255,255,255,0.5);
            outline-offset: 2px;
          }

          /* TERTIARY — ghost, text + underline on hover */
          .assessment-results .ar-btn-tertiary {
            background: transparent;
            color: #6b7280;
            border: none;
            box-shadow: none;
            border-radius: 6px;
            font-weight: 500;
            transition: color 0.15s ease;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
          }
          .assessment-results .ar-btn-tertiary:hover {
            color: #111827;
            text-decoration: underline;
          }
          .assessment-results .ar-btn-tertiary:focus-visible {
            outline: 2px solid #e5e7eb;
            outline-offset: 2px;
          }
        `}</style>

        {/* ══ Apple-style two-layer fixed header ══════════════════ */}
        <div style={{
          position: 'fixed', top: BSQ_H, left: 0, right: 0, zIndex: 999,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          transition: 'top 0.2s linear',
        }}>
          {/* Layer 1 — 2px PRU red accent (identity, not decoration) */}
          <div style={{ height: ACCENT_H, background: 'linear-gradient(90deg, #ff3b3b, #b30000 70%, transparent)' }} />

          {/* Layer 2 — 44px main nav (Apple standard height) */}
          <div style={{
            background:           pageScrolled ? 'rgba(10,10,10,0.97)' : 'rgba(11,11,15,0.88)',
            backdropFilter:       'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            borderBottom:         '1px solid rgba(255,255,255,0.07)',
            transition:           'background 0.3s ease',
          }}>
            <div style={{
              maxWidth: 960, margin: '0 auto', padding: '0 20px',
              height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>

              {/* Left — back (quiet link, weight 400) */}
              <button
                onClick={() => router.push('/')}
                style={{
                  fontSize: 12, fontWeight: 400, letterSpacing: 0,
                  color: 'rgba(255,255,255,0.35)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
                  display: 'flex', alignItems: 'center', gap: 4,
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >
                <Home size={12} />
                <span className="hidden sm:inline">Home</span>
              </button>

              {/* Center — Brand (12px / 500 — SF Pro feel) */}
              <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.01em' }}>
                  BSQ Financial Assessment
                </div>
                <div style={{ fontSize: 10, fontWeight: 400, color: '#ff3b3b', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.85 }}>
                  PRU Life UK
                </div>
              </div>

              {/* Right — status + retake (compact, text-only) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="hidden sm:inline-flex" style={{
                  fontSize: 10, fontWeight: 400, color: '#ff3b3b',
                  display: 'inline-flex', alignItems: 'center', gap: 4, opacity: 0.9,
                }}>
                  <CheckCircle size={10} /> Complete
                </span>
                <button
                  onClick={handleRetake}
                  style={{
                    fontSize: 12, fontWeight: 400,
                    color: 'rgba(255,255,255,0.35)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
                    display: 'flex', alignItems: 'center', gap: 4,
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ff3b3b')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >
                  <RotateCcw size={11} />
                  <span className="hidden sm:inline">Retake</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer — compensates for fixed header height */}
        <div style={{ height: ACCENT_H + BSQ_NAV_H, flexShrink: 0 }} />

        {/* Subtle grid overlay */}
        <div className="pointer-events-none fixed inset-0 z-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',
          backgroundSize: '52px 52px',
        }} />

        {/* ── Main content ────────────────────────────────────────── */}
        <div className="relative z-10 flex-1 py-10">
          {result && engineResult && <ResultsScreen result={result} engineResult={engineResult} />}
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div className="relative z-10 py-5 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
            Brilliant Star Quartz · Licensed PRU Life UK Advisor · Ortigas, Pasig City
          </p>
        </div>

      </div>
    )
  }

  // phase === 'question' (default)
  return (
    <div className="min-h-screen flex flex-col relative"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(220,0,0,0.18), transparent 40%),
          radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05), transparent 40%),
          #0b0b0f
        `,
      }}>
      <style>{`
        @keyframes af-fade-in { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .af-fade { animation: af-fade-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes af-glow-pulse { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
      `}</style>

      {/* Subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
        backgroundSize: '52px 52px',
      }} />

      {/* Extra red ambient bottom-right */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 50% at 70% 80%, rgba(180,0,0,0.10), transparent 60%)',
      }} />

      {/* ══ Apple-style two-layer fixed header ══════════════════ */}
      <div style={{
        position: 'fixed', top: BSQ_H, left: 0, right: 0, zIndex: 999,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        transition: 'top 0.2s linear',
      }}>

        {/* Layer 1 — Announcement bar (trust strip) */}
        <div style={{
          background:           pageScrolled ? 'rgba(10,10,10,0.92)' : 'rgba(11,11,15,0.72)',
          backdropFilter:       'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom:         '1px solid rgba(255,255,255,0.04)',
          padding:              '6px 24px',
          transition:           'background 0.3s ease',
        }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <AssessmentTrustStrip />
          </div>
        </div>

        {/* Layer 2 — Main nav (44px — Apple standard) */}
        <div style={{
          background:           pageScrolled ? 'rgba(10,10,10,0.97)' : 'rgba(11,11,15,0.88)',
          backdropFilter:       'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom:         '1px solid rgba(255,255,255,0.07)',
          transition:           'background 0.3s ease',
          /* ❌ no boxShadow */
        }}>
          <div style={{
            maxWidth: 960, margin: '0 auto', padding: '0 24px',
            height: BSQ_NAV_H, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            {/* Brand (12px / 500) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                background: '#ff3b3b', display: 'inline-block',
                animation: 'af-glow-pulse 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.01em' }}>
                BSQ Financial Assessment
              </span>
            </div>

            {/* Step counter (12px / 400 — quiet) */}
            <span style={{
              fontSize: 12, fontWeight: 400,
              color: 'rgba(255,255,255,0.3)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {step + 1} / {questions.length}
            </span>
          </div>
        </div>
      </div>
      {/* Spacer — compensates for fixed header height */}
      <div style={{ height: TRUST_H + BSQ_NAV_H, flexShrink: 0 }} />

      {/* Main content — glass card */}
      <div className="relative flex-1 flex flex-col justify-center px-6 md:px-12 py-16">
        <div className="max-w-2xl mx-auto w-full">
          {/* Glass container */}
          <div style={{
            background:    'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border:        '1px solid rgba(255,255,255,0.08)',
            borderRadius:  20,
            padding:       '40px 40px 44px',
            boxShadow:     '0 8px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset',
          }}>
            <ProgressBar step={step} total={questions.length} />
            <QuestionScreen key={step} step={step} onAnswer={handleAnswer} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative px-6 py-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.05em' }}>Brilliant Star Quartz · Licensed PRU Life UK Advisor · Ortigas, Manila</p>
      </div>
    </div>
  )
}
