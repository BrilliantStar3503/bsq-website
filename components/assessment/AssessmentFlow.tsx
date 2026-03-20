'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Shield, TrendingUp, Clock, ArrowRight, Info, Zap, CheckCircle, BarChart2, RotateCcw, Home, Mail, Phone, X, Send, MessageCircle } from 'lucide-react'
import { questions } from '@/lib/assessment-questions'
import { computeScore, type Answers, type ScoreResult } from '@/lib/assessment-scoring'
import { GlowingEffect } from '@/components/ui/glowing-effect'

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
          <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
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
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150"
                              style={contactType === type
                                ? { background: RED, color: '#fff', boxShadow: `0 4px 12px ${RED}40` }
                                : { background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' }
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
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all duration-200 flex items-center justify-center gap-2"
                        style={{ background: `linear-gradient(135deg, ${RED}, #c1121f)`, boxShadow: `0 6px 24px ${RED}40`, opacity: loading ? 0.8 : 1 }}
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
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => window.open(`https://m.me/Bstarquartzarea?ref=results_lead_score${score}`, '_blank')}
                        className="w-full py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2"
                        style={{ background: `linear-gradient(135deg, ${RED}, #c1121f)`, boxShadow: `0 6px 20px ${RED}40` }}
                      >
                        <MessageCircle size={15} />
                        Talk to an Advisor Now
                      </motion.button>
                      <button
                        onClick={handleClose}
                        className="w-full py-3 rounded-2xl font-semibold text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-150"
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

function ResultsScreen({ result }: { result: ScoreResult }) {
  const [leadModalOpen, setLeadModalOpen] = useState(false)

  const gapIcon: Record<string, React.ReactNode> = {
    income:       <Shield        size={16} />,
    medical:      <AlertTriangle size={16} />,
    savings:      <TrendingUp    size={16} />,
    retirement:   <Clock         size={16} />,
    awareness:    <Zap           size={16} />,
    optimization: <BarChart2     size={16} />,
  }

  const sevStyle = {
    high:   { color: PRU_RED,    accent: '#fca5a5', track: '#fef2f2', label: 'High Risk',   dot: PRU_RED },
    medium: { color: '#d97706',  accent: '#fde68a', track: '#fffbeb', label: 'Medium Risk', dot: '#f59e0b' },
    low:    { color: '#059669',  accent: '#6ee7b7', track: '#ecfdf5', label: 'Low Risk',    dot: '#10b981' },
  }

  const statusColor = result.status === 'good' ? '#059669' : result.status === 'moderate' ? '#d97706' : PRU_RED
  const statusLabel = result.status === 'good' ? 'Well Protected' : result.status === 'moderate' ? 'Moderate Risk' : result.status === 'at-risk' ? 'At Risk' : 'Critical Risk'

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
  const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } }

  const subScores = [
    { label: 'Protection', val: result.protectionScore,  icon: <Shield size={12} /> },
    { label: 'Savings',    val: result.savingsScore,     icon: <TrendingUp size={12} /> },
    { label: 'Retirement', val: result.retirementScore,  icon: <Clock size={12} /> },
    { label: 'Awareness',  val: result.awarenessScore,   icon: <Zap size={12} /> },
  ]

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto px-4 md:px-8 pb-24"
      variants={stagger} initial="hidden" animate="show"
    >

      {/* ── Hero Score Card — dark ────────────────────────────────── */}
      <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl mb-6"
        style={{ background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 60%, #0f172a 100%)' }}>

        {/* Red accent stripe top */}
        <div style={{ height: 3, background: `linear-gradient(to right, ${PRU_RED}, #f87171, transparent)` }} />

        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Left — Score ring */}
          <div className="flex flex-col items-center justify-center p-10 md:p-12"
            style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
            <ScoreRing score={result.total} />
            {/* Status badge */}
            <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: `${statusColor}18`, border: `1px solid ${statusColor}40` }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor, display: 'inline-block', boxShadow: `0 0 6px ${statusColor}` }} />
              <span className="text-xs font-bold tracking-wide" style={{ color: statusColor }}>{statusLabel}</span>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-semibold mt-3"
              style={{ color: 'rgba(255,255,255,0.2)' }}>{result.riskLevel} Risk Level</span>
          </div>

          {/* Right — Explanation + sub-scores */}
          <div className="p-8 md:p-10 flex flex-col justify-center gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: PRU_RED }}>Assessment Summary</p>
              <p className="text-white/70 text-sm leading-relaxed">{result.explanation}</p>
            </div>

            {/* Sub-score bars */}
            <div className="space-y-4">
              {subScores.map(({ label, val, icon }) => {
                const barColor = val < 40 ? PRU_RED : val < 65 ? '#f59e0b' : '#10b981'
                return (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>{icon}</span>
                        <span className="text-[11px] font-semibold tracking-wide text-white/50 uppercase">{label}</span>
                      </div>
                      <span className="text-xs font-black tabular-nums" style={{ color: barColor }}>{val}</span>
                    </div>
                    <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' as const }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(to right, ${barColor}, ${barColor}99)` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 4 Metric Cards ───────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {subScores.map(({ label, val }) => {
          const color = val < 40 ? PRU_RED : val < 65 ? '#f59e0b' : '#10b981'
          const grade = val < 40 ? 'Needs Work' : val < 65 ? 'Fair' : val < 85 ? 'Good' : 'Excellent'
          return (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100"
              style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
              </div>
              <p className="text-3xl font-black tabular-nums leading-none mb-1" style={{ color }}>{val}</p>
              <p className="text-[10px] font-semibold" style={{ color }}>{grade}</p>
              <div className="mt-3 h-1 rounded-full overflow-hidden bg-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 1.0, delay: 0.6, ease: 'easeOut' as const }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* ── Detected Gaps ────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: 3, height: 20, background: PRU_RED, borderRadius: 2 }} />
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Risk Exposures Identified</h3>
          <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
            style={{ background: '#fef2f2', color: PRU_RED, border: `1px solid #fecaca` }}>
            {result.gaps.length} Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.gaps.map((gap, i) => {
            const sv = sevStyle[gap.severity]
            return (
              <motion.div
                key={gap.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: 'easeOut' as const }}
                whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-2xl p-5 transition-all duration-300 flex flex-col gap-3"
                style={{
                  border: '1px solid #f1f5f9',
                  borderLeft: `3px solid ${sv.color}`,
                  boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center rounded-xl shrink-0"
                      style={{ width: 36, height: 36, background: sv.track, color: sv.color }}>
                      {gapIcon[gap.id] ?? <AlertTriangle size={16} />}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">{gap.title}</h4>
                      <span className="text-[10px] font-bold tracking-wide uppercase" style={{ color: sv.color }}>{sv.label}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{gap.description}</p>
                <div className="flex items-start gap-2 rounded-xl px-3 py-2.5"
                  style={{ background: sv.track }}>
                  <Zap size={11} className="shrink-0 mt-0.5" style={{ color: sv.color }} />
                  <p className="text-[11px] font-medium leading-relaxed" style={{ color: sv.color }}>{gap.consequence}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ── Solutions ────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: 3, height: 20, background: PRU_RED, borderRadius: 2 }} />
          <div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Your Protection Plan</h3>
            <p className="text-xs text-gray-400 mt-0.5">Powered by PRU Life UK product suite</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {result.recommendations.map((rec, i) => {
            const categoryMap: Record<string, string> = {
              'Income Replacement Layer': 'Protection',
              'Medical Risk Layer':       'Health',
              'Protection + Growth Layer':'Investment',
              'Retirement Income Layer':  'Retirement',
              'Wealth & Legacy Layer':    'Wealth',
            }
            const category = categoryMap[rec.layer] ?? rec.layer
            const catColor: Record<string, { text: string; bg: string }> = {
              Protection: { text: PRU_RED,   bg: '#fef2f2' },
              Health:     { text: '#0369a1', bg: '#f0f9ff' },
              Investment: { text: '#059669', bg: '#ecfdf5' },
              Retirement: { text: '#d97706', bg: '#fffbeb' },
              Wealth:     { text: '#7c3aed', bg: '#f5f3ff' },
            }
            const cc = catColor[category] ?? { text: '#6b7280', bg: '#f9fafb' }

            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.45, ease: 'easeOut' as const }}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
                style={{ border: '1px solid #f1f5f9', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
              >
                {/* Category top bar */}
                <div className="px-5 pt-5 pb-4 flex items-center justify-between"
                  style={{ borderBottom: '1px solid #f8fafc' }}>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                    style={{ color: cc.text, background: cc.bg }}>{category}</span>
                  <ArrowRight size={13} style={{ color: cc.text }} />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-sm font-bold text-gray-900 mb-2 leading-snug">{rec.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-4">{rec.what}</p>
                  <div className="rounded-xl p-3" style={{ background: '#f8fafc' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Why this matters</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{rec.why}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ── Lead Capture Card ─────────────────────────────────── */}
      <motion.div variants={fadeUp}
        className="relative overflow-hidden rounded-3xl"
        style={{ border: `1.5px solid ${PRU_RED}30`, background: 'linear-gradient(135deg, #fff 0%, #fff9f9 100%)', boxShadow: `0 4px 32px ${PRU_RED}12` }}>

        {/* Soft red glow top-left */}
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: `${PRU_RED}08`, filter: 'blur(40px)' }} />

        <div className="relative p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8">
          {/* Left — copy */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0"
                style={{ background: '#fef2f2' }}>
                <Mail size={14} style={{ color: PRU_RED }} />
              </span>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: PRU_RED }}>
                Save Your Report
              </p>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-2">
              Send My Results via<br />Email or SMS — Free
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Get a personalised copy of your financial gap report with tailored
              recommendations — delivered directly to your inbox or phone.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-4">
              {['Instant delivery', 'Free & private', 'No spam ever'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={11} style={{ color: PRU_RED }} />
                  <span className="text-[11px] text-gray-500">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — CTA button */}
          <div className="shrink-0">
            <motion.button
              onClick={() => setLeadModalOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-white transition-all duration-200 w-full md:w-auto justify-center"
              style={{ background: `linear-gradient(135deg, ${PRU_RED}, #c1121f)`, boxShadow: `0 8px 28px ${PRU_RED}45` }}
            >
              <Send size={14} />
              Send My Results
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Advisor CTA ───────────────────────────────────────── */}
      <motion.div variants={fadeUp}
        className="relative overflow-hidden rounded-3xl p-8 md:p-12"
        style={{ background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)' }}>

        {/* Red accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(to right, ${PRU_RED}, #f87171, transparent)` }} />
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 80% at 20% 50%, ${PRU_RED}18 0%, transparent 70%)` }} />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: PRU_RED }}>Talk to an Expert</p>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
              Talk to a Trusted<br />Financial Advisor
            </h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              A licensed BSQ · PRU Life UK advisor will review your results and build a
              personalised protection plan — at no cost, no obligation.
            </p>
            <div className="flex items-center gap-5 mt-4">
              {['Free consultation', 'No obligation', 'Licensed advisor'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={11} style={{ color: PRU_RED }} />
                  <span className="text-[11px] text-white/40">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0">
            <motion.button
              onClick={() => window.open(`https://m.me/Bstarquartzarea?ref=results_score${result.total}`, '_blank')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-white transition-all duration-200"
              style={{ background: `linear-gradient(135deg, ${PRU_RED}, #c1121f)`, boxShadow: `0 8px 32px ${PRU_RED}50` }}
            >
              <MessageCircle size={15} />
              Talk to an Advisor
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Lead Capture Modal ────────────────────────────────── */}
      <LeadCaptureModal
        open={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        result={result}
      />

      {/* ── Disclaimer ───────────────────────────────────────────── */}
      <motion.div variants={fadeUp}
        className="mt-5 flex items-start gap-2.5 px-4 py-3 rounded-xl"
        style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
        <Info size={12} className="shrink-0 mt-0.5 text-gray-300" />
        <p className="text-[11px] leading-relaxed text-gray-400">
          Results are based on financial planning models assessing risk exposure, savings behavior, and long-term readiness. Advisory purposes only — not financial advice. PRU Life UK products subject to eligibility and underwriting.
        </p>
      </motion.div>

    </motion.div>
  )
}

/* ─── Main AssessmentFlow — phase state machine ────────────────────── */
export default function AssessmentFlow() {
  const router = useRouter()
  const [phase, setPhase]     = useState<'question' | 'analyzing' | 'results'>('question')
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult]   = useState<ScoreResult | null>(null)

  const handleRetake = () => {
    setAnswers({})
    setResult(null)
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
      // Last question — compute score and enter analyzing phase
      const computed = computeScore(updated)
      setResult(computed)
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
      <div className="min-h-screen flex flex-col" style={{ background: '#f8fafc' }}>

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
          {result && <ResultsScreen result={result} />}
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
