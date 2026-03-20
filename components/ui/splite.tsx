'use client'

import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

function SplineLoader() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-red-500 animate-spin" />
      <span className="text-xs text-neutral-500 tracking-wide">Loading 3D scene…</span>
    </div>
  )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense fallback={<SplineLoader />}>
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
