/* ─────────────────────────────────────────────────────────────────────────
   Education Funding — Calculation Module
   Estimates future college costs and computes the education funding gap.
   Used by the recommendation engine to surface relevant PRU products.
   ───────────────────────────────────────────────────────────────────────── */

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface EducationFundingInput {
  /** Current age of the child */
  childAge: number
  /** Duration of the college program in years (typically 4 or 5) */
  collegeYears: 4 | 5
  /** Current annual tuition cost in today's peso value (PHP) */
  currentTuition: number
  /**
   * Expected average annual tuition inflation rate as a decimal.
   * Defaults to 0.10 (10%) if not provided — Philippine university average.
   */
  tuitionGrowthRate?: number
  /** Existing education fund / savings already set aside (PHP) */
  existingFund: number
  /**
   * Client's gross annual income (PHP).
   * Used to classify budget tier for product recommendations.
   * Defaults to 0 (treated as low budget) when not provided.
   */
  annualIncome?: number
  /**
   * Client's total liquid savings (PHP).
   * Used alongside annualIncome to classify budget tier.
   * Defaults to 0 when not provided.
   */
  currentSavings?: number
}

export interface EducationFundingResult {
  /** Years remaining until the child turns 18 and enters college */
  yearsToCollege: number
  /** Projected tuition cost in Year 1 of college (PHP) */
  tuitionAt18: number
  /**
   * Tuition cost broken down per college year, adjusted for ongoing
   * tuition inflation during the college period (PHP[])
   */
  tuitionPerYear: number[]
  /** Total projected tuition cost across all college years (PHP) */
  totalEducationCost: number
  /** Existing education fund already accumulated (PHP) */
  existingFund: number
  /** Uncovered funding gap (PHP) — always ≥ 0 */
  gap: number
}

export type EducationGapLevel = 'funded' | 'low' | 'moderate' | 'high'

/** Budget tier derived from the client's annual income and liquid savings */
export type BudgetLevel = 'high' | 'medium' | 'low'

export interface EducationGapClassification {
  level: EducationGapLevel
  /** Human-readable label for display */
  label: string
  /** Short advisory message tied to the gap level */
  message: string
  /** Urgency score: 1 = act now, 2 = act soon, 3 = monitor, 4 = maintain */
  urgency: 1 | 2 | 3 | 4
}

export interface EducationProductRecommendation {
  /**
   * Primary recommended product — the single best match.
   * Only real, currently-offered PRU Life UK products.
   */
  primary: string
  /**
   * Up to 2 alternative products the advisor may also discuss.
   * Empty array when no strong alternative applies.
   */
  alternatives: string[]
  /**
   * Advisory-tone explanation focused on financial outcomes.
   * No technical product features or insurance jargon.
   */
  explanation: string
  /** Recommended action priority: 1 = immediate, 2 = soon, 3 = review */
  priority: 1 | 2 | 3
}

/* ─── Defaults ──────────────────────────────────────────────────────────── */

const DEFAULT_TUITION_GROWTH_RATE = 0.10  // 10% annual tuition inflation (PH average)
const COLLEGE_START_AGE           = 18    // Standard Philippine college entry age

/* ─── Core Calculation ──────────────────────────────────────────────────── */

/**
 * Computes the full education funding gap analysis.
 *
 * Formula:
 *   yearsToCollege      = 18 − childAge
 *   tuitionAt18         = currentTuition × (1 + rate) ^ yearsToCollege
 *   tuitionYear[i]      = tuitionAt18    × (1 + rate) ^ i   (for each college year i = 0…n−1)
 *   totalEducationCost  = Σ tuitionYear[i]
 *   gap                 = max(totalEducationCost − existingFund, 0)
 */
export function calculateEducationFund(
  input: EducationFundingInput,
): EducationFundingResult {
  const {
    childAge,
    collegeYears,
    currentTuition,
    existingFund,
  } = input

  const rate         = input.tuitionGrowthRate ?? DEFAULT_TUITION_GROWTH_RATE

  // Guard: clamp all inputs to safe values
  const safeChildAge    = Math.max(Math.min(childAge, COLLEGE_START_AGE), 0)
  const safeTuition     = Math.max(currentTuition, 0)
  const safeExisting    = Math.max(existingFund, 0)
  const safeRate        = Math.max(rate, 0)

  const yearsToCollege  = Math.max(COLLEGE_START_AGE - safeChildAge, 0)
  const tuitionAt18     = safeTuition * Math.pow(1 + safeRate, yearsToCollege)

  // Build per-year tuition array — inflation continues during college years
  const tuitionPerYear: number[] = Array.from(
    { length: collegeYears },
    (_, i) => tuitionAt18 * Math.pow(1 + safeRate, i),
  )

  const totalEducationCost = tuitionPerYear.reduce((sum, v) => sum + v, 0)
  const gap                = Math.max(totalEducationCost - safeExisting, 0)

  return {
    yearsToCollege,
    tuitionAt18:        Math.round(tuitionAt18),
    tuitionPerYear:     tuitionPerYear.map(Math.round),
    totalEducationCost: Math.round(totalEducationCost),
    existingFund:       Math.round(safeExisting),
    gap:                Math.round(gap),
  }
}

/* ─── Gap Classification ────────────────────────────────────────────────── */

/**
 * Classifies the severity of an education funding gap.
 *
 * Coverage ratio = existingFund / totalEducationCost
 *
 * Thresholds:
 *   funded    →  gap === 0  (100%+ funded)
 *   low       →  coverage ≥ 70%  (gap covers < 30% of cost)
 *   moderate  →  coverage ≥ 40%  (gap covers 30–60% of cost)
 *   high      →  coverage < 40%  (gap covers > 60% of cost)
 */
export function classifyEducationGap(
  gap: number,
  totalEducationCost: number,
): EducationGapClassification {
  const safeGap  = Math.max(gap, 0)
  const safeCost = Math.max(totalEducationCost, 0)

  if (safeGap === 0) {
    return {
      level:   'funded',
      label:   'Fully Funded',
      message: "Your child's education fund is on track. Consider reviewing annually as tuition costs may rise faster than projected.",
      urgency: 4,
    }
  }

  const coverageRatio = safeCost > 0
    ? (safeCost - safeGap) / safeCost
    : 0

  if (coverageRatio >= 0.70) {
    return {
      level:   'low',
      label:   'Minor Shortfall',
      message: 'You have a solid head start. A small additional monthly savings plan can close this gap well before college begins.',
      urgency: 3,
    }
  }

  if (coverageRatio >= 0.40) {
    return {
      level:   'moderate',
      label:   'Moderate Shortfall',
      message: 'A meaningful portion of the education cost is still uncovered. A dedicated education savings plan started now can bridge this gap effectively.',
      urgency: 2,
    }
  }

  return {
    level:   'high',
    label:   'Critical Shortfall',
    message: 'The majority of your child\'s education cost is unfunded. Immediate action is recommended to ensure college remains within reach.',
    urgency: 1,
  }
}

/* ─── Budget Classification ─────────────────────────────────────────────── */

/**
 * Classifies the client's budget capacity for an education savings plan.
 *
 * Thresholds (PHP annual income):
 *   high   →  ≥ ₱1,500,000 / year  (≥ ₱125,000 / month)  OR  savings ≥ ₱500,000
 *   medium →  ₱600,000 – ₱1,499,999 / year                OR  savings ₱100,000 – ₱499,999
 *   low    →  < ₱600,000 / year                            AND savings < ₱100,000
 *
 * When both signals are present the more generous classification wins —
 * savings reflect capacity to act immediately regardless of income level.
 */
export function classifyBudget(
  annualIncome: number,
  savings:      number,
): BudgetLevel {
  const safeIncome  = Math.max(annualIncome, 0)
  const safeSavings = Math.max(savings, 0)

  const incomeLevel: BudgetLevel =
    safeIncome >= 1_500_000 ? 'high' :
    safeIncome >= 600_000   ? 'medium' : 'low'

  const savingsLevel: BudgetLevel =
    safeSavings >= 500_000 ? 'high' :
    safeSavings >= 100_000 ? 'medium' : 'low'

  // Take the more generous of the two signals
  const order: BudgetLevel[] = ['high', 'medium', 'low']
  return order[Math.min(order.indexOf(incomeLevel), order.indexOf(savingsLevel))]
}

/* ─── Product Mapping ───────────────────────────────────────────────────── */

/**
 * Maps an education gap level + budget tier to real PRU Life UK products.
 *
 * Valid products used (no fabricated names):
 *   • PRULink Assurance Account Plus   (investment-linked, accessible entry point)
 *   • PRULifetime Income               (income-generating, wealth-building)
 *   • PRUMillion Protect               (protection + savings, higher budget)
 *   • PRU Elite Series                 (premium wealth management)
 *
 * Rules:
 *   High budget  → PRULifetime Income as primary (income + growth focus)
 *                  Alternatives: PRU Elite Series, PRUMillion Protect
 *   Medium budget → PRULink Assurance Account Plus as primary
 *                  Alternative: PRULifetime Income (upgrade path)
 *   Low budget   → PRULink Assurance Account Plus as primary (most accessible)
 *                  No alternatives (keep it simple and achievable)
 *
 *   Special case: gap === 0 (funded) + high budget → PRU Elite Series as primary
 *   (shift focus from accumulation to wealth optimisation)
 *
 * Maximum: 1 primary product, 2 alternatives.
 */
export function getEducationProductRecommendation(
  level:  EducationGapLevel,
  budget: BudgetLevel = 'medium',
): EducationProductRecommendation {

  // Funded + high budget: no accumulation needed, focus on wealth optimisation
  if (level === 'funded' && budget === 'high') {
    return {
      primary:      'PRU Elite Series',
      alternatives: ['PRUMillion Protect', 'PRULifetime Income'],
      explanation:  "Your child's education is already covered — well done. At your income level, the priority now is making sure those accumulated funds continue working for your family through a wealth management strategy that also provides protection.",
      priority:     3,
    }
  }

  // Funded (any other budget): maintain and review
  if (level === 'funded') {
    return {
      primary:      'PRULink Assurance Account Plus',
      alternatives: [],
      explanation:  "Your education fund is on track. Consider keeping it growing through an investment-linked plan so it stays ahead of tuition inflation, which historically runs at 10% per year in the Philippines.",
      priority:     3,
    }
  }

  // Gap exists — route by budget
  if (budget === 'high') {
    const urgency = level === 'high' ? 1 : 2
    return {
      primary:      'PRULifetime Income',
      alternatives: ['PRU Elite Series', 'PRUMillion Protect'],
      explanation:  level === 'high'
        ? "A significant portion of your child's education costs is currently unfunded. Given your financial capacity, a plan that combines long-term income generation with protection is the most effective way to close this gap before college begins."
        : "You have a good foundation, but tuition inflation means the gap will widen over time. A premium plan focused on income and growth will ensure your child's college fund stays fully funded — regardless of market conditions.",
      priority: urgency,
    }
  }

  if (budget === 'medium') {
    return {
      primary:      'PRULink Assurance Account Plus',
      alternatives: ['PRULifetime Income'],
      explanation:  level === 'high'
        ? "Your child's education fund has a meaningful shortfall. Starting a dedicated investment-linked savings plan now gives your money the most years to grow and reduces the monthly contribution needed to close the gap."
        : "A small but consistent investment in an education savings plan now is the most practical way to bridge this gap — before tuition inflation makes it significantly larger.",
      priority: level === 'high' ? 1 : 2,
    }
  }

  // Low budget
  return {
    primary:      'PRULink Assurance Account Plus',
    alternatives: [],
    explanation:  level === 'high'
      ? "Starting small is far better than starting late. Even a modest monthly plan now can make a real difference — tuition inflation means every year of delay increases the total cost significantly."
      : "You're already ahead of many families by planning early. A simple investment-linked plan with a manageable monthly contribution can close this gap well before your child turns 18.",
    priority: level === 'high' ? 1 : 2,
  }
}

/* ─── Convenience: Full Pipeline ────────────────────────────────────────── */

export interface EducationFundingAnalysis {
  result:         EducationFundingResult
  classification: EducationGapClassification
  recommendation: EducationProductRecommendation
  /** Budget tier used to drive product selection */
  budget:         BudgetLevel
}

/**
 * Runs the full education funding pipeline in one call:
 * calculateEducationFund → classifyEducationGap → classifyBudget → getEducationProductRecommendation
 *
 * @example
 * const analysis = analyzeEducationFunding({
 *   childAge:          3,
 *   collegeYears:      4,
 *   currentTuition:    150_000,
 *   tuitionGrowthRate: 0.10,
 *   existingFund:      100_000,
 *   annualIncome:      720_000,   // ₱60k/month → medium budget
 *   currentSavings:    80_000,
 * })
 * // analysis.result.gap                    → ~3_500_000
 * // analysis.classification.level          → 'high'
 * // analysis.budget                        → 'medium'
 * // analysis.recommendation.primary        → 'PRULink Assurance Account Plus'
 * // analysis.recommendation.alternatives   → ['PRULifetime Income']
 */
export function analyzeEducationFunding(
  input: EducationFundingInput,
): EducationFundingAnalysis {
  const result         = calculateEducationFund(input)
  const classification = classifyEducationGap(result.gap, result.totalEducationCost)
  const budget         = classifyBudget(input.annualIncome ?? 0, input.currentSavings ?? input.existingFund)
  const recommendation = getEducationProductRecommendation(classification.level, budget)

  return { result, classification, recommendation, budget }
}
