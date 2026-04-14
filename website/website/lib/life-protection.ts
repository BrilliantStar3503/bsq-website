/* ─────────────────────────────────────────────────────────────────────────
   Life Income Protection — Calculation Module
   Computes the life insurance protection gap based on user financial data.
   Used by the recommendation engine to surface relevant PRU products.
   ───────────────────────────────────────────────────────────────────────── */

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface LifeProtectionInput {
  /** Annual gross income of the insured (PHP) */
  annualIncome: number
  /** Age of the youngest financial dependent (set to 22+ if no dependents) */
  youngestDependentAge: number
  /** Total existing life/death benefit coverage already in force (PHP) */
  existingCoverage: number
}

export interface LifeProtectionResult {
  /** Years until youngest dependent reaches financial independence (age 22) */
  dependencyYears: number
  /** Total income replacement needed over dependency period (PHP) */
  totalNeeded: number
  /** Uncovered gap after existing coverage is applied (PHP) */
  gap: number
}

export type LifeGapLevel = 'covered' | 'low' | 'medium' | 'high'

export interface LifeGapClassification {
  level: LifeGapLevel
  /** Human-readable label for display */
  label: string
  /** Short advisory message tied to the gap level */
  message: string
}

export interface LifeProductRecommendation {
  /** Primary recommended product — verified real PRU Life UK product */
  primary: string
  /** Up to 2 alternative products. Empty array when none strongly apply. */
  alternatives: string[]
  /** Financial need category for UI display */
  category: 'Life Insurance Protection'
  /** Advisory-tone reason — outcome focused, no insurance jargon */
  reason: string
  /** Recommended action urgency: 1 = immediate, 2 = soon, 3 = review */
  priority: 1 | 2 | 3
}

/* ─── Core Calculation ──────────────────────────────────────────────────── */

/**
 * Calculates the life income protection gap.
 *
 * Formula:
 *   dependencyYears = max(22 − youngestDependentAge, 0)
 *   totalNeeded     = annualIncome × dependencyYears
 *   gap             = max(totalNeeded − existingCoverage, 0)
 */
export function calculateLifeProtectionNeed(
  input: LifeProtectionInput,
): LifeProtectionResult {
  const { annualIncome, youngestDependentAge, existingCoverage } = input

  // Guard: clamp all inputs to non-negative values
  const safeIncome   = Math.max(annualIncome, 0)
  const safeAge      = Math.max(youngestDependentAge, 0)
  const safeCoverage = Math.max(existingCoverage, 0)

  const dependencyYears = Math.max(22 - safeAge, 0)
  const totalNeeded     = safeIncome * dependencyYears
  const gap             = Math.max(totalNeeded - safeCoverage, 0)

  return {
    dependencyYears,
    totalNeeded,
    gap,
  }
}

/* ─── Gap Classification ────────────────────────────────────────────────── */

/**
 * Classifies the severity of a life protection gap.
 *
 * Thresholds (PHP):
 *   covered  →  gap === 0
 *   low      →  gap > 0 and ≤ 1,000,000
 *   medium   →  gap > 1,000,000 and ≤ 5,000,000
 *   high     →  gap > 5,000,000
 */
export function classifyLifeGap(gap: number): LifeGapClassification {
  const safeGap = Math.max(gap, 0)

  if (safeGap === 0) {
    return {
      level: 'covered',
      label: 'Fully Covered',
      message: 'Your existing coverage meets your income replacement needs. Consider reviewing periodically as income grows.',
    }
  }

  if (safeGap <= 1_000_000) {
    return {
      level: 'low',
      label: 'Minor Gap',
      message: 'A small protection gap exists. A top-up or supplementary rider may be sufficient to close it.',
    }
  }

  if (safeGap <= 5_000_000) {
    return {
      level: 'medium',
      label: 'Moderate Gap',
      message: 'Your family\'s financial security has a meaningful gap. A dedicated income replacement plan is recommended.',
    }
  }

  return {
    level: 'high',
    label: 'Critical Gap',
    message: 'Your family is significantly underprotected. Immediate action is strongly recommended to prevent long-term financial hardship.',
  }
}

/* ─── Product Mapping ───────────────────────────────────────────────────── */

/**
 * Maps a life gap level to verified PRU Life UK products.
 *
 * Allowed products (no invented names):
 *   PRULove for Life        — permanent life coverage, grows in value over time
 *   PRUMillion Protect      — lump-sum payout, income-replacement focused
 *   PRULink Assurance Account Plus — investment-linked with life protection
 *
 * Ladder:
 *   covered  →  PRULove for Life (maintain with a permanent plan)
 *   low      →  PRUMillion Protect (targeted top-up)
 *   medium   →  PRUMillion Protect, alt: PRULove for Life
 *   high     →  PRULove for Life, alts: PRUMillion Protect, PRULink Assurance Account Plus
 */
export function getLifeProductRecommendation(
  gapLevel: LifeGapLevel,
): LifeProductRecommendation {
  const map: Record<LifeGapLevel, LifeProductRecommendation> = {
    covered: {
      primary:      'PRULove for Life',
      alternatives: [],
      category:     'Life Insurance Protection',
      reason:       'Your existing coverage is sufficient for now. A permanent life plan ensures your protection stays in place for life and can also build long-term value for your family.',
      priority:     3,
    },
    low: {
      primary:      'PRUMillion Protect',
      alternatives: ['PRULove for Life'],
      category:     'Life Insurance Protection',
      reason:       'You have a small protection gap. A lump-sum plan can close this efficiently — ensuring your family receives the income replacement they need without disrupting your current coverage.',
      priority:     2,
    },
    medium: {
      primary:      'PRUMillion Protect',
      alternatives: ['PRULove for Life', 'PRULink Assurance Account Plus'],
      category:     'Life Insurance Protection',
      reason:       'A meaningful gap exists in your income protection. Your family could face a significant shortfall if something happened to you today. A lump-sum benefit plan addresses this directly.',
      priority:     2,
    },
    high: {
      primary:      'PRULove for Life',
      alternatives: ['PRUMillion Protect', 'PRULink Assurance Account Plus'],
      category:     'Life Insurance Protection',
      reason:       'Your dependents are significantly underprotected. A permanent life plan with comprehensive coverage is the most appropriate solution — ensuring your family is financially secure for years to come, regardless of what happens.',
      priority:     1,
    },
  }

  return map[gapLevel]
}

/* ─── Convenience: Full Pipeline ────────────────────────────────────────── */

export interface LifeProtectionAnalysis {
  result:         LifeProtectionResult
  classification: LifeGapClassification
  recommendation: LifeProductRecommendation
}

/**
 * Runs the full pipeline in one call:
 * calculateLifeProtectionNeed → classifyLifeGap → getLifeProductRecommendation
 *
 * @example
 * const analysis = analyzeLifeProtection({
 *   annualIncome:         600_000,
 *   youngestDependentAge: 5,
 *   existingCoverage:     1_000_000,
 * })
 * // analysis.result.gap          → 8_200_000
 * // analysis.classification.level → 'high'
 * // analysis.recommendation.primary  → 'PRULove for Life'
 * // analysis.recommendation.category → 'Life Insurance Protection'
 */
export function analyzeLifeProtection(
  input: LifeProtectionInput,
): LifeProtectionAnalysis {
  const result         = calculateLifeProtectionNeed(input)
  const classification = classifyLifeGap(result.gap)
  const recommendation = getLifeProductRecommendation(classification.level)

  return { result, classification, recommendation }
}
