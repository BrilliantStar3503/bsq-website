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
  // Solid white, not a translucent tint, for the white variant: at this
  // size (11px) WCAG AA needs 4.5:1 regardless of font-weight, and
  // white/85 on #D92D20 measures 3.85:1 — fails. The rule beside it is
  // decorative, not text, so it can stay translucent.
  const color = tone === 'white' ? '#ffffff' : '#D92D20'
  const ruleColor = tone === 'white' ? 'rgba(255,255,255,0.6)' : '#D92D20'
  return (
    <div className={`flex items-center gap-2.5 mb-5 ${align === 'center' ? 'justify-center' : ''}`}>
      <span style={{ width: 3, height: 20, background: ruleColor, borderRadius: 2 }} />
      <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color }}>
        {children}
      </span>
    </div>
  )
}
