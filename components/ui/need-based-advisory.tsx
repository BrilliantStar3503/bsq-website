'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Heart, Landmark, GraduationCap, TrendingUp,
  AlertTriangle, CheckCircle2, ArrowRight, MessageCircle,
  Calculator, ChevronRight, Info, Zap,
} from 'lucide-react'

import { analyzeLifeProtection }    from '@/lib/life-protection'
import { calculateRetirementNeed, classifyRetirementGap, getRetirementProductRecommendation } from '@/lib/retirement-planning'
import { analyzeHealthProtection }  from '@/lib/health-protection'
import { analyzeEducationFunding }  from '@/lib/education-funding'
import type { HospitalLevel }       from '@/lib/health-protection'

/* ══════════════════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════════════════ */

type NeedKey = 'emergency' | 'life' | 'health' | 'retirement' | 'education' | 'wealth'

interface GapResult {
  gapAmount:   number
  severity:    'critical' | 'high' | 'medium' | 'covered'
  headline:    string
  detail:      string
  product:     string
  rationale:   string
  coverageRatio?: number
}

/* ══════════════════════════════════════════════════════════════════════════
   ACCORDION CONFIG
   ══════════════════════════════════════════════════════════════════════════ */

const NEEDS_CONFIG: Array<{
  id:          NeedKey
  title:       string
  subtitle:    string
  image:       string
  icon:        React.ElementType
  accentColor: string
  accentBg:    string
  accentBorder:string
  description: string
  insight:     string
}> = [
  {
    id:           'emergency',
    title:        'Emergency Fund',
    subtitle:     'Your financial safety net',
    image:        'https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=1200&auto=format&fit=crop',
    icon:         Shield,
    accentColor:  '#2563eb',
    accentBg:     '#eff6ff',
    accentBorder: '#bfdbfe',
    description:  'An emergency fund is the foundation of every financial plan. Without it, a single unexpected event — a job loss, a medical bill, a car repair — can force you into debt and unravel years of savings.',
    insight:      'A minimum of 6 months of living expenses should be kept liquid. Most Filipinos have fewer than 30 days of cash reserves, making this the first financial priority before anything else.',
  },
  {
    id:           'life',
    title:        'Life Insurance Protection',
    subtitle:     'Protect those who depend on you',
    image:        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop',
    icon:         Shield,
    accentColor:  '#dc2626',
    accentBg:     '#fef2f2',
    accentBorder: '#fecaca',
    description:  'Life insurance ensures your family can maintain their lifestyle, pay off debts, and fund their futures — even if you are no longer able to provide for them.',
    insight:      'Most Filipinos are significantly underinsured. A good benchmark is 10–15 years of your annual income. If you have dependents under 22, your gap is likely larger than you think.',
  },
  {
    id:           'health',
    title:        'Health Insurance Coverage',
    subtitle:     'Guard against medical emergencies',
    image:        'https://images.unsplash.com/photo-1588776814546-ec7e2c3c0d4d?q=80&w=1200&auto=format&fit=crop',
    icon:         Heart,
    accentColor:  '#0891b2',
    accentBg:     '#f0f9ff',
    accentBorder: '#bae6fd',
    description:  'A single critical illness or major surgery can cost ₱500,000 to ₱5,000,000 or more. Without adequate coverage, these costs come directly from your savings — setting back every other financial goal simultaneously.',
    insight:      'Health protection is treated as the top-priority financial gap because a medical event can simultaneously drain your emergency fund, halt retirement contributions, and force liquidation of assets.',
  },
  {
    id:           'retirement',
    title:        'Retirement Funding',
    subtitle:     'Secure your financial independence',
    image:        'https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?q=80&w=1200&auto=format&fit=crop',
    icon:         Landmark,
    accentColor:  '#d97706',
    accentBg:     '#fffbeb',
    accentBorder: '#fde68a',
    description:  'Without a dedicated retirement fund, you risk outliving your savings or becoming financially dependent on your children — a reality many Filipino families face today.',
    insight:      'Starting a small monthly contribution today makes a dramatic difference over 20–30 years. Delaying by just 5 years can reduce your final fund by more than 40% due to lost compounding.',
  },
  {
    id:           'education',
    title:        'Educational Funding',
    subtitle:     "Invest in your child's future",
    image:        'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop',
    icon:         GraduationCap,
    accentColor:  '#059669',
    accentBg:     '#f0fdf4',
    accentBorder: '#bbf7d0',
    description:  'Tuition in the Philippines grows at roughly 10% per year. A child entering college in 15 years will face costs 4× higher than today. Without a plan, education becomes a financial emergency.',
    insight:      'Starting an education fund at birth requires ₱3,000–₱5,000/month. Waiting until age 10 may require ₱20,000+/month. The cost of waiting is steep.',
  },
  {
    id:           'wealth',
    title:        'Wealth Accumulation',
    subtitle:     'Grow and protect your assets',
    image:        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
    icon:         TrendingUp,
    accentColor:  '#7c3aed',
    accentBg:     '#f5f3ff',
    accentBorder: '#ddd6fe',
    description:  'Once your protection base is secure, investment-linked products let your money grow faster than inflation — building the legacy and financial freedom you and your family deserve.',
    insight:      'Wealth building without a protection foundation is like building on sand. Sequence matters: emergency fund → protection → retirement → education → wealth growth.',
  },
]

/* ══════════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════════ */

const php = (n: number) =>
  '₱' + Math.round(n).toLocaleString('en-PH')

const severityStyle = {
  critical: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Critical Gap',  icon: AlertTriangle },
  high:     { color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', label: 'High Gap',      icon: AlertTriangle },
  medium:   { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Moderate Gap',  icon: Info          },
  covered:  { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Well Covered',  icon: CheckCircle2  },
}

/* ── Input ──────────────────────────────────────────────────────────────── */

/* ─── Currency formatter ────────────────────────────────────────────── */
const FMT          = new Intl.NumberFormat('en-PH')
const formatPeso    = (raw: string) => raw ? FMT.format(parseInt(raw) || 0) : ''
const stripNonDigit = (s: string)   => s.replace(/[^\d]/g, '')

function InputField({
  label, value, onChange, prefix = '₱', placeholder = '0',
}: {
  label: string; value: string; onChange: (v: string) => void
  prefix?: string; placeholder?: string
}) {
  // Currency fields (prefix='₱'): store raw digits, display formatted on blur
  // Plain fields (prefix=''): pass value through unchanged
  const isCurrency = prefix === '₱'
  const [focused, setFocused] = useState(false)

  // While typing → raw digits (no cursor jumping)
  // After blur   → formatted with commas
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium select-none pointer-events-none">
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
            e.target.style.boxShadow = '0 0 0 2px rgba(220,38,38,0.2)'
          }}
          onBlur={e => {
            if (isCurrency) setFocused(false)
            e.target.style.boxShadow = 'none'
          }}
          className="w-full border border-gray-200 rounded-xl py-2.5 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-150"
          style={{ paddingLeft: prefix ? '2rem' : '0.75rem', paddingRight: '0.75rem' }}
        />
      </div>
    </div>
  )
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-medium focus:outline-none bg-white transition-all duration-150"
        onFocus={e => e.target.style.boxShadow = '0 0 0 2px rgba(220,38,38,0.2)'}
        onBlur={e  => e.target.style.boxShadow = 'none'}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function CalcButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white rounded-xl py-3 text-sm font-bold transition-colors duration-150"
      style={{ boxShadow: '0 3px 14px rgba(220,38,38,0.28)' }}
    >
      <Calculator size={14} />
      {loading ? 'Calculating…' : 'Calculate My Gap'}
    </motion.button>
  )
}

/* ── Gap Result Card ────────────────────────────────────────────────────── */

function GapResultCard({ result, accentColor }: { result: GapResult; accentColor: string }) {
  const sv = severityStyle[result.severity]
  const SvIcon = sv.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl border p-5 mt-5"
      style={{ background: sv.bg, borderColor: sv.border }}
    >
      {/* Severity badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ color: sv.color, background: '#fff', border: `1px solid ${sv.border}` }}
        >
          <SvIcon size={11} />
          {sv.label}
        </span>
        {result.coverageRatio !== undefined && (
          <span className="text-xs text-gray-500 font-medium">
            {Math.round(result.coverageRatio * 100)}% covered
          </span>
        )}
      </div>

      {/* Gap amount */}
      {result.gapAmount > 0 ? (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-0.5">Estimated Protection Gap</p>
          <p className="text-2xl font-black" style={{ color: sv.color }}>{php(result.gapAmount)}</p>
        </div>
      ) : (
        <p className="text-sm font-bold text-green-700 mb-3">✓ No gap detected — you're on track!</p>
      )}

      {/* Headline & detail */}
      <p className="text-sm font-semibold text-gray-800 mb-1">{result.headline}</p>
      <p className="text-xs text-gray-600 leading-relaxed mb-4">{result.detail}</p>

      {/* Recommended product */}
      <div className="border-t pt-4" style={{ borderColor: sv.border }}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Recommended Solution</p>
        <p className="text-sm font-semibold text-gray-900 mb-1">{result.product}</p>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">{result.rationale}</p>
        <button
          onClick={() => window.open('https://m.me/Bstarquartzarea?ref=financial_assessment', '_blank')}
          className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors duration-150"
          style={{ color: sv.color }}
        >
          <MessageCircle size={12} />
          Talk to an advisor about this
          <ArrowRight size={11} />
        </button>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   FORMS — one per need type
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Emergency Fund Form ───────────────────────────────────────────────── */
function EmergencyForm({ onResult }: { onResult: (r: GapResult) => void }) {
  const [monthly, setMonthly]   = useState('')
  const [existing, setExisting] = useState('')
  const [result, setResult]     = useState<GapResult | null>(null)

  const calculate = () => {
    const monthlyExp   = parseFloat(monthly)  || 0
    const existingFund = parseFloat(existing) || 0
    const target       = monthlyExp * 6
    const gap          = Math.max(target - existingFund, 0)
    const ratio        = target > 0 ? Math.min(existingFund / target, 1) : 1

    const severity: GapResult['severity'] =
      gap === 0             ? 'covered'  :
      ratio >= 0.60         ? 'medium'   :
      ratio >= 0.25         ? 'high'     : 'critical'

    const r: GapResult = {
      gapAmount:     Math.round(gap),
      severity,
      headline:      gap === 0 ? 'Your emergency fund is sufficient.' : `You need ${php(gap)} more in your emergency fund.`,
      detail:        gap === 0
        ? 'You have at least 6 months of living expenses covered. This protects you from financial shocks without disrupting your other plans.'
        : `Your current fund covers ${Math.round(ratio * 6 * 10) / 10} months of expenses. You need ${php(target)} total (6 months of ₱${Math.round(monthlyExp).toLocaleString('en-PH')} monthly expenses).`,
      product:       gap === 0 ? 'PRULife Optimizer' : 'PRULink Assurance Account Plus',
      rationale:     gap === 0
        ? 'Consider redirecting surplus savings into a growth-oriented plan once your protection base is secure.'
        : "Build your emergency fund through a structured savings plan that earns while it protects — so your money isn't sitting idle in a zero-interest account.",
      coverageRatio: ratio,
    }
    setResult(r)
    onResult(r)
  }

  return (
    <div className="space-y-4">
      <InputField label="Monthly Living Expenses (PHP)" value={monthly} onChange={setMonthly} placeholder="30,000" />
      <InputField label="Existing Emergency Fund (PHP)" value={existing} onChange={setExisting} placeholder="50,000" />
      <CalcButton onClick={calculate} loading={false} />
      {result && <GapResultCard result={result} accentColor="#2563eb" />}
    </div>
  )
}

/* ── Life Insurance Form ───────────────────────────────────────────────── */
function LifeForm({ onResult }: { onResult: (r: GapResult) => void }) {
  const [income,    setIncome]    = useState('')
  const [youngAge,  setYoungAge]  = useState('')
  const [coverage,  setCoverage]  = useState('')
  const [result,    setResult]    = useState<GapResult | null>(null)

  const calculate = () => {
    const analysis = analyzeLifeProtection({
      annualIncome:         parseFloat(income)    || 0,
      youngestDependentAge: parseInt(youngAge)    || 0,
      existingCoverage:     parseFloat(coverage)  || 0,
    })
    const { result: res, classification, recommendation } = analysis

    const severity: GapResult['severity'] =
      classification.level === 'covered' ? 'covered'  :
      classification.level === 'low'     ? 'medium'   :
      classification.level === 'medium'  ? 'high'     : 'critical'

    const r: GapResult = {
      gapAmount:     res.gap,
      severity,
      headline:      classification.label,
      detail:        `${classification.message} Your income would need to cover ${res.dependencyYears} years of dependency. Total coverage needed: ${php(res.totalNeeded)}.`,
      product:       recommendation.primary,
      rationale:     recommendation.reason + (recommendation.alternatives.length > 0 ? ` Your advisor may also present ${recommendation.alternatives.join(' or ')}.` : ''),
      coverageRatio: res.gap > 0 && res.totalNeeded > 0
        ? Math.min((res.totalNeeded - res.gap) / res.totalNeeded, 1) : 1,
    }
    setResult(r)
    onResult(r)
  }

  return (
    <div className="space-y-4">
      <InputField label="Annual Income (PHP)" value={income} onChange={setIncome} placeholder="600,000" />
      <InputField label="Youngest Dependent's Age" value={youngAge} onChange={setYoungAge} prefix="" placeholder="8" />
      <InputField label="Existing Life Insurance Coverage (PHP)" value={coverage} onChange={setCoverage} placeholder="1,000,000" />
      <CalcButton onClick={calculate} loading={false} />
      {result && <GapResultCard result={result} accentColor="#dc2626" />}
    </div>
  )
}

/* ── Health Coverage Form ──────────────────────────────────────────────── */
function HealthForm({ onResult }: { onResult: (r: GapResult) => void }) {
  const [tier,     setTier]     = useState<HospitalLevel>('mid')
  const [savings,  setSavings]  = useState('')
  const [coverage, setCoverage] = useState('')
  const [result,   setResult]   = useState<GapResult | null>(null)

  const tierLabels: Record<HospitalLevel, string> = {
    low:  'Low — Government / Provincial Hospital',
    mid:  'Mid — Private Hospital (Semi-Suite)',
    high: 'High — Top-Tier Private / ICU-Capable',
  }

  const calculate = () => {
    const analysis = analyzeHealthProtection({
      hospitalLevel:    tier,
      savings:          parseFloat(savings)  || 0,
      existingCoverage: parseFloat(coverage) || 0,
    })
    const { result: res, classification, recommendation } = analysis

    const severity: GapResult['severity'] =
      classification.level === 'protected' ? 'covered'  :
      classification.level === 'partial'   ? 'medium'   :
      classification.level === 'exposed'   ? 'high'     : 'critical'

    const r: GapResult = {
      gapAmount:     res.gap,
      severity,
      headline:      classification.label,
      detail:        `${classification.message} Target coverage for your chosen hospital tier: ${php(res.effectiveTarget)}. Available: ${php(res.availableFunds)}.`,
      product:       recommendation.primary,
      rationale:     recommendation.reason + (recommendation.alternatives.length > 0 ? ` Your advisor may also present ${recommendation.alternatives.join(' or ')}.` : ''),
      coverageRatio: res.coverageRatio,
    }
    setResult(r)
    onResult(r)
  }

  return (
    <div className="space-y-4">
      <SelectField
        label="Target Hospital Tier"
        value={tier}
        onChange={v => setTier(v as HospitalLevel)}
        options={(['low', 'mid', 'high'] as HospitalLevel[]).map(v => ({ value: v, label: tierLabels[v] }))}
      />
      <InputField label="Liquid Savings (PHP)" value={savings} onChange={setSavings} placeholder="200,000" />
      <InputField label="Existing Health Insurance Coverage (PHP)" value={coverage} onChange={setCoverage} placeholder="500,000" />
      <CalcButton onClick={calculate} loading={false} />
      {result && <GapResultCard result={result} accentColor="#0891b2" />}
    </div>
  )
}

/* ── Retirement Form ───────────────────────────────────────────────────── */
function RetirementForm({ onResult }: { onResult: (r: GapResult) => void }) {
  const [curAge,     setCurAge]     = useState('')
  const [retAge,     setRetAge]     = useState('60')
  const [income,     setIncome]     = useState('')
  const [savings,    setSavings]    = useState('')
  const [bankCash,   setBankCash]   = useState('')
  const [insFund,    setInsFund]    = useState('0')
  const [result,     setResult]     = useState<GapResult | null>(null)

  const calculate = () => {
    const input = {
      currentAge:     parseInt(curAge)     || 30,
      retirementAge:  parseInt(retAge)     || 60,
      currentIncome:  parseFloat(income)   || 0,
      savings:        parseFloat(savings)  || 0,
      insuranceFund:  parseFloat(insFund)  || 0,
      bankCash:       parseFloat(bankCash) || 0,
    }
    const res           = calculateRetirementNeed(input)
    const classification = classifyRetirementGap(res.gap, res.retirementFundNeeded)
    const recommendation = getRetirementProductRecommendation(classification.level)

    const severity: GapResult['severity'] =
      classification.level === 'on-track' ? 'covered'  :
      classification.level === 'minor'    ? 'medium'   :
      classification.level === 'moderate' ? 'high'     : 'critical'

    const r: GapResult = {
      gapAmount:     res.gap,
      severity,
      headline:      classification.label,
      detail:        `${classification.message} You have ${res.yearsToRetirement} years to retirement. Fund needed: ${php(res.retirementFundNeeded)}. Existing assets: ${php(res.existingAssets)}.`,
      product:       recommendation.primary,
      rationale:     recommendation.reason + (recommendation.alternatives.length > 0 ? ` Your advisor may also present ${recommendation.alternatives.join(' or ')}.` : ''),
      coverageRatio: res.retirementFundNeeded > 0
        ? Math.min(res.existingAssets / res.retirementFundNeeded, 1) : 1,
    }
    setResult(r)
    onResult(r)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Current Age" value={curAge} onChange={setCurAge} prefix="" placeholder="35" />
        <InputField label="Target Retirement Age" value={retAge} onChange={setRetAge} prefix="" placeholder="60" />
      </div>
      <InputField label="Annual Income (PHP)" value={income} onChange={setIncome} placeholder="600,000" />
      <InputField label="Current Savings (PHP)" value={savings} onChange={setSavings} placeholder="100,000" />
      <InputField label="Bank Cash / Deposits (PHP)" value={bankCash} onChange={setBankCash} placeholder="50,000" />
      <InputField label="Existing Insurance Fund / VUL Value (PHP)" value={insFund} onChange={setInsFund} placeholder="0" />
      <CalcButton onClick={calculate} loading={false} />
      {result && <GapResultCard result={result} accentColor="#d97706" />}
    </div>
  )
}

/* ── Education Fund Form ───────────────────────────────────────────────── */
function EducationForm({ onResult }: { onResult: (r: GapResult) => void }) {
  const [childAge,  setChildAge]  = useState('')
  const [years,     setYears]     = useState<'4' | '5'>('4')
  const [tuition,   setTuition]   = useState('')
  const [existing,  setExisting]  = useState('0')
  const [result,    setResult]    = useState<GapResult | null>(null)

  const calculate = () => {
    const analysis = analyzeEducationFunding({
      childAge:         parseInt(childAge)   || 5,
      collegeYears:     parseInt(years) as 4 | 5,
      currentTuition:   parseFloat(tuition)  || 80_000,
      existingFund:     parseFloat(existing) || 0,
    })
    const { result: res, classification, recommendation } = analysis

    const severity: GapResult['severity'] =
      classification.level === 'funded'   ? 'covered'  :
      classification.level === 'low'      ? 'medium'   :
      classification.level === 'moderate' ? 'high'     : 'critical'

    const r: GapResult = {
      gapAmount:     res.gap,
      severity,
      headline:      classification.label,
      detail:        `${classification.message} Total projected college cost: ${php(res.totalEducationCost)}. First-year tuition at 18: ${php(res.tuitionAt18)}. Years to college: ${res.yearsToCollege}.`,
      product:       recommendation.primary,
      rationale:     recommendation.explanation + (recommendation.alternatives.length > 0 ? ` Your advisor may also discuss ${recommendation.alternatives.join(' or ')}.` : ''),
      coverageRatio: res.totalEducationCost > 0
        ? Math.min(res.existingFund / res.totalEducationCost, 1) : 1,
    }
    setResult(r)
    onResult(r)
  }

  return (
    <div className="space-y-4">
      <InputField label="Child's Current Age" value={childAge} onChange={setChildAge} prefix="" placeholder="5" />
      <SelectField
        label="College Program Duration"
        value={years}
        onChange={v => setYears(v as '4' | '5')}
        options={[{ value: '4', label: '4-Year Program' }, { value: '5', label: '5-Year Program' }]}
      />
      <InputField label="Current Annual Tuition (PHP)" value={tuition} onChange={setTuition} placeholder="80,000" />
      <InputField label="Existing Education Fund (PHP)" value={existing} onChange={setExisting} placeholder="0" />
      <CalcButton onClick={calculate} loading={false} />
      {result && <GapResultCard result={result} accentColor="#059669" />}
    </div>
  )
}

/* ── Wealth Form (Advisory CTA) ─────────────────────────────────────────── */
function WealthForm() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Advisor Note</p>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Wealth accumulation strategy is highly personalized — it depends on your risk appetite, time horizon, existing assets, and tax considerations. Rather than a single number, this requires a tailored investment plan.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          A PRU Life UK advisor can walk you through investment-linked options including VUL products, fund selection strategies, and long-term wealth structuring — at no cost.
        </p>
      </div>

      <div className="space-y-2">
        {[
          'PRULink Assurance Account Plus — protection + investment in one plan',
          'PRUMillionaire — premium wealth accumulation with life coverage',
          'PRU Elite Series — institutional-grade wealth strategy for high-net-worth clients',
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <Zap size={13} className="shrink-0 mt-0.5 text-purple-400" />
            <p className="text-xs text-gray-600 leading-relaxed">{item}</p>
          </div>
        ))}
      </div>

      <motion.button
        onClick={() => window.open('https://m.me/Bstarquartzarea?ref=financial_assessment', '_blank')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white rounded-xl py-3 text-sm font-bold transition-colors duration-150"
        style={{ boxShadow: '0 3px 14px rgba(220,38,38,0.28)' }}
      >
        <MessageCircle size={14} />
        Get a Personalized Wealth Plan
        <ArrowRight size={14} />
      </motion.button>

      <p className="text-center text-[11px] text-gray-400">No pressure · Free consultation · Licensed advisor</p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   ACCORDION ITEM
   ══════════════════════════════════════════════════════════════════════════ */

function AccordionItem({
  item, isActive, onClick,
}: {
  item: (typeof NEEDS_CONFIG)[number]
  isActive: boolean
  onClick: () => void
}) {
  return (
    <motion.div
      onClick={onClick}
      animate={{ flex: isActive ? 3 : 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-2xl overflow-hidden cursor-pointer shrink-0"
      style={{ height: 280, minWidth: isActive ? 200 : 72 }}
    >
      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover"
        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=1200&auto=format&fit=crop' }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: isActive
            ? 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Active state: recommendation tag + title */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="absolute bottom-5 left-4 right-4"
          >
            <p className="text-[10px] font-semibold text-white/60 mb-1 leading-snug">
              Recommended based on your financial assessment
            </p>
            <p className="text-white font-bold text-base leading-snug">{item.title}</p>
            <p className="text-white/60 text-[11px] mt-0.5">{item.subtitle}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inactive state: rotated label */}
      {!isActive && (
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <p
            className="text-white text-[10px] font-bold text-center leading-snug px-1 opacity-90"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.04em' }}
          >
            {item.title}
          </p>
        </div>
      )}

      {/* Active top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-500"
        style={{ background: isActive ? item.accentColor : 'transparent' }}
      />
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   GAP SUMMARY BANNER
   ══════════════════════════════════════════════════════════════════════════ */

function GapSummaryBanner({
  results, onFocus, activeNeed,
}: {
  results:    Partial<Record<NeedKey, GapResult>>
  onFocus:    (k: NeedKey) => void
  activeNeed: NeedKey
}) {
  const entries = Object.entries(results) as [NeedKey, GapResult][]
  if (entries.length < 2) return null

  const highest = entries.reduce((max, curr) =>
    curr[1].gapAmount > max[1].gapAmount ? curr : max
  )
  const [topKey, topResult] = highest
  const topConfig = NEEDS_CONFIG.find(n => n.id === topKey)!
  const sv = severityStyle[topResult.severity]

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-4 flex items-center justify-between gap-4 flex-wrap"
      style={{ background: sv.bg, borderColor: sv.border }}
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center rounded-xl w-9 h-9 shrink-0"
          style={{ background: '#fff', border: `1px solid ${sv.border}` }}>
          <AlertTriangle size={16} style={{ color: sv.color }} />
        </span>
        <div>
          <p className="text-xs font-bold text-gray-800">
            Highest Priority Gap: <span style={{ color: sv.color }}>{topConfig.title}</span>
          </p>
          <p className="text-[11px] text-gray-500">
            {topResult.gapAmount > 0 ? `${php(topResult.gapAmount)} uncovered` : 'No gap — well covered'} · {entries.length} area{entries.length > 1 ? 's' : ''} analyzed
          </p>
        </div>
      </div>
      {topKey !== activeNeed && (
        <button
          onClick={() => onFocus(topKey)}
          className="inline-flex items-center gap-1.5 text-xs font-bold shrink-0 transition-colors duration-150"
          style={{ color: sv.color }}
        >
          Review this gap <ChevronRight size={13} />
        </button>
      )}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT — NeedBasedAdvisory
   ══════════════════════════════════════════════════════════════════════════ */

export default function NeedBasedAdvisory() {
  const [activeNeed, setActiveNeed] = useState<NeedKey>('retirement')
  const [results, setResults]       = useState<Partial<Record<NeedKey, GapResult>>>({})

  const saveResult = useCallback((key: NeedKey, r: GapResult) => {
    setResults(prev => ({ ...prev, [key]: r }))
  }, [])

  const activeConfig = useMemo(
    () => NEEDS_CONFIG.find(n => n.id === activeNeed)!,
    [activeNeed],
  )

  const formMap: Record<NeedKey, React.ReactNode> = {
    emergency:  <EmergencyForm   key="emergency"  onResult={r => saveResult('emergency',  r)} />,
    life:       <LifeForm        key="life"        onResult={r => saveResult('life',        r)} />,
    health:     <HealthForm      key="health"      onResult={r => saveResult('health',      r)} />,
    retirement: <RetirementForm  key="retirement"  onResult={r => saveResult('retirement',  r)} />,
    education:  <EducationForm   key="education"   onResult={r => saveResult('education',   r)} />,
    wealth:     <WealthForm      key="wealth" />,
  }

  return (
    <section className="bg-white py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ── Section Header ──────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-gray-400 mb-3">
            Need-Based Financial Advisory
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
            Build a Strong Financial Foundation
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Select a financial area below to understand your gap and get a personalized recommendation.
            Each calculation is based on your actual situation — not a generic estimate.
          </p>
        </div>

        {/* ── Gap Summary (appears after 2+ calculations) ──────────── */}
        <GapSummaryBanner
          results={results}
          onFocus={setActiveNeed}
          activeNeed={activeNeed}
        />

        {/* ── Image Accordion ─────────────────────────────────────── */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-3 min-w-[480px]">
            {NEEDS_CONFIG.map(item => (
              <AccordionItem
                key={item.id}
                item={item}
                isActive={activeNeed === item.id}
                onClick={() => setActiveNeed(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Advisory Content + Form ──────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNeed}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left: Info Panel */}
            <div className="space-y-6">

              {/* Calculated badge */}
              {results[activeNeed] && (
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    color:      severityStyle[results[activeNeed]!.severity].color,
                    background: severityStyle[results[activeNeed]!.severity].bg,
                    border:     `1px solid ${severityStyle[results[activeNeed]!.severity].border}`,
                  }}
                >
                  <CheckCircle2 size={11} />
                  {severityStyle[results[activeNeed]!.severity].label}
                </span>
              )}

              {/* Category label */}
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{
                  color:      activeConfig.accentColor,
                  background: activeConfig.accentBg,
                  border:     `1px solid ${activeConfig.accentBorder}`,
                }}
              >
                <activeConfig.icon size={11} />
                {activeConfig.title}
              </span>

              {/* Title */}
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{activeConfig.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{activeConfig.description}</p>
              </div>

              {/* Advisor insight */}
              <div
                className="rounded-2xl border p-5"
                style={{ background: activeConfig.accentBg, borderColor: activeConfig.accentBorder }}
              >
                <div className="flex items-start gap-2.5">
                  <Info size={14} className="shrink-0 mt-0.5" style={{ color: activeConfig.accentColor }} />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: activeConfig.accentColor }}>
                      Advisor Insight
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed">{activeConfig.insight}</p>
                  </div>
                </div>
              </div>

              {/* Progress across all needs */}
              {Object.keys(results).length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Areas Analyzed ({Object.keys(results).length} of 6)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {NEEDS_CONFIG.map(n => {
                      const r = results[n.id]
                      if (!r) return null
                      const sv = severityStyle[r.severity]
                      return (
                        <button
                          key={n.id}
                          onClick={() => setActiveNeed(n.id)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all duration-150 hover:scale-105"
                          style={{
                            color:      sv.color,
                            background: sv.bg,
                            border:     `1px solid ${sv.border}`,
                            fontWeight: activeNeed === n.id ? 700 : 500,
                          }}
                        >
                          {n.title.split(' ')[0]}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Form Panel */}
            <div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Calculator size={15} style={{ color: activeConfig.accentColor }} />
                  <h4 className="text-sm font-bold text-gray-900">
                    {activeNeed === 'wealth' ? 'Wealth Planning' : 'Calculate Your Gap'}
                  </h4>
                </div>
                {formMap[activeNeed]}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom CTA ───────────────────────────────────────────── */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-4">
            Ready for a complete picture? Talk to a licensed BSQ advisor.
          </p>
          <motion.button
            onClick={() => window.open('https://m.me/Bstarquartzarea?ref=financial_assessment', '_blank')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl px-8 py-3.5 font-bold text-sm transition-all duration-200"
            style={{ boxShadow: '0 4px 20px rgba(220,38,38,0.3)' }}
          >
            <MessageCircle size={15} />
            Talk to a Financial Advisor
            <ArrowRight size={14} />
          </motion.button>
          <p className="text-[11px] text-gray-400 mt-3">No pressure · Free consultation · Personalized plan</p>
        </div>

      </div>
    </section>
  )
}
