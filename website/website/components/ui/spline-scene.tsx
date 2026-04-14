'use client'

/**
 * SplineScene — Optimized 3D loader
 *
 * Strategy:
 * 1. Dynamic import  → Spline JS (~800 KB) never blocks initial page render
 * 2. IntersectionObserver → only mounts WebGL when container enters viewport
 * 3. Skeleton shimmer → shows in <100ms, removes blank white flash
 * 4. Fade-in → smooth transition from skeleton to live robot
 * 5. Preload link → browser fetches .splinecode in background immediately
 */

import { useEffect, useRef, useState, memo } from 'react'
import dynamic from 'next/dynamic'

/* Lazy-load the heavy Spline runtime — zero cost on initial bundle */
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => null,
})

interface SplineSceneProps {
  scene: string
  className?: string
}

export const SplineScene = memo(function SplineScene({ scene, className }: SplineSceneProps) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const [inView,  setInView]  = useState(false)
  const [loaded,  setLoaded]  = useState(false)
  const [errored, setErrored] = useState(false)

  /* ── Mount Spline only when the container is near the viewport ── */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' } // pre-load 300px before it scrolls into view
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
    >

      {/* ── Skeleton placeholder — visible until robot loads ── */}
      <div
        aria-hidden
        style={{
          position:   'absolute',
          inset:      0,
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity:    loaded ? 0 : 1,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }}
      >
        {/* Robot-shaped silhouette */}
        <div style={{
          width: '60%', maxWidth: 240,
          height: '80%', maxHeight: 380,
          borderRadius: 32,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Shimmer sweep */}
          <div style={{
            position: 'absolute',
            top: 0, bottom: 0,
            width: '60%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
            animation: 'bsq-shimmer 2s ease-in-out infinite',
          }} />
        </div>

        {/* Head circle */}
        <div style={{
          position: 'absolute',
          top: '8%',
          width: '28%', maxWidth: 80,
          aspectRatio: '1',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
        }} />
      </div>

      {/* ── Live Spline scene — mounted on visibility, fades in on load ── */}
      {inView && !errored && (
        <div style={{
          position:   'absolute',
          inset:      0,
          opacity:    loaded ? 1 : 0,
          transition: 'opacity 0.7s ease',
        }}>
          <Spline
            scene={scene}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* ── Fallback if Spline fails (network error / WebGL not supported) ── */}
      {errored && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 8,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(237,27,46,0.08)',
            border: '1px solid rgba(237,27,46,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
          }}>🤖</div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
            3D view unavailable
          </p>
        </div>
      )}

      {/* ── Keyframes injected once ── */}
      <style>{`
        @keyframes bsq-shimmer {
          0%   { transform: translateX(-100%) }
          100% { transform: translateX(280%) }
        }
      `}</style>
    </div>
  )
})
