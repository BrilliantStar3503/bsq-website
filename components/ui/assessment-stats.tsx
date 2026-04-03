'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, ClipboardList, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Static data (swap for real API later) ────────────────────────── */
export const SITE_STATS = {
  assessments:      4_283,
  siteVisitors:     12_740,
  satisfactionRate: 87,        // percent
}

/* ─── Animated count-up hook ───────────────────────────────────────── */
function useCountUp(target: number, duration = 1600, startDelay = 0) {
  const [value, setValue] = useState(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start: number | null = null
      const tick = (ts: number) => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3) // easeOutCubic
        setValue(Math.round(ease * target))
        if (progress < 1) raf.current = requestAnimationFrame(tick)
      }
      raf.current = requestAnimationFrame(tick)
    }, startDelay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf.current)
    }
  }, [target, duration, startDelay])

  return value
}

/* ─── Number formatter ─────────────────────────────────────────────── */
function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : String(n)
}

/* ─────────────────────────────────────────────────────────────────────
   VARIANT A — Hero pill row (dark background)
   Used on homepage hero section below the CTA buttons
───────────────────────────────────────────────────────────────────── */
export function HeroStatsPills({ className }: { className?: string }) {
  const assessments = useCountUp(SITE_STATS.assessments, 1800, 200)
  const visitors    = useCountUp(SITE_STATS.siteVisitors, 2000, 400)
  const rate        = useCountUp(SITE_STATS.satisfactionRate, 1200, 600)

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Pill
        icon={<ClipboardList size={11} />}
        value={`${fmt(assessments)} assessments`}
        sub="taken"
        accent="#D92D20"
      />
      <Pill
        icon={<Users size={11} />}
        value={`${fmt(visitors)} visitors`}
        sub="this month"
        accent="#a78bfa"
      />
      <Pill
        icon={<TrendingUp size={11} />}
        value={`${rate}% found clarity`}
        sub="after results"
        accent="#B42318"
      />
    </div>
  )
}

function Pill({
  icon, value, sub, accent,
}: { icon: React.ReactNode; value: string; sub: string; accent: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
      style={{
        background: `${accent}12`,
        border:     `1px solid ${accent}25`,
        color:      `${accent}dd`,
      }}
    >
      <span style={{ color: accent }}>{icon}</span>
      {value}
      <span style={{ color: `${accent}70` }}>· {sub}</span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   VARIANT B — Assessment trust strip (dark, inline)
   Used below the assessment header bar while answering questions
───────────────────────────────────────────────────────────────────── */
export function AssessmentTrustStrip({ className }: { className?: string }) {
  const count = useCountUp(SITE_STATS.assessments, 1600, 300)

  return (
    <div className={cn('flex items-center justify-center gap-3', className)}>
      {/* Live dot */}
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block rounded-full"
          style={{ width: 5, height: 5, background: '#D92D20', boxShadow: '0 0 6px rgba(217,45,32,0.6)', animation: 'pulse 2s ease-in-out infinite' }}
        />
        <span className="text-[10px] text-white/30 tracking-widest uppercase font-medium">Live</span>
      </span>

      <span className="text-white/10">·</span>

      <span className="text-[10px] text-white/30">
        <span className="text-white/50 font-semibold tabular-nums">{fmt(count)}</span>
        {' '}people have taken this assessment
      </span>

      <span className="text-white/10">·</span>

      <span className="text-[10px] text-white/30">
        <span className="text-white/50 font-semibold">{SITE_STATS.satisfactionRate}%</span>
        {' '}found their coverage gaps
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   VARIANT C — Results page context bar (light background)
   Used at the top of the results screen
───────────────────────────────────────────────────────────────────── */
export function ResultsStatsBanner({ className }: { className?: string }) {
  const assessments = useCountUp(SITE_STATS.assessments, 1600, 100)
  const visitors    = useCountUp(SITE_STATS.siteVisitors, 1800, 300)

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-6 rounded-2xl px-6 py-4',
        className,
      )}
      style={{
        background:  'linear-gradient(135deg, #0f172a, #1e293b)',
        border:      '1px solid rgba(255,255,255,0.07)',
        boxShadow:   '0 1px 8px rgba(0,0,0,0.06)',
      }}
    >
      <StatItem
        icon={<ClipboardList size={14} />}
        count={fmt(assessments)}
        label="Assessments Taken"
        accent="#D92D20"
      />
      <Divider />
      <StatItem
        icon={<Users size={14} />}
        count={fmt(visitors)}
        label="Site Visitors"
        accent="#a78bfa"
      />
      <Divider />
      <StatItem
        icon={<TrendingUp size={14} />}
        count={`${SITE_STATS.satisfactionRate}%`}
        label="Found Their Gaps"
        accent="#B42318"
      />
    </div>
  )
}

function StatItem({
  icon, count, label, accent,
}: { icon: React.ReactNode; count: string; label: string; accent: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${accent}15`, color: accent }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-white tabular-nums leading-none">{count}</p>
        <p className="text-[10px] text-white/40 mt-0.5 leading-none">{label}</p>
      </div>
    </div>
  )
}

function Divider() {
  return <div className="hidden sm:block w-px h-6 bg-white/10" />
}
