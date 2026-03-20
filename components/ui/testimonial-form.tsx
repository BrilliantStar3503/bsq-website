'use client'

import { useState } from 'react'
import { CheckCircle, Star } from 'lucide-react'

const PRU_RED = '#ed1b2e'

interface FormState {
  rating:  number
  message: string
  name:    string
  role:    string
  consent: boolean
}

const INITIAL: FormState = { rating: 0, message: '', name: '', role: '', consent: false }

export default function TestimonialForm() {
  const [form,      setForm]      = useState<FormState>(INITIAL)
  const [hover,     setHover]     = useState(0)
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  const set = (key: keyof FormState, val: string | number | boolean) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.rating === 0)    return setError('Please select a star rating.')
    if (!form.message.trim()) return setError('Please share a short feedback.')
    if (!form.consent)        return setError('Please check the consent box.')

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/testimonial', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="text-center py-10 px-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}>
          <CheckCircle size={26} className="text-green-500" />
        </div>
        <h4 className="text-lg font-black text-gray-900 mb-2">Thank you! 🙏</h4>
        <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
          Your feedback helps others make better financial decisions. We appreciate you taking the time.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-1"
          style={{ color: PRU_RED }}>Share Your Experience</p>
        <h3 className="text-lg font-black text-gray-900 leading-tight">
          How was your assessment?
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Takes less than 30 seconds. Your feedback helps others.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Star Rating ── */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block mb-2">
            Your Rating
          </label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => set('rating', star)}
                className="transition-transform duration-100 hover:scale-110"
                aria-label={`${star} star`}
              >
                <Star
                  size={28}
                  fill={(hover || form.rating) >= star ? '#f59e0b' : 'none'}
                  stroke={(hover || form.rating) >= star ? '#f59e0b' : '#d1d5db'}
                  strokeWidth={1.5}
                />
              </button>
            ))}
            {form.rating > 0 && (
              <span className="text-xs text-gray-400 self-center ml-1">
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][form.rating]}
              </span>
            )}
          </div>
        </div>

        {/* ── Message ── */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5">
            Your Feedback <span className="text-gray-400 normal-case font-normal">(required)</span>
          </label>
          <textarea
            rows={3}
            placeholder="How did the assessment help you? What did you learn?"
            value={form.message}
            onChange={e => set('message', e.target.value)}
            maxLength={300}
            className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 resize-none outline-none transition-all duration-200"
            style={{ border: '1.5px solid #e5e7eb', background: '#fafafa' }}
            onFocus={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.boxShadow = `0 0 0 3px ${PRU_RED}15` }}
            onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
          />
          <p className="text-[10px] text-gray-400 text-right mt-1">{form.message.length}/300</p>
        </div>

        {/* ── Name + Role ── */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5">
              Name <span className="text-gray-400 normal-case font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Maria S."
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm text-gray-900 outline-none transition-all duration-200"
              style={{ border: '1.5px solid #e5e7eb', background: '#fafafa' }}
              onFocus={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.boxShadow = `0 0 0 3px ${PRU_RED}15` }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5">
              Role <span className="text-gray-400 normal-case font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Business Owner"
              value={form.role}
              onChange={e => set('role', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm text-gray-900 outline-none transition-all duration-200"
              style={{ border: '1.5px solid #e5e7eb', background: '#fafafa' }}
              onFocus={e => { e.currentTarget.style.borderColor = PRU_RED; e.currentTarget.style.boxShadow = `0 0 0 3px ${PRU_RED}15` }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
        </div>

        {/* ── Consent ── */}
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={e => set('consent', e.target.checked)}
              className="sr-only"
            />
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150"
              style={{
                background: form.consent ? PRU_RED : '#fff',
                border: `2px solid ${form.consent ? PRU_RED : '#d1d5db'}`,
              }}
            >
              {form.consent && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
          <span className="text-xs text-gray-500 leading-relaxed">
            I agree to display this feedback on the BSQ website to help other Filipinos make better financial decisions.
          </span>
        </label>

        {/* ── Error ── */}
        {error && (
          <p className="text-xs font-medium text-center" style={{ color: PRU_RED }}>{error}</p>
        )}

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all duration-200"
          style={{
            background:  `linear-gradient(135deg, ${PRU_RED}, #c1121f)`,
            boxShadow:   `0 6px 20px ${PRU_RED}35`,
            opacity:     loading ? 0.75 : 1,
          }}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </>
          ) : (
            'Submit My Feedback'
          )}
        </button>

        <p className="text-[10px] text-gray-400 text-center">
          🔒 Your feedback is kept private until you consent to share it.
        </p>
      </form>
    </div>
  )
}
