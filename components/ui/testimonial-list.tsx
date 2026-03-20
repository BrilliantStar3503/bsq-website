'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

const PRU_RED = '#ed1b2e'

export interface Testimonial {
  id:        string
  rating:    number
  message:   string
  name:      string
  role:      string
  consent:   boolean
  timestamp: string
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 animate-pulse"
      style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 rounded bg-gray-200" />
        ))}
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-3/5" />
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="space-y-1">
          <div className="h-2.5 w-20 bg-gray-200 rounded" />
          <div className="h-2 w-16 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )
}

/* ── Star display ── */
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={14}
          fill={s <= rating ? '#f59e0b' : 'none'}
          stroke={s <= rating ? '#f59e0b' : '#e5e7eb'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

/* ── Testimonial card ── */
function TestimonialCard({ t }: { t: Testimonial }) {
  const initials = t.name
    ? t.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '★'

  return (
    <div
      className="rounded-2xl p-6 flex flex-col h-full transition-all duration-200"
      style={{
        background:  '#ffffff',
        border:      '1px solid #f1f5f9',
        boxShadow:   '0 1px 6px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.09)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
    >
      <StarRow rating={t.rating} />

      <p className="text-sm text-gray-700 leading-relaxed flex-1 mb-4">
        &ldquo;{t.message}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid #f8fafc' }}>
        {/* Avatar initials */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-white"
          style={{ background: `linear-gradient(135deg, ${PRU_RED}, #c1121f)` }}>
          {initials}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900">
            {t.name || 'Anonymous'}
          </p>
          {t.role && (
            <p className="text-[10px] text-gray-400">{t.role}</p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main list component ── */
export default function TestimonialList() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(false)

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: Testimonial[]) => {
        // Only show consented testimonials
        setTestimonials(data.filter(t => t.consent && t.message?.trim()))
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  /* Nothing to show yet */
  if (!loading && !error && testimonials.length === 0) return null

  return (
    <section className="py-20 px-6" style={{ background: '#f8fafc' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2"
            style={{ color: PRU_RED }}>Real Clients · Real Results</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
            What Our Clients Say
          </h2>
          <p className="text-sm text-gray-500 mt-3 max-w-sm mx-auto">
            Verified feedback from real assessments — unedited, authentic.
          </p>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-sm text-gray-400">
            Unable to load testimonials right now.
          </p>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        )}

        {/* Count badge */}
        {!loading && testimonials.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-10">
            {testimonials.length} verified {testimonials.length === 1 ? 'review' : 'reviews'} from real BSQ assessments
          </p>
        )}
      </div>
    </section>
  )
}
