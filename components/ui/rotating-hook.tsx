'use client'

import { useState, useEffect, useRef } from 'react'

const HOOKS = [
  "What does AI say about your financial protection?",
  "AI can detect financial risks you might be missing…",
  "Get your personalized financial score—powered by AI.",
  "In 60 seconds, AI reveals your financial gaps.",
  "Most families are underprotected. Are you one of them? Let AI check.",
  "AI analyzed thousands of cases—see where you stand.",
  "Your finances are unique. See what AI recommends for you.",
  "Are you financially secure… or just assuming? Ask AI.",
  "This AI uncovers hidden risks in your income, health, and future.",
  "Smart decisions start with data. Get your AI financial insight now.",
]

const TYPE_SPEED   = 30   // ms per character (typing)
const DELETE_SPEED = 15   // ms per character (deleting — faster feels snappy)
const PAUSE_AFTER  = 1400 // ms to hold full sentence before deleting
const PAUSE_BEFORE = 300  // ms pause between delete and next hook

export default function RotatingHook() {
  const [display, setDisplay]   = useState('')
  const [hookIdx, setHookIdx]   = useState(0)
  const [phase, setPhase]       = useState<'typing' | 'pausing' | 'deleting' | 'waiting'>('typing')
  const [cursor, setCursor]     = useState(true)
  const pausedRef               = useRef(false)
  const timerRef                = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Blinking cursor — independent 530ms interval ── */
  useEffect(() => {
    const id = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(id)
  }, [])

  /* ── Typewriter state machine ── */
  useEffect(() => {
    const hook = HOOKS[hookIdx]

    const clear = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }

    const schedule = (fn: () => void, delay: number) => {
      clear()
      timerRef.current = setTimeout(() => {
        if (!pausedRef.current) fn()
        else {
          // if paused, retry every 80ms until unpaused
          const retry = setInterval(() => {
            if (!pausedRef.current) { clearInterval(retry); fn() }
          }, 80)
        }
      }, delay)
    }

    if (phase === 'typing') {
      if (display.length < hook.length) {
        schedule(() => setDisplay(hook.slice(0, display.length + 1)), TYPE_SPEED)
      } else {
        setPhase('pausing')
      }
    }

    if (phase === 'pausing') {
      schedule(() => setPhase('deleting'), PAUSE_AFTER)
    }

    if (phase === 'deleting') {
      if (display.length > 0) {
        schedule(() => setDisplay(d => d.slice(0, -1)), DELETE_SPEED)
      } else {
        setPhase('waiting')
      }
    }

    if (phase === 'waiting') {
      schedule(() => {
        setHookIdx(i => (i + 1) % HOOKS.length)
        setPhase('typing')
      }, PAUSE_BEFORE)
    }

    return clear
  }, [display, phase, hookIdx])

  /* ── Hover: pause / resume ── */
  const handleMouseEnter = () => { pausedRef.current = true }
  const handleMouseLeave = () => { pausedRef.current = false }

  return (
    /*
     * ── Layout-shift fix ────────────────────────────────────────────────
     * display:block + minHeight reserves space for 3 lines of text
     * (3 × leading-tight 1.25 = 3.75em), relative to the <h1> font-size.
     * This prevents any vertical reflow of elements below as text grows
     * or shrinks during the typewriter cycle.
     */
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={HOOKS[hookIdx]}
      aria-live="polite"
      style={{ display: 'block', minHeight: '3.75em' }}
    >
      {display}
      <span
        aria-hidden
        style={{
          display:       'inline-block',
          width:         '3px',
          marginLeft:    '2px',
          verticalAlign: 'text-bottom',
          opacity:       cursor ? 1 : 0,
          transition:    'opacity 0.1s',
          background:    'currentColor',
          height:        '0.85em',
          borderRadius:  '1px',
        }}
      />
    </span>
  )
}
