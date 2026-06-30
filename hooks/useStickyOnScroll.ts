'use client'

import { useEffect, useRef, useState } from 'react'

/* ── Manual "stick on scroll" — CSS `position: sticky` doesn't work in
   this app because html/body set `overflow-x: hidden` without an
   explicit overflow-y, which forces an implicit overflow-y: auto and
   breaks sticky's containing-block resolution. The existing
   PruLifeHeader works around this the same way: position: fixed +
   a scroll-tracked boolean. This hook generalizes that pattern.

   Returns a sentinel ref to place where the element naturally sits,
   and `stuck` — true once that sentinel has scrolled past `topOffset`.
──────────────────────────────────────────────────────────────────── */
export function useStickyOnScroll(topOffset: number) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: `-${topOffset + 1}px 0px 0px 0px`, threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [topOffset])

  return { sentinelRef, stuck }
}
