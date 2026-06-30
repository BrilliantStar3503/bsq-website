'use client'

/* ── Shared section kicker — label + accent rule, used above every
   major section heading. Extracted for consistency: before this, the
   pattern was hand-copied per section with small drift in spacing/
   sizing. One definition now, reusable by future experiences. ────── */
export function SectionEyebrow({
  children,
  tone = 'red',
  align = 'left',
}: {
  children: React.ReactNode
  tone?: 'red' | 'white'
  align?: 'left' | 'center'
}) {
  const color = tone === 'white' ? 'rgba(255,255,255,0.85)' : '#D92D20'
  const ruleColor = tone === 'white' ? 'rgba(255,255,255,0.6)' : '#D92D20'
  return (
    <div className={`flex items-center gap-2.5 mb-5 ${align === 'center' ? 'justify-center' : ''}`}>
      <span style={{ width: 28, height: 1.5, background: ruleColor, borderRadius: 1 }} />
      <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color }}>
        {children}
      </span>
    </div>
  )
}
