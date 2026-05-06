'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  useAgentContact,
  getWhatsAppUrl,
} from '@/hooks/useAgentContact'

/* ═══════════════════════════════════════════════════════════════════════
   PREMIUM TABLES — exact PRU Life UK published rates. Do not estimate.
═══════════════════════════════════════════════════════════════════════ */
type Term = 5 | 10

interface TableData {
  label:   string
  SAs:     number[]
  payouts: number[]
  dbs:     number[]
  ages:    number[]
  prems:   number[][]
}

const TABLES: Record<Term, TableData> = {
  10: {
    label:   '10-Pay',
    SAs:     [150000, 200000, 250000, 500000, 1000000, 1500000, 2000000],
    payouts: [  7500,  10000,  12500,  25000,   50000,   75000,  100000],
    dbs:     [300000, 400000, 500000, 1000000, 2000000, 3000000, 4000000],
    ages:    [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
    prems: [
      [27475, 36500, 45525,  90650, 169210, 253615, 338020], // age 0
      [27738, 36850, 45963,  91525, 170910, 256165, 341420], // age 5
      [28000, 37200, 46400,  92400, 172600, 258700, 344800], // age 10
      [28383, 37710, 47038,  93675, 175500, 263050, 350600], // age 15
      [28765, 38220, 47675,  94950, 178400, 267400, 356400], // age 20
      [29331, 38974, 48618,  96835, 182900, 274150, 365400], // age 25
      [29896, 39728, 49560,  98720, 187400, 280900, 374400], // age 30
      [30516, 40554, 50593, 100785, 192400, 288400, 384400], // age 35
      [31135, 41380, 51625, 102850, 197400, 295900, 394400], // age 40
      [31885, 42380, 52875, 105350, 203400, 304900, 406400], // age 45
      [32635, 43380, 54125, 107850, 209400, 313900, 418400], // age 50
      [33292, 44256, 55220, 110040, 215250, 322675, 430100], // age 55
      [33949, 45132, 56315, 112230, 221100, 331450, 441800], // age 60
    ],
  },
  5: {
    label:   '5-Pay',
    SAs:     [250000, 500000, 1000000, 1500000, 2000000],
    payouts: [ 12500,  25000,   50000,   75000,  100000],
    dbs:     [500000, 1000000, 2000000, 3000000, 4000000],
    ages:    [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
    prems: [
      [ 84735, 169070, 331400, 496900, 662400], // age 0
      [ 85580, 170760, 334750, 501925, 669100], // age 5
      [ 86425, 172450, 338100, 506950, 675800], // age 10
      [ 87705, 175010, 343250, 514675, 686100], // age 15
      [ 88985, 177570, 348400, 522400, 696400], // age 20
      [ 90318, 180235, 354000, 530800, 707600], // age 25
      [ 91650, 182900, 359600, 539200, 718800], // age 30
      [ 92900, 185400, 365050, 547375, 729700], // age 35
      [ 94150, 187900, 370500, 555550, 740600], // age 40
      [ 95525, 190650, 376550, 564625, 752700], // age 45
      [ 96900, 193400, 382600, 573700, 764800], // age 50
      [ 98483, 196565, 389500, 584050, 778600], // age 55
      [100065, 199730, 396400, 594400, 792400], // age 60
    ],
  },
}

/* ═══════════════════════════════════════════════════════════════════════
   CALCULATION ENGINE
═══════════════════════════════════════════════════════════════════════ */
function getPrems(table: TableData, age: number): number[] {
  const ages = table.ages
  const a    = Math.min(Math.max(Math.round(age), ages[0]), ages[ages.length - 1])
  const ei   = ages.indexOf(a)
  if (ei !== -1) return [...table.prems[ei]]
  let lo = 0
  for (let i = 0; i < ages.length - 1; i++) {
    if (ages[i] <= a && ages[i + 1] >= a) { lo = i; break }
  }
  const hi = lo + 1
  const t  = (a - ages[lo]) / (ages[hi] - ages[lo])
  return table.prems[lo].map((v, i) => Math.round(v + t * (table.prems[hi][i] - v)))
}

interface PlanOption {
  sa:        number
  saLabel:   string
  prem:      number
  premMo:    number
  payout:    number
  payoutMo:  number
  db:        number
  totalPaid: number
}

interface PlanStats extends PlanOption {
  age:          number
  term:         Term
  startAge:     number
  premEndAge:   number
  payoutYrs:    number
  lifetime:     number
  roi:          string
  breakevenAge: number
}

interface MatchResult {
  tooLow:  boolean
  rec:     PlanOption | null
  up:      PlanOption | null
  minimum: PlanOption
  opts:    PlanOption[]
}

function buildOptions(age: number, term: Term): PlanOption[] {
  const tbl   = TABLES[term]
  const prems = getPrems(tbl, age)
  return tbl.SAs.map((sa, i) => ({
    sa,
    saLabel:  fmtM(sa),
    prem:     prems[i],
    premMo:   Math.round(prems[i] / 12),
    payout:   tbl.payouts[i],
    payoutMo: Math.round(tbl.payouts[i] / 12),
    db:       tbl.dbs[i],
    totalPaid: prems[i] * term,
  }))
}

function matchPlan(age: number, annBudget: number, term: Term): MatchResult {
  const opts = buildOptions(age, term)
  const aff  = opts.filter(o => o.prem <= annBudget)
  if (!aff.length) return { tooLow: true, minimum: opts[0], rec: null, up: null, opts }
  const rec  = aff[aff.length - 1]
  const recI = opts.indexOf(rec)
  const up   = recI < opts.length - 1 ? opts[recI + 1] : null
  return { tooLow: false, rec, up, minimum: opts[0], opts }
}

function recTerm(age: number, annBudget: number): Term {
  return annBudget >= buildOptions(age, 5)[0].prem ? 5 : 10
}

function computeStats(plan: PlanOption, age: number, term: Term): PlanStats {
  const startAge     = age + 6
  const premEndAge   = age + term
  const payoutYrs    = Math.max(0, 100 - startAge)
  const lifetime     = plan.payout * payoutYrs
  const roi          = (lifetime / plan.totalPaid).toFixed(1)
  const breakevenAge = startAge + Math.ceil(plan.totalPaid / plan.payout)
  return { ...plan, age, term, startAge, premEndAge, payoutYrs, lifetime, roi, breakevenAge }
}

/* ═══════════════════════════════════════════════════════════════════════
   FORMATTERS
═══════════════════════════════════════════════════════════════════════ */
function fmt(n: number): string {
  return '₱' + Math.round(n).toLocaleString('en-PH')
}
function fmtM(n: number): string {
  if (n >= 1_000_000) return '₱' + (n / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M'
  if (n >= 1_000)     return '₱' + (n / 1_000).toFixed(0) + 'K'
  return fmt(n)
}

/* ═══════════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════════ */
const PRU_RED  = '#D92D20'
const PRU_DARK = '#7f0000'
type Goal = 'income' | 'protection' | 'legacy'

const GOALS: { id: Goal; icon: string; title: string; sub: string }[] = [
  { id: 'income',     icon: '💰', title: 'Guaranteed Income',    sub: 'Reliable retirement income — zero market risk.' },
  { id: 'protection', icon: '🛡️', title: 'Family Protection',    sub: 'Financial security if anything happens to me.' },
  { id: 'legacy',     icon: '🌿', title: 'Legacy & Wealth',      sub: 'Build wealth that passes across generations.' },
]

/* ═══════════════════════════════════════════════════════════════════════
   LEAD MODAL
═══════════════════════════════════════════════════════════════════════ */
interface LeadModalProps {
  plan:    PlanStats | null
  goal:    Goal | null
  waUrl:   string | null          // agent-aware WhatsApp URL (from useAgentContact)
  onClose: () => void
}

function LeadModal({ plan, goal, waUrl, onClose }: LeadModalProps) {
  const [name,      setName]      = useState('')
  const [phone,     setPhone]     = useState('')
  const [email,     setEmail]     = useState('')
  const [bestTime,  setBestTime]  = useState('')
  const [error,     setError]     = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const n = name.trim()
    const p = phone.trim()
    if (!n)        { setError('Please enter your full name.'); return }
    if (p.length < 9) { setError('Please enter a valid mobile number.'); return }

    setSubmitting(true)

    // ── Build WhatsApp message ────────────────────────────────────────
    let msg  = `Hi! I used the PRULifetime Income planner and I'd like a personalized plan.\n\n`
    msg += `👤 *Name:* ${n}\n`
    msg += `📞 *Mobile:* +63 ${p}\n`
    if (email.trim()) msg += `📧 *Email:* ${email.trim()}\n`
    if (bestTime)     msg += `⏰ *Best time to call:* ${bestTime}\n`

    if (plan) {
      msg += `\n📊 *My Calculated Plan:*\n`
      msg += `• Age: ${plan.age}  |  Goal: ${goal ?? '—'}\n`
      msg += `• Budget: ${fmt(plan.premMo)}/month\n`
      msg += `• Plan: ${plan.term}-Pay · ${fmtM(plan.sa)} SA\n`
      msg += `• Annual Payout: ${fmt(plan.payout)}/year\n`
      msg += `• Death Benefit: ${fmtM(plan.db)}\n`
      msg += `• Income Starts: Age ${plan.startAge}\n`
    }

    msg += `\nPlease contact me. Thank you!`

    // ── POST to CRM (non-blocking — fire & forget) ────────────────────
    fetch('/api/pli-lead', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: n, phone: p, email: email.trim(), bestTime,
        plan: plan
          ? { age: plan.age, goal, term: plan.term, sa: plan.sa,
              payout: plan.payout, premMo: plan.premMo,
              db: plan.db, startAge: plan.startAge }
          : null,
        utm: typeof window !== 'undefined'
          ? Object.fromEntries(new URLSearchParams(window.location.search))
          : {},
      }),
    }).catch(() => {/* silent */})

    // ── Open WhatsApp ─────────────────────────────────────────────────
    const base = waUrl ?? 'https://wa.me/639178232799'
    const dest = base.includes('?')
      ? `${base}&text=${encodeURIComponent(msg)}`
      : `${base}?text=${encodeURIComponent(msg)}`
    window.open(dest, '_blank')

    setSubmitting(false)
    onClose()
  }

  const inputCls =
    'w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-base font-medium ' +
    'text-gray-900 placeholder-gray-300 bg-gray-50 focus:outline-none transition-colors'

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl"
        style={{ animation: 'pliSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Red header */}
        <div
          className="px-7 pt-7 pb-5 relative"
          style={{ background: `linear-gradient(135deg, ${PRU_DARK}, ${PRU_RED})` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-white/60 hover:text-white text-2xl leading-none transition-colors"
            aria-label="Close"
          >×</button>
          <p className="text-[10px] font-bold tracking-[3px] uppercase text-white/60 mb-1">Free Consultation</p>
          <h3 className="text-xl font-black text-white leading-tight">Let's Build Your Plan Together</h3>
          <p className="text-sm text-white/70 mt-1.5 leading-relaxed">
            A licensed PRU Life advisor will reach out — no pressure, no jargon.
          </p>
        </div>

        {/* Plan snapshot */}
        {plan && (
          <div className="mx-7 mt-5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Your Calculated Plan</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <span className="text-gray-400">Annual Payout</span>
              <span className="font-black" style={{ color: PRU_RED }}>{fmt(plan.payout)}/year</span>
              <span className="text-gray-400">Sum Assured</span>
              <span className="font-semibold text-gray-800">{fmtM(plan.sa)}</span>
              <span className="text-gray-400">Death Benefit</span>
              <span className="font-semibold text-emerald-600">{fmtM(plan.db)}</span>
              <span className="text-gray-400">Plan</span>
              <span className="font-semibold text-gray-800">{plan.term}-Pay · Age {plan.age}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 pb-7 pt-5 space-y-4" noValidate>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Full Name *</label>
            <input
              type="text" required value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Juan dela Cruz" autoComplete="name"
              className={inputCls}
              onFocus={e  => (e.target.style.borderColor = PRU_RED)}
              onBlur={e   => (e.target.style.borderColor = name  ? '#86efac' : '#f3f4f6')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Mobile Number *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm select-none">+63</span>
              <input
                type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="917 123 4567" autoComplete="tel"
                className={`${inputCls} pl-12`}
                onFocus={e => (e.target.style.borderColor = PRU_RED)}
                onBlur={e  => (e.target.style.borderColor = phone ? '#86efac' : '#f3f4f6')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Email{' '}
              <span className="text-gray-400 font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com" autoComplete="email"
              className={inputCls}
              onFocus={e => (e.target.style.borderColor = PRU_RED)}
              onBlur={e  => (e.target.style.borderColor = email ? '#86efac' : '#f3f4f6')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Best Time to Call</label>
            <select
              value={bestTime} onChange={e => setBestTime(e.target.value)}
              className={inputCls}
              onFocus={e => (e.target.style.borderColor = PRU_RED)}
              onBlur={e  => (e.target.style.borderColor = '#f3f4f6')}
            >
              <option value="">Any time is fine</option>
              <option>Morning (8AM – 12PM)</option>
              <option>Afternoon (12PM – 5PM)</option>
              <option>Evening (5PM – 8PM)</option>
              <option>Weekends only</option>
            </select>
          </div>

          {error && (
            <p className="text-sm font-semibold" style={{ color: PRU_RED }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 text-white font-black text-base rounded-xl transition-all"
            style={{
              background:  submitting ? '#d1d5db' : `linear-gradient(135deg, ${PRU_DARK}, ${PRU_RED})`,
              cursor:      submitting ? 'not-allowed' : 'pointer',
              boxShadow:   submitting ? 'none' : '0 8px 24px rgba(217,45,32,0.3)',
            }}
          >
            {submitting ? 'Sending…' : 'Send via WhatsApp →'}
          </button>
          <p className="text-center text-xs text-gray-400 leading-snug">
            Sent directly to your advisor's WhatsApp · No spam, ever.
          </p>
        </form>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   PLANNER FORM (3 inputs + calculate)
═══════════════════════════════════════════════════════════════════════ */
interface PlannerFormProps {
  onResults: (stats: PlanStats, goal: Goal) => void
}

function PlannerForm({ onResults }: PlannerFormProps) {
  const [age,     setAge]     = useState('')
  const [budget,  setBudget]  = useState('')
  const [goal,    setGoal]    = useState<Goal | null>(null)
  const [ageHint, setAgeHint] = useState('')
  const [budgetStatus, setBudgetStatus] = useState<'idle' | 'low' | 'ok'>('idle')
  const [budgetHint,   setBudgetHint]   = useState('')

  const ageNum    = parseInt(age)
  const budgetNum = parseFloat(budget)
  const ageOk     = !isNaN(ageNum) && ageNum >= 0 && ageNum <= 60

  /* Age hint ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!ageOk) { setAgeHint(''); return }
    if (ageNum < 30)      setAgeHint(`At ${ageNum}, time is your biggest advantage — lower premiums, more lifetime income.`)
    else if (ageNum < 45) setAgeHint(`At ${ageNum}, you're in peak earning years. Lock in guaranteed income now.`)
    else if (ageNum < 55) setAgeHint(`At ${ageNum}, income starts at age ${ageNum + 6} — just ${6} years away.`)
    else                  setAgeHint(`At ${ageNum}, guaranteed income starting at age ${ageNum + 6} is achievable.`)
  }, [age, ageOk, ageNum])

  /* Budget validation against actual plan minimums ───────────── */
  useEffect(() => {
    if (!ageOk || isNaN(budgetNum) || budgetNum <= 0) {
      setBudgetStatus('idle')
      setBudgetHint(ageOk ? `Minimum ≈ ${fmt(buildOptions(ageNum, 10)[0].premMo)}/month for age ${ageNum}` : '')
      return
    }
    const annual  = budgetNum * 12
    const minOpts = buildOptions(ageNum, 10)   // 10-Pay is always the cheaper floor
    const minMo   = minOpts[0].premMo

    if (budgetNum < minMo) {
      setBudgetStatus('low')
      setBudgetHint(
        `Below minimum. For age ${ageNum}: ${fmt(minOpts[0].prem)}/year (${fmt(minMo)}/month) — 10-Pay, ₱150K SA.`
      )
    } else {
      const term  = recTerm(ageNum, annual)
      const match = matchPlan(ageNum, annual, term)
      if (match.rec) {
        setBudgetStatus('ok')
        setBudgetHint(
          `✓ Qualifies for ${match.rec.saLabel} SA · ${TABLES[term].label} · ${fmt(match.rec.payout)}/year guaranteed for life`
        )
      }
    }
  }, [age, budget, ageOk, ageNum, budgetNum])

  const budgetOk     = budgetStatus === 'ok'
  const canCalculate = ageOk && budgetOk && goal !== null

  function handleCalculate() {
    if (!canCalculate) return
    const annual = budgetNum * 12
    const term   = recTerm(ageNum, annual)
    const match  = matchPlan(ageNum, annual, term)
    if (!match.rec) return   // guard (shouldn't happen if budgetOk)
    onResults(computeStats(match.rec, ageNum, term), goal!)
  }

  const inputBase =
    'w-full border-2 rounded-xl px-5 py-4 text-2xl font-bold text-gray-900 ' +
    'placeholder-gray-300 bg-gray-50 focus:outline-none transition-colors'

  return (
    <div className="space-y-7">

      {/* ── Age ── */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          How old are you?
          <span className="text-gray-400 font-normal ml-1.5 text-xs">Ages 0 – 60</span>
        </label>
        <div className="relative">
          <input
            type="number" min={0} max={60} value={age}
            onChange={e => setAge(e.target.value)}
            placeholder="e.g. 35"
            className={`${inputBase} pr-24`}
            style={{ borderColor: ageOk ? '#86efac' : age ? '#fca5a5' : '#f3f4f6' }}
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold select-none">
            years old
          </span>
        </div>
        {ageHint && <p className="text-sm text-gray-500 mt-2">{ageHint}</p>}
      </div>

      {/* ── Monthly Budget ── */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Monthly budget?
          <span className="text-gray-400 font-normal ml-1.5 text-xs">Sets your coverage &amp; income</span>
        </label>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-2xl select-none">₱</span>
          <input
            type="number" min={2290} value={budget}
            onChange={e => setBudget(e.target.value)}
            placeholder="e.g. 5,000"
            className={`${inputBase} pl-10`}
            style={{
              borderColor:
                budgetStatus === 'ok'  ? '#86efac' :
                budgetStatus === 'low' ? '#fca5a5' : '#f3f4f6',
            }}
          />
        </div>
        {budgetHint && (
          <div className={`text-sm mt-2 leading-snug font-medium ${
            budgetStatus === 'low' ? 'text-red-500' :
            budgetStatus === 'ok'  ? 'text-emerald-600' : 'text-gray-400'
          }`}>
            {budgetStatus === 'low' && '⚠️ '}
            {budgetHint}
            {budgetStatus === 'low' && (
              <span className="block text-gray-400 font-normal text-xs mt-0.5">
                A different product may be better suited. Ask your advisor.
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Goal ── */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">What matters most to you?</label>
        <div className="grid grid-cols-3 gap-3">
          {GOALS.map(g => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGoal(g.id)}
              className="rounded-xl p-4 text-left border-2 transition-all"
              style={{
                borderColor: goal === g.id ? PRU_RED : '#f3f4f6',
                background:  goal === g.id ? '#fff5f5' : '#f9fafb',
              }}
            >
              <div className="text-2xl mb-2">{g.icon}</div>
              <div className="text-sm font-bold text-gray-800 leading-tight">{g.title}</div>
              <div className="text-xs text-gray-400 mt-1 leading-snug hidden sm:block">{g.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Calculate ── */}
      <button
        type="button"
        onClick={handleCalculate}
        disabled={!canCalculate}
        className="w-full py-4 text-base font-black rounded-xl transition-all"
        style={{
          background:  canCalculate ? `linear-gradient(135deg, ${PRU_DARK}, ${PRU_RED})` : '#e5e7eb',
          color:       canCalculate ? '#fff' : '#9ca3af',
          cursor:      canCalculate ? 'pointer' : 'not-allowed',
          boxShadow:   canCalculate ? '0 8px 24px rgba(217,45,32,0.3)' : 'none',
        }}
      >
        See My Personalized Plan →
      </button>
      {!canCalculate && (
        <p className="text-center text-xs text-gray-400 -mt-3">
          {!ageOk ? 'Enter your age to continue'
            : !budgetOk ? 'Enter a valid monthly budget to continue'
            : 'Select your goal above to continue'}
        </p>
      )}

      <p className="text-center text-[11px] text-gray-400">
        Based on official PRU Life UK rate tables · Illustration purposes only
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   RESULTS SECTION
═══════════════════════════════════════════════════════════════════════ */
interface ResultsProps {
  stats:     PlanStats
  goal:      Goal
  onAdvisor: () => void
  onReset:   () => void
}

function ResultsSection({ stats, goal, onAdvisor, onReset }: ResultsProps) {
  const goalLabel = { income: 'Income Plan', protection: 'Protection Plan', legacy: 'Legacy Plan' }[goal]

  const emotional = {
    income:
      `You're <strong>${stats.age} years old</strong>. At <strong>age ${stats.startAge}</strong>, ` +
      `${fmt(stats.payoutMo)}/month begins — and <strong>never stops.</strong>`,
    protection:
      `If anything happens to you, your family receives <strong>${fmtM(stats.db)}</strong> — guaranteed. ` +
      `While you're here, you collect <strong>${fmt(stats.payoutMo)}/month for life.</strong>`,
    legacy:
      `Your <strong>${fmtM(stats.sa)} coverage</strong> doubles to <strong>${fmtM(stats.db)}</strong> ` +
      `on transfer — and can reach three generations. One decision. A legacy that outlives you.`,
  }[goal]

  const ctaHeadline = {
    income:     `Your ${fmt(stats.payoutMo)}/month income is ready to lock in.`,
    protection: `Protect your family with ${fmtM(stats.db)} — guaranteed.`,
    legacy:     'Start your 3-generation legacy today.',
  }[goal]

  const timeline = [
    {
      age:  `Age ${stats.age} (Today)`,
      text: `Start your <strong>${stats.term}-Pay</strong> plan. Annual premium: <strong>${fmt(stats.prem)}</strong>.`,
    },
    {
      age:  `Age ${stats.startAge}`,
      text: `<strong>${fmt(stats.payout)}/year</strong> guaranteed income begins — <strong>for life.</strong>`,
    },
    {
      age:  `Age ${stats.premEndAge}`,
      text: `Final premium paid. You owe nothing more — ever. Income continues forever.`,
    },
    {
      age:  `Age ${stats.breakevenAge}`,
      text: `You've received back everything you paid in. <strong>Every peso after this is pure gain.</strong>`,
    },
    {
      age:  'Age 100',
      text: `Total lifetime payouts: <strong>${fmtM(stats.lifetime)}</strong> · ${stats.roi}× return on premiums paid. ` +
            `Death benefit: <strong>${fmtM(stats.db)}</strong> to your family.`,
    },
  ]

  const statCards = [
    { icon: '📅', label: 'Annual Premium',  value: fmt(stats.prem),   sub: `${fmt(stats.premMo)}/month`,            color: PRU_RED },
    { icon: '🏦', label: 'Sum Assured',     value: fmtM(stats.sa),    sub: `${stats.term}-Pay plan`,                color: '#1f2937' },
    { icon: '💵', label: 'Annual Payout',   value: fmt(stats.payout), sub: `${fmt(stats.payoutMo)}/month · for life`, color: PRU_RED },
    { icon: '💎', label: 'Death Benefit',   value: fmtM(stats.db),    sub: '200% guaranteed',                       color: '#059669' },
  ]

  return (
    <div className="space-y-4">

      {/* ── Hero card ── */}
      <div
        className="rounded-2xl p-8 text-center text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PRU_DARK}, ${PRU_RED})` }}
      >
        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-60 h-60 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-block bg-white/20 text-[10px] font-black tracking-[3px] uppercase px-3.5 py-1.5 rounded-full mb-4">
            Your {goalLabel}
          </span>
          <p className="text-sm text-white/70 mb-1">Guaranteed annual income</p>
          <div
            className="font-black text-white leading-none mb-1"
            style={{ fontSize: 'clamp(40px,9vw,64px)', letterSpacing: '-1px' }}
          >
            {fmt(stats.payout)}
          </div>
          <p className="text-sm text-white/70 mb-6">
            {fmt(stats.payoutMo)}/month · starting age {stats.startAge} · guaranteed for life
          </p>
          <div className="bg-black/25 rounded-xl px-5 py-4 text-sm text-white/90 leading-relaxed italic text-left">
            <span dangerouslySetInnerHTML={{ __html: emotional }} />
          </div>
        </div>
      </div>

      {/* ── Core numbers ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Your Numbers</h3>
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4">
              <div className="text-xl mb-1.5">{s.icon}</div>
              <div className="text-xs text-gray-400 mb-1">{s.label}</div>
              <div className="text-lg font-black leading-tight" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 leading-relaxed">
          <span className="font-bold text-gray-800">What this means: </span>
          {{
            income:
              `Pay ${fmt(stats.prem)}/year for ${stats.term} years — then receive ${fmt(stats.payout)}/year for life. ` +
              `Guaranteed. No market conditions apply.`,
            protection:
              `Your family receives ${fmtM(stats.db)} guaranteed — while you still collect ${fmt(stats.payout)}/year for life.`,
            legacy:
              `A ${fmtM(stats.sa)} coverage base that doubles to ${fmtM(stats.db)} at transfer. Three generations can build on this.`,
          }[goal]}
        </div>
      </div>

      {/* ── Income timeline ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Income Timeline</h3>
        <div className="relative">
          <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-gray-100" />
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-4 mb-5 last:mb-0">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 z-10 border-2 border-white"
                style={{ background: PRU_RED, boxShadow: `0 0 0 2px #fecaca` }}
              />
              <div>
                <p className="text-xs font-black mb-0.5" style={{ color: PRU_RED }}>{item.age}</p>
                <p
                  className="text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Breakeven Age</p>
            <p className="text-xl font-black" style={{ color: PRU_RED }}>Age {stats.breakevenAge}</p>
            <p className="text-xs text-gray-400">pure gain after this</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total Lifetime Payouts</p>
            <p className="text-xl font-black text-emerald-600">{fmtM(stats.lifetime)}</p>
            <p className="text-xs text-gray-400">{stats.roi}× return · to age 100</p>
          </div>
        </div>
      </div>

      {/* ── 3-Gen legacy ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">3-Generation Impact</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '👤',     gen: '1st Gen', name: 'You',           value: fmtM(stats.lifetime),              sub: `Lifetime income\nAge ${stats.startAge}–100` },
            { icon: '👨‍👩‍👧', gen: '2nd Gen', name: 'Your children', value: fmtM(stats.db),                    sub: 'Death benefit\n200% guaranteed' },
            { icon: '👶',     gen: '3rd Gen', name: 'Grandchildren', value: fmtM(Math.round(stats.db * 1.3)) + '+', sub: 'Wealth grown\n& transferred' },
          ].map((g, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{g.icon}</div>
              <div className="text-[9px] font-black tracking-widest uppercase mb-0.5" style={{ color: PRU_RED }}>{g.gen}</div>
              <div className="text-xs font-semibold text-gray-700 mb-1.5 leading-tight">{g.name}</div>
              <div className="text-sm font-extrabold text-gray-900 mb-1 leading-tight">{g.value}</div>
              <div className="text-[10px] text-gray-400 whitespace-pre-line leading-snug">{g.sub}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 leading-relaxed">
          🌿 The <strong>{fmtM(stats.db)} death benefit</strong> passes to your children — who protect and grow it for your grandchildren.
          <strong> One decision. Three generations of impact.</strong>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="rounded-2xl px-7 py-8 text-center" style={{ background: '#111' }}>
        <h3 className="text-xl font-black text-white mb-2">{ctaHeadline}</h3>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          A licensed PRU Life advisor will finalize your plan — no jargon, no pressure.
        </p>
        <button
          onClick={onAdvisor}
          className="w-full py-4 text-white font-black text-base rounded-xl transition-all"
          style={{
            background: `linear-gradient(135deg, ${PRU_DARK}, ${PRU_RED})`,
            boxShadow:  '0 8px 24px rgba(217,45,32,0.4)',
          }}
        >
          Talk to a PRU Life Advisor →
        </button>
        <p className="text-xs text-gray-500 mt-3">Free consultation · No obligation · No commitment</p>
      </div>

      {/* ── Recalculate ── */}
      <div className="text-center pb-2">
        <button
          onClick={onReset}
          className="text-sm text-gray-400 underline hover:text-gray-700 transition-colors"
        >
          ← Recalculate with different numbers
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export default function PruLifetimePlanner() {
  const [stats,     setStats]     = useState<PlanStats | null>(null)
  const [goal,      setGoal]      = useState<Goal | null>(null)
  const [showModal, setShowModal] = useState(false)
  const resultsRef                = useRef<HTMLDivElement>(null)

  // Agent-aware WhatsApp URL (respects ?agent_id= UTM param)
  const { contact } = useAgentContact()
  const waUrl = getWhatsAppUrl(contact) ?? 'https://wa.me/639178232799'

  const handleResults = useCallback((s: PlanStats, g: Goal) => {
    setStats(s)
    setGoal(g)
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }, [])

  const handleReset = useCallback(() => {
    setStats(null)
    setGoal(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <style>{`
        @keyframes pliSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pliRise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ══ Hero ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-16 px-6"
        style={{ background: `linear-gradient(160deg, #1a0000 0%, ${PRU_RED} 65%, #c41c0c 100%)` }}
      >
        {/* Decorative glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle at 75% 15%, #fff 0%, transparent 55%)' }}
        />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <span className="inline-block bg-white/15 text-white text-xs font-black tracking-[3px] uppercase px-4 py-2 rounded-full mb-6">
            Guaranteed · No Market Risk · PRU Life UK Philippines
          </span>

          <h1
            className="font-black text-white leading-none mb-4"
            style={{ fontSize: 'clamp(36px, 7vw, 60px)', letterSpacing: '-1.5px' }}
          >
            Never Outlive<br />Your Money.
          </h1>

          <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed max-w-lg mx-auto">
            Guaranteed income for life. Double the benefit for your family.
            Pay 5 or 10 years — then collect forever.
          </p>

          {/* Trust stats bar */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-8 max-w-sm mx-auto">
            {[
              { stat: '5%',    label: 'Annual payout' },
              { stat: '200%',  label: 'Death benefit' },
              { stat: '3 Gen', label: 'Wealth transfer' },
              { stat: '₱0',    label: 'Market risk' },
            ].map((t, i) => (
              <div key={i} className="bg-white/10 rounded-xl py-3 px-1 text-center">
                <div className="font-black text-white text-base sm:text-lg leading-none mb-1">{t.stat}</div>
                <div className="text-white/55 text-[9px] sm:text-[10px] leading-tight">{t.label}</div>
              </div>
            ))}
          </div>

          <a
            href="#pli-planner"
            className="inline-flex items-center gap-2 bg-white font-bold text-sm px-6 py-3 rounded-full transition-all hover:bg-gray-50 hover:shadow-lg"
            style={{ color: PRU_RED }}
          >
            Calculate My Income ↓
          </a>
        </div>
      </section>

      {/* ══ Planner / Results ════════════════════════════════════════ */}
      <section id="pli-planner" className="py-14 px-6" style={{ background: '#f5f5f7' }}>
        <div className="max-w-lg mx-auto">

          {/* Section header */}
          <div className="text-center mb-8">
            <p className="text-xs font-black tracking-[3px] uppercase mb-2" style={{ color: PRU_RED }}>
              Free Planner
            </p>
            <h2
              className="font-black text-gray-900 mb-2"
              style={{ fontSize: 'clamp(28px, 5vw, 42px)', letterSpacing: '-0.5px' }}
            >
              {stats ? 'Your Personalized Plan' : "See Exactly What\nYou'll Receive"}
            </h2>
            <p className="text-gray-500 text-sm">
              {stats
                ? 'Based on official PRU Life UK published rates.'
                : 'Answer 3 questions. Get your guaranteed income projection.'}
            </p>
          </div>

          {/* Form */}
          {!stats && (
            <div
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100"
              style={{ animation: 'pliRise 0.4s ease' }}
            >
              <PlannerForm onResults={handleResults} />
            </div>
          )}

          {/* Results */}
          {stats && goal && (
            <div ref={resultsRef} style={{ animation: 'pliRise 0.4s ease' }}>
              <ResultsSection
                stats={stats}
                goal={goal}
                onAdvisor={() => setShowModal(true)}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </section>

      {/* ══ Disclaimer ═══════════════════════════════════════════════ */}
      <div className="px-6 pb-10 text-center">
        <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
          For illustration purposes only. Actual figures are subject to underwriting approval
          and policy terms and conditions. PRU Life Insurance Corporation of U.K. Philippines.
        </p>
      </div>

      {/* ══ Lead Modal ═══════════════════════════════════════════════ */}
      {showModal && (
        <LeadModal
          plan={stats}
          goal={goal}
          waUrl={waUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
