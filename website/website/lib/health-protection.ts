/* ─────────────────────────────────────────────────────────────────────────
   Health Protection — Calculation Module
   Estimates the financial gap for critical illness and hospitalization coverage.
   Treated as a top-priority financial gap — medical events directly destroy
   accumulated savings and derail all other financial plans.
   Used by the recommendation engine to surface relevant PRU health products.
   ───────────────────────────────────────────────────────────────────────── */

/* ─── Types ─────────────────────────────────────────────────────────────── */

/** Expected hospital tier the client would realistically use */
export type HospitalLevel = 'low' | 'mid' | 'high'

export interface HealthProtectionInput {
  /**
   * Expected hospital tier:
   *   low  → provincial / government-level (₱1,000,000 target)
   *   mid  → private hospital, semi-suite   (₱4,000,000 target)
   *   high → top-tier / ICU-capable private (₱8,000,000 target)
   */
  hospitalLevel: HospitalLevel
  /** Current liquid savings that could be used in a medical emergency (PHP) */
  savings: number
  /** Existing health / critical illness insurance coverage already in force (PHP) */
  existingCoverage: number
}

export interface HealthProtectionResult {
  /**
   * Raw target coverage based on hospital tier — the realistic total cost
   * of a major critical illness event at that tier (PHP)
   */
  targetCoverage: number
  /**
   * Effective target used in gap computation.
   * Always at least ₱1,500,000 regardless of tier (minimum critical fund).
   */
  effectiveTarget: number
  /** Combined available protection: savings + existing coverage (PHP) */
  availableFunds: number
  /** Uncovered health protection gap (PHP) — always ≥ 0 */
  gap: number
  /**
   * Coverage ratio: availableFunds / effectiveTarget (0–1+).
   * Useful for UI progress indicators.
   */
  coverageRatio: number
}

export type HealthGapLevel = 'protected' | 'partial' | 'exposed' | 'critical'

export interface HealthGapClassification {
  level: HealthGapLevel
  /** Human-readable label for display */
  label: string
  /** Advisory message emphasizing financial risk, not just insurance absence */
  message: string
  /**
   * Risk flag — health is treated as top-priority because a single
   * medical event can wipe out ALL other financial plans simultaneously.
   */
  isTopPriority: boolean
  /** Urgency score: 1 = act now, 2 = act soon, 3 = monitor, 4 = maintain */
  urgency: 1 | 2 | 3 | 4
}

export interface HealthProductRecommendation {
  /** Primary recommended product — verified real PRU Life UK product */
  primary: string
  /** Up to 2 alternative products. Empty array when none strongly apply. */
  alternatives: string[]
  /** Financial need category for UI display */
  category: 'Health Insurance Coverage'
  /** Advisory-tone reason — outcome focused, no insurance jargon */
  reason: string
  /** Recommended action priority: 1 = immediate, 2 = soon, 3 = review */
  priority: 1 | 2 | 3
}

/* ─── Tier Coverage Targets (PHP) ──────────────────────────────────────── */

const TIER_TARGETS: Record<HospitalLevel, number> = {
  low:  1_000_000,   // Provincial / government hospital — major illness total cost
  mid:  4_000_000,   // Private hospital, semi-suite — critical illness + surgery
  high: 8_000_000,   // Top-tier private / ICU-capable — cancer, heart, stroke
}

const MINIMUM_CRITICAL_FUND = 1_500_000   // Absolute floor regardless of tier

/* ─── Core Calculation ──────────────────────────────────────────────────── */

/**
 * Computes the health protection gap.
 *
 * Formula:
 *   targetCoverage   = TIER_TARGETS[hospitalLevel]
 *   effectiveTarget  = max(targetCoverage, 1,500,000)
 *   availableFunds   = savings + existingCoverage
 *   gap              = max(effectiveTarget − availableFunds, 0)
 *   coverageRatio    = availableFunds / effectiveTarget  (capped display at 1.0)
 */
export function calculateHealthProtectionNeed(
  input: HealthProtectionInput,
): HealthProtectionResult {
  const { hospitalLevel, savings, existingCoverage } = input

  // Guard: clamp monetary inputs to non-negative
  const safeSavings  = Math.max(savings, 0)
  const safeCoverage = Math.max(existingCoverage, 0)

  const targetCoverage  = TIER_TARGETS[hospitalLevel]
  const effectiveTarget = Math.max(targetCoverage, MINIMUM_CRITICAL_FUND)
  const availableFunds  = safeSavings + safeCoverage
  const gap             = Math.max(effectiveTarget - availableFunds, 0)
  const coverageRatio   = effectiveTarget > 0
    ? Math.min(availableFunds / effectiveTarget, 1)
    : 1

  return {
    targetCoverage,
    effectiveTarget,
    availableFunds: Math.round(availableFunds),
    gap:            Math.round(gap),
    coverageRatio:  Math.round(coverageRatio * 100) / 100,   // 2 decimal places
  }
}

/* ─── Gap Classification ────────────────────────────────────────────────── */

/**
 * Classifies the severity of a health protection gap.
 *
 * Uses coverage ratio (availableFunds / effectiveTarget) for thresholds
 * so the logic scales correctly across all hospital tiers.
 *
 * All levels except 'protected' are flagged isTopPriority = true.
 * Rationale: a single critical illness event can simultaneously:
 *   - drain the emergency fund
 *   - halt retirement contributions
 *   - destroy savings and investment plans
 *   - force liquidation of assets
 *
 * Coverage thresholds:
 *   protected  →  gap === 0  (100%+ covered)
 *   partial    →  coverage ≥ 60%  (meaningful buffer, gap < 40%)
 *   exposed    →  coverage ≥ 25%  (significant gap, 40–75% uncovered)
 *   critical   →  coverage < 25%  (severely underprotected, >75% uncovered)
 */
export function classifyHealthGap(
  gap: number,
  effectiveTarget: number,
): HealthGapClassification {
  const safeGap    = Math.max(gap, 0)
  const safeTarget = Math.max(effectiveTarget, 0)

  if (safeGap === 0) {
    return {
      level:         'protected',
      label:         'Adequately Protected',
      message:       'Your health coverage and savings buffer meet your critical illness target. Review annually as medical costs rise.',
      isTopPriority: false,
      urgency:       4,
    }
  }

  const coverageRatio = safeTarget > 0
    ? (safeTarget - safeGap) / safeTarget
    : 0

  if (coverageRatio >= 0.60) {
    return {
      level:         'partial',
      label:         'Partially Covered',
      message:       'You have a partial buffer, but a critical illness could still consume a significant portion of your savings — disrupting all other financial goals simultaneously.',
      isTopPriority: true,
      urgency:       3,
    }
  }

  if (coverageRatio >= 0.25) {
    return {
      level:         'exposed',
      label:         'Financially Exposed',
      message:       'A major medical event would likely exhaust your savings and derail your retirement and education plans. Comprehensive health coverage is a financial necessity, not a luxury.',
      isTopPriority: true,
      urgency:       2,
    }
  }

  return {
    level:         'critical',
    label:         'Critically Unprotected',
    message:       'You are severely underprotected. A single hospitalization or critical illness diagnosis could cause immediate and irreversible financial collapse across all your life goals. This must be addressed first.',
    isTopPriority: true,
    urgency:       1,
  }
}

/* ─── Product Mapping ───────────────────────────────────────────────────── */

/**
 * Maps a health gap level to verified PRU Life UK products.
 *
 * Allowed products (no invented names):
 *   PRU Health Prime                  — core hospitalization + critical illness
 *   PRUMillion Protect                — lump-sum benefit for major illness events
 *   PRULink Assurance Account Plus    — investment-linked with built-in protection
 *
 * Ladder:
 *   protected → PRU Health Prime (review + maintain)
 *   partial   → PRU Health Prime, alt: PRULink Assurance Account Plus
 *   exposed   → PRU Health Prime, alt: PRUMillion Protect
 *   critical  → PRU Health Prime, alts: PRUMillion Protect, PRULink Assurance Account Plus
 */
export function getHealthProductRecommendation(
  level: HealthGapLevel,
): HealthProductRecommendation {
  const map: Record<HealthGapLevel, HealthProductRecommendation> = {
    protected: {
      primary:      'PRU Health Prime',
      alternatives: [],
      category:     'Health Insurance Coverage',
      reason:       'Your current health fund looks adequate. Maintaining a comprehensive health plan ensures medical costs never touch your savings or derail your other financial goals.',
      priority:     3,
    },
    partial: {
      primary:      'PRU Health Prime',
      alternatives: ['PRULink Assurance Account Plus'],
      category:     'Health Insurance Coverage',
      reason:       'You have a partial health buffer, but a major illness could still consume a significant portion of your personal savings. A dedicated health plan keeps medical expenses separate from your financial goals.',
      priority:     2,
    },
    exposed: {
      primary:      'PRU Health Prime',
      alternatives: ['PRUMillion Protect'],
      category:     'Health Insurance Coverage',
      reason:       'A serious medical event would likely exhaust your savings and derail your retirement or education plans simultaneously. Health coverage is a financial necessity — not an optional add-on.',
      priority:     2,
    },
    critical: {
      primary:      'PRU Health Prime',
      alternatives: ['PRUMillion Protect', 'PRULink Assurance Account Plus'],
      category:     'Health Insurance Coverage',
      reason:       'You are severely underprotected against medical risk. A single hospitalization or critical illness diagnosis could cause immediate and irreversible financial damage across all your life goals. This should be addressed first.',
      priority:     1,
    },
  }

  return map[level]
}

/* ─── Convenience: Full Pipeline ────────────────────────────────────────── */

export interface HealthProtectionAnalysis {
  result:         HealthProtectionResult
  classification: HealthGapClassification
  recommendation: HealthProductRecommendation
}

/**
 * Runs the full health protection pipeline in one call:
 * calculateHealthProtectionNeed → classifyHealthGap → getHealthProductRecommendation
 *
 * @example
 * const analysis = analyzeHealthProtection({
 *   hospitalLevel:    'mid',
 *   savings:          300_000,
 *   existingCoverage: 500_000,
 * })
 * // analysis.result.gap                  → 3_200_000
 * // analysis.classification.level        → 'exposed'
 * // analysis.classification.isTopPriority → true
 * // analysis.recommendation.primary   → 'PRU Health Prime'
 * // analysis.recommendation.category  → 'Health Insurance Coverage'
 */
export function analyzeHealthProtection(
  input: HealthProtectionInput,
): HealthProtectionAnalysis {
  const result         = calculateHealthProtectionNeed(input)
  const classification = classifyHealthGap(result.gap, result.effectiveTarget)
  const recommendation = getHealthProductRecommendation(classification.level)

  return { result, classification, recommendation }
}
