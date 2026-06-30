import { Shield, Briefcase, Sunset, TrendingUp, GraduationCap, type LucideIcon } from 'lucide-react'

/**
 * Resolves FinancialGoal.icon (a plain string in the registry, kept
 * UI-agnostic — see lib/products.ts) to an actual icon component.
 *
 * Single source of truth for every surface that renders a goal icon:
 * the global header dropdown (bsq-header.tsx), GoalCard, and — once
 * built — the Financial Assessment results page. Add a new goal icon
 * here once; every consumer picks it up automatically.
 */
export const GOAL_ICONS: Record<string, LucideIcon> = {
  Shield, Briefcase, Sunset, TrendingUp, GraduationCap,
}

/**
 * Use this for building data (e.g. mapping financialGoals to a list of
 * link/card props) rather than directly inside a component's render
 * body. Assigning its result straight to a capitalized `const Icon =`
 * and rendering `<Icon />` in the same render trips the
 * static-components lint rule (it can't prove a function call returns
 * a stable component). For that pattern, index GOAL_ICONS directly:
 * `const Icon = GOAL_ICONS[goal.icon] ?? GOAL_ICONS.Shield` — see
 * GoalCard.tsx.
 */
export function getGoalIcon(iconName: string): LucideIcon {
  return GOAL_ICONS[iconName] ?? Shield
}
