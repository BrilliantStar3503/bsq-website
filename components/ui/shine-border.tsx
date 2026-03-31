'use client'

import { cn } from '@/lib/utils'

type TColorProp = string | string[]

interface ShineBorderProps {
  borderRadius?: number
  borderWidth?: number
  duration?: number
  color?: TColorProp
  className?: string
  children: React.ReactNode
}

/**
 * ShineBorder
 * Animated radial-gradient border sweep — colour bands orbit the edge of the element.
 *
 * Usage:
 *   <ShineBorder color={['#D92D20', '#ff6b35', '#ffb347']} borderRadius={12} borderWidth={2}>
 *     <button ...>Click me</button>
 *   </ShineBorder>
 *
 * Props:
 *   borderRadius  — corner radius in px (default 8)
 *   borderWidth   — border thickness in px (default 1)
 *   duration      — animation cycle length in seconds (default 14)
 *   color         — single CSS colour string or array of colours
 *   className     — extra classes for the outer wrapper (override bg, padding, etc.)
 *   children      — content rendered inside the border
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = '#000000',
  className,
  children,
}: ShineBorderProps) {
  const colorValue = Array.isArray(color) ? color.join(',') : color

  return (
    <div
      style={{ '--border-radius': `${borderRadius}px` } as React.CSSProperties}
      className={cn(
        'relative grid h-full w-full place-items-center rounded-[--border-radius] bg-white p-3 text-black dark:bg-black dark:text-white',
        className,
      )}
    >
      {/* The animated border pseudo-element, implemented as an absolutely-positioned sibling */}
      <div
        style={
          {
            '--border-width':           `${borderWidth}px`,
            '--border-radius':          `${borderRadius}px`,
            '--shine-pulse-duration':   `${duration}s`,
            '--mask-linear-gradient':   `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            '--background-radial-gradient': `radial-gradient(transparent,transparent,${colorValue},transparent,transparent)`,
          } as React.CSSProperties
        }
        className={[
          'before:absolute before:inset-0 before:aspect-square before:size-full',
          'before:rounded-[--border-radius]',
          'before:p-[--border-width]',
          'before:will-change-[background-position]',
          'before:content-[""]',
          'before:![-webkit-mask-composite:xor]',
          'before:[background-image:var(--background-radial-gradient)]',
          'before:[background-size:300%_300%]',
          'before:![mask-composite:exclude]',
          'before:[mask:var(--mask-linear-gradient)]',
          'motion-safe:before:animate-[shine-pulse-border_var(--shine-pulse-duration)_infinite_linear]',
        ].join(' ')}
      />
      {children}
    </div>
  )
}
