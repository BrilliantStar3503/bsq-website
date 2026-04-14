'use client'

import { cn } from '@/lib/utils'

/**
 * AnimatedGradientButton
 * ──────────────────────────────────────────────────────────────────────
 * Scoped, isolated component. Does NOT touch:
 *   - buttonVariants
 *   - global styles
 *   - any other button in the app
 *
 * Pattern:
 *   outer div (relative)
 *     └─ glow div  (absolute inset-0, blurred gradient, animates)
 *     └─ button    (relative z-10, solid bg sits above the glow)
 *
 * The blurred gradient layer "leaks" around the button edges → glowing
 * animated halo effect.
 */

interface AnimatedGradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * CSS colour array for the gradient.
   * Defaults to neon pink → lime → cyan.
   */
  colors?: string[]
  /** Animation duration in seconds (default 3) */
  duration?: number
  className?: string
  children: React.ReactNode
}

export function AnimatedGradientButton({
  colors = ['#FF007F', '#39FF14', '#00FFFF'],
  duration = 3,
  className,
  children,
  style,
  ...props
}: AnimatedGradientButtonProps) {
  // Build a repeating gradient so all colours show during the sweep
  const gradient = `linear-gradient(135deg, ${[...colors, colors[0]].join(', ')})`

  return (
    <>
      {/* Keyframe + glow class scoped inside this component only */}
      <style>{`
        @keyframes agb-shine {
          0%   { background-position: 0%   0%;   }
          50%  { background-position: 100% 100%; }
          100% { background-position: 0%   0%;   }
        }
        .agb-glow-layer {
          background-image: ${gradient};
          background-size: 300% 300%;
          animation: agb-shine ${duration}s ease infinite;
        }
      `}</style>

      <div className="relative inline-flex w-full">
        {/* Animated glow halo — sits behind the button, bleeds out around it */}
        <div
          className="agb-glow-layer absolute inset-0 rounded-xl blur-md opacity-75 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        {/* The actual button — solid bg so glow shows only around the edges */}
        <button
          className={cn(
            'relative z-10 w-full h-12 rounded-xl text-sm font-semibold',
            'flex items-center justify-center gap-2',
            'transition-all duration-200 hover:brightness-110 active:scale-[0.98]',
            className,
          )}
          style={style}
          {...props}
        >
          {children}
        </button>
      </div>
    </>
  )
}
