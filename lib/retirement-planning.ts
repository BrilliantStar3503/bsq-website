/* ─────────────────────────────────────────────────────────────────────────
   Retirement Planning — Calculation Module
   Computes the retirement fund gap based on user financial data.
   Used by the recommendation engine to surface relevant PRU products.
   ───────────────────────────────────────────────────────────────────────── */

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface RetirementInput {
  /** Current age of the insured */
  currentAge: number
  /** Target retirement age (default: 60) */
  retirementAge: number
  /** Current gross annual income (PHP) */
  currentIncome: number
  /**
   * Expected average annual income growth rate as a decimal.
   * Defaults to 0.04 (4%) if not provided.
   */
  growthRate?: number
  /** Current savings / investments (PHP) */
  savings: number
  /** Existing insurance fund / VUL cash value (PHP) */
  insuranceFund: number
  /** Cash on hand / bank deposits (PHP) */
  bankCash: number
}

export interface RetirementResult {
  /** Number of years remaining until retirement */
  yearsToRetirement: number
  /** Projected annual income at retirement age, adjusted for growth (PHP) */
  futureIncome: number
  /** Annual income needed during retirement (50% of future income) (PHP) */
  annualRetirementNeed: number
  /**
   * Total retirement corpus required.
   * Uses the 20-year withdrawal rule: annualRetirementNeed × 20 (PHP)
   */
  retirementFundNeeded: number
  /** Sum of all existing assets already working toward retirement (PHP) */
  existingAssets: number
  /** Uncovered gap between what's needed and what's already accumulated (PHP) */
  gap: number
}

export type RetirementGapLevel = 'on-track' | 'minor' | 'moderate' | 'critical'

export interface RetirementGapClassification {
  level: RetirementGapLevel
  /** Human-readable label for display */
  label: string
  /** Short advisory message tied to the gap level */
  message: string
  /** Urgency score: 1 = act now, 2 = act soon, 3 = monitor, 4 = maintain */
  urgency: 1 | 2 | 3 | 4
}

export interface RetirementProductRecommendation {
  /** Primary recommended product — verified real PRU Life UK product */
  primary: string
  /** Up to 2 alternative products. Empty array when none strongly apply. */
  alternatives: string[]
  /** Financial need category for UI display */
  category: 'Retirement Funding'
  /** Advisory-tone reason — outcome focused, no insurance jargon */
  reason: string
  /** Recommended action priority: 1 = immediate, 2 = soon, 3 = review */
  priority: 1 | 2 | 3
}

/* ─── Defaults ──────────────────────────────────────────────────────────── */

const DEFAULT_GROWTH_RATE        = 0.04   // 4% annual income growth
const RETIREMENT_INCOME_RATIO    = 0.5    // 50% of future income needed annually
const WITHDRAWAL_YEARS           = 20     // 20-year withdrawal horizon

/* ─── Core Calculation ──────────────────────────────────────────────────── */

/**
 * Computes the full retirement fund gap analysis.
 *
 * Formula:
 *   yearsToRetirement     = retirementAge − currentAge
 *   futureIncome          = currentIncome × (1 + growthRate) ^ yearsToRetirement
 *   annualRetirementNeed  = futureIncome × 0.5
 *   retirementFundNeeded  = annualRetirementNeed × 20
 *   existingAssets        = savings + insuranceFund + bankCash
 *   gap                   = max(retirementFundNeeded − existingAssets, 0)
 */
export function calculateRetirementNeed(
  input: RetirementInput,
): RetirementResult {
  const {
    currentAge,
    retirementAge,
    currentIncome,
    savings,
    insuranceFund,
    bankCash,
  } = input

  const growthRate = input.growthRate ?? DEFAULT_GROWTH_RATE

  // Guard: clamp all monetary inputs to non-negative
  const safeIncome       = Math.max(currentIncome, 0)
  const safeSavings      = Math.max(savings, 0)
  const safeInsurance    = Math.max(insuranceFund, 0)
  const safeBankCash     = Math.max(bankCash, 0)
  const safeGrowthRate   = Math.max(growthRate, 0)

  // Guard: retirement age must be greater than current age
  const yearsToRetirement = Math.max(retirementAge - currentAge, 0)

  const futureIncome         = safeIncome * Math.pow(1 + safeGrowthRate, yearsToRetirement)
  const annualRetirementNeed = futureIncome * RETIREMENT_INCOME_RATIO
  const retirementFundNeeded = annualRetirementNeed * WITHDRAWAL_YEARS
  const existingAssets       = safeSavings + safeInsurance + safeBankCash
  const gap                  = Math.max(retirementFundNeeded - existingAssets, 0)

  return {
    yearsToRetirement,
    futureIncome:         Math.round(futureIncome),
    annualRetirementNeed: Math.round(annualRetirementNeed),
    retirementFundNeeded: Math.round(retirementFundNeeded),
    existingAssets:       Math.round(existingAssets),
    gap:                  Math.round(gap),
  }
}

/* ─── Gap Classification ────────────────────────────────────────────────── */

/**
 * Classifies the severity of a retirement fund gap.
 *
 * Coverage ratio = existingAssets / retirementFundNeeded
 *
 * Thresholds:
 *   on-track  →  gap === 0  (100%+ funded)
 *   minor     →  coverage ≥ 70%  (gap covers < 30% of need)
 *   moderate  →  coverage ≥ 40%  (gap covers 30–60% of need)
 *   critical  →  coverage < 40%  (gap covers > 60% of need)
 */
export function classifyRetirementGap(
  gap: number,
  retirementFundNeeded: number,
): RetirementGapClassification {
  const safeGap    = Math.max(gap, 0)
  const safeFunded = Math.max(retirementFundNeeded, 0)

  if (safeGap === 0) {
    return {
      level:   'on-track',
      label:   'On Track',
      message: 'Your existing assets are sufficient for your retirement target. Focus on maintaining your plan and optimizing for legacy.',
      urgency: 4,
    }
  }

  const coverageRatio = safeFunded > 0
    ? (safeFunded - safeGap) / safeFunded
    : 0

  if (coverageRatio >= 0.70) {
    return {
      level:   'minor',
      label:   'Minor Shortfall',
      message: 'You have a strong foundation. A small additional savings plan or top-up can close the remaining gap before retirement.',
      urgency: 3,
    }
  }

  if (coverageRatio >= 0.40) {
    return {
      level:   'moderate',
      label:   'Moderate Shortfall',
      message: 'Your retirement corpus has a meaningful gap. A structured investment-linked plan started now can significantly close it over time.',
      urgency: 2,
    }
  }

  return {
    level:   'critical',
    label:   'Critical Shortfall',
    message: 'Your retirement fund is significantly underfunded. Immediate action is required to avoid outliving your savings.',
    urgency: 1,
  }
}

/* ─── Product Mapping ───────────────────────────────────────────────────── */

/**
 * Maps a retirement gap level to verified PRU Life UK products.
 *
 * Allowed products (no invented names):
 *   PRU Elite Series                  — premium wealth management + legacy transfer
 *   PRULifetime Income                — guaranteed lifetime income stream
 *   PRULink Assurance Account Plus    — investment-linked growth with protection
 *   PRUMillionaire                    — wealth accumulation focus
 *
 * Ladder:
 *   on-track → PRU Elite Series, alt: PRUMillionaire
 *   minor    → PRULink Assurance Account Plus, alt: PRULifetime Income
 *   moderate → PRULifetime Income, alt: PRULink Assurance Account Plus
 *   critical → PRULifetime Income, alts: PRULink Assurance Account Plus, PRUMillion Protect
 */
export function getRetirementProductRecommendation(
  level: RetirementGapLevel,
): RetirementProductRecommendation {
  const map: Record<RetirementGapLevel, RetirementProductRecommendation> = {
    'on-track': {
      primary:      'PRU Elite Series',
      alternatives: ['PRUMillionaire'],
      category:     'Retirement Funding',
      reason:       'Your retirement fund is on track — well done. The focus now shifts to making your accumulated wealth work harder and ensuring a clean, efficient transfer of assets to your family.',
      priority:     3,
    },
    minor: {
      primary:      'PRULink Assurance Account Plus',
      alternatives: ['PRULifetime Income'],
      category:     'Retirement Funding',
      reason:       'You have a small retirement gap. Growing your fund through a consistent, investment-linked savings plan can close this efficiently — giving your money more time to compound before retirement.',
      priority:     2,
    },
    moderate: {
      primary:      'PRULifetime Income',
      alternatives: ['PRULink Assurance Account Plus'],
      category:     'Retirement Funding',
      reason:       'A meaningful shortfall exists in your retirement fund. A plan that converts contributions into a guaranteed lifetime income stream ensures you never outlive your money — regardless of how long you live.',
      priority:     2,
    },
    critical: {
      primary:      'PRULifetime Income',
      alternatives: ['PRULink Assurance Account Plus', 'PRUMillion Protect'],
      category:     'Retirement Funding',
      reason:       'Your retirement is significantly underfunded. Without immediate action, you risk spending your final years dependent on others. A guaranteed income plan now is the most direct path to a secure and dignified retirement.',
      priority:     1,
    },
  }

  return map[level]
}

/* ─── Convenience: Full Pipeline ────────────────────────────────────────── */

export interface RetirementAnalysis {
  result:         RetirementResult
  classification: RetirementGapClassification
  recommendation: RetirementProductRecommendation
}

/**
 * Runs the full retirement analysis pipeline in one call:
 * calculateRetirementNeed → classifyRetirementGap → getRetirementProductRecommendation
 *
 * @example
 * const analysis = analyzeRetirement({
 *   currentAge:    32,
 *   retirementAge: 60,
 *   currentIncome: 720_000,
 *   growthRate:    0.04,
 *   savings:       200_000,
 *   insuranceFund: 150_000,
 *   bankCash:      80_000,
 * })
 * // analysis.result.gap                  → ~18_300_000
 * // analysis.classification.level        → 'critical'
 * // analysis.recommendation.primary  → 'PRULifetime Income'
 * // analysis.recommendation.category → 'Retirement Funding'
 */
export function analyzeRetirement(
  input: RetirementInput,
): RetirementAnalysis {
  const result         = calculateRetirementNeed(input)
  const classification = classifyRetirementGap(result.gap, result.retirementFundNeeded)
  const recommendation = getRetirementProductRecommendation(classification.level)

  return { result, classification, recommendation }
}
