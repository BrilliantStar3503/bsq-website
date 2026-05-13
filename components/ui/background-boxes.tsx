'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ─── Colour palette — BSQ brand reds on hover ──────────────────────── */
const HOVER_COLORS = [
  'rgb(220 38 38)',    // red-600
  'rgb(185 28 28)',    // red-700
  'rgb(239 68 68)',    // red-500
  'rgb(127 29 29)',    // red-950
  'rgb(252 165 165)',  // red-300 (light blush)
  'rgb(217 45 32)',    // BSQ primary  #D92D20
  'rgb(180 35 24)',    // BSQ darker   #B42318
  'rgb(248 113 113)',  // red-400
  'rgb(254 202 202)',  // red-200 (very light)
]

const getRandomColor = () =>
  HOVER_COLORS[Math.floor(Math.random() * HOVER_COLORS.length)]

/* ─── Core grid ────────────────────────────────────────────────────── */
export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(150).fill(1)
  const cols = new Array(100).fill(1)

  return (
    <div
      style={{
        transform:
          'translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)',
      }}
      className={cn(
        'absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0',
        className,
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row${i}`}
          className="w-16 h-8 border-l border-slate-700 relative"
        >
          {cols.map((_, j) => (
            <motion.div
              key={`col${j}`}
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{ transition: { duration: 2 } }}
              className="w-16 h-8 border-r border-t border-slate-700 relative"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-700 stroke-[1px] pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

export const Boxes = React.memo(BoxesCore)
