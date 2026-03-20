'use client'

import { useEffect, useState } from 'react'
import { GlowButton } from './ui/glow-button'

/* ─── Mock data ────────────────────────────────────────────────────── */
const MOCK = {
  score: 62,
  gaps: [
    {
      id: 1,
      title: 'Income Protection Gap',
      description: 'Your income is not fully protected if you become unable to work due to illness, disability, or death.',
      consequence: 'If this happens, your family may lose their primary income source.',
      severity: 'high',
    },
    {
      id: 2,
      title: 'Retirement Income Gap',
      description: 'Based on your current savings rate, projected retirement income falls below your monthly expenses.',
      consequence: 'You may outlive your savings without a stable income stream.',
      severity: 'medium',
    },
    {
      id: 3,
      title: 'Medical Coverage Gap',
      description: 'No dedicated health buffer detected. A major medical event could directly impact your savings.',
      consequence: 'A single hospital event could significantly reduce your savings.',
      severity: 'medium',
    },
  ],
  recommendations: [
    {
      id: 1,
      name: 'PRUMillion Protect',
      layer: 'Income Replacement Layer',
      what: 'Delivers a lump-sum benefit that replaces years of lost income if you pass away or become permanently disabled.',
      why: 'Your income is currently unprotected and dependents rely on it.',
      accent: '#ef4444',
      dot: '#ef4444',
    },
    {
      id: 2,
      name: 'PRULifetime Income',
      layer: 'Retirement Income Layer',
      what: 'Converts savings into a guaranteed monthly income that continues for life regardless of market conditions.',
      why: 'Your retirement income projection shows a gap against your current expense level.',
      accent: '#f59e0b',
      dot: '#f59e0b',
    },
    {
      id: 3,
      name: 'PRU Health Prime',
      layer: 'Medical Risk Layer',
      what: 'Covers hospitalization, surgeries, and critical illness costs, separating medical expenses from your savings.',
      why: 'No medical coverage buffer was detected in your current financial profile.',
      accent: '#0ea5e9',
      dot: '#0ea5e9',
    },
  ],
}

/* ─── Helpers ──────────────────────────────────────────────────────── */
const LOADING_MSGS = [
  'Analyzing your financial profile…',
  'Comparing against protection benchmarks…',
  'Detecting gaps in your coverage…',
  'Generating personalized recommendations…',
]

function severityConfig(severity) {
  if (severity === 'high') return { label: 'High Risk', bg: '#fef2f2', border: '#fecaca', text: '#dc2626' }
  if (severity === 'medium') return { label: 'Medium Risk', bg: '#fffbeb', border: '#fde68a', text: '#d97706' }
  return { label: 'Low Risk', bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a' }
}

/* ─── Score Ring ───────────────────────────────────────────────────── */
const RADIUS = 52
const CIRC = 2 * Math.PI * RADIUS

function ScoreRing({ score }) {
  const [displayScore, setDisplayScore] = useState(0)
  const [offset, setOffset] = useState(CIRC)

  useEffect(() => {
    let start = null
    const duration = 1400
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setDisplayScore(Math.round(e * score))
      setOffset(CIRC - e * (score / 100) * CIRC)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [score])

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: 156, height: 156 }}>
      <svg width="156" height="156" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx="78" cy="78" r={RADIUS} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        {/* Progress */}
        <circle
          cx="78" cy="78" r={RADIUS} fill="none"
          stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-900 tabular-nums">{displayScore}</span>
        <span className="text-xs text-gray-400 mt-0.5">out of 100</span>
      </div>
    </div>
  )
}

/* ─── Dark loading screen (AI state — intentionally dark) ──────────── */
function LoadingScreen({ msgIndex }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b]">
      <style>{`
        @keyframes rs-spin { to { transform: rotate(360deg); } }
        @keyframes rs-fade-up { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .rs-spin { animation: rs-spin 1s linear infinite; }
        .rs-fade-up { animation: rs-fade-up 0.4s ease both; }
      `}</style>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 30%, rgba(239,68,68,0.08), transparent 60%)',
      }} />
      <div className="rs-spin mb-8" style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#ef4444',
      }} />
      <div className="rs-fade-up" key={msgIndex}>
        <p className="text-white/60 text-sm tracking-wide text-center px-6">
          {LOADING_MSGS[msgIndex % LOADING_MSGS.length]}
        </p>
      </div>
      <div className="flex gap-1.5 mt-6">
        {LOADING_MSGS.map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%', transition: 'background 0.3s',
            background: i <= msgIndex % LOADING_MSGS.length ? '#ef4444' : 'rgba(255,255,255,0.12)',
          }} />
        ))}
      </div>
    </div>
  )
}

/* ─── Main component ───────────────────────────────────────────────── */
export default function ResultsSection() {
  const [loading, setLoading] = useState(true)
  const [msgIndex, setMsgIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setMsgIndex((i) => i + 1), 600)
    const timer = setTimeout(() => {
      clearInterval(interval)
      setLoading(false)
      setTimeout(() => setVisible(true), 80)
    }, 2400)
    return () => { clearInterval(interval); clearTimeout(timer) }
  }, [])

  return (
    <>
      <style>{`
        @keyframes rs-fade-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .rs-in    { animation: rs-fade-in 0.55s ease both; }
        .rs-in-d1 { animation: rs-fade-in 0.55s ease 0.12s both; }
        .rs-in-d2 { animation: rs-fade-in 0.55s ease 0.24s both; }
        .rs-in-d3 { animation: rs-fade-in 0.55s ease 0.36s both; }
        .rs-in-d4 { animation: rs-fade-in 0.55s ease 0.48s both; }
        .rs-spin  { animation: rs-spin 1s linear infinite; }
        @keyframes rs-spin { to { transform: rotate(360deg); } }
      `}</style>

      {loading && <LoadingScreen msgIndex={msgIndex} />}

      {!loading && (
        <div
          className="py-14 px-5"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}
        >
          <div className="max-w-3xl mx-auto space-y-6">

            {/* ── AI system header ──────────────────────────────────── */}
            <div className="rs-in flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                  BSQ Financial System
                </span>
              </div>
              <span className="text-xs text-gray-400 tabular-nums">
                Report #{Math.floor(Math.random() * 90000) + 10000}
              </span>
            </div>

            {/* ── Score card ────────────────────────────────────────── */}
            <div className="rs-in-d1 bg-white border border-gray-200 shadow-md rounded-2xl p-8">
              {/* AI label */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                  Financial Protection Score
                </p>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full"
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
                  Needs Attention
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <ScoreRing score={MOCK.score} />

                <div className="flex-1 text-center sm:text-left">
                  {/* Status headline */}
                  <p className="text-lg font-bold text-gray-900 leading-snug mb-2">
                    ⚠️ You're Partially Protected — But Exposed in Key Areas
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    We found multiple areas where your financial plan could fail under real-life scenarios.
                  </p>

                  {/* Confidence chip */}
                  <div className="inline-flex items-center gap-2 rounded-xl px-3 py-2 mb-5"
                    style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <div>
                      <span className="text-xs font-semibold text-green-700">Confidence Level: High</span>
                      <span className="text-[10px] text-green-600 ml-1.5">· Based on your inputs and financial benchmarks</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
                      <span>0 — At Risk</span><span>50</span><span>100 — Protected</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div style={{
                        height: '100%',
                        width: `${MOCK.score}%`,
                        borderRadius: 9999,
                        background: 'linear-gradient(to right, #ef4444, #dc2626)',
                        transition: 'width 1.4s cubic-bezier(0.34,1.56,0.64,1)',
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Gap section ───────────────────────────────────────── */}
            <div className="rs-in-d2">
              {/* Section label */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-bold text-gray-900">Detected Financial Gaps</h2>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                  System Detected · {MOCK.gaps.length} Gaps
                </span>
              </div>

              <div className="space-y-3">
                {MOCK.gaps.map((gap, i) => {
                  const sev = severityConfig(gap.severity)
                  return (
                    <div
                      key={gap.id}
                      className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5"
                      style={{ animation: `rs-fade-in 0.5s ease ${0.28 + i * 0.1}s both` }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold flex items-center justify-center rounded-full shrink-0"
                            style={{ width: 22, height: 22, background: sev.bg, border: `1px solid ${sev.border}`, color: sev.text }}>
                            {i + 1}
                          </span>
                          <h3 className="text-sm font-semibold text-gray-900">{gap.title}</h3>
                        </div>
                        <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: sev.bg, border: `1px solid ${sev.border}`, color: sev.text }}>
                          {sev.label}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 leading-relaxed pl-8 mb-2.5">{gap.description}</p>

                      {/* Consequence */}
                      <div className="pl-8 flex items-start gap-1.5">
                        <span className="text-[11px] shrink-0 mt-px">⚡</span>
                        <p className="text-[11px] italic leading-relaxed"
                          style={{ color: gap.severity === 'high' ? '#dc2626' : '#d97706' }}>
                          {gap.consequence}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Recommendations ───────────────────────────────────── */}
            <div className="rs-in-d3">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-base font-bold text-gray-900">Recommended Based on Your Gaps</h2>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                  style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                  Recommended Based on Data
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Solutions surfaced by the system based on detected patterns in your profile.
              </p>

              <div className="space-y-3">
                {MOCK.recommendations.map((rec, i) => (
                  <div
                    key={rec.id}
                    className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow duration-200"
                    style={{ animation: `rs-fade-in 0.5s ease ${0.42 + i * 0.1}s both` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-1.5" style={{ width: 8, height: 8, borderRadius: '50%', background: rec.dot }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-sm font-bold text-gray-900">{rec.name}</h3>
                          <span className="text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                            {rec.layer}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed mb-3">{rec.what}</p>
                        <div className="border-l-2 border-gray-200 pl-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Why this matters:</p>
                          <p className="text-xs text-gray-500 italic leading-relaxed">{rec.why}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CTA ───────────────────────────────────────────────── */}
            <div className="rs-in-d4">
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 text-center">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3">Next Step</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Your results are ready. Let's build your plan.
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-sm mx-auto">
                  A licensed advisor will walk you through your gaps and match you with the right solution — no pressure, no commitment.
                </p>

                {/* Urgency */}
                <p className="text-xs italic text-amber-600 mb-6">
                  ⚠️ Most people take action after seeing this — don't ignore these gaps.
                </p>

                <GlowButton
                  variant="primary"
                  spread={40}
                  proximity={72}
                  inactiveZone={0.25}
                  borderWidth={2}
                  btnClassName="rounded-xl px-6 py-3 text-sm"
                  onClick={() => {
                    console.log('Fix gaps clicked')
                    window.location.href = 'https://m.me/Bstarquartzarea?ref=results_fix_gaps'
                  }}
                >
                  Fix My Financial Gaps →
                </GlowButton>

                <p className="text-xs text-gray-400 mt-3">
                  Based on your actual gaps &nbsp;·&nbsp; No guesswork
                </p>
              </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-[11px] text-gray-400 pb-2">
              Results generated by the BSQ Financial Assessment System · For advisory purposes only
            </p>

          </div>
        </div>
      )}
    </>
  )
}
