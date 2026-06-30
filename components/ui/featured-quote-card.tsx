'use client'

/* ── Large editorial quote card — "Why It Matters"-style sections ──────
   Reuses the initials-avatar pattern already established in
   testimonial-list.tsx (gradient circle + initials) rather than
   inventing a new placeholder treatment. Pass `photoSrc` once a real
   headshot exists; falls back to initials automatically. ──────────── */

const PRU_RED = '#D92D20'

export interface FeaturedQuote {
  quote: string
  name: string
  title: string
  photoSrc?: string
}

export function FeaturedQuoteCard({ quote, name, title, photoSrc }: FeaturedQuote) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="relative">
      {/* Undertone — a second surface peeking out behind the card,
          same layered-depth technique used by the hero photo and the
          goal/recommendation cards, instead of one heavy drop-shadow. */}
      <div className="absolute rounded-3xl" style={{ inset: '10px -10px -10px 10px', background: 'rgba(0,0,0,0.06)' }} />
      <div
        className="relative rounded-3xl p-9 md:p-11"
        style={{ background: '#ffffff', boxShadow: '0 1px 2px rgba(16,24,40,0.04), 0 32px 56px -16px rgba(16,24,40,0.16)' }}
      >
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" style={{ color: PRU_RED }} className="mb-5" aria-hidden="true">
          <path d="M0 24V13.714C0 9.143 1.143 5.714 3.429 3.429C5.714 1.143 8.571 0 12 0V5.143C9.714 5.143 8 5.714 6.857 6.857C5.714 8 5.143 9.714 5.143 12H12V24H0ZM20 24V13.714C20 9.143 21.143 5.714 23.429 3.429C25.714 1.143 28.571 0 32 0V5.143C29.714 5.143 28 5.714 26.857 6.857C25.714 8 25.143 9.714 25.143 12H32V24H20Z" fill="currentColor" />
        </svg>
        <p className="text-lg md:text-xl font-semibold text-gray-900 leading-snug mb-7 tracking-[-0.005em]">
          {quote}
        </p>
        <div className="flex items-center gap-3">
          {photoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoSrc} alt={name} className="w-12 h-12 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-sm font-black text-white"
              style={{ background: `linear-gradient(135deg, ${PRU_RED}, #c1121f)` }}>
              {initials}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{title}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
