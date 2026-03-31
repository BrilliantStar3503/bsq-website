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

  const c1 = score < 35 ? '#ef4444' : score < 55 ? '#f97316' : score < 75 ? '#eab308' : '#22c55e'
  const c2 = score < 35 ? '#ed1b2e' : score < 55 ? '#fbbf24' : score < 75 ? '#84cc16' : '#16a34a'
  const statusColor = score < 35 ? '#ef4444' : score < 55 ? '#f97316' : score < 75 ? '#eab308' : '#22c55e'

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
          <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="10" />
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
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold mt-1" style={{ color: '#9ca3af' }}>out of 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-1" style={{ color: '#9ca3af' }}>Financial Risk Score</p>
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
        <span className="text-white/40 font-medium tracking-wide">Step {step + 1} of {total}</span>
        <span className="text-white/40 font-medium tabular-nums">{pct}%</span>
      </div>
      <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: 'linear-gradient(to right, #dc2626, #f87171, #fca5a5)' }}
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
                className="relative w-full text-left px-6 py-5 rounded-2xl transition-all duration-300 active:scale-[0.98]"
                style={{
                  background:  isSelected ? 'rgba(220,38,38,0.15)' : 'rgba(255,255,255,0.04)',
                  border:      `1px solid ${isSelected ? 'rgba(220,38,38,0.5)' : 'rgba(255,255,255,0.09)'}`,
                  boxShadow:   isSelected ? '0 8px 32px rgba(220,38,38,0.15)' : 'none',
                  transform:   isSelected ? 'scale(1.01)' : 'scale(1)',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    const el = e.currentTarget
                    el.style.background = 'rgba(255,255,255,0.07)'
                    el.style.borderColor = 'rgba(255,255,255,0.15)'
                    el.style.transform = 'scale(1.015)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    const el = e.currentTarget
                    el.style.background = 'rgba(255,255,255,0.04)'
                    el.style.borderColor = 'rgba(255,255,255,0.09)'
                    el.style.transform = 'scale(1)'
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
        border: '1px solid rgba(34,211,238,0.18)',
        boxShadow: '0 0 32px rgba(34,211,238,0.06)',
      }}>
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-1.5">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginLeft: 4 }}>
            bsq-ai-scanner — running
          </span>
          <span className="scan-pulse ml-auto" style={{
            width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', display: 'inline-block',
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
                  background: isDone ? 'rgba(34,197,94,0.15)' : isCurrent ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.04)',
                  border: isDone ? '1px solid rgba(34,197,94,0.4)' : isCurrent ? '1px solid rgba(34,211,238,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease',
                }}>
                  {isDone ? (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : isCurrent ? (
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22d3ee', display: 'inline-block' }} />
                  ) : (
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
                  )}
                </span>
                <p style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.01em',
                  color: isDone ? '#4ade80' : isCurrent ? '#67e8f9' : 'rgba(255,255,255,0.25)',
                  transition: 'color 0.3s ease',
                }}>
                  {isDone ? `✓ ${label}` : label}
                  {isCurrent && (
                    <span style={{
                      display: 'inline-block', width: 6, height: 12,
                      background: '#22d3ee', marginLeft: 3, verticalAlign: 'text-bottom',
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
              background: 'linear-gradient(to right, #22d3ee, #4ade80)',
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
                        style={{ background: score < 40 ? '#fef2f2' : score < 65 ? '#fffbeb' : '#f0fdf4',
                                 color: score < 40 ? RED : score < 65 ? '#d97706' : '#059669' }}>
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
                      style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}>
                      <CheckCircle size={28} className="text-green-500" />
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
                        onClick={() => window.open(`https://m.me/Bstarquartzarea?ref=results_lead_score${score}`, '_blank')}
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
    high:   { color: PRU_RED,   bg: RED_SOFT,    border: RED_MED,        label: 'High Risk'   },
    medium: { color: '#b45309', bg: '#fffbeb',   border: '#fde68a',      label: 'Moderate Risk' },
    low:    { color: '#047857', bg: '#f0fdf4',   border: '#bbf7d0',      label: 'Low Risk'    },
  }

  const statusColor = result.status === 'good' ? '#047857' : result.status === 'moderate' ? '#b45309' : PRU_RED
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
    Health:     { text: '#0369a1', bg: '#eff6ff', border: '#bfdbfe' },
    Investment: { text: '#047857', bg: '#f0fdf4', border: '#bbf7d0' },
    Retirement: { text: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    Wealth:     { text: '#6d28d9', bg: '#faf5ff', border: '#ddd6fe' },
  }

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto px-4 md:px-8 pb-24 space-y-8"
      variants={stagger} initial="hidden" animate="show"
    >

      {/* ══ SECTION 1 — Score Overview ═══════════════════════════════ */}
      <motion.div variants={fadeUp}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ height: 3, background: `linear-gradient(to right, ${PRU_RED}, #fca5a5, transparent)` }} />
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Score ring */}
          <div className="flex flex-col items-center justify-center p-10 gap-4"
            style={{ borderBottom: '1px solid #f3f4f6' }} >
            <ScoreRing score={result.total} />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: `${statusColor}10`, border: `1px solid ${statusColor}30` }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColor }} />
              <span className="text-xs font-semibold tracking-wide" style={{ color: statusColor }}>{statusLabel}</span>
            </div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">{result.riskLevel} Risk Level</p>
          </div>

          {/* Sub-scores */}
          <div className="p-8 md:p-10 flex flex-col justify-center gap-5">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: PRU_RED }}>Assessment Summary</p>
              <p className="text-sm text-gray-500 leading-relaxed">{result.explanation}</p>
            </div>
            <div className="space-y-4">
              {subScores.map(({ label, val, icon }) => {
                const barColor = val < 40 ? PRU_RED : val < 65 ? '#b45309' : '#047857'
                const grade    = val < 40 ? 'Needs attention' : val < 65 ? 'Fair' : val < 85 ? 'Good' : 'Excellent'
                return (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{icon}</span>
                        <span className="text-xs font-medium text-gray-500">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{grade}</span>
                        <span className="text-xs font-semibold tabular-nums w-6 text-right" style={{ color: barColor }}>{val}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 1.1, delay: 0.4, ease: 'easeOut' as const }}
                        style={{ background: barColor }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Metric mini row */}
        <div className="grid grid-cols-4 border-t border-gray-100">
          {subScores.map(({ label, val }, idx) => {
            const color = val < 40 ? PRU_RED : val < 65 ? '#b45309' : '#047857'
            const grade = val < 40 ? 'Needs Work' : val < 65 ? 'Fair' : val < 85 ? 'Good' : 'Excellent'
            return (
              <div key={label}
                className="flex flex-col items-center py-4 gap-0.5"
                style={{ borderRight: idx < 3 ? '1px solid #f3f4f6' : 'none' }}>
                <p className="text-2xl font-semibold tabular-nums" style={{ color }}>{val}</p>
                <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">{label}</p>
                <p className="text-[10px] font-medium" style={{ color }}>{grade}</p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ══ SECTION 2 — Emergency Fund (conditional) ════════════════════ */}
      {result.emergencyFundTarget > 0 && (
        <motion.div variants={fadeUp}
          className="bg-white rounded-2xl border overflow-hidden"
          style={{ borderColor: '#fde68a', boxShadow: '0 1px 12px rgba(245,158,11,0.08)' }}>
          <div style={{ height: 2, background: 'linear-gradient(to right,#f59e0b,#fbbf24,transparent)' }} />
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <p className="text-xs uppercase tracking-widest font-semibold text-amber-600">Emergency Fund Target</p>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">Industry Grade</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div>
                <p className="text-xs text-gray-400 mb-1 font-medium">Recommended Target</p>
                <p className="text-3xl font-semibold tracking-tight text-gray-900">
                  ₱{result.emergencyFundTarget.toLocaleString('en-PH')}
                </p>
                <p className="text-xs text-gray-400 mt-1.5">
                  {result.emergencyFundMonths.toFixed(1)} months × ₱{result.emergencyFundMonthlyExp.toLocaleString('en-PH')}/mo
                </p>
              </div>
              <div className="rounded-xl p-4 bg-amber-50 border border-amber-100">
                <p className="text-xs uppercase tracking-wide text-amber-600 font-semibold mb-1">Months Coverage</p>
                <p className="text-2xl font-semibold text-gray-900">{result.emergencyFundMonths.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">Based on your income type &amp; dependents</p>
              </div>
              <div className="rounded-xl p-4 bg-gray-50 border border-gray-100">
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Monthly Expenses</p>
                <p className="text-2xl font-semibold text-gray-900">₱{result.emergencyFundMonthlyExp.toLocaleString('en-PH')}</p>
                <p className="text-xs text-gray-500 mt-1">Essential expenses only</p>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-2 pt-4 border-t border-gray-100">
              <Info size={12} className="shrink-0 mt-0.5 text-amber-400" />
              <p className="text-xs text-gray-500 leading-relaxed">
                <span className="font-medium text-gray-700">Industry standard:</span> Keep 1–2 months liquid in cash or savings. Park the remainder in a high-yield money market fund — not locked in long-term investments.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ══ SECTION 3 — Financial Gaps ══════════════════════════════════ */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-0.5">Risk Analysis</p>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Financial Gaps Identified</h2>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: RED_SOFT, color: PRU_RED, border: `1px solid ${RED_MED}` }}>
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
                whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.07)' }}
                className="bg-white rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200"
                style={{ border: `1px solid ${sv.border}`, borderLeft: `3px solid ${sv.color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                    style={{ background: sv.bg, color: sv.color }}>
                    {gapIcon[gap.id] ?? <AlertTriangle size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 leading-snug">{gap.title}</h4>
                    <span className="text-xs font-medium" style={{ color: sv.color }}>{sv.label}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{gap.description}</p>
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
        style={{ background: `${PRU_RED}08`, border: `1px solid ${RED_MED}` }}>
        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: '#fff', border: `1px solid ${RED_MED}` }}>
          <User size={16} style={{ color: PRU_RED }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: PRU_RED }}>Your BSQ Advisor</p>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium text-gray-500 bg-white border border-gray-200">
              {engineResult.segment} · {tierLabel}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            &ldquo;{engineResult.positioning_message}&rdquo;
          </p>
        </div>
      </motion.div>

      {/* ══ SECTION 5 — Recommended Plans ══════════════════════════════ */}
      <motion.div variants={fadeUp}>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-0.5">Personalised to your profile</p>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Recommended Plans</h2>
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
                whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.10)' }}
                className="bg-white rounded-2xl flex flex-col relative overflow-hidden transition-all duration-300"
                style={{
                  border: isTopPick ? `1.5px solid ${RED_MED}` : '1px solid #e5e7eb',
                  boxShadow: isTopPick ? `0 4px 20px ${PRU_RED}12` : '0 1px 6px rgba(0,0,0,0.04)',
                }}>

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
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200">
                            ✓ Income Fit
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 leading-snug">{rec.shortName ?? rec.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{rec.what}</p>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-gray-100" />

                {/* Key benefits */}
                <div className="p-6 pt-4 flex flex-col flex-1 gap-4">
                  {rec.keyBenefits && rec.keyBenefits.slice(0, 2).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Key Benefits</p>
                      {rec.keyBenefits.slice(0, 2).map((b, bi) => (
                        <div key={bi} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: cc.bg }}>
                            <Check size={9} style={{ color: cc.text }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{b.title}</p>
                            <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{b.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Why this fits */}
                  <div className="rounded-xl p-3.5 bg-gray-50 border border-gray-100 mt-auto">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-1.5">Why this fits you</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{rec.why}</p>
                    {engineMatch && (
                      <p className="text-xs text-gray-400 leading-relaxed mt-2 pt-2 border-t border-gray-200 italic">
                        {engineMatch.reason}
                      </p>
                    )}
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-2 pt-1">
                    <ShineBorder
                      color={['#7f0000', '#D92D20', '#ff6b35', '#ffb347', '#ffffff', '#ffb347', '#ff6b35', '#D92D20']}
                      borderRadius={11}
                      borderWidth={2}
                      duration={4}
                      className="flex-1"
                    >
                      <a href={`/products/${rec.slug}`}
                        className="w-full h-10 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all duration-200 active:scale-[0.97]"
                        style={{ color: hex, background: '#fff' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = hex; el.style.color = '#fff' }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#fff'; el.style.color = hex }}>
                        Learn More <ArrowRight size={12} />
                      </a>
                    </ShineBorder>
                    <ShineBorder
                      color={['#9ca3af', '#d1d5db', '#ffffff', '#d1d5db', '#9ca3af']}
                      borderRadius={11}
                      borderWidth={2}
                      duration={5}
                    >
                      <button onClick={() => setLeadModalOpen(true)}
                        className="h-10 px-3 text-xs font-medium text-gray-400 hover:text-gray-600 transition-all duration-200 flex items-center gap-1.5 bg-white">
                        <MessageCircle size={12} /> Advisor
                      </button>
                    </ShineBorder>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ══ SECTION 6 — CTA ═════════════════════════════════════════════ */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Save Report */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-4"
          style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: RED_SOFT }}>
              <Mail size={15} style={{ color: PRU_RED }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-gray-400">Save Your Report</p>
              <h3 className="text-base font-semibold text-gray-900">Get it via Email or SMS</h3>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Receive a personalised copy of your financial gap report with tailored recommendations — free and instant.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {['Instant delivery', 'Free & private', 'No spam'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check size={11} style={{ color: PRU_RED }} />
                <span className="text-xs text-gray-500">{t}</span>
              </div>
            ))}
          </div>
          <ShineBorder
            color={['#7f0000', '#D92D20', '#ff6b35', '#ffb347', '#ffffff', '#ffb347', '#ff6b35', '#D92D20']}
            borderRadius={12}
            borderWidth={3}
            duration={4}
            className="w-full"
          >
            <button onClick={() => setLeadModalOpen(true)}
              className="h-12 w-full text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              style={{ background: PRU_RED, color: '#fff' }}>
              <Send size={14} />
              Send My Results
            </button>
          </ShineBorder>
        </div>

        {/* Talk to Advisor */}
        <div className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 10% 50%, ${PRU_RED}20 0%, transparent 60%)` }} />
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: RED_SOFT }}>
              <MessageCircle size={15} style={{ color: PRU_RED }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: `${PRU_RED}cc` }}>Talk to an Expert</p>
              <h3 className="text-base font-semibold text-white">Free Consultation</h3>
            </div>
          </div>
          <p className="relative text-sm text-white/50 leading-relaxed">
            A licensed BSQ · PRU Life UK advisor will review your results and build a personalised plan — no cost, no obligation.
          </p>
          <div className="relative flex flex-wrap gap-x-4 gap-y-1">
            {['Free consultation', 'No obligation', 'Licensed advisor'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check size={11} style={{ color: PRU_RED }} />
                <span className="text-xs text-white/40">{t}</span>
              </div>
            ))}
          </div>
          <ShineBorder
            color={['#D92D20', '#ff6b35', '#ffb347', '#ffffff', '#ffb347', '#ff6b35', '#D92D20', '#7f0000']}
            borderRadius={12}
            borderWidth={3}
            duration={4}
            className="w-full relative z-10"
          >
            <button
              onClick={() => window.open(`https://m.me/Bstarquartzarea?ref=results_score${result.total}`, '_blank')}
              className="relative h-12 w-full text-sm font-semibold flex items-center justify-center gap-2 text-white transition-all duration-200 active:scale-[0.98]"
              style={{ background: '#1e293b' }}>
              <MessageCircle size={14} />
              Talk to an Advisor
            </button>
          </ShineBorder>
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
        className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100"
        style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
        <TestimonialForm />
      </motion.div>

      {/* ── Disclaimer ───────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex items-start gap-2.5">
        <Info size={12} className="shrink-0 mt-0.5 text-gray-300" />
        <p className="text-xs leading-relaxed text-gray-400">
          Results are based on financial planning models assessing risk exposure, savings behavior, and long-term readiness. Advisory purposes only — not financial advice. PRU Life UK products subject to eligibility and underwriting.
        </p>
      </motion.div>

    </motion.div>
  )
}

/* ─── Main AssessmentFlow — phase state machine ────────────────────── */
export default function AssessmentFlow() {
  const router = useRouter()
  const [phase, setPhase]       = useState<'question' | 'analyzing' | 'results'>('question')
  const [step, setStep]         = useState(0)
  const [answers, setAnswers]   = useState<Answers>({})
  const [result, setResult]     = useState<ScoreResult | null>(null)
  const [engineResult, setEngineResult] = useState<RecommendationResult | null>(null)


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
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-lg mx-auto flex items-center">
            <div className="flex items-center gap-2">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', boxShadow: '0 0 6px #dc2626' }} />
              <span className="text-xs font-bold tracking-widest uppercase text-white/40">BSQ Financial Assessment</span>
            </div>
          </div>
        </div>
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
      <div id="assessment-results" className="assessment-results min-h-screen flex flex-col" style={{ background: '#f8fafc' }}>
        {/* ── Scoped button design system — ONLY affects .assessment-results ── */}
        <style>{`
          /* ═══════════════════════════════════════════════════════════════
             Assessment Results — Scoped Button System
             Inspired by Prudential Singapore (prudential.com.sg)
             Scope: .assessment-results only — zero global side-effects
             ═══════════════════════════════════════════════════════════════ */

          /* PRIMARY — animated gradient sweep */
          .assessment-results .ar-btn-primary {
            background-image: linear-gradient(135deg, #7f0000, #D92D20, #ff6b35, #ffb347, #D92D20, #7f0000);
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
            background-image: linear-gradient(135deg, #7f0000, #D92D20, #ff6b35, #ffb347, #D92D20, #7f0000);
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

        {/* ── Top nav bar — PRU Life UK branded ──────────────────── */}
        <div className="sticky top-0 z-30 bg-white"
          style={{ borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
          {/* PRU red top stripe */}
          <div style={{ height: 3, background: `linear-gradient(to right, ${PRU_RED}, #f87171 60%, transparent)` }} />
          <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-4">

            {/* Left — back */}
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-800 transition-colors duration-150"
            >
              <Home size={13} />
              <span className="hidden sm:inline">Back to Home</span>
            </button>

            {/* Center — Brand */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-gray-800">BSQ Financial Assessment</span>
              <span className="text-[9px] tracking-widest uppercase font-semibold" style={{ color: PRU_RED }}>Powered by PRU Life UK</span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0' }}>
                <CheckCircle size={10} /> Complete
              </span>
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150"
                style={{ color: PRU_RED }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Retake</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Main content ────────────────────────────────────────── */}
        <div className="flex-1 py-10">
          {result && engineResult && <ResultsScreen result={result} engineResult={engineResult} />}
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div className="py-5 text-center" style={{ borderTop: '1px solid #f1f5f9' }}>
          <p className="text-[11px] text-gray-400">
            Brilliant Star Quartz · Licensed PRU Life UK Advisor · Ortigas, Pasig City
          </p>
        </div>

      </div>
    )
  }

  // phase === 'question' (default)
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #050508 0%, #080b14 40%, #0d0f1e 100%)' }}>
      <style>{`
        @keyframes af-fade-in { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .af-fade { animation: af-fade-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      {/* Radial glow behind content */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(220,38,38,0.07) 0%, transparent 70%)',
      }} />
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',
        backgroundSize: '56px 56px',
      }} />

      {/* Header */}
      <div className="relative px-6 md:px-12 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', boxShadow: '0 0 6px #dc2626', display: 'inline-block' }} />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/35">BSQ Financial Assessment</span>
          </div>
          <span className="text-[11px] text-white/25 tabular-nums">{step + 1} / {questions.length}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col justify-center px-6 md:px-12 py-16">
        <div className="max-w-2xl mx-auto w-full">
          <ProgressBar step={step} total={questions.length} />
          <QuestionScreen key={step} step={step} onAnswer={handleAnswer} />
        </div>
      </div>

      {/* Footer */}
      <div className="relative px-6 py-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-[10px] text-white/20 tracking-wide">Brilliant Star Quartz · Licensed PRU Life UK Advisor · Ortigas, Manila</p>
      </div>
    </div>
  )
}
