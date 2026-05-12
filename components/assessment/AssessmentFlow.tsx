'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Shield, TrendingUp, Clock, ArrowRight, Info, Zap, CheckCircle, BarChart2, RotateCcw, Home, Mail, Phone, X, Send, MessageCircle, Check, Sparkles, User, GraduationCap, Briefcase, Key, Users } from 'lucide-react'
import { questions, type Question } from '@/lib/assessment-questions'
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
  const [done, setDone]       = useState(false)
  const gradId = useRef(`sg-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    const t = setTimeout(() => {
      let start: number | null = null
      const dur = 1800
      const tick = (ts: number) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / dur, 1)
        const e = 1 - Math.pow(1 - p, 4)
        setDisplay(Math.round(e * score))
        setOffset(CIRC - e * (score / 100) * CIRC)
        if (p < 1) requestAnimationFrame(tick)
        else setDone(true)
      }
      requestAnimationFrame(tick)
    }, 200)
    return () => clearTimeout(t)
  }, [score])

  const statusLabel = score < 35 ? 'Critical Risk' : score < 55 ? 'At Risk' : score < 75 ? 'Moderate Risk' : 'Well Protected'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      <svg
        width="180" height="180"
        className={done ? 'ring-idle-pulse' : ''}
        style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 6px rgba(185,28,28,0.15))' }}
      >
        <defs>
          <linearGradient id={gradId.current} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx="90" cy="90" r={RADIUS} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="11" />
        {/* Fill */}
        <circle
          cx="90" cy="90" r={RADIUS} fill="none"
          stroke={`url(#${gradId.current})`} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.04s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="metric" style={{ color: '#b91c1c', fontSize: 40, lineHeight: 1 }}>{display}</span>
        <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(17,17,17,0.5)', fontWeight: 500, marginTop: 4 }}>{statusLabel}</span>
      </div>
    </div>
  )
}

/* ─── Progress Bar ─────────────────────────────────────────────────── */
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between text-xs mb-2">
        <span className="font-medium tracking-wide" style={{ color: 'rgba(0,0,0,0.55)' }}>Step {step + 1} of {total}</span>
        <span className="font-medium tabular-nums" style={{ color: 'rgba(0,0,0,0.55)' }}>{pct}%</span>
      </div>
      <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
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

/* ─── Visible question filter ────────────────────────────────────── */
function getVisibleQuestions(answers: Record<string, string>): Question[] {
  return questions.filter(q => !q.showIf || q.showIf(answers))
}

/* ─── Question Screen ──────────────────────────────────────────────── */
function QuestionScreen({ question, onAnswer }: { question: Question; onAnswer: (val: string) => void }) {
  const q = question
  const [selected, setSelected] = useState<string | null>(null)

  const choose = (opt: string) => {
    setSelected(opt)
    setTimeout(() => onAnswer(opt), 300)
  }

  return (
    <div className="af-fade w-full">
      {/* Question */}
      <div className="mb-4 text-center">
        <h1 style={{ fontSize: 'clamp(18px, 4vh, 26px)', fontWeight: 600, color: '#111111', lineHeight: 1.3, marginBottom: '0.5rem' }}>{q.question}</h1>
        {q.subtitle && (
          <p className="text-xs sm:text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(0,0,0,0.60)' }}>{q.subtitle}</p>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {q.options.map((opt) => {
          const isSelected = selected === opt
          return (
            <div key={opt} className="relative rounded-xl">
              <GlowingEffect
                proximity={80}
                spread={isSelected ? 50 : 32}
                inactiveZone={0}
                borderWidth={1}
                color={isSelected ? 'rgba(220,38,38,0.7)' : 'rgba(0,0,0,0.12)'}
              />
              <button
                onClick={() => choose(opt)}
                className="relative w-full text-left px-5 py-3 rounded-xl active:scale-[0.99]"
                style={{
                  background:  isSelected ? 'rgba(220,0,0,0.07)' : 'rgba(0,0,0,0.025)',
                  border:      `1px solid ${isSelected ? 'rgba(220,0,0,0.6)' : 'rgba(0,0,0,0.12)'}`,
                  boxShadow:   isSelected
                    ? '0 3px 16px rgba(220,0,0,0.12), 0 1px 4px rgba(220,0,0,0.07)'
                    : 'none',
                  transform:   isSelected ? 'translateY(-1px)' : 'translateY(0)',
                  transition:  'background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease',
                  cursor:      'pointer',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    const el = e.currentTarget
                    el.style.background  = 'rgba(0,0,0,0.02)'
                    el.style.borderColor = 'rgba(0,0,0,0.22)'
                    el.style.transform   = 'translateY(-1px)'
                    el.style.boxShadow   = '0 3px 14px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    const el = e.currentTarget
                    el.style.background  = 'rgba(0,0,0,0.025)'
                    el.style.borderColor = 'rgba(0,0,0,0.12)'
                    el.style.transform   = 'translateY(0)'
                    el.style.boxShadow   = 'none'
                  }
                }}
              >
                <span className="flex items-center gap-4">
                  {/* Custom radio */}
                  <span
                    className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{
                      width: 22, height: 22,
                      border: `2px solid ${isSelected ? '#dc2626' : 'rgba(0,0,0,0.2)'}`,
                      background: isSelected ? '#dc2626' : 'transparent',
                      boxShadow: isSelected ? '0 0 8px rgba(220,38,38,0.3)' : 'none',
                    }}
                  >
                    {isSelected && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                    )}
                  </span>
                  <span
                    className="text-sm md:text-base font-medium transition-colors duration-200"
                    style={{ color: isSelected ? '#991b1b' : '#111111' }}
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
                                ? { background: RED, color: '#fff', boxShadow: '0 4px 12px rgba(185,28,28,0.25)' }
                                : { background: 'transparent', color: '#111111', border: '1px solid rgba(0,0,0,0.10)' }
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
    income:            <Shield size={15} />,
    medical:           <AlertTriangle size={15} />,
    savings:           <TrendingUp size={15} />,
    retirement:        <Clock size={15} />,
    awareness:         <Zap size={15} />,
    optimization:      <BarChart2 size={15} />,
    education:         <GraduationCap size={15} />,
    businessInsurance: <Briefcase size={15} />,
    keyMan:            <Key size={15} />,
    employeeRetirement:<Users size={15} />,
  }

  const sevStyle = {
    high:   { color: '#ff5b5b', bg: 'rgba(220,0,0,0.10)',  border: 'rgba(255,59,59,0.35)',   label: 'High Risk'     },
    medium: { color: 'rgba(255,255,255,0.55)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', label: 'Moderate Risk' },
    low:    { color: 'rgba(255,255,255,0.40)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.09)', label: 'Low Risk'      },
  }

  const statusColor = result.status === 'good' ? '#b91c1c' : result.status === 'moderate' ? '#dc2626' : '#dc2626'
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
    Education:  { text: '#38bdf8', bg: 'rgba(14,165,233,0.10)', border: 'rgba(56,189,248,0.25)' },
    Business:   { text: '#34d399', bg: 'rgba(5,150,105,0.10)',  border: 'rgba(52,211,153,0.25)' },
  }

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto px-4 md:px-8 pb-28 space-y-10"
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
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.05), 0 16px 40px rgba(0,0,0,0.04)',
        }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #b91c1c 0%, #dc2626 45%, rgba(185,28,28,0.25) 80%, transparent 100%)' }} />
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Score ring */}
          <div className="flex flex-col items-center justify-center px-8 py-10 gap-4"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <ScoreRing score={result.total} />
            <motion.div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2, duration: 0.4, ease: 'easeOut' }}
              style={{ background: `${statusColor}10`, border: `1px solid ${statusColor}30` }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColor }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: statusColor }}>{statusLabel}</span>
            </motion.div>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(17,17,17,0.38)', fontWeight: 500 }}>Financial Risk Score</p>
            <div className="w-full pt-4 flex items-center justify-center gap-7" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              {subScores.map(({ label, val }) => {
                const c = val < 40 ? '#dc2626' : '#111111'
                return (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <span style={{ fontSize: 18, fontWeight: 700, color: c, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{val}</span>
                    <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(17,17,17,0.40)', fontWeight: 500 }}>{label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sub-scores */}
          <div className="p-8 md:p-9 flex flex-col justify-center gap-6"
            style={{ borderLeft: '1px solid rgba(0,0,0,0.06)' }}>
            <div>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, color: 'rgba(17,17,17,0.38)', marginBottom: 8 }}>Assessment Summary</p>
              <p style={{ fontSize: 14, color: 'rgba(17,17,17,0.68)', lineHeight: 1.75 }}>{result.explanation}</p>
            </div>
            <div className="space-y-4">
              {subScores.map(({ label, val, icon }, i) => {
                const barColor = val < 40 ? '#dc2626' : '#b91c1c'
                const grade    = val < 40 ? 'Needs attention' : val < 65 ? 'Fair' : val < 85 ? 'Good' : 'Excellent'
                const barDelay = 1.1 + i * 0.08
                return (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span style={{ color: 'rgba(17,17,17,0.40)' }}>{icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#111111' }}>{label}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span style={{ fontSize: 10, color: 'rgba(17,17,17,0.38)', letterSpacing: '0.02em' }}>{grade}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: barColor, fontVariantNumeric: 'tabular-nums', minWidth: 22, textAlign: 'right' }}>{val}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 1.0, delay: barDelay, ease: 'easeOut' as const }}
                        style={{ background: 'linear-gradient(90deg, #dc2626 0%, #991b1b 100%)' }}
                      />
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
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          }}>
          <div style={{ height: 2, background: 'linear-gradient(90deg, #b91c1c, rgba(153,27,27,0.4) 70%, transparent)' }} />
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: '#dc2626' }}>Emergency Fund Target</p>
              <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 999, fontWeight: 500, background: 'rgba(0,0,0,0.05)', color: 'rgba(17,17,17,0.7)', border: '1px solid rgba(0,0,0,0.10)' }}>Industry Grade</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div>
                <p style={{ fontSize: 11, color: 'rgba(17,17,17,0.7)', fontWeight: 500, marginBottom: 4 }}>Recommended Target</p>
                <p className="metric" style={{ color: '#111111' }}>
                  ₱{result.emergencyFundTarget.toLocaleString('en-PH')}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(17,17,17,0.7)', marginTop: 6 }}>
                  {result.emergencyFundMonths.toFixed(1)} months × ₱{result.emergencyFundMonthlyExp.toLocaleString('en-PH')}/mo
                </p>
              </div>
              <div className="rounded-xl p-5" style={{ background: 'rgba(220,0,0,0.05)', border: '1px solid rgba(220,0,0,0.15)' }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#dc2626', fontWeight: 600, marginBottom: 6 }}>Months Coverage</p>
                <p className="metric" style={{ color: '#111111', fontSize: 32 }}>{result.emergencyFundMonths.toFixed(1)}</p>
                <p style={{ fontSize: 11, color: 'rgba(17,17,17,0.7)', marginTop: 6 }}>Based on your income type &amp; dependents</p>
              </div>
              <div className="rounded-xl p-5" style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(17,17,17,0.7)', fontWeight: 600, marginBottom: 6 }}>Monthly Expenses</p>
                <p className="metric" style={{ color: '#111111', fontSize: 32 }}>₱{result.emergencyFundMonthlyExp.toLocaleString('en-PH')}</p>
                <p style={{ fontSize: 11, color: 'rgba(17,17,17,0.7)', marginTop: 6 }}>Essential expenses only</p>
              </div>
            </div>
            <div className="mt-6 flex items-start gap-2 pt-5" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <Info size={12} className="shrink-0 mt-0.5" style={{ color: 'rgba(17,17,17,0.4)' }} />
              <p style={{ fontSize: 12, color: 'rgba(17,17,17,0.7)', lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600, color: '#111111' }}>Industry standard:</span> Keep 1–2 months liquid in cash or savings. Park the remainder in a high-yield money market fund — not locked in long-term investments.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ══ SECTION 3 — Financial Gaps ══════════════════════════════════ */}
      <motion.div variants={fadeUp}>
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
        >
          <div>
            <p className="text-label uppercase tracking-widest font-medium mb-1" style={{ color: '#86868b', letterSpacing: '0.15em' }}>Risk Analysis</p>
            <h2 style={{ color: '#1d1d1f' }}>Financial Gaps Identified</h2>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full tabular-nums"
            style={{ background: 'rgba(0,0,0,0.05)', color: '#6e6e73', border: '1px solid rgba(0,0,0,0.07)' }}>
            {result.gaps.length} found
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {result.gaps.map((gap, i) => {
            /* ── Per-severity design tokens ── */
            const sev = gap.severity === 'high'
              ? { accent: '#b91c1c', badgeBg: 'rgba(185,28,28,0.12)', badgeColor: 'rgba(220,60,60,0.85)',  label: 'High Risk'     }
              : gap.severity === 'medium'
              ? { accent: '#c0392b', badgeBg: 'rgba(192,57,43,0.10)', badgeColor: 'rgba(210,80,70,0.80)',  label: 'Moderate Risk' }
              : { accent: '#6b7280', badgeBg: 'rgba(107,114,128,0.10)', badgeColor: 'rgba(160,165,175,0.75)', label: 'Low Risk'   }

            return (
              <motion.div
                key={gap.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.10, duration: 0.42, ease: 'easeOut' as const }}
                className="group flex flex-col gap-4 rounded-2xl"
                style={{
                  background:   '#1c1c1e',
                  border:       '1px solid rgba(255,255,255,0.07)',
                  borderLeft:   `2.5px solid ${sev.accent}`,
                  borderRadius: 16,
                  padding:      24,
                  boxShadow:    '0 1px 3px rgba(0,0,0,0.14), 0 4px 14px rgba(0,0,0,0.10)',
                  transition:   'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                  cursor:       'default',
                }}
                whileHover={{
                  y: -2,
                  transition: { duration: 0.18, ease: 'easeOut' as const },
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor     = 'rgba(255,255,255,0.12)'
                  el.style.borderLeftColor = sev.accent
                  el.style.boxShadow       = '0 2px 8px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.14)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor     = 'rgba(255,255,255,0.07)'
                  el.style.borderLeftColor = sev.accent
                  el.style.boxShadow       = '0 1px 3px rgba(0,0,0,0.14), 0 4px 14px rgba(0,0,0,0.10)'
                }}
              >
                {/* ── Top row: icon · title · badge ── */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.42)' }}>
                      {gapIcon[gap.id] ?? <AlertTriangle size={14} />}
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.92)', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                      {gap.title}
                    </h4>
                  </div>
                  {/* Severity dot + label — minimal, no pill */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: sev.accent, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: sev.badgeColor }}>
                      {sev.label}
                    </span>
                  </div>
                </div>

                {/* ── Description ── */}
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', lineHeight: 1.65, margin: 0 }}>
                  {gap.description}
                </p>

                {/* ── Key impact callout ── */}
                <div style={{
                  background:   'rgba(255,255,255,0.04)',
                  borderLeft:   `2px solid ${sev.accent}`,
                  borderRadius: '0 6px 6px 0',
                  padding:      '9px 12px',
                }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.40)', lineHeight: 1.6, margin: 0, letterSpacing: '0.01em' }}>
                    {gap.consequence}
                  </p>
                </div>

                {/* ── Actions ── */}
                <div className="flex items-center gap-4 pt-1">
                  <button
                    onClick={() => openContact('gap_advisor')}
                    style={{
                      height:       32,
                      paddingLeft:  16,
                      paddingRight: 16,
                      borderRadius: 6,
                      background:   '#b91c1c',
                      color:        '#fff',
                      fontSize:     11,
                      fontWeight:   600,
                      border:       'none',
                      cursor:       'pointer',
                      letterSpacing: '0.02em',
                      transition:   'background 0.15s ease, transform 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#991b1b'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    Talk to Advisor
                  </button>
                  <a
                    href="/assessment"
                    style={{
                      fontSize:       11,
                      fontWeight:     500,
                      color:          'rgba(255,255,255,0.30)',
                      textDecoration: 'none',
                      letterSpacing:  '0.02em',
                      display:        'inline-flex',
                      alignItems:     'center',
                      gap:            4,
                      transition:     'color 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.30)' }}
                  >
                    Learn more <ArrowRight size={10} />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ══ SECTION 4 — Advisor Recommendation ═════════════════════════ */}
      <motion.div variants={fadeUp}
        className="rounded-2xl p-7 flex gap-4 items-start"
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        }}>
        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(220,0,0,0.07)', border: '1px solid rgba(220,0,0,0.15)' }}>
          <User size={16} style={{ color: '#b91c1c' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#dc2626', letterSpacing: '0.15em' }}>Your BSQ Advisor</p>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(17,17,17,0.7)', border: '1px solid rgba(0,0,0,0.10)' }}>
              {engineResult.segment} · {tierLabel}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#111111' }}>
            &ldquo;{engineResult.positioning_message}&rdquo;
          </p>
        </div>
      </motion.div>

      {/* ══ SECTION 5 — Recommended Plans ══════════════════════════════ */}
      <motion.div variants={fadeUp}>
        <div className="mb-6">
          <p className="text-label uppercase tracking-widest font-medium mb-0.5" style={{ color: '#86868b', letterSpacing: '0.15em' }}>Personalised to your profile</p>
          <h2 style={{ color: '#1d1d1f' }}>Recommended Plans</h2>
        </div>

        {/* Timeline vertical list */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}>
          {result.recommendations.map((rec, i) => {
            const hex         = rec.color ?? PRU_RED
            const engineMatch = engineResult.recommended_products.find(e => e.slug === rec.slug)
            const isTopPick   = engineMatch?.priority === 1
            const isLast      = i === result.recommendations.length - 1

            const categoryImageMap: Record<string, string> = {
              protection:  'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=240&h=160&fit=crop&crop=center',
              health:      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=240&h=160&fit=crop&crop=center',
              investment:  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=240&h=160&fit=crop&crop=center',
              retirement:  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&h=160&fit=crop&crop=center',
              education:   'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=240&h=160&fit=crop&crop=center',
            }
            const cardImage = categoryImageMap[(rec.category ?? '').toLowerCase()]
              ?? 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=240&h=160&fit=crop&crop=center'

            return (
              <motion.div key={rec.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.08, duration: 0.35, ease: 'easeOut' as const }}
                className="flex gap-5 p-7"
                style={{ borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.06)' }}
              >
                {/* Left — icon + connector line */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 40 }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-base shrink-0"
                    style={{ background: 'rgba(185,28,28,0.08)', border: '1.5px solid rgba(185,28,28,0.2)' }}>
                    {rec.emoji}
                  </div>
                  {!isLast && (
                    <div className="flex-1 mt-3" style={{ width: 1, background: 'rgba(0,0,0,0.07)', minHeight: 20 }} />
                  )}
                </div>

                {/* Right — content */}
                <div className="flex-1 min-w-0 pb-1">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      {isTopPick && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5"
                          style={{ background: 'rgba(185,28,28,0.07)', color: '#b91c1c', border: '1px solid rgba(185,28,28,0.15)' }}>
                          <Sparkles size={8} /> Advisor&apos;s Pick
                        </span>
                      )}
                      <h3 className="text-base font-semibold" style={{ color: '#111111', lineHeight: 1.3 }}>
                        {rec.shortName ?? rec.name}
                      </h3>
                    </div>
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0 mt-0.5 capitalize"
                      style={{ background: 'rgba(185,28,28,0.07)', color: '#b91c1c', border: '1px solid rgba(185,28,28,0.15)' }}>
                      {rec.category}
                    </span>
                  </div>

                  {/* One-line description */}
                  <p className="text-sm mb-3" style={{ color: 'rgba(17,17,17,0.65)', lineHeight: 1.5 }}>
                    {rec.what}
                  </p>

                  {/* Key benefits */}
                  {rec.keyBenefits && rec.keyBenefits.length > 0 && (
                    <div className="flex flex-col gap-1.5 mb-4">
                      {rec.keyBenefits.slice(0, 3).map((b, bi) => (
                        <div key={bi} className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(185,28,28,0.08)', border: '1px solid rgba(185,28,28,0.22)' }}>
                            <Check size={8} style={{ color: '#b91c1c' }} />
                          </div>
                          <span className="text-sm" style={{ color: 'rgba(17,17,17,0.75)' }}>{b.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openContact(`rec_${rec.slug}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
                      style={{ background: 'linear-gradient(135deg, #ff3b3b, #b30000)', color: '#ffffff', boxShadow: '0 6px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(255,0,0,0.15)', transition: 'background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #e02020, #990000)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.16), 0 4px 10px rgba(255,0,0,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #ff3b3b, #b30000)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(255,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      <MessageCircle size={11} /> Talk to Advisor
                    </button>
                    <a href={rec.slug === 'prulifetime-income' ? '/prulifetime' : `/products/${rec.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium"
                      style={{ color: '#111111', border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', transition: 'background 0.15s ease, border-color 0.15s ease' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(0,0,0,0.03)'; el.style.borderColor = 'rgba(0,0,0,0.22)' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'transparent'; el.style.borderColor = 'rgba(0,0,0,0.15)' }}
                    >
                      Learn More <ArrowRight size={10} />
                    </a>
                  </div>
                </div>

                {/* Product image */}
                <div className="hidden md:block shrink-0 self-center" style={{ width: 180 }}>
                  <div style={{
                    width: 180, height: 130,
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.07)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cardImage}
                      alt={rec.shortName ?? rec.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
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
        <div className="rounded-2xl p-7 flex flex-col gap-5 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          }}>
          <div className="absolute top-0 left-0 right-0" style={{ height: 2, background: 'linear-gradient(90deg, #b91c1c, rgba(153,27,27,0.4) 70%, transparent)' }} />
          <div className="flex items-center gap-3 mt-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(220,0,0,0.07)', border: '1px solid rgba(220,0,0,0.15)' }}>
              <Mail size={15} style={{ color: '#D92D20' }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#dc2626', letterSpacing: '0.13em' }}>Save Your Report</p>
              <h3 className="text-base font-semibold" style={{ color: '#111111' }}>Get it via Email or SMS</h3>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(17,17,17,0.7)' }}>
            Receive a personalised copy of your financial gap report with tailored recommendations — free and instant.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {['Instant delivery', 'Free & private', 'No spam'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check size={11} style={{ color: '#dc2626' }} />
                <span className="text-xs" style={{ color: 'rgba(17,17,17,0.7)' }}>{t}</span>
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
        <div className="rounded-2xl p-7 flex flex-col gap-5 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          }}>
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(220,0,0,0.07)', border: '1px solid rgba(220,0,0,0.15)' }}>
              <MessageCircle size={15} style={{ color: '#D92D20' }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#dc2626', letterSpacing: '0.13em' }}>Talk to an Expert</p>
              <h3 className="text-base font-semibold" style={{ color: '#111111' }}>Free Consultation</h3>
            </div>
          </div>
          <p className="relative text-sm leading-relaxed" style={{ color: 'rgba(17,17,17,0.7)' }}>
            A licensed BSQ · PRU Life UK advisor will review your results and build a personalised plan — no cost, no obligation.
          </p>
          <div className="relative flex flex-wrap gap-x-4 gap-y-1">
            {['Free consultation', 'No obligation', 'Licensed advisor'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check size={11} style={{ color: '#dc2626' }} />
                <span className="text-xs" style={{ color: 'rgba(17,17,17,0.7)' }}>{t}</span>
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
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        }}>
        <TestimonialForm />
      </motion.div>

      {/* ── Disclaimer ───────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex items-start gap-2.5">
        <Info size={12} className="shrink-0 mt-0.5" style={{ color: 'rgba(17,17,17,0.60)' }} />
        <p className="text-label" style={{ color: 'rgba(17,17,17,0.75)' }}>
          Results are based on financial planning models assessing risk exposure, savings behavior, and long-term readiness. Advisory purposes only — not financial advice. PRU Life UK products subject to eligibility and underwriting.
        </p>
      </motion.div>

    </motion.div>
  )
}

/* ─── Header height constants ──────────────────────────────────────── */
/**
 * BSQ_H — offset for the global BsqHeader.
 * HeaderWrapper returns null on /assessment, so the global header does
 * NOT render here at all. Assessment navbars must start at top: 0.
 * BSQ_H is kept as 0 so existing `top: BSQ_H` expressions still compile
 * correctly without touching every call-site.
 */
const BSQ_H         = 0    // Global header suppressed on /assessment

const TRUST_H       = 32   // (unused on assessment — kept for reference)
const BSQ_NAV_H     = 44   // Assessment nav height (Apple standard)
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
    // Use the CURRENT visible list to identify which question is active
    const currentVisible = getVisibleQuestions(answers as Record<string, string>)
    const key            = currentVisible[step].id as keyof Answers
    const updated        = { ...answers, [key]: value }
    setAnswers(updated)

    // Re-compute visible list with updated answers (may grow if conditional Qs unlock)
    const nextVisible = getVisibleQuestions(updated as Record<string, string>)

    if (step < nextVisible.length - 1) {
      // More visible questions remain
      setStep(step + 1)
    } else {
      // All visible questions answered — compute results
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
      <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
        <style>{`
          html, body { overscroll-behavior: none; background: #0d1117; }
          @keyframes af-fade-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
          @keyframes scan-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.35; transform:scale(0.75); } }
          .af-fade { animation: af-fade-in 0.45s ease both; }
          .scan-pulse { animation: scan-pulse 1.2s ease-in-out infinite; }
        `}</style>
        {/* Fixed scanning header */}
        <div style={{
          position: 'fixed', top: BSQ_H, left: 0, right: 0, zIndex: 999,
          background: pageScrolled ? 'rgba(18,18,20,0.97)' : 'rgba(18,18,20,0.88)',
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
      <div id="assessment-results" className="assessment-results min-h-screen flex flex-col" style={{ background: '#f5f5f7', position: 'relative', zIndex: 0 }}>
        {/* Full-viewport background — fixed so iOS bounce never reveals white */}
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: '#f5f5f7' }} />
        {/* ── Scoped button design system — ONLY affects .assessment-results ── */}
        <style>{`
          /* ── Scroll containment — prevents iOS/macOS overscroll bounce ──
             revealing content above the fixed navbar. Applied to html+body
             only while this phase is mounted; cleaned up on unmount via
             React's style tag lifecycle (tag removed when component unmounts). */
          html, body {
            overscroll-behavior: none;
            background: #f5f5f7;
          }

          /* ═══════════════════════════════════════════════════════════════
             Assessment Results — Scoped Button System
             Inspired by Prudential Singapore (prudential.com.sg)
             Scope: .assessment-results only — zero global side-effects
             ═══════════════════════════════════════════════════════════════ */

          /* PRIMARY — deep controlled red */
          .assessment-results .ar-btn-primary {
            background: linear-gradient(135deg, #ff3b3b, #b30000);
            color: #ffffff;
            border: none;
            border-radius: 6px;
            box-shadow: 0 6px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(255,0,0,0.15);
            box-shadow: 0 6px 20px rgba(185,28,28,0.25);
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: background 0.15s ease, box-shadow 0.15s ease;
          }
          .assessment-results .ar-btn-primary:hover:not(:disabled) {
            background: linear-gradient(135deg, #e02020, #990000);
            box-shadow: 0 8px 24px rgba(0,0,0,0.16), 0 4px 10px rgba(255,0,0,0.25);
          }
          .assessment-results .ar-btn-primary:focus-visible {
            outline: 2px solid #FCA5A5;
            outline-offset: 2px;
          }
          .assessment-results .ar-btn-primary:disabled {
            opacity: 0.55;
            cursor: not-allowed;
          }

          /* SECONDARY — neutral ghost */
          .assessment-results .ar-btn-secondary {
            background: transparent;
            color: #111111;
            border: 1px solid rgba(0,0,0,0.10);
            border-radius: 6px;
            box-shadow: none;
            font-weight: 500;
            transition: background 0.15s ease, border-color 0.15s ease;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .assessment-results .ar-btn-secondary:hover:not(:disabled) {
            background: rgba(0,0,0,0.04);
            border-color: rgba(0,0,0,0.18);
          }
          .assessment-results .ar-btn-secondary:focus-visible {
            outline: 2px solid rgba(0,0,0,0.2);
            outline-offset: 2px;
          }

          /* SECONDARY-DARK — primary red on dark surfaces */
          .assessment-results .ar-btn-secondary-dark {
            background: #b91c1c;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(185,28,28,0.25);
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
          }
          .assessment-results .ar-btn-secondary-dark:hover:not(:disabled) {
            background: #991b1b;
            box-shadow: 0 6px 18px rgba(185,28,28,0.35);
            transform: translateY(-1px);
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

          /* ── Typography ─────────────────────────────────────────────── */
          .assessment-results h1 {
            font-weight: 700;
            line-height: 1.2;
            letter-spacing: -0.02em;
          }
          .assessment-results h2 {
            font-weight: 700;
            line-height: 1.25;
            letter-spacing: -0.015em;
          }
          .assessment-results h3 {
            font-weight: 600;
            line-height: 1.3;
            letter-spacing: -0.01em;
          }
          .assessment-results h4 {
            font-weight: 600;
            line-height: 1.3;
            letter-spacing: -0.005em;
          }
          .assessment-results p {
            font-weight: 400;
            line-height: 1.6;
            color: rgba(17,17,17,0.75);
          }
          .assessment-results span.body-medium {
            font-weight: 500;
            line-height: 1.55;
          }
          .assessment-results .text-label {
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.04em;
            color: rgba(17,17,17,0.65);
          }
          .assessment-results small,
          .assessment-results caption,
          .assessment-results figcaption {
            font-weight: 400;
            letter-spacing: 0.02em;
            color: rgba(17,17,17,0.55);
          }

          /* ── Micro depth — section separators ───────────────────────── */
          .assessment-results .space-y-10 > * + * {
            border-top: 1px solid rgba(0,0,0,0.04);
            padding-top: inherit;
          }

          /* ── Smooth transitions on interactive surfaces ──────────────── */
          .assessment-results a,
          .assessment-results button:not(:disabled) {
            transition: background 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
          }
          .assessment-results [class*="rounded"] {
            transition: box-shadow 0.2s ease, border-color 0.2s ease;
          }

          /* ── Ring idle pulse (starts after animation completes) ──────── */
          @keyframes ring-idle-pulse {
            0%, 100% { filter: drop-shadow(0 0 5px rgba(185,28,28,0.12)); }
            50%       { filter: drop-shadow(0 0 12px rgba(185,28,28,0.26)); }
          }
          .ring-idle-pulse {
            animation: ring-idle-pulse 3.5s ease-in-out infinite;
          }

          /* ── Bar shimmer (one-time, fires on mount) ──────────────────── */
          @keyframes bar-shimmer {
            0%   { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .bar-shimmer {
            background: linear-gradient(90deg, #b30000 0%, #ff6b6b 40%, #b30000 70%) !important;
            background-size: 200% 100% !important;
            animation: bar-shimmer 1.2s ease-out 1 forwards;
          }

          /* ── Progress row hover ──────────────────────────────────────── */
          .progress-row {
            transition: transform 0.15s ease;
          }
          .progress-row:hover {
            transform: translateX(2px);
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
            background:           pageScrolled ? 'rgba(18,18,20,0.97)' : 'rgba(18,18,20,0.88)',
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

        {/* ── Main content ────────────────────────────────────────── */}
        <div className="relative z-10 flex-1 py-10">
          {result && engineResult && <ResultsScreen result={result} engineResult={engineResult} />}
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div className="relative z-10 py-6 text-center" style={{ borderTop: '1px solid rgba(0,0,0,0.15)', background: '#e8e8ea', opacity: 1 }}>
          <p className="text-label" style={{ color: '#111111', opacity: 1 }}>
            Brilliant Star Quartz · Licensed PRU Life UK Advisor · Ortigas, Pasig City
          </p>
        </div>

      </div>
    )
  }

  // ─── phase === 'question' — focused KYC-style onboarding layout ─────
  const visibleQs  = getVisibleQuestions(answers as Record<string, string>)
  const safeStep   = Math.min(step, visibleQs.length - 1)
  const currentQ   = visibleQs[safeStep]
  const totalSteps = visibleQs.length
  const pct        = Math.round(((safeStep + 1) / totalSteps) * 100)

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100dvh',
        background: 'linear-gradient(165deg, #ffffff 0%, #f6f8ff 50%, #eef1ff 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        html, body { overscroll-behavior: none; background: #f6f8ff; }
        @keyframes af-fade-in { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .af-fade { animation: af-fade-in 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes af-glow-pulse { 0%,100% { opacity:0.40; } 50% { opacity:1; } }
        .af-card-scroll { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.10) transparent; }
        .af-card-scroll::-webkit-scrollbar { width: 3px; }
        .af-card-scroll::-webkit-scrollbar-track { background: transparent; }
        .af-card-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.10); border-radius: 9999px; }
      `}</style>

      {/* ─── Z-INDEX MAP: z-1 glows · z-2 ribbon · z-10 card · z-20 footer · z-999 header ─── */}

      {/* z-1 — Ambient glows */}
      <div aria-hidden className="pointer-events-none" style={{ position:'fixed', inset:0, zIndex:1 }}>
        <div style={{ position:'absolute', top:'-15%', right:'-8%', width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle, rgba(237,27,46,0.050) 0%, transparent 68%)' }} />
        <div style={{ position:'absolute', bottom:'-10%', left:'-6%', width:460, height:460, borderRadius:'50%', background:'radial-gradient(circle, rgba(100,116,255,0.040) 0%, transparent 68%)' }} />
        <div style={{ position:'absolute', top:'38%', left:'18%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(237,27,46,0.025) 0%, transparent 60%)' }} />
      </div>

      {/* z-2 — PRU RIBBON: diagonal band flowing THROUGH the layout, behind the card.
          ViewBox 0 0 1440 900 → maps to full viewport via preserveAspectRatio="none".
          Path anatomy:
            Enters top-left at ~42% vh (y≈384) → descends asymmetrically, faster left side
            Deepest point ~61% vh (y≈549) around x=695 (slightly left-of-centre)
            Gradual rise through right half → exits at ~50% vh (y≈452) right edge
          Control-point strategy:
            Left quarter:  wide handle spans → steep "compression" descent
            Centre:        narrower handles, path flattens into trough → organic "stretch"
            Right quarter: elongated handles, smooth accelerating rise → elegant exit
      */}
      <svg
        aria-hidden="true"
        className="pointer-events-none"
        style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:2 }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="afRMain" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#BE0020" stopOpacity="0"/>
            <stop offset="3%"   stopColor="#C8001E" stopOpacity="0.92"/>
            <stop offset="28%"  stopColor="#E20026" stopOpacity="1"/>
            <stop offset="55%"  stopColor="#D92D20" stopOpacity="1"/>
            <stop offset="82%"  stopColor="#C8001E" stopOpacity="0.96"/>
            <stop offset="97%"  stopColor="#BE0020" stopOpacity="0.75"/>
            <stop offset="100%" stopColor="#BE0020" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="afRHL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#FF7088" stopOpacity="0"/>
            <stop offset="3%"   stopColor="#FF607A" stopOpacity="0.42"/>
            <stop offset="35%"  stopColor="#FF3A5C" stopOpacity="0.38"/>
            <stop offset="65%"  stopColor="#FF4A6A" stopOpacity="0.34"/>
            <stop offset="97%"  stopColor="#FF607A" stopOpacity="0.28"/>
            <stop offset="100%" stopColor="#FF7088" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="afRShadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6E0012" stopOpacity="0"/>
            <stop offset="3%"   stopColor="#7A0016" stopOpacity="0.28"/>
            <stop offset="42%"  stopColor="#880018" stopOpacity="0.24"/>
            <stop offset="75%"  stopColor="#7A0016" stopOpacity="0.20"/>
            <stop offset="97%"  stopColor="#6E0012" stopOpacity="0.16"/>
            <stop offset="100%" stopColor="#6E0012" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="afGComp" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#C0C0C8" stopOpacity="0"/>
            <stop offset="3%"   stopColor="#C8C8D0" stopOpacity="0.30"/>
            <stop offset="50%"  stopColor="#D8D8E0" stopOpacity="0.26"/>
            <stop offset="97%"  stopColor="#C8C8D0" stopOpacity="0.20"/>
            <stop offset="100%" stopColor="#C0C0C8" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* Gray companion — bottommost, +16px below main */}
        <path d="M -20,410  C 110,403  230,420  375,472  C 490,512  580,546  690,563  C 780,577  858,574  946,558  C 1052,538  1168,513  1292,494  C 1368,484  1415,479  1460,478"
              fill="none" stroke="url(#afGComp)" strokeWidth="13" strokeLinecap="round"/>
        {/* Shadow underside — +8px below main, wide stroke for depth */}
        <path d="M -20,398  C 112,391  232,408  377,460  C 492,500  582,534  692,551  C 782,565  860,562  948,546  C 1054,526  1170,501  1294,482  C 1370,472  1417,467  1460,466"
              fill="none" stroke="url(#afRShadow)" strokeWidth="22" strokeLinecap="round"/>
        {/* Main red ribbon */}
        <path d="M -20,384  C 115,377  235,394  380,446  C 495,486  585,520  695,537  C 785,551  863,548  951,532  C 1057,512  1173,487  1297,468  C 1373,458  1420,453  1460,452"
              fill="none" stroke="url(#afRMain)" strokeWidth="13" strokeLinecap="round"/>
        {/* Top highlight — topmost, thin, -12px above main */}
        <path d="M -20,372  C 118,365  238,382  383,434  C 498,474  588,508  698,525  C 788,539  866,536  954,520  C 1060,500  1176,475  1300,456  C 1376,446  1423,441  1460,440"
              fill="none" stroke="url(#afRHL)" strokeWidth="3.5" strokeLinecap="round"/>
      </svg>

      {/* z-999 — FOCUSED HEADER */}
      <header style={{
        position:             'fixed',
        top:0, left:0, right:0,
        height:               52,
        zIndex:               999,
        display:              'flex',
        alignItems:           'center',
        gap:                  16,
        padding:              '0 20px',
        background:           pageScrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.90)',
        backdropFilter:       'saturate(200%) blur(20px)',
        WebkitBackdropFilter: 'saturate(200%) blur(20px)',
        borderBottom:         '1px solid rgba(0,0,0,0.07)',
        transition:           'background 0.3s ease',
      }}>

        {/* Left — compact BSQ logo */}
        <a href="/" aria-label="BSQ Home" style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0, textDecoration:'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/bsq-logo.png" alt="BSQ" width={28} height={28} style={{ objectFit:'contain', display:'block' }} />
          <span style={{ fontSize:13, fontWeight:700, color:'#111', letterSpacing:'0.01em', lineHeight:1 }}>BSQ</span>
        </a>

        {/* Center — animated progress bar */}
        <div style={{ flex:1, position:'relative' }}>
          {/* Track */}
          <div style={{ height:3, background:'rgba(0,0,0,0.07)', borderRadius:9999, overflow:'hidden' }}>
            {/* Fill */}
            <div style={{
              height:     '100%',
              width:      `${pct}%`,
              background: 'linear-gradient(90deg, #D92D20 0%, #b91c1c 100%)',
              borderRadius: 9999,
              transition: 'width 0.55s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
        </div>

        {/* Right — step counter */}
        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <span style={{
            fontSize:12, fontWeight:400,
            color:'rgba(17,17,17,0.38)',
            fontVariantNumeric:'tabular-nums',
            letterSpacing:'0.02em',
          }}>
            {safeStep + 1}&thinsp;<span style={{ opacity:0.5 }}>of</span>&thinsp;{totalSteps}
          </span>
          {/* Subtle live dot */}
          <span style={{
            width:5, height:5, borderRadius:'50%', flexShrink:0, display:'inline-block',
            background:'#D92D20', boxShadow:'0 0 5px rgba(217,45,32,0.55)',
            animation:'af-glow-pulse 2s ease-in-out infinite',
          }} />
        </div>
      </header>

      {/* Header spacer */}
      <div style={{ height:52, flexShrink:0 }} />

      {/* z-10 — MAIN CONTENT */}
      <main
        className="relative flex-1 flex flex-col justify-center"
        style={{ padding:'12px 20px 44px', zIndex:10, minHeight:0, overflow:'hidden' }}
      >
        {/* Constrains card height to remaining viewport minus header (52px) + padding */}
        <div style={{ maxWidth:620, margin:'0 auto', width:'100%', display:'flex', flexDirection:'column', maxHeight:'calc(100dvh - 116px)' }}>
          <div
            className="af-card-scroll"
            style={{
              background:           'rgba(255,255,255,0.93)',
              backdropFilter:       'saturate(180%) blur(28px)',
              WebkitBackdropFilter: 'saturate(180%) blur(28px)',
              border:               '1px solid rgba(255,255,255,0.90)',
              borderRadius:         24,
              padding:              'clamp(24px, 3.5vh, 40px) clamp(22px, 3.5vw, 40px)',
              boxShadow:            '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.07), 0 28px 60px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
              flex:                 1,
              minHeight:            0,
              overflowY:            'auto',
            }}
          >
            {currentQ && (
              <QuestionScreen
                key={safeStep}
                question={currentQ}
                onAnswer={handleAnswer}
              />
            )}
          </div>
        </div>
      </main>

      {/* z-20 — TRUST FOOTER: transparent, floats above ribbon */}
      <footer style={{
        position:   'fixed',
        bottom:     0, left:0, right:0,
        zIndex:     20,
        padding:    '10px 24px 11px',
        textAlign:  'center',
      }}>
        <p style={{ fontSize:10, color:'rgba(17,17,17,0.30)', letterSpacing:'0.06em', margin:0 }}>
          🔒&nbsp; Confidential &nbsp;·&nbsp; Free &nbsp;·&nbsp; No obligation &nbsp;·&nbsp; PRU Life UK Licensed Advisor
        </p>
      </footer>
    </div>
  )
}
