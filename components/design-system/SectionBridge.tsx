'use client'

/* ── SectionBridge — PRUBSQ signature visual connector ──────────────────
   Visually connects two adjacent sections into one continuous composition.
   Renders a full-width organic curve that transitions from the upper
   section's background into the lower section's background.

   Reusable across Insurance Solutions, Assessment, Recruitment, Advisors,
   Products, and future landing pages.

   PRESENTATION ONLY — no logic, routing, navigation, data, or state.
──────────────────────────────────────────────────────────────────────── */

export interface SectionBridgeProps {
  fromColor?: string
  toColor?: string
  /** Height of the curve area in px */
  height?: number
  /** Optional thin accent line drawn along the curve */
  accent?: boolean
  accentColor?: string
}

export function SectionBridge({
  fromColor  = '#ffffff',
  toColor    = '#f5f5f5',
  height     = 72,
  accent     = false,
  accentColor = '#D92D20',
}: SectionBridgeProps) {
  /* Asymmetric organic arc: right side descends slightly earlier,
     giving the curve a natural hand-drawn character rather than
     a mechanical mirror. */
  const d   = `M0,0 L1440,0 L1440,${height * 0.08} C1200,${height * 0.98} 800,${height} 360,${height * 0.96} C160,${height * 0.93} 0,${height * 0.18} 0,${height * 0.08} Z`

  return (
    <div
      aria-hidden="true"
      style={{ background: toColor, lineHeight: 0, marginTop: -1, pointerEvents: 'none' }}
    >
      <svg
        viewBox={`0 0 1440 ${height}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height }}
      >
        {/* Upper section colour fills to the organic curve edge */}
        <path d={d} fill={fromColor} />

        {/* Optional premium accent curve */}
        {accent && (
          <path
            d={`M0,${height * 0.08} C160,${height * 0.93} 360,${height * 0.96} 800,${height} C1200,${height * 0.98} 1440,${height * 0.08} 1440,${height * 0.08}`}
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />
        )}
      </svg>
    </div>
  )
}
