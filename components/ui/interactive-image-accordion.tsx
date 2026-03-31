'use client'

import { useState } from 'react'
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  ArrowRight, CheckCircle2, X, Calculator,
  MessageCircle, AlertTriangle, Info,
  // Category icons
  Wallet, ShieldCheck, HeartPulse, TrendingUp,
  Sunset, GraduationCap, LineChart,
} from 'lucide-react'

import { analyzeLifeProtection }                                          from '@/lib/life-protection'
import { analyzeHealthProtection }                                        from '@/lib/health-protection'
import { calculateRetirementNeed, classifyRetirementGap,
         getRetirementProductRecommendation }                            from '@/lib/retirement-planning'
import { analyzeEducationFunding }                                        from '@/lib/education-funding'
import type { HospitalLevel }                                             from '@/lib/health-protection'

/* ══════════════════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════════════════ */

type AccordionItemData = {
  id:       number
  title:    string
  imageUrl: string
  /** Short display label shown as the category chip, e.g. "Protection" */
  category: string
  /** Hex accent color — used for border, icon badge, and ring highlight */
  accent:   string
  /** lucide-react icon component */
  Icon:     React.ElementType
}

type AccordionItemProps = {
  item:         AccordionItemData
  isHovered:    boolean
  isSelected:   boolean
  /** When a modal is open, dim non-selected items and disable pointer events */
  isModalOpen:  boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick:      () => void
}

interface GapResult {
  gapAmount:     number
  severity:      'critical' | 'high' | 'medium' | 'covered'
  headline:      string
  detail:        string
  product:       string
  rationale:     string
  coverageRatio?: number
}

/* ══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════════════════════ */

// Dark navy fallback — looks intentional when an Unsplash image fails to load
const FALLBACK_URL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" y1="0" x2="1" y2="1"%3E%3Cstop offset="0%25" stop-color="%231e293b"/%3E%3Cstop offset="100%25" stop-color="%230f172a"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1200" height="800" fill="url(%23g)"/%3E%3C/svg%3E'

const php = (n: number) => '₱' + Math.round(n).toLocaleString('en-PH')

const SEV_STYLE = {
  critical: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Critical Gap'   },
  high:     { color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', label: 'High Gap'        },
  medium:   { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Moderate Gap'   },
  covered:  { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Well Covered'   },
}

/* ══════════════════════════════════════════════════════════════════════════
   ACCORDION DATA
   ══════════════════════════════════════════════════════════════════════════ */

const accordionItems: AccordionItemData[] = [
  {
    id: 1, title: 'Emergency Fund',
    category: 'Liquidity',
    accent:   '#f59e0b',   // amber
    Icon:     Wallet,
    // Stack of cash / coins — warm amber tones, dark base
    imageUrl: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?q=80&w=1200&auto=format&fit=crop&crop=center',
  },
  {
    id: 2, title: 'Life Insurance Protection',
    category: 'Protection',
    accent:   '#3b82f6',   // blue
    Icon:     ShieldCheck,
    // Father with child — family + protection narrative
    imageUrl: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1200&auto=format&fit=crop&crop=center',
  },
  {
    id: 3, title: 'Health Insurance Coverage',
    category: 'Health',
    accent:   '#22c55e',   // green
    Icon:     HeartPulse,
    // Stethoscope on dark surface — reads well at any brightness
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop&crop=center',
  },
  {
    id: 4, title: 'Income Protection',
    category: 'Income',
    accent:   '#8b5cf6',   // violet
    Icon:     TrendingUp,
    // Professional at work — income / career narrative
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop&crop=center',
  },
  {
    id: 5, title: 'Retirement Funding',
    category: 'Retirement',
    accent:   '#f97316',   // orange
    Icon:     Sunset,
    // Senior couple outdoors — freedom / sunset-of-life narrative
    imageUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=1200&auto=format&fit=crop&crop=center',
  },
  {
    id: 6, title: 'Educational Funding',
    category: 'Education',
    accent:   '#6366f1',   // indigo
    Icon:     GraduationCap,
    // Campus / students — darker tone, education context
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop&crop=center',
  },
  {
    id: 7, title: 'Wealth Accumulation',
    category: 'Wealth',
    accent:   '#10b981',   // emerald
    Icon:     LineChart,
    // Stock charts — investment & growth narrative, dark background
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop&crop=center',
  },
]

/* ══════════════════════════════════════════════════════════════════════════
   ACCORDION ITEM
   ══════════════════════════════════════════════════════════════════════════ */

const AccordionItem: React.FC<AccordionItemProps> = ({
  item, isHovered, isSelected, isModalOpen, onMouseEnter, onMouseLeave, onClick,
}) => {
  const { accent, Icon, category } = item
  const isExpanded = isHovered || isSelected

  // When modal is open: selected item glows, others fade out and become inert
  const dimmed  = isModalOpen && !isSelected
  const glowing = isModalOpen && isSelected

  // Derive rgba variants of the accent color inline — avoids Tailwind JIT purge issues
  const accentRgba = (a: number) => {
    // Convert hex → r,g,b then compose rgba
    const h = accent.replace('#', '')
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    return `rgba(${r},${g},${b},${a})`
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl flex-shrink-0"
      style={{
        width:         isExpanded ? '360px' : '76px',
        minWidth:      isExpanded ? '240px' : '68px',
        height:        '440px',
        cursor:        dimmed ? 'default' : 'pointer',
        pointerEvents: dimmed ? 'none' : 'auto',
        // Dim / glow transitions
        opacity:    dimmed ? 0.28 : 1,
        filter:     dimmed ? 'blur(1px) brightness(0.55)' : 'none',
        transition: [
          'width 0.55s cubic-bezier(0.4,0,0.2,1)',
          'min-width 0.55s cubic-bezier(0.4,0,0.2,1)',
          'opacity 0.35s ease',
          'filter 0.35s ease',
          'box-shadow 0.3s ease',
          'border-color 0.3s ease',
        ].join(', '),
        // Category-colored border — accent when hovered/selected, gray at rest
        border:
          glowing    ? `2px solid ${accentRgba(0.9)}`
          : isSelected ? `2px solid ${accentRgba(0.65)}`
          : isHovered  ? `2px solid ${accentRgba(0.35)}`
          :               '2px solid rgba(255,255,255,0.08)',
        // Category-colored glow when selected + modal open
        boxShadow:
          glowing    ? `0 0 0 4px ${accentRgba(0.22)}, 0 16px 48px rgba(0,0,0,0.28)`
          : isExpanded ? '0 8px 32px rgba(0,0,0,0.18)'
          :              '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      {/* ── Background image ─────────────────────────────────────── */}
      <img
        src={item.imageUrl}
        alt={item.title}
        loading="eager"
        decoding="async"
        onError={e => { (e.currentTarget as HTMLImageElement).src = FALLBACK_URL }}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform:  isExpanded ? 'scale(1.06)' : 'scale(1.0)',
          filter:     isExpanded ? 'brightness(0.72)' : 'brightness(0.58)',
          transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.45s ease',
          zIndex:     0,
        }}
      />

      {/* ── Premium gradient overlay — bottom-heavy so image breathes ── */}
      <div
        className="absolute inset-0"
        style={{
          background: isExpanded
            ? 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.28) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.22) 100%)',
          transition: 'background 0.45s ease',
          zIndex:     1,
        }}
      />

      {/* ── Subtle accent colour wash — top edge, category identity ── */}
      <div
        className="absolute inset-x-0 top-0 h-16 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${accentRgba(isExpanded ? 0.22 : 0.12)} 0%, transparent 100%)`,
          transition: 'opacity 0.4s ease',
          zIndex:     2,
        }}
      />

      {/* ── Icon badge — top-left, always visible, scales on expand ── */}
      <div
        className="absolute top-4 left-4"
        style={{ zIndex: 3, transition: 'opacity 0.3s ease, transform 0.3s ease' }}
      >
        <span
          className="inline-flex items-center justify-center rounded-xl"
          style={{
            width:      isExpanded ? 36 : 28,
            height:     isExpanded ? 36 : 28,
            background: accentRgba(isExpanded ? 0.9 : 0.7),
            boxShadow:  `0 2px 10px ${accentRgba(0.45)}`,
            transition: 'width 0.35s ease, height 0.35s ease, background 0.3s ease',
          }}
        >
          <Icon size={isExpanded ? 18 : 14} color="#fff" strokeWidth={2} />
        </span>
      </div>

      {/* ── Selected checkmark — top-right ───────────────────────── */}
      <div
        className="absolute top-3 right-3"
        style={{
          zIndex:    3,
          opacity:   isSelected ? 1 : 0,
          transform: isSelected ? 'scale(1)' : 'scale(0.7)',
          transition:'opacity 0.25s ease, transform 0.25s ease',
        }}
      >
        <span
          className="inline-flex items-center justify-center rounded-full w-6 h-6"
          style={{ background: accent, boxShadow: `0 2px 8px ${accentRgba(0.5)}` }}
        >
          <CheckCircle2 size={13} color="#fff" />
        </span>
      </div>

      {/* ── Collapsed state — vertical title + category dot ─────── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-end pb-6"
        style={{
          zIndex:        3,
          opacity:       isExpanded ? 0 : 1,
          transition:    'opacity 0.22s ease',
          pointerEvents: isExpanded ? 'none' : 'auto',
        }}
      >
        {/* Accent dot */}
        <span
          className="block rounded-full mb-3"
          style={{ width: 5, height: 5, background: accent, opacity: 0.85 }}
        />
        <p
          className="text-white font-semibold text-sm whitespace-nowrap select-none"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.1em' }}
        >
          {item.title}
        </p>
      </div>

      {/* ── Expanded state — content ──────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 p-6"
        style={{
          zIndex:        3,
          opacity:       isExpanded ? 1 : 0,
          transform:     isExpanded ? 'translateY(0)' : 'translateY(12px)',
          transition:    'opacity 0.32s ease 0.12s, transform 0.32s ease 0.12s',
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
      >
        {/* Category chip */}
        <div className="mb-3">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              background:   accentRgba(0.22),
              color:        '#fff',
              border:       `1px solid ${accentRgba(0.45)}`,
              backdropFilter: 'blur(6px)',
            }}
          >
            <Icon size={10} color={accent} strokeWidth={2.5} />
            {category}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-white text-lg font-bold leading-tight mb-1.5 drop-shadow-sm">
          {item.title}
        </h4>

        {/* Subtext */}
        <p className="text-white/65 text-[11px] leading-relaxed mb-4">
          Answer a few quick questions to calculate your personal financial gap.
        </p>

        {/* CTA */}
        <AnimatedGradientButton
          preset="pru"
          duration={5}
          className="text-xs px-4 py-2.5 rounded-lg"
          onClick={e => { e.stopPropagation(); onClick() }}
        >
          <Calculator size={12} /> Start Assessment <ArrowRight size={11} />
        </AnimatedGradientButton>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MINI FORM HELPERS
   ══════════════════════════════════════════════════════════════════════════ */

/* ─── Currency formatter ────────────────────────────────────────────── */
const FMT = new Intl.NumberFormat('en-PH')
const formatPeso   = (raw: string) => raw ? FMT.format(parseInt(raw) || 0) : ''
const stripNonDigit = (s: string)  => s.replace(/[^\d]/g, '')

function MiniInput({
  label, value, onChange, prefix = '₱', placeholder = '0',
}: {
  label: string; value: string; onChange: (v: string) => void
  prefix?: string; placeholder?: string
}) {
  // Currency fields (prefix='₱'): store raw digits, display formatted on blur
  // Plain fields (prefix=''): pass value through unchanged
  const isCurrency = prefix === '₱'
  const [focused, setFocused] = useState(false)

  // While typing → show raw digits so cursor never jumps
  // After blur   → show formatted with commas
  const displayValue = isCurrency
    ? (focused ? value : formatPeso(value))
    : value

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(isCurrency ? stripNonDigit(e.target.value) : e.target.value)
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 select-none pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode={isCurrency ? 'numeric' : 'text'}
          value={displayValue}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={e => {
            if (isCurrency) setFocused(true)
            e.target.style.boxShadow = '0 0 0 2px rgba(220,38,38,0.25)'
          }}
          onBlur={e => {
            if (isCurrency) setFocused(false)
            e.target.style.boxShadow = 'none'
          }}
          className="w-full border border-gray-200 rounded-xl py-2.5 text-sm text-gray-900 font-medium focus:outline-none transition-all duration-150"
          style={{ paddingLeft: prefix ? '1.75rem' : '0.75rem', paddingRight: '0.75rem' }}
        />
      </div>
    </div>
  )
}

function MiniSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-medium focus:outline-none bg-white transition-all duration-150"
        onFocus={e => e.target.style.boxShadow = '0 0 0 2px rgba(220,38,38,0.25)'}
        onBlur={e  => e.target.style.boxShadow = 'none'}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function MiniCalcButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.97 }}
      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 text-sm font-bold transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 active:scale-[0.97]">
      <Calculator size={14} /> Calculate My Gap
    </motion.button>
  )
}

/* ── AI Financial Insight Card ────────────────────────────────────────── */
function MiniGapResult({ result }: { result: GapResult }) {
  const sv  = SEV_STYLE[result.severity]
  const pct = result.coverageRatio !== undefined ? Math.round(result.coverageRatio * 100) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl border border-gray-200 bg-white shadow-sm mt-5 overflow-hidden"
    >
      {/* Severity accent bar */}
      <div className="h-[3px] w-full" style={{ background: sv.color }} />

      <div className="p-5">

        {/* ── Header row ─────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: sv.color, boxShadow: `0 0 5px ${sv.color}` }}
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
              AI Financial Insight
            </span>
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ color: sv.color, background: sv.bg, border: `1px solid ${sv.border}` }}
          >
            {sv.label}
          </span>
        </div>

        {/* ── Gap amount ─────────────────────────────────────── */}
        {result.gapAmount > 0 ? (
          <div className="mb-4">
            <p className="text-[11px] font-medium text-gray-400 mb-0.5">Estimated annual gap</p>
            <p className="text-3xl font-black tracking-tight leading-none" style={{ color: sv.color }}>
              {php(result.gapAmount)}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 size={12} color="#16a34a" />
            </span>
            <p className="text-sm font-bold text-green-700">You're on track — no gap detected!</p>
          </div>
        )}

        {/* ── Coverage progress bar ──────────────────────────── */}
        {pct !== null && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-gray-500 font-medium">Current coverage level</span>
              <span className="text-[11px] font-bold" style={{ color: sv.color }}>{pct}% covered</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(to right, ${sv.color}70, ${sv.color})`,
                }}
              />
            </div>
          </div>
        )}

        {/* ── Personalized AI advisory copy ─────────────────── */}
        <div
          className="rounded-xl p-3.5 mb-5"
          style={{ background: sv.bg, border: `1px solid ${sv.border}` }}
        >
          <p className="text-xs font-semibold text-gray-800 mb-1 leading-snug">{result.headline}</p>
          <p className="text-[11px] text-gray-500 leading-relaxed">{result.detail}</p>
        </div>

        {/* ── Suggested Financial Solution ───────────────────── */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 mb-2">
            Suggested Financial Solution
          </p>
          <p className="text-sm font-bold text-gray-900 mb-1">{result.product}</p>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-4">{result.rationale}</p>

          {/* Full-width CTA button */}
          <motion.button
            onClick={() => window.open('https://m.me/Bstarquartzarea?ref=financial_assessment', '_blank')}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold rounded-xl py-3.5 transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97]"
            style={{
              background: sv.color,
              boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.9)')}
            onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
          >
            <MessageCircle size={14} />
            Talk to an advisor
            <ArrowRight size={13} />
          </motion.button>
          <p className="text-center text-[10px] text-gray-400 mt-2.5">
            Free consultation &nbsp;•&nbsp; No obligation
          </p>
        </div>

      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MINI ASSESSMENT FORMS (3–4 fields each)
   ══════════════════════════════════════════════════════════════════════════ */

function EmergencyAssessment() {
  const [monthly,    setMonthly]    = useState('')
  const [incomeType, setIncomeType] = useState('fixed')
  const [dependents, setDependents] = useState('none')
  const [existing,   setExisting]   = useState('')
  const [result,     setResult]     = useState<GapResult | null>(null)

  // Industry-standard multipliers (midpoint of recommended range)
  const INCOME_MONTHS: Record<string, { months: number; label: string }> = {
    fixed:      { months: 4.5,  label: '3–6 months (employee)'          },
    mixed:      { months: 7.5,  label: '6–9 months (mixed income)'      },
    commission: { months: 10.5, label: '9–12 months (commission/freelance)' },
    business:   { months: 10.5, label: '9–12 months (business owner)'   },
  }

  // Dependent adjustment per industry practice
  const DEP_ADJ: Record<string, number> = {
    none:     0,
    partner:  1,
    children: 2,
    parents:  2,
  }

  const calc = () => {
    const monthlyExp  = parseFloat(monthly)  || 0
    const fund        = parseFloat(existing) || 0
    const { months: baseMonths, label: incomeLabel } = INCOME_MONTHS[incomeType] ?? INCOME_MONTHS.fixed
    const depAdj      = DEP_ADJ[dependents] ?? 0
    const totalMonths = baseMonths + depAdj
    const target      = monthlyExp * totalMonths
    const gap         = Math.max(target - fund, 0)
    const ratio       = target > 0 ? Math.min(fund / target, 1) : 1
    const monthsCovered = monthlyExp > 0 ? Math.min(fund / monthlyExp, totalMonths) : totalMonths

    const severity: GapResult['severity'] =
      gap === 0    ? 'covered' :
      ratio >= 0.6 ? 'medium'  :
      ratio >= 0.25? 'high'    : 'critical'

    const depNote = depAdj > 0 ? ` (+${depAdj} month${depAdj > 1 ? 's' : ''} for dependents)` : ''

    setResult({
      gapAmount: Math.round(gap),
      severity,
      headline: gap === 0
        ? `Emergency fund is sufficient — ${totalMonths.toFixed(1)} months covered ✓`
        : `You need ${php(gap)} more to reach your ${totalMonths.toFixed(1)}-month target.`,
      detail: gap === 0
        ? `Based on ${incomeLabel}${depNote}, your target is ${php(target)}. Your current fund meets or exceeds this requirement.`
        : `Your fund covers ${monthsCovered.toFixed(1)} of ${totalMonths.toFixed(1)} months needed. Target: ${php(target)} (${incomeLabel}${depNote}).`,
      product:   gap === 0 ? 'PRULife Optimizer' : 'PRULink Assurance Account Plus',
      rationale: gap === 0
        ? 'Your safety net is fully funded. Redirect your surplus into a growth plan to maximize returns while keeping your protection base secure.'
        : 'Build your emergency fund faster through a structured savings plan — one that earns interest while it protects you against life\'s unexpected events.',
      coverageRatio: ratio,
    })
  }

  return (
    <div className="space-y-4">
      <MiniInput
        label="Monthly Essential Expenses (PHP)"
        value={monthly}
        onChange={setMonthly}
        placeholder="40,000"
      />
      <MiniSelect
        label="Income Type"
        value={incomeType}
        onChange={setIncomeType}
        options={[
          { value: 'fixed',      label: 'Fixed salary (employee) — 3–6 months'         },
          { value: 'mixed',      label: 'Mixed (salary + commission) — 6–9 months'      },
          { value: 'commission', label: 'Commission / freelance — 9–12 months'          },
          { value: 'business',   label: 'Business owner — 9–12 months'                  },
        ]}
      />
      <MiniSelect
        label="Dependents"
        value={dependents}
        onChange={setDependents}
        options={[
          { value: 'none',     label: 'None'                           },
          { value: 'partner',  label: 'Partner only (+1 month)'        },
          { value: 'children', label: 'Children (+2 months)'           },
          { value: 'parents',  label: 'Parents / others (+2 months)'   },
        ]}
      />
      <MiniInput
        label="Current Emergency Fund (PHP)"
        value={existing}
        onChange={setExisting}
        placeholder="50,000"
      />
      <MiniCalcButton onClick={calc} />
      {result && <MiniGapResult result={result} />}
    </div>
  )
}

function LifeAssessment() {
  const [income,   setIncome]   = useState('')
  const [age,      setAge]      = useState('')
  const [coverage, setCoverage] = useState('')
  const [result,   setResult]   = useState<GapResult | null>(null)

  const calc = () => {
    const { result: res, classification, recommendation } = analyzeLifeProtection({
      annualIncome: parseFloat(income) || 0, youngestDependentAge: parseInt(age) || 0,
      existingCoverage: parseFloat(coverage) || 0,
    })
    const severity: GapResult['severity'] =
      classification.level === 'covered' ? 'covered' : classification.level === 'low' ? 'medium' :
      classification.level === 'medium'  ? 'high'    : 'critical'
    setResult({
      gapAmount: res.gap, severity,
      headline:  classification.label,
      detail:    `${classification.message} Dependency period: ${res.dependencyYears} yrs. Total needed: ${php(res.totalNeeded)}.`,
      product:   recommendation.primary,
      rationale: recommendation.reason + (recommendation.alternatives.length > 0 ? ` Your advisor may also present ${recommendation.alternatives.join(' or ')}.` : ''),
      coverageRatio: res.totalNeeded > 0 ? Math.min((res.totalNeeded - res.gap) / res.totalNeeded, 1) : 1,
    })
  }

  return (
    <div className="space-y-4">
      <MiniInput label="Annual Income (PHP)"              value={income}   onChange={setIncome}   placeholder="600,000" />
      <MiniInput label="Youngest Dependent's Age"         value={age}      onChange={setAge}      prefix="" placeholder="8" />
      <MiniInput label="Existing Life Coverage (PHP)"     value={coverage} onChange={setCoverage} placeholder="1,000,000" />
      <MiniCalcButton onClick={calc} />
      {result && <MiniGapResult result={result} />}
    </div>
  )
}

function HealthAssessment() {
  const [tier,     setTier]     = useState<HospitalLevel>('mid')
  const [savings,  setSavings]  = useState('')
  const [coverage, setCoverage] = useState('')
  const [result,   setResult]   = useState<GapResult | null>(null)

  const calc = () => {
    const { result: res, classification, recommendation } = analyzeHealthProtection({
      hospitalLevel: tier, savings: parseFloat(savings) || 0, existingCoverage: parseFloat(coverage) || 0,
    })
    const severity: GapResult['severity'] =
      classification.level === 'protected' ? 'covered' : classification.level === 'partial' ? 'medium' :
      classification.level === 'exposed'   ? 'high'    : 'critical'
    setResult({
      gapAmount: res.gap, severity,
      headline:  classification.label,
      detail:    `${classification.message} Target: ${php(res.effectiveTarget)}. Available: ${php(res.availableFunds)}.`,
      product:   recommendation.primary,
      rationale: recommendation.reason + (recommendation.alternatives.length > 0 ? ` Your advisor may also present ${recommendation.alternatives.join(' or ')}.` : ''),
      coverageRatio: res.coverageRatio,
    })
  }

  return (
    <div className="space-y-4">
      <MiniSelect label="Hospital Tier" value={tier} onChange={v => setTier(v as HospitalLevel)} options={[
        { value: 'low',  label: 'Low — Government / Provincial' },
        { value: 'mid',  label: 'Mid — Private Hospital'        },
        { value: 'high', label: 'High — Top-Tier / ICU-Capable' },
      ]} />
      <MiniInput label="Current Savings (PHP)"            value={savings}  onChange={setSavings}  placeholder="200,000" />
      <MiniInput label="Existing Health Coverage (PHP)"   value={coverage} onChange={setCoverage} placeholder="500,000" />
      <MiniCalcButton onClick={calc} />
      {result && <MiniGapResult result={result} />}
    </div>
  )
}

function IncomeProtectionAssessment() {
  const [monthly,   setMonthly]   = useState('')
  const [expenses,  setExpenses]  = useState('')
  const [coverage,  setCoverage]  = useState('')
  const [result,    setResult]    = useState<GapResult | null>(null)

  const calc = () => {
    const monthlyIncome = parseFloat(monthly)   || 0
    const monthlyExpenses = parseFloat(expenses) || 0
    const existing = parseFloat(coverage) || 0
    const annualIncomeLoss = monthlyIncome * 12
    const gap = Math.max(annualIncomeLoss - existing, 0)
    const ratio = annualIncomeLoss > 0 ? Math.min(existing / annualIncomeLoss, 1) : 1
    const severity: GapResult['severity'] = gap === 0 ? 'covered' : ratio >= 0.6 ? 'medium' : ratio >= 0.25 ? 'high' : 'critical'
    setResult({
      gapAmount: Math.round(gap), severity,
      headline:  gap === 0 ? 'Income is protected.' : 'Income replacement gap detected.',
      detail:    gap === 0
        ? 'Your existing coverage can replace your annual income if you are unable to work.'
        : `If you lost your income today, your family would face a ${php(gap)} annual shortfall not covered by existing plans.`,
      product:   'PRULove for Life',
      rationale: 'Provides income replacement benefit and life coverage, ensuring your family maintains their lifestyle even when you cannot work.',
      coverageRatio: ratio,
    })
  }

  return (
    <div className="space-y-4">
      <MiniInput label="Monthly Income (PHP)"             value={monthly}  onChange={setMonthly}  placeholder="50,000" />
      <MiniInput label="Monthly Expenses (PHP)"           value={expenses} onChange={setExpenses} placeholder="35,000" />
      <MiniInput label="Existing Disability Coverage (PHP)" value={coverage} onChange={setCoverage} placeholder="0" />
      <MiniCalcButton onClick={calc} />
      {result && <MiniGapResult result={result} />}
    </div>
  )
}

function RetirementAssessment() {
  const [curAge,  setCurAge]  = useState('')
  const [income,  setIncome]  = useState('')
  const [savings, setSavings] = useState('')
  const [result,  setResult]  = useState<GapResult | null>(null)

  const calc = () => {
    const res    = calculateRetirementNeed({
      currentAge: parseInt(curAge) || 30, retirementAge: 60,
      currentIncome: parseFloat(income) || 0,
      savings: parseFloat(savings) || 0, insuranceFund: 0, bankCash: 0,
    })
    const classification = classifyRetirementGap(res.gap, res.retirementFundNeeded)
    const recommendation = getRetirementProductRecommendation(classification.level)
    const severity: GapResult['severity'] =
      classification.level === 'on-track' ? 'covered' : classification.level === 'minor' ? 'medium' :
      classification.level === 'moderate' ? 'high'    : 'critical'
    setResult({
      gapAmount: res.gap, severity,
      headline:  classification.label,
      detail:    `${classification.message} You have ${res.yearsToRetirement} yrs to retirement. Fund needed: ${php(res.retirementFundNeeded)}. Existing: ${php(res.existingAssets)}.`,
      product:   recommendation.primary,
      rationale: recommendation.reason + (recommendation.alternatives.length > 0 ? ` Your advisor may also present ${recommendation.alternatives.join(' or ')}.` : ''),
      coverageRatio: res.retirementFundNeeded > 0 ? Math.min(res.existingAssets / res.retirementFundNeeded, 1) : 1,
    })
  }

  return (
    <div className="space-y-4">
      <MiniInput label="Current Age"                value={curAge}  onChange={setCurAge}  prefix="" placeholder="35" />
      <MiniInput label="Annual Income (PHP)"        value={income}  onChange={setIncome}  placeholder="600,000" />
      <MiniInput label="Existing Retirement Savings (PHP)" value={savings} onChange={setSavings} placeholder="100,000" />
      <MiniCalcButton onClick={calc} />
      {result && <MiniGapResult result={result} />}
    </div>
  )
}

function EducationAssessment() {
  const [childAge, setChildAge] = useState('')
  const [tuition,  setTuition]  = useState('')
  const [income,   setIncome]   = useState('')
  const [existing, setExisting] = useState('0')
  const [result,   setResult]   = useState<GapResult | null>(null)

  const calc = () => {
    const { result: res, classification, recommendation } = analyzeEducationFunding({
      childAge:       parseInt(childAge) || 5,
      collegeYears:   4,
      currentTuition: parseFloat(tuition)  || 80_000,
      existingFund:   parseFloat(existing) || 0,
      annualIncome:   parseFloat(income)   || 0,
      currentSavings: parseFloat(existing) || 0,
    })
    const severity: GapResult['severity'] =
      classification.level === 'funded'   ? 'covered'  :
      classification.level === 'low'      ? 'medium'   :
      classification.level === 'moderate' ? 'high'     : 'critical'

    // Format alternatives as a readable addendum when present
    const altNote = recommendation.alternatives.length > 0
      ? ` Your advisor may also discuss ${recommendation.alternatives.join(' or ')}.`
      : ''

    setResult({
      gapAmount:     res.gap,
      severity,
      headline:      `${classification.label} — Total projected cost: ${php(res.totalEducationCost)}`,
      detail:        `${classification.message} First-year tuition at 18: ${php(res.tuitionAt18)}.`,
      product:       recommendation.primary,
      rationale:     recommendation.explanation + altNote,
      coverageRatio: res.totalEducationCost > 0
        ? Math.min(res.existingFund / res.totalEducationCost, 1)
        : 1,
    })
  }

  return (
    <div className="space-y-4">
      <MiniInput label="Child's Current Age"              value={childAge} onChange={setChildAge} prefix="" placeholder="5" />
      <MiniInput label="Current Annual Tuition (PHP)"     value={tuition}  onChange={setTuition}  placeholder="80,000" />
      <MiniInput label="Your Annual Income (PHP)"         value={income}   onChange={setIncome}   placeholder="600,000" />
      <MiniInput label="Existing Education Fund (PHP)"    value={existing} onChange={setExisting} placeholder="0" />
      <MiniCalcButton onClick={calc} />
      {result && <MiniGapResult result={result} />}
    </div>
  )
}

/* ── Wealth Accumulation Assessment ──────────────────────────────────── */
function WealthAssessment() {
  const [income,   setIncome]   = useState('')
  const [savings,  setSavings]  = useState('')
  const [existing, setExisting] = useState('0')
  const [result,   setResult]   = useState<GapResult | null>(null)

  const WEALTH_TARGET_MULTIPLIER = 10   // 10× annual income as a wealth target

  const calc = () => {
    const annualIncome   = parseFloat(income)   || 0
    const currentSavings = parseFloat(savings)  || 0
    const existingFund   = parseFloat(existing) || 0
    const totalAssets    = currentSavings + existingFund
    const wealthTarget   = annualIncome * WEALTH_TARGET_MULTIPLIER
    const gap            = Math.max(wealthTarget - totalAssets, 0)
    const ratio          = wealthTarget > 0 ? Math.min(totalAssets / wealthTarget, 1) : 1

    const severity: GapResult['severity'] =
      gap === 0    ? 'covered' :
      ratio >= 0.6 ? 'medium'  :
      ratio >= 0.3 ? 'high'    : 'critical'

    // Product selection: higher income → premium products
    const isHighBudget = annualIncome >= 1_500_000 || totalAssets >= 500_000
    const primary      = gap === 0 ? 'PRU Elite Series'
                       : isHighBudget ? 'PRUMillionaire'
                       : 'PRULink Assurance Account Plus'
    const alternatives = gap === 0
      ? ['PRUMillionaire']
      : isHighBudget
        ? ['PRU Elite Series', 'PRULink Assurance Account Plus']
        : ['PRULifetime Income']

    const reason = gap === 0
      ? "Your wealth position is strong. The focus now is making your money work more efficiently — optimizing growth, protecting what you've built, and planning a clean transfer to the next generation."
      : isHighBudget
        ? "You have good income but a significant opportunity to grow your wealth. A premium investment-linked plan can accelerate your accumulation while keeping your family protected."
        : "Building wealth takes consistent, structured action. An investment-linked savings plan lets your money grow over time while maintaining protection — a practical first step toward financial independence."

    setResult({
      gapAmount:    Math.round(gap),
      severity,
      headline:     gap === 0 ? 'Wealth target met' : `Wealth accumulation gap: ${php(gap)}`,
      detail:       `Based on a target of ${WEALTH_TARGET_MULTIPLIER}× your annual income (${php(wealthTarget)}). Current assets: ${php(totalAssets)}.`,
      product:      primary,
      rationale:    reason + (alternatives.length > 0 ? ` Your advisor may also discuss ${alternatives.join(' or ')}.` : ''),
      coverageRatio: ratio,
    })
  }

  return (
    <div className="space-y-4">
      <MiniInput label="Annual Income (PHP)"            value={income}   onChange={setIncome}   placeholder="600,000" />
      <MiniInput label="Total Savings / Cash (PHP)"     value={savings}  onChange={setSavings}  placeholder="200,000" />
      <MiniInput label="Existing Investment Fund (PHP)" value={existing} onChange={setExisting} placeholder="0" />
      <MiniCalcButton onClick={calc} />
      {result && <MiniGapResult result={result} />}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MODAL CONFIG (per accordion id)
   ══════════════════════════════════════════════════════════════════════════ */

const MODAL_CONFIG: Record<number, {
  title:    string
  subtitle: string
  icon:     React.ElementType
  color:    string
  bg:       string
  form:     React.ReactNode
}> = {
  1: { title: 'Emergency Fund',            subtitle: 'How secure is your financial safety net?',  icon: Wallet,       color: '#f59e0b', bg: '#fffbeb', form: <EmergencyAssessment /> },
  2: { title: 'Life Insurance Protection', subtitle: 'Are your dependents financially protected?', icon: ShieldCheck,  color: '#3b82f6', bg: '#eff6ff', form: <LifeAssessment /> },
  3: { title: 'Health Insurance Coverage', subtitle: 'Can you handle a major medical event?',      icon: HeartPulse,   color: '#22c55e', bg: '#f0fdf4', form: <HealthAssessment /> },
  4: { title: 'Income Protection',         subtitle: 'What happens if you cannot work?',           icon: TrendingUp,   color: '#8b5cf6', bg: '#f5f3ff', form: <IncomeProtectionAssessment /> },
  5: { title: 'Retirement Funding',        subtitle: 'Will you have enough at retirement?',        icon: Sunset,       color: '#f97316', bg: '#fff7ed', form: <RetirementAssessment /> },
  6: { title: 'Educational Funding',       subtitle: "Is your child's future funded?",             icon: GraduationCap,color: '#6366f1', bg: '#eef2ff', form: <EducationAssessment /> },
  7: { title: 'Wealth Accumulation',       subtitle: 'Is your money working hard enough for you?', icon: LineChart,    color: '#10b981', bg: '#f0fdf4', form: <WealthAssessment /> },
}

/* ══════════════════════════════════════════════════════════════════════════
   ASSESSMENT MODAL
   ══════════════════════════════════════════════════════════════════════════ */

function AssessmentModal({
  needId, onClose,
}: {
  needId:  number
  onClose: () => void
}) {
  const cfg = MODAL_CONFIG[needId]
  if (!cfg) return null
  const Icon = cfg.icon

  return (
    <AnimatePresence>
      {/* Backdrop — directional gradient: transparent left (accordion stays visible),
          darker right (modal sits here). No blur on backdrop so accordion detail
          remains readable through the overlay. */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end md:pr-16"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.32) 45%, rgba(0,0,0,0.62) 100%)',
        }}
      >
        {/* Modal panel — slide up on mobile, slide in from right on desktop */}
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 40,  scale: 0.97 }}
          animate={{ opacity: 1, y: 0,   scale: 1    }}
          exit={   { opacity: 0, y: 24,  scale: 0.97 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          className="relative w-full md:w-[460px] max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-3xl bg-white shadow-2xl"
        >
          {/* Modal header */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-6 pt-6 pb-4 rounded-t-3xl"
            style={{ background: cfg.bg, borderBottom: `1px solid ${cfg.color}22` }}
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center rounded-xl w-9 h-9"
                style={{ background: cfg.color + '18', border: `1px solid ${cfg.color}30` }}>
                <Icon size={18} style={{ color: cfg.color }} />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.title}</p>
                <p className="text-sm font-bold text-gray-900 leading-tight">{cfg.subtitle}</p>
              </div>
            </div>
            <button onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-150">
              <X size={14} className="text-gray-500" />
            </button>
          </div>

          {/* Form area */}
          <div className="px-6 pb-6 pt-5">
            {/* UX hint */}
            <div className="flex items-start gap-2 mb-5 rounded-xl p-3" style={{ background: cfg.bg }}>
              <Info size={13} className="shrink-0 mt-0.5" style={{ color: cfg.color }} />
              <p className="text-xs text-gray-600 leading-relaxed">
                Answer a few quick questions to calculate your personal financial gap and get a tailored recommendation.
              </p>
            </div>

            {cfg.form}

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-[11px] text-gray-400">
                Licensed PRU Life UK Advisor · Free consultation · No obligation
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT — FinancialAccordion
   ══════════════════════════════════════════════════════════════════════════ */

export function FinancialAccordion() {
  const [hoverIndex,     setHoverIndex]     = useState<number>(2)
  const [selectedIndex,  setSelectedIndex]  = useState<number | null>(null)
  const [activeNeedId,   setActiveNeedId]   = useState<number | null>(null)
  const [isModalOpen,    setIsModalOpen]    = useState(false)

  // Hover is a no-op while modal is open — prevents accidental state changes
  const handleHover = (index: number) => { if (isModalOpen) return; setHoverIndex(index) }
  const handleLeave = ()               => { if (isModalOpen) return; setHoverIndex(selectedIndex ?? 2) }

  const handleClick = (index: number, id: number) => {
    setSelectedIndex(index)
    setHoverIndex(index)
    setActiveNeedId(id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    // keep selectedIndex so ring remains visible after modal closes
  }

  return (
    <>
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ──────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500 mb-3">Financial Foundation</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                Build a Strong Financial Foundation
              </h2>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                Based on your answers, we've identified key areas that may need attention.
                Hover to explore each area — click to start a focused assessment.
              </p>
            </div>
            <div className="shrink-0">
              <AnimatedGradientButton
                preset="pru"
                duration={5}
                className="font-semibold text-sm rounded-xl px-8 py-3.5 whitespace-nowrap"
                onClick={() => window.open('https://m.me/Bstarquartzarea?ref=financial_assessment', '_blank')}
              >
                Talk to a Financial Advisor <ArrowRight size={15} />
              </AnimatedGradientButton>
              <p className="text-[11px] text-gray-400 mt-2 text-center">Free · No commitment</p>
            </div>
          </div>

          {/* ── Selected indicator ──────────────────────────────── */}
          <AnimatePresence>
            {selectedIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="hidden md:flex items-center gap-2.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                <p className="text-xs text-gray-500 font-medium">
                  Last assessed: <span className="text-gray-900 font-bold">{accordionItems[selectedIndex].title}</span>
                  <button onClick={() => setIsModalOpen(true)}
                    className="ml-2 text-red-600 hover:text-red-500 font-semibold transition-colors">
                    Reopen →
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Desktop accordion ───────────────────────────────── */}
          <div className="hidden md:flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {accordionItems.map((item, index) => (
              <AccordionItem
                key={item.id} item={item}
                isHovered={hoverIndex === index}
                isSelected={selectedIndex === index}
                isModalOpen={isModalOpen}
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={handleLeave}
                onClick={() => handleClick(index, item.id)}
              />
            ))}
          </div>

          {/* ── Mobile stack ────────────────────────────────────── */}
          <div className="flex md:hidden flex-col gap-3">
            {accordionItems.map((item, index) => {
              const isOpen = selectedIndex === index
              return (
                <div
                  key={item.id}
                  onClick={() => handleClick(isOpen ? -1 : index, item.id)}
                  className="relative overflow-hidden rounded-2xl cursor-pointer border transition-all duration-300"
                  style={{ height: 72, borderColor: isOpen ? 'rgba(220,38,38,0.4)' : '#e5e7eb' }}
                >
                  <img
                    src={item.imageUrl} alt={item.title}
                    loading="eager"
                    decoding="async"
                    onError={e => { (e.currentTarget as HTMLImageElement).src = FALLBACK_URL }}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'brightness(0.68)' }}
                  />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.12) 100%)' }} />
                  {isOpen && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center justify-center rounded-full w-6 h-6" style={{ background: '#dc2626' }}>
                        <CheckCircle2 size={13} color="#fff" />
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center px-5 gap-3">
                    <span className="shrink-0 w-2 h-2 rounded-full" style={{ background: isOpen ? '#f87171' : '#f87171' }} />
                    <span className="text-white font-semibold text-sm">{item.title}</span>
                    {isOpen && (
                      <span className="ml-auto text-[10px] font-bold text-white/70">Tap to assess →</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Trust footer ────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-10">
            {['Licensed PRU Life UK Advisors', 'Personalized Financial Planning', 'No Obligation Consultation'].map(t => (
              <span key={t} className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                {t}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ── Assessment Modal ──────────────────────────────────────── */}
      {isModalOpen && activeNeedId !== null && (
        <AssessmentModal needId={activeNeedId} onClose={closeModal} />
      )}
    </>
  )
}
