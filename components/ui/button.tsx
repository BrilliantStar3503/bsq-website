import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]",
  {
    variants: {
      variant: {
        // ── Shadcn defaults (unchanged for internal UI) ──────────────
        default:     "rounded-md bg-primary text-primary-foreground hover:bg-primary/90 ring-offset-background focus-visible:ring-ring",
        destructive: "rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 ring-offset-background focus-visible:ring-ring",
        outline:     "rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground ring-offset-background focus-visible:ring-ring",
        secondary:   "rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 ring-offset-background focus-visible:ring-ring",
        ghost:       "rounded-md hover:bg-accent hover:text-accent-foreground ring-offset-background focus-visible:ring-ring",
        link:        "rounded-md text-primary underline-offset-4 hover:underline ring-offset-background focus-visible:ring-ring",

        // ── PRU Life UK brand buttons ────────────────────────────────
        //
        // pru-primary  → white bg + red text/border → hover solid red + white
        // Use for: CTAs on white/light backgrounds (results page, cards)
        "pru-primary":
          "rounded-xl bg-white text-red-600 border border-red-200 shadow-[0_1px_3px_rgba(0,0,0,0.07)] " +
          "hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-[0_2px_8px_rgba(220,38,38,0.18)] " +
          "focus-visible:ring-red-400 font-bold",

        // pru-solid    → solid red bg + white text → hover slightly darker
        // Use for: high-priority form submits, modal CTAs, inline results
        "pru-solid":
          "rounded-xl bg-red-600 text-white shadow-[0_1px_4px_rgba(0,0,0,0.10)] " +
          "hover:bg-red-700 hover:shadow-[0_2px_8px_rgba(185,28,28,0.20)] " +
          "focus-visible:ring-red-400 font-bold",

        // pru-outline  → transparent + red border/text → hover light red tint
        // Use for: secondary actions, "Advisor" button next to primary
        "pru-outline":
          "rounded-xl bg-transparent text-red-600 border border-red-200 " +
          "hover:bg-red-50 hover:border-red-300 " +
          "focus-visible:ring-red-400 font-bold",

        // pru-ghost-dark → for buttons on dark/navy backgrounds
        // Use for: advisor section dark card
        "pru-ghost-dark":
          "rounded-xl bg-white text-red-600 border border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.12)] " +
          "hover:bg-red-600 hover:text-white hover:shadow-[0_2px_10px_rgba(220,38,38,0.25)] " +
          "focus-visible:ring-red-300 font-bold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm:      "h-9 px-3 text-xs",
        lg:      "h-12 px-8 text-sm",
        xl:      "h-14 px-10 text-base",
        icon:    "h-10 w-10",
        // PRU standard sizes
        pru:     "px-6 py-3 text-sm",
        "pru-lg":"px-8 py-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
