'use client'

import { useEffect, useState } from 'react'
import { PopupModal } from 'react-calendly'
import { GlowButton } from './ui/glow-button'

/* ─── Loading messages ─────────────────────────────────────────────── */
const LOADING_MSGS = [
  'Building your personalized plan…',
  'Matching strategies to your profile…',
]

/* ─── Benefits ─────────────────────────────────────────────────────── */
const BENEFITS = [
  { icon: '🎯', text: 'Based on your actual financial gaps' },
  { icon: '📐', text: 'Tailored to your budget and goals' },
  { icon: '🤝', text: 'No pressure — just clarity' },
]

/* ─── Loader (light-themed to match parent) ────────────────────────── */
function ClosingLoader({ msgIndex }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20">
      <div className="cls-spin mb-5" style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '2px solid #e5e7eb', borderTopColor: '#dc2626',
      }} />
      <p key={msgIndex} className="cls-fade-up text-sm text-gray-400 tracking-wide text-center">
        {LOADING_MSGS[msgIndex % LOADING_MSGS.length]}
      </p>
      <div className="flex gap-1.5 mt-4">
        {LOADING_MSGS.map((_, i) => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: '50%', transition: 'background 0.3s',
            background: i <= msgIndex % LOADING_MSGS.length ? '#dc2626' : '#e5e7eb',
          }} />
        ))}
      </div>
    </div>
  )
}

/* ─── Main component ───────────────────────────────────────────────── */
export default function ClosingSection() {
  const [loading, setLoading] = useState(true)
  const [msgIndex, setMsgIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setMsgIndex((i) => i + 1), 750)
    const timer = setTimeout(() => {
      clearInterval(interval)
      setLoading(false)
      setTimeout(() => setVisible(true), 80)
    }, 1600)
    return () => { clearInterval(interval); clearTimeout(timer) }
  }, [])

  return (
    <section className="border-t border-gray-200">
      <style>{`
        @keyframes cls-spin { to { transform: rotate(360deg); } }
        @keyframes cls-fade-up { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cls-fade-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .cls-spin    { animation: cls-spin 1s linear infinite; }
        .cls-fade-up { animation: cls-fade-up 0.4s ease both; }
        .cls-in      { animation: cls-fade-in 0.5s ease both; }
        .cls-d1 { animation: cls-fade-in 0.5s ease 0.1s both; }
        .cls-d2 { animation: cls-fade-in 0.5s ease 0.2s both; }
        .cls-d3 { animation: cls-fade-in 0.5s ease 0.3s both; }
        .cls-d4 { animation: cls-fade-in 0.5s ease 0.4s both; }
        .cls-d5 { animation: cls-fade-in 0.5s ease 0.5s both; }
        .cls-btn-wa:hover { background: #f0fdf4; border-color: #86efac; }
      `}</style>

      {/* Section label strip */}
      <div className="bg-white border-b border-gray-100 px-5 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#dc2626' }} />
          <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
            Personalized Action Plan
          </span>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="max-w-3xl mx-auto px-5">
          <ClosingLoader msgIndex={msgIndex} />
        </div>
      )}

      {/* Revealed content */}
      {!loading && (
        <div
          className="max-w-3xl mx-auto px-5 pt-8 pb-16"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}
        >
          {/* Based-on-results divider */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 whitespace-nowrap">
              Based on your results
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ── Handoff card ────────────────────────────────────────── */}
          <div className="cls-in bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
            {/* Red top accent bar */}
            <div style={{ height: 3, background: 'linear-gradient(to right, #dc2626, #ef4444)' }} />

            <div style={{ padding: '32px 28px 28px' }}>
              {/* AI label */}
              <div className="flex justify-center mb-5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
                  AI Analysis Complete — Plan Ready
                </span>
              </div>

              {/* Title */}
              <h2 className="cls-d1 text-xl md:text-2xl font-bold text-gray-900 text-center leading-snug mb-3">
                Your plan is ready. Let's walk through it together.
              </h2>

              {/* Description */}
              <p className="cls-d2 text-sm text-gray-500 text-center leading-relaxed max-w-md mx-auto mb-8">
                A licensed advisor will explain your gaps and recommend the best strategy based on your results.
              </p>

              {/* Benefits */}
              <div className="cls-d3 flex flex-col gap-2 max-w-sm mx-auto mb-8">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                    <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>{b.icon}</span>
                    <span className="text-sm text-gray-700 font-medium flex-1">{b.text}</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="cls-d4 flex flex-col sm:flex-row gap-3 justify-center">
                {/* Primary — Messenger booking */}
                <GlowButton
                  variant="primary"
                  spread={38}
                  proximity={72}
                  inactiveZone={0.25}
                  borderWidth={2}
                  btnClassName="rounded-xl px-7 py-3.5 text-sm"
                  onClick={() => {
                    console.log('Opening Calendly')
                    setIsCalendlyOpen(true)
                  }}
                >
                  Book My Free Consultation →
                </GlowButton>

                {/* Calendly popup */}
                {typeof window !== 'undefined' && (
                  <PopupModal
                    url="https://calendly.com/brilliantstarquartz/30min"
                    onModalClose={() => setIsCalendlyOpen(false)}
                    open={isCalendlyOpen}
                    rootElement={document.body}
                  />
                )}

                {/* Secondary — WhatsApp deep link */}
                <GlowButton
                  variant="secondary"
                  spread={32}
                  proximity={60}
                  inactiveZone={0.3}
                  borderWidth={1}
                  btnClassName="rounded-xl px-7 py-3.5 text-sm bg-white border border-gray-200 text-gray-700 hover:text-gray-900"
                  onClick={() => {
                    console.log('WhatsApp clicked')
                    window.location.href = 'https://wa.me/639178232799?text=Hi%20I%20just%20completed%20my%20financial%20assessment%20and%20would%20like%20to%20get%20my%20plan.'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                      fill="#25D366" />
                  </svg>
                  Send Me My Plan via WhatsApp
                </GlowButton>
              </div>

              {/* Reassurance */}
              <p className="cls-d5 text-center text-xs text-gray-400 mt-5">
                Licensed PRU Life UK advisor · Ortigas Branch · Free · No obligation
              </p>
            </div>
          </div>

          {/* ── Trust strip ─────────────────────────────────────────── */}
          <div className="cls-d5 mt-5 bg-white border border-gray-200 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 20 }}>🏦</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">PRU Life UK — Authorized Advisor</p>
                <p className="text-[10px] text-gray-400">Regulated by the Insurance Commission of the Philippines</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {['🔒 Confidential', '📋 IC Compliant', '🇵🇭 Based in Manila'].map((item) => (
                <span key={item} className="text-[10px] text-gray-400 whitespace-nowrap">{item}</span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-gray-400 mt-7">
            Brilliant Star Quartz · A tied-branch of PRU Life UK · 18th Floor, Exquadra Tower, Ortigas Center
          </p>
        </div>
      )}
    </section>
  )
}
