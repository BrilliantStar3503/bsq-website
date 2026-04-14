'use client'

import { useRef, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { GlobePolaroids } from '@/components/ui/cobe-globe-polaroids'
import { Hero as BYBHero } from '@/components/ui/hero-with-image-text-and-two-buttons'
import {
  ArrowRight,
  Brain,
  ShieldCheck,
  TrendingUp,
  Users,
  Smartphone,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Zap,
  Globe,
  BarChart3,
  BadgeCheck,
  ChevronRight,
  Phone,
  User,
  CalendarCheck,
  Camera,
} from 'lucide-react'

/* ─── Design tokens ─────────────────────────────────────────────────── */
const RED = '#ed1b2e'

/* ─── Animation helpers ──────────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   EVENT PHOTOS
   ─────────────────────────────────────────────────────────────────────
   To add a new photo: push an object to this array.
   src   → place the image in /public/images/events/ and set the filename
   label → short caption shown on hover
   date  → event date string
   ═══════════════════════════════════════════════════════════════════════ */
const EVENT_PHOTOS: {
  src: string
  label: string
  date: string
  wide?: boolean
}[] = [
  // ── Add your photos here ──────────────────────────────────────────
  // Example:
  // { src: '/images/events/opp-night-apr-2026.jpg', label: 'Opportunity Night', date: 'Apr 19, 2026', wide: true },
  // { src: '/images/events/team-cebu-may-2026.jpg', label: 'Cebu Expansion', date: 'May 10, 2026' },
]

/* ─── Page data ──────────────────────────────────────────────────────── */
const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Uncapped Income',
    body: 'Your earnings grow with your effort. No salary ceiling — first-year advisors regularly earn above market.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Selling System',
    body: 'Access our proprietary assessment platform — the same tool that converts cold leads into booked consultations.',
  },
  {
    icon: BadgeCheck,
    title: 'PRU Life UK License',
    body: "We guide you through full licensure. You come out as a certified, regulated financial advisor under one of PH's top insurers.",
  },
  {
    icon: Users,
    title: 'Built-in Team Support',
    body: "You're never alone. Join a team with active mentorship, group coaching, and shared client resources.",
  },
  {
    icon: Smartphone,
    title: 'Full Digital Setup',
    body: 'CRM, landing pages, chatbot, Messenger automation — your practice runs online from day one.',
  },
  {
    icon: Globe,
    title: 'Work Anywhere',
    body: 'Fully remote-capable. Serve clients from any city in the Philippines on your own schedule.',
  },
]

const EVENTS = [
  {
    title: 'Mega BYB — Build Your Business',
    date: 'April 13, 2026 · 7:00PM–8:30PM',
    day: '13',
    month: 'APR',
    location: 'Dusit Thani Hotel, Makati City',
    format: 'In-person',
    slots: 12,
    tag: 'FEATURED',
  },
  {
    title: 'Online Discovery Call',
    date: 'Rolling — Book anytime',
    day: '—',
    month: 'OPEN',
    location: 'Zoom / Google Meet',
    format: 'Virtual',
    slots: 5,
    tag: 'VIRTUAL',
  },
  {
    title: 'Visayas Expansion Preview',
    date: 'May 10, 2026',
    day: '10',
    month: 'MAY',
    location: 'Cebu City',
    format: 'In-person',
    slots: 8,
    tag: 'NEW CITY',
  },
]

const NOT_FOR_YOU = [
  "You want a guaranteed salary with zero accountability",
  "You're looking for a passive side hustle with no real work",
  "You're not willing to talk to people or be coached",
  "You expect overnight results without a system",
]

const FOR_YOU = [
  "You're driven by results and want to control your income",
  "You want a career backed by real technology and structure",
  "You're coachable and open to a proven process",
  "You're ready to build something that grows over time",
]

const SYSTEM_FEATURES = [
  { icon: BarChart3, label: 'Assessment Engine', sub: 'Converts any conversation into a structured financial profile.' },
  { icon: Zap, label: 'Automated Follow-Up', sub: 'Messenger and email sequences that nurture leads while you sleep.' },
  { icon: Globe, label: 'Digital Presence', sub: 'A branded site and funnel built for your market — ready on day one.' },
  { icon: Brain, label: 'AI Recommendations', sub: 'Smart product matching so every client gets the right plan.' },
]

const TESTIMONIALS = [
  {
    name: 'Virginia Garcia',
    role: 'Licensed Financial Advisor',
    initials: 'VG',
    quote: '"I never imagined I could run a financial advisory practice from my laptop. The system handles the heavy lifting — I just show up for the conversations."',
  },
  {
    name: 'Samantha Alonso',
    role: 'Licensed Financial Advisor',
    initials: 'SA',
    quote: '"The training was structured, the tools were already set up, and my mentor actually answered my calls. I hit my first MDRT milestone within the year."',
  },
  {
    name: 'New BSQ Advisor',
    role: 'Licensed Financial Advisor · 6 months in',
    initials: 'BA',
    quote: '"I was skeptical. But after the Opportunity Night I saw the actual numbers, the actual system, and the actual team. I signed the next week."',
  },
]

const PH_REGIONS = [
  'Metro Manila', 'Cebu', 'Davao', 'Laguna', 'Cavite', 'Rizal',
  'Bulacan', 'Pampanga', 'Batangas', 'Iloilo', 'Cagayan de Oro',
  'Zamboanga', 'General Santos', 'Other',
]

/* ─── Sub-components ─────────────────────────────────────────────────── */
function BenefitCard({
  icon: Icon,
  title,
  body,
  delay,
}: (typeof BENEFITS)[0] & { delay: number }) {
  return (
    <FadeUp delay={delay}>
      <div
        className="group rounded-2xl p-6 h-full flex flex-col gap-4 bg-white transition-all duration-300"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.07)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'translateY(-4px)'
          el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.10)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${RED}12` }}
        >
          <Icon size={18} style={{ color: RED }} strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-gray-900 font-semibold text-[15px] leading-snug">{title}</p>
          <p className="text-gray-400 text-[13px] mt-2 font-light leading-relaxed">{body}</p>
        </div>
      </div>
    </FadeUp>
  )
}

function EventCard({
  title, date, day, month, location, format, slots, tag, delay,
}: (typeof EVENTS)[0] & { delay: number }) {
  const isFeatured = tag === 'FEATURED'
  return (
    <FadeUp delay={delay}>
      <div
        className="rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300"
        style={{
          background: isFeatured ? 'linear-gradient(135deg, #0a0a0a 0%, #1a0505 100%)' : 'white',
          border: isFeatured ? `1px solid ${RED}33` : '1px solid rgba(0,0,0,0.07)',
          boxShadow: isFeatured ? `0 0 40px ${RED}18` : '0 1px 3px rgba(0,0,0,0.06)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
      >
        <div className="px-5 pt-4 flex items-center justify-between">
          <span
            className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
            style={isFeatured ? { background: `${RED}25`, color: RED } : { background: 'rgba(0,0,0,0.06)', color: '#555' }}
          >
            {tag}
          </span>
          <div className="flex items-center gap-1.5" style={{ color: isFeatured ? 'rgba(255,255,255,0.35)' : '#aaa' }}>
            <Clock size={11} />
            <span className="text-[11px] font-medium">{format}</span>
          </div>
        </div>

        <div className="px-5 pt-5 pb-4 flex items-start gap-4">
          <div
            className="rounded-xl flex flex-col items-center justify-center w-14 h-14 flex-shrink-0"
            style={{
              background: isFeatured ? `${RED}20` : '#f3f4f6',
              border: isFeatured ? `1px solid ${RED}30` : '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <span className="font-bold leading-none" style={{ fontSize: day === '—' ? '1.2rem' : '1.5rem', color: isFeatured ? RED : '#111' }}>
              {day}
            </span>
            <span className="text-[9px] font-semibold tracking-widest mt-0.5" style={{ color: isFeatured ? 'rgba(255,255,255,0.4)' : '#999' }}>
              {month}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-bold leading-snug" style={{ color: isFeatured ? 'white' : '#111', fontSize: '1rem' }}>{title}</p>
            <p className="text-[12px] mt-1 font-light" style={{ color: isFeatured ? 'rgba(255,255,255,0.4)' : '#888' }}>{date}</p>
          </div>
        </div>

        <div className="mx-5 flex items-center gap-2 py-3" style={{ borderTop: isFeatured ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)' }}>
          <MapPin size={12} style={{ color: isFeatured ? 'rgba(255,255,255,0.35)' : '#aaa' }} />
          <span className="text-[12px] font-medium" style={{ color: isFeatured ? 'rgba(255,255,255,0.5)' : '#777' }}>{location}</span>
        </div>

        <div className="px-5 pb-5 mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: slots <= 5 ? '#f59e0b' : '#22c55e' }} />
            <span className="text-[11px] font-semibold" style={{ color: isFeatured ? 'rgba(255,255,255,0.45)' : '#666' }}>
              {slots} seat{slots !== 1 ? 's' : ''} left
            </span>
          </div>
          <a
            href="#book"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold transition-all duration-200 hover:gap-2.5"
            style={{ color: isFeatured ? RED : '#111' }}
          >
            Reserve Seat <ChevronRight size={13} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </FadeUp>
  )
}

/* ─── Event photo gallery ────────────────────────────────────────────── */
function EventGallery() {
  const isEmpty = EVENT_PHOTOS.length === 0

  return (
    <section className="bg-white py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: RED }}>
              Build Your Business Events
            </p>
            <h2
              className="font-bold text-gray-900 tracking-tight"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
            >
              See what our events look like.
            </h2>
            <p className="text-gray-400 mt-4 font-light text-[1rem] max-w-lg mx-auto leading-relaxed">
              Real people, real conversations, real decisions. Our Opportunity Nights are
              designed to give you the full picture.
            </p>
          </div>
        </FadeUp>

        {isEmpty ? (
          /* Placeholder grid — shown until photos are added */
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3 ${i === 0 ? 'md:col-span-2' : ''}`}
                  style={{
                    aspectRatio: i === 0 ? '16/7' : '4/3',
                    background: i % 2 === 0 ? '#f3f4f6' : '#fafafa',
                    border: '1.5px dashed rgba(0,0,0,0.10)',
                  }}
                >
                  <Camera size={20} style={{ color: '#d1d5db' }} />
                  <p className="text-[11px] font-medium text-gray-300 tracking-wide">Event photo</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-300 text-xs mt-6 font-light">
              Photos will appear here — add them to the <code className="text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">EVENT_PHOTOS</code> array in the component.
            </p>
          </FadeIn>
        ) : (
          /* Real photo grid */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {EVENT_PHOTOS.map((photo, i) => (
              <FadeUp key={i} delay={i * 0.06} className={photo.wide ? 'md:col-span-2' : ''}>
                <div
                  className="group relative rounded-2xl overflow-hidden"
                  style={{ aspectRatio: photo.wide ? '16/7' : '4/3' }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }}
                  >
                    <p className="text-white font-semibold text-[13px]">{photo.label}</p>
                    <p className="text-white/60 text-[11px]">{photo.date}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Book a Briefing / Event Pre-Registration form ─────────────────── */
const PRU_FORM_URL = 'https://forms.office.com/pages/responsepage.aspx?id=XjAHcGQma065pMTVzP0VJCY2UsqUAABFsBkyscTFhr5UODBLTldHVlVLVkFRVllMRkxYSlZUWk8xTC4u&origin=QRCode&route=shorturl'

function BookBriefing() {
  const searchParams = useSearchParams()
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', location: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Hidden tracking fields — read silently from QR code URL params
  const [tracking, setTracking] = useState({
    branch:      'Brilliant Star Quartz',
    recruiter:   'Christopher Garcia',
    agentCode:   '70003503',
    unitManager: 'Christopher Garcia',
  })

  useEffect(() => {
    setTracking({
      branch:      searchParams.get('branch')      ?? 'Brilliant Star Quartz',
      recruiter:   searchParams.get('recruiter')   ?? 'Christopher Garcia',
      agentCode:   searchParams.get('agent')       ?? '70003503',
      unitManager: searchParams.get('unit_manager') ?? 'Christopher Garcia',
    })
  }, [searchParams])

  function validate() {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.location) e.location = 'Required'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('submitting')

    try {
      // 1. Save lead to BSQ CRM via n8n (with hidden tracking fields)
      await fetch('/api/recruitment-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ...tracking,
          eventName: 'Mega BYB 2026',
          eventDate: 'April 13, 2026',
        }),
      })
    } catch {
      // Silent fail — don't block the user if n8n is down
    }

    // 2. Open PRU Life UK's official registration form in a new tab
    window.open(PRU_FORM_URL, '_blank', 'noopener,noreferrer')

    setStatus('done')
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.10)',
    background: '#f9fafb',
    fontSize: 14,
    fontFamily: 'inherit',
    color: '#111',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }

  return (
    <section
      id="book"
      className="py-24 px-6"
      style={{ background: '#fafafa' }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Left — text */}
        <div className="flex flex-col gap-6 lg:pt-2">
          <FadeUp delay={0.1}>
            <span className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ color: RED }}>
              Event Pre-Registration
            </span>
          </FadeUp>

          <FadeUp delay={0.2}>
            <h2
              className="font-bold text-gray-900 tracking-tight leading-snug"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}
            >
              Reserve your spot at Mega BYB 2026.
            </h2>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p className="text-gray-500 leading-relaxed font-light text-[1.02rem]">
              Fill in your details below. Your slot will be logged with BSQ and you&apos;ll
              be directed to PRU Life UK&apos;s official form — required to qualify for
              the raffle and secure your entry at the door.
            </p>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="flex flex-col gap-4 mt-2">
              {[
                { icon: CalendarCheck, text: 'Monday, April 13, 2026 · 7:00PM–8:30PM' },
                { icon: MapPin, text: 'Mayuree I & II, Dusit Thani Hotel, Makati City' },
                { icon: Users, text: 'Guest speaker: Chinkee Tan' },
                { icon: ShieldCheck, text: 'Limited slots only — register now to secure entry' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${RED}12` }}
                  >
                    <Icon size={13} style={{ color: RED }} strokeWidth={2} />
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Right — form */}
        <FadeUp delay={0.15}>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-8 flex flex-col gap-5"
            style={{
              background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.07)',
            }}
          >
            <div>
              <p className="text-gray-900 font-bold text-[18px] mb-1">Share your details</p>
              <p className="text-gray-400 text-[13px] font-light">Takes 30 seconds. Official PRU form opens next.</p>
            </div>

            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-gray-600">
                  First Name <span style={{ color: RED }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Juan"
                    value={form.firstName}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    style={{
                      ...inputBase,
                      borderColor: errors.firstName ? RED : 'rgba(0,0,0,0.10)',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = `0 0 0 3px ${RED}14` }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.firstName ? RED : 'rgba(0,0,0,0.10)'; e.currentTarget.style.boxShadow = 'none' }}
                  />
                </div>
                {errors.firstName && <p className="text-[11px]" style={{ color: RED }}>{errors.firstName}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-gray-600">
                  Last Name <span style={{ color: RED }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="dela Cruz"
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  style={{
                    ...inputBase,
                    borderColor: errors.lastName ? RED : 'rgba(0,0,0,0.10)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = `0 0 0 3px ${RED}14` }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.lastName ? RED : 'rgba(0,0,0,0.10)'; e.currentTarget.style.boxShadow = 'none' }}
                />
                {errors.lastName && <p className="text-[11px]" style={{ color: RED }}>{errors.lastName}</p>}
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-gray-600">
                Phone Number <span style={{ color: RED }}>*</span>
              </label>
              <div className="flex gap-2">
                <div
                  className="flex items-center px-3 rounded-xl text-[13px] font-semibold text-gray-500 flex-shrink-0"
                  style={{ background: '#f3f4f6', border: '1px solid rgba(0,0,0,0.10)', gap: 6 }}
                >
                  <Phone size={12} style={{ color: '#9ca3af' }} />
                  +63
                </div>
                <input
                  type="tel"
                  placeholder="9XX XXX XXXX"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  style={{
                    ...inputBase,
                    borderColor: errors.phone ? RED : 'rgba(0,0,0,0.10)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = `0 0 0 3px ${RED}14` }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.phone ? RED : 'rgba(0,0,0,0.10)'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
              {errors.phone && <p className="text-[11px]" style={{ color: RED }}>{errors.phone}</p>}
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-gray-600">
                Location <span style={{ color: RED }}>*</span>
              </label>
              <div className="relative">
                <MapPin size={14} style={{ color: '#9ca3af', position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <select
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  style={{
                    ...inputBase,
                    paddingLeft: 36,
                    appearance: 'none',
                    cursor: 'pointer',
                    borderColor: errors.location ? RED : 'rgba(0,0,0,0.10)',
                    color: form.location ? '#111' : '#9ca3af',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = `0 0 0 3px ${RED}14` }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.location ? RED : 'rgba(0,0,0,0.10)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <option value="" disabled>Select your region</option>
                  {PH_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronRight size={14} style={{ color: '#9ca3af', position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none' }} />
              </div>
              {errors.location && <p className="text-[11px]" style={{ color: RED }}>{errors.location}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting' || status === 'done'}
              className="mt-1 w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: status === 'done' ? '#22c55e' : RED,
                boxShadow: status === 'done' ? '0 4px 20px rgba(34,197,94,0.35)' : `0 4px 20px ${RED}40`,
              }}
            >
              {status === 'idle' && <><CalendarCheck size={15} strokeWidth={2} /> Pre-Register for the Event</>}
              {status === 'submitting' && 'Saving your details...'}
              {status === 'done' && <><CheckCircle2 size={15} /> Pre-registered! Complete official form →</>}
            </button>

            {status === 'done' ? (
              <div
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                <p className="text-[13px] font-semibold" style={{ color: '#16a34a' }}>
                  ✅ You&apos;re pre-registered with BSQ!
                </p>
                <p className="text-[12px] text-gray-500 mt-1 font-light">
                  A new tab just opened with the official PRU Life UK registration form.
                  Please complete it to qualify for the raffle and secure your entry.
                </p>
              </div>
            ) : (
              <p className="text-center text-gray-400 text-[11px] font-light -mt-1">
                Your details are saved with BSQ. You&apos;ll then be directed to PRU Life UK&apos;s official registration.
              </p>
            )}
          </form>
        </FadeUp>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function RecruitmentPage() {
  return (
    <div style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      {/*
        To add your BYB event invite photo:
        1. Drop the image into /public/images/events/
        2. Pass it as: eventImage="/images/events/your-file.jpg"
      */}
      <BYBHero
        eventLabel="Now Recruiting · Build Your Business"
        eventImage="/images/events/byb-apr-2026.jpg"
      />

      {/* ── 2. BENEFITS GRID ────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="mb-14 text-center">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: RED }}>Why BSQ</p>
              <h2 className="font-bold text-gray-900 tracking-tight" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
                Everything you need to grow — already built.
              </h2>
              <p className="text-gray-400 mt-4 font-light text-[1rem] max-w-lg mx-auto leading-relaxed">
                We hand you a system, not just a license. You focus on relationships. The platform handles the rest.
              </p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => <BenefitCard key={b.title} {...b} delay={i * 0.08} />)}
          </div>
        </div>
      </section>

      {/* ── 3. TRAVEL INCENTIVES ────────────────────────────────────────── */}
      <section
        className="py-24 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #18080a 60%, #0f0f0f 100%)' }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 40% at 50% 50%, #ed1b2e14 0%, transparent 70%)` }}
        />

        <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — globe */}
          <FadeUp delay={0.1} className="flex justify-center">
            <GlobePolaroids className="w-full max-w-md" speed={0.004} />
          </FadeUp>

          {/* Right — text */}
          <div className="flex flex-col gap-6">
            <FadeUp delay={0.15}>
              <span className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ color: RED }}>
                PRU Life UK Travel Incentives
              </span>
            </FadeUp>

            <FadeUp delay={0.25}>
              <h2
                className="font-bold text-white tracking-tight leading-snug"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
              >
                Travel the World.<br />
                <span style={{ color: RED }}>A to Z.</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.35}>
              <p className="text-white/50 leading-relaxed font-light text-[1.02rem]">
                PRU Life UK rewards top-performing advisors with all-expense-paid trips to world-class
                destinations. Tokyo, Singapore, Paris, New York — your production unlocks the world.
              </p>
            </FadeUp>

            <FadeUp delay={0.45}>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  { city: 'Tokyo', flag: '🇯🇵' },
                  { city: 'Singapore', flag: '🇸🇬' },
                  { city: 'Paris', flag: '🇫🇷' },
                  { city: 'New York', flag: '🇺🇸' },
                  { city: 'Dubai', flag: '🇦🇪' },
                  { city: 'London', flag: '🇬🇧' },
                ].map(({ city, flag }) => (
                  <div
                    key={city}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <span style={{ fontSize: 16 }}>{flag}</span>
                    <span className="text-white/70 text-[13px] font-medium">{city}</span>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.55}>
              <p className="text-white/30 text-[12px] font-light mt-2">
                Destinations vary per incentive cycle. Past trips include Southeast Asia, Europe, Middle East, and the Americas.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED EVENTS ──────────────────────────────────────────── */}
      <section id="events" className="py-24 px-6" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="mb-14 text-center">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: RED }}>Upcoming Events</p>
              <h2 className="font-bold text-gray-900 tracking-tight" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
                See it in person. Decide with full context.
              </h2>
              <p className="text-gray-400 mt-4 font-light text-[1rem] max-w-lg mx-auto leading-relaxed">
                Our Opportunity Nights give you the income model, the system, and the people — all in one room.
              </p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EVENTS.map((ev, i) => <EventCard key={ev.title} {...ev} delay={i * 0.1} />)}
          </div>
          <FadeIn delay={0.4}>
            <div className="text-center mt-10">
              <a href="#book" className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3" style={{ color: RED }}>
                Can&#39;t find a date? Book a private call <ArrowRight size={14} strokeWidth={2.5} />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 4. EVENT PHOTO GALLERY ──────────────────────────────────────── */}
      <EventGallery />

      {/* ── 5. "THIS IS NOT FOR EVERYONE" ───────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="mb-14 text-center">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: RED }}>Be Honest With Yourself</p>
              <h2 className="font-bold text-gray-900 tracking-tight" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
                This is not for everyone.
              </h2>
              <p className="text-gray-400 mt-4 font-light text-[1rem] max-w-md mx-auto leading-relaxed">
                We&#39;re selective because we&#39;re serious. Read both sides before you apply.
              </p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeUp delay={0.1}>
              <div className="rounded-2xl p-7 h-full" style={{ background: '#fafafa', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex items-center gap-2.5 mb-6">
                  <XCircle size={18} style={{ color: '#d1d5db' }} />
                  <p className="font-semibold text-gray-400 text-[15px]">Not a fit if you&#39;re…</p>
                </div>
                <div className="flex flex-col gap-4">
                  {NOT_FOR_YOU.map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#f3f4f6' }}>
                        <XCircle size={10} style={{ color: '#d1d5db' }} />
                      </div>
                      <p className="text-gray-400 text-[13px] leading-relaxed font-light">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="rounded-2xl p-7 h-full" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0505 100%)', border: `1px solid ${RED}22` }}>
                <div className="flex items-center gap-2.5 mb-6">
                  <CheckCircle2 size={18} style={{ color: RED }} />
                  <p className="font-semibold text-white text-[15px]">You belong here if…</p>
                </div>
                <div className="flex flex-col gap-4">
                  {FOR_YOU.map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${RED}20`, border: `1px solid ${RED}35` }}>
                        <CheckCircle2 size={10} style={{ color: RED }} />
                      </div>
                      <p className="text-white/60 text-[13px] leading-relaxed font-light">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 6. SYSTEM ADVANTAGE ─────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp delay={0.1}>
            <div
              className="rounded-3xl overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0505 100%)', aspectRatio: '4 / 3', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }} />
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 p-8">
                <div className="w-full rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${RED}25` }}>
                    <Zap size={14} style={{ color: RED }} />
                  </div>
                  <div className="flex-1">
                    <div className="w-28 h-2 rounded bg-white/20" />
                    <div className="w-16 h-1.5 rounded bg-white/10 mt-1.5" />
                  </div>
                  <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ background: `${RED}20`, color: RED }}>LIVE</div>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full">
                  {[{ label: 'Leads', value: '24', color: RED }, { label: 'Booked', value: '11', color: '#22c55e' }, { label: 'Closed', value: '6', color: '#f59e0b' }].map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p style={{ color, fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{value}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 4 }}>{label}</p>
                    </div>
                  ))}
                </div>
                <div className="w-full rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {[{ dot: '#22c55e', pct: 80 }, { dot: RED, pct: 90 }, { dot: '#f59e0b', pct: 65 }].map(({ dot, pct }, i) => (
                    <div key={i} className={`flex items-center gap-2.5 ${i > 0 ? 'mt-2.5' : ''}`}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
                      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', width: `${pct}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>

          <div className="flex flex-col gap-6">
            <FadeUp delay={0.15}>
              <span className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ color: RED }}>The BSQ Platform</span>
            </FadeUp>
            <FadeUp delay={0.25}>
              <h2 className="font-bold text-gray-900 tracking-tight leading-snug" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
                You don&#39;t just get a career. You get a full operating system.
              </h2>
            </FadeUp>
            <FadeUp delay={0.35}>
              <p className="text-gray-500 leading-relaxed font-light text-[1.02rem]">
                Every BSQ advisor launches with a complete digital practice — AI assessments,
                automated follow-ups, a branded funnel, and real-time analytics. No cold starts.
              </p>
            </FadeUp>
            <FadeUp delay={0.45}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {SYSTEM_FEATURES.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${RED}12` }}>
                      <Icon size={15} style={{ color: RED }} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-[13px]">{label}</p>
                      <p className="text-gray-400 text-[12px] mt-0.5 font-light leading-relaxed">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.55}>
              <a href="#book" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3" style={{ color: RED }}>
                See how it works — book a call <ArrowRight size={15} strokeWidth={2.5} />
              </a>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 7. BOOK A BRIEFING (form) ───────────────────────────────────── */}
      <BookBriefing />

      {/* ── 8. TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="mb-14 text-center">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: RED }}>From the Team</p>
              <h2 className="font-bold text-gray-900 tracking-tight" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
                People who made the decision.
              </h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="rounded-2xl p-6 h-full flex flex-col gap-5" style={{ background: '#fafafa', border: '1px solid rgba(0,0,0,0.07)' }}>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={12} fill={RED} style={{ color: RED }} />)}
                  </div>
                  <p className="text-gray-700 text-[14px] leading-relaxed font-light flex-1 italic">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #18181b, #3f3f46)' }}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-[13px]">{t.name}</p>
                      <p className="text-gray-400 text-[11px]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ────────────────────────────────────────────────── */}
      <section
        className="py-32 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #18080a 60%, #0f0f0f 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${RED}18 0%, transparent 70%)` }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <FadeUp delay={0.1}>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-5" style={{ color: RED }}>
              Limited Seats · Reserve Yours Now
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <h2 className="font-bold text-white tracking-tight leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}>
              The next chapter starts with one seat.
            </h2>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-white/40 mt-5 font-light leading-relaxed" style={{ fontSize: '1.05rem' }}>
              Attend an Opportunity Night or book a private briefing.
              See the system. Meet the team. Then decide.
            </p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(237,27,46,0.12)', border: '1px solid rgba(237,27,46,0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: RED }} />
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: RED }}>April 19 — 12 seats remaining</span>
            </div>
          </FadeUp>
          <FadeUp delay={0.5}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#book"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:gap-3 hover:scale-[1.02]"
                style={{ background: RED, boxShadow: `0 6px 32px ${RED}55` }}
              >
                Book My Briefing <ArrowRight size={16} strokeWidth={2.5} />
              </a>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-white/60 border border-white/12 hover:border-white/25 hover:text-white transition-all duration-200"
              >
                Take the Assessment First
              </Link>
            </div>
          </FadeUp>
          <FadeIn delay={0.65}>
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {[{ icon: ShieldCheck, label: 'PRU Life UK Regulated' }, { icon: BadgeCheck, label: 'No joining fee' }, { icon: Users, label: 'Active mentorship' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <Icon size={13} style={{ color: 'rgba(255,255,255,0.25)' }} />
                  {label}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  )
}
