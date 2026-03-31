/**
 * BSQ AI Recommendation Engine
 * ─────────────────────────────────────────────────────────────────────
 * Recommends the most appropriate PRU Life UK products based on:
 *   1. User segment  (OFW | Professional | Business Owner | Employee)
 *   2. Monthly income (PHP)
 *
 * Rules authored by Chris Garcia / BSQ District.
 * Last updated: March 2026
 */

/* ════════════════════════════════════════════════════════════════════
   TYPES
════════════════════════════════════════════════════════════════════ */

export type Segment =
  | 'OFW'
  | 'Professional'
  | 'Business Owner'
  | 'Employee'

export interface ProductRecommendation {
  /** Display name shown to the client */
  name: string
  /** Internal slug — links to /products/[slug] page */
  slug: string
  /**
   * Elite pay-term variant, if applicable.
   * e.g. 5 | 7 | 10 | 15  → "Elite 10 (10-Pay)"
   */
  payTerm?: number
  /** Short, positive, client-facing reason for this recommendation */
  reason: string
  /** Priority rank within this result set (1 = top pick) */
  priority: 1 | 2 | 3 | 4
}

export interface RecommendationResult {
  segment: Segment
  income: number
  /** Income tier label for internal use / analytics */
  incomeTier: 'entry' | 'mid' | 'high' | 'premium'
  recommended_products: ProductRecommendation[]
  /** Aspirational message shown at the top of the results card */
  positioning_message: string
}

/* ════════════════════════════════════════════════════════════════════
   PRODUCT CATALOGUE  (aligned with /lib/products.ts slugs)
════════════════════════════════════════════════════════════════════ */

const PRODUCTS = {
  PRU_MILLION_PROTECT: {
    name: 'PRUMillion Protect',
    slug: 'pru-million-protect',
  },
  ELITE_SERIES: {
    name: 'Elite Series',
    slug: 'elite-series',
  },
  PRU_LIFETIME_INCOME: {
    name: 'PRULifetime Income',
    slug: 'prulifetime-income',
  },
  PRU_LINK_PLUS: {
    name: 'PRULink Assurance Account Plus',
    slug: 'prulink-assurance-account-plus',
  },
  PRU_LOVE: {
    name: 'PRULove for Life',
    slug: 'prulove-for-life',
  },
} as const

/* ════════════════════════════════════════════════════════════════════
   INCOME TIER CLASSIFIER
════════════════════════════════════════════════════════════════════ */

function classifyIncome(
  income: number,
  segment: Segment,
): RecommendationResult['incomeTier'] {
  if (segment === 'Employee') {
    if (income < 50_000)  return 'entry'
    if (income < 80_000)  return 'mid'
    if (income < 150_000) return 'high'
    return 'premium'
  }
  // OFW / Professional / Business Owner
  if (income < 50_000)  return 'entry'
  if (income < 100_000) return 'mid'
  if (income < 150_000) return 'high'
  return 'premium'
}

/* ════════════════════════════════════════════════════════════════════
   POSITIONING MESSAGES  (aspirational, never condescending)
════════════════════════════════════════════════════════════════════ */

const MESSAGES: Record<Segment, Record<RecommendationResult['incomeTier'], string>> = {
  OFW: {
    entry:   'Your hard work abroad deserves a safety net back home. Here\'s a plan built to protect what matters most.',
    mid:     'You\'re building something bigger than just a paycheck. These plans help make sure your family never has to start over.',
    high:    'Your income abroad puts you in a strong position to build lasting wealth. Here\'s how to make every peso work harder.',
    premium: 'You\'ve earned the ability to think beyond just protection. These plans are designed to grow, sustain, and multiply your wealth.',
  },
  Professional: {
    entry:   'Starting a career is just the beginning. Protect your income and secure your future with a plan that grows with you.',
    mid:     'Your expertise is your greatest asset. These plans protect it — and make sure your family is covered no matter what.',
    high:    'Your earning potential is strong. Channel it into plans that build long-term financial security and legacy.',
    premium: 'At your income level, the right financial plan doesn\'t just protect — it multiplies. Here are your top options.',
  },
  'Business Owner': {
    entry:   'Every business starts small. Protect yourself first so your business can keep growing.',
    mid:     'Your business is thriving. Make sure your personal financial plan is just as strong.',
    high:    'Smart business owners protect their income and build personal wealth outside the business. These plans do both.',
    premium: 'Your financial capacity unlocks premium-tier products designed for high-net-worth individuals and their families.',
  },
  Employee: {
    entry:   'Starting your financial journey is the most important step. Here\'s a plan that fits your life right now.',
    mid:     'You\'re in a great position to start building real protection. These plans are structured for your income range.',
    high:    'Your steady income is your biggest advantage. These plans help you turn that into long-term financial security.',
    premium: 'Your income puts you in an elite category. These products are designed for your level of financial readiness.',
  },
}

/* ════════════════════════════════════════════════════════════════════
   CORE RECOMMENDATION LOGIC
════════════════════════════════════════════════════════════════════ */

function buildElite(payTerm: 5 | 7 | 10 | 15, reason: string, priority: 1 | 2 | 3 | 4): ProductRecommendation {
  return {
    ...PRODUCTS.ELITE_SERIES,
    name: `Elite Series (${payTerm}-Pay)`,
    payTerm,
    reason,
    priority,
  }
}

function recommendForMassMarket(income: number): ProductRecommendation[] {
  // OFW | Professional | Business Owner — shared ladder

  if (income >= 150_000) {
    return [
      {
        ...PRODUCTS.PRU_MILLION_PROTECT,
        reason: 'Provides a lump-sum death benefit of up to ₱1 million or more — ideal protection for your family at your income level.',
        priority: 1,
      },
      {
        ...PRODUCTS.PRU_LIFETIME_INCOME,
        reason: 'Guarantees regular cash payouts starting Year 6, giving your family sustainable income — no matter what happens to you.',
        priority: 2,
      },
      buildElite(5, 'A shorter premium-payment term that builds high cash value fast — maximizing returns for those with strong income.', 3),
    ]
  }

  if (income >= 100_000) {
    return [
      buildElite(10, 'A balanced 10-year payment plan that builds strong long-term wealth while keeping premiums manageable.', 1),
      buildElite(7,  'Slightly faster wealth accumulation — a great middle ground between affordability and building value quickly.', 2),
      {
        ...PRODUCTS.PRU_LIFETIME_INCOME,
        reason: 'Guarantees lifetime cash payouts starting Year 6 — a reliable income stream built on top of your existing earnings.',
        priority: 3,
      },
    ]
  }

  if (income >= 50_000) {
    return [
      {
        ...PRODUCTS.PRU_LINK_PLUS,
        reason: 'A variable life plan that combines life insurance with investment — growing your wealth while keeping your family protected.',
        priority: 1,
      },
      buildElite(15, 'A flexible long-term plan with lower annual premiums — an ideal entry point into wealth-building insurance.', 2),
    ]
  }

  // Below 50K — entry-level recommendation
  return [
    {
      ...PRODUCTS.PRU_LOVE,
      reason: 'A straightforward life protection plan that gives your family real coverage without stretching your budget.',
      priority: 1,
    },
    {
      ...PRODUCTS.PRU_LINK_PLUS,
      reason: 'Combines protection and investment in one plan — a great foundation as your income grows.',
      priority: 2,
    },
  ]
}

function recommendForEmployee(income: number): ProductRecommendation[] {
  // Employees follow a structured ladder with stricter tiers

  if (income >= 150_000) {
    return [
      {
        ...PRODUCTS.PRU_MILLION_PROTECT,
        reason: 'Your income qualifies you for premium-tier protection — up to ₱1M+ in life coverage with a strong legacy component.',
        priority: 1,
      },
      {
        ...PRODUCTS.PRU_LIFETIME_INCOME,
        reason: 'Locks in guaranteed lifetime income starting Year 6 — so your family\'s future is secured even after you retire.',
        priority: 2,
      },
      buildElite(5, 'Pay premiums for just 5 years and enjoy full coverage for life — the fastest path to financial independence.', 3),
    ]
  }

  if (income >= 100_000) {
    return [
      buildElite(10, 'A structured 10-year wealth-building plan — consistent premiums, strong returns, and lifetime coverage.', 1),
      {
        ...PRODUCTS.PRU_LIFETIME_INCOME,
        reason: 'Complements your salary with guaranteed cash payouts starting Year 6 — building income beyond your paycheck.',
        priority: 2,
      },
    ]
  }

  if (income >= 80_000) {
    return [
      buildElite(15, 'A long-term plan with manageable premiums that builds real wealth over time — perfect for steady income earners.', 1),
      {
        ...PRODUCTS.PRU_LINK_PLUS,
        reason: 'Gives you both life protection and market-linked investment growth — making the most of your stable income.',
        priority: 2,
      },
    ]
  }

  // Below 80K (but >= 0)
  return [
    {
      ...PRODUCTS.PRU_LINK_PLUS,
      reason: 'A solid foundation plan that grows with your career — protecting your family while building investment value.',
      priority: 1,
    },
    {
      ...PRODUCTS.PRU_LOVE,
      reason: 'Straightforward life protection that keeps your family covered without stretching your current budget.',
      priority: 2,
    },
  ]
}

/* ════════════════════════════════════════════════════════════════════
   PUBLIC API  —  getRecommendations(segment, income)
════════════════════════════════════════════════════════════════════ */

/**
 * Returns a structured recommendation result for a given client profile.
 *
 * @param segment  - Client's occupational segment
 * @param income   - Gross monthly income in PHP
 * @returns        RecommendationResult with max 4 products, positioning message, and metadata
 *
 * @example
 * const result = getRecommendations('OFW', 120_000)
 * // → { segment: 'OFW', income: 120000, incomeTier: 'high', recommended_products: [...], positioning_message: '...' }
 */
export function getRecommendations(
  segment: Segment,
  income: number,
): RecommendationResult {
  const safeIncome = Math.max(0, Math.round(income))
  const tier       = classifyIncome(safeIncome, segment)

  const products =
    segment === 'Employee'
      ? recommendForEmployee(safeIncome)
      : recommendForMassMarket(safeIncome)

  // Enforce max 4 recommendations, sorted by priority
  const recommended_products = products
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 4)

  return {
    segment,
    income:    safeIncome,
    incomeTier: tier,
    recommended_products,
    positioning_message: MESSAGES[segment][tier],
  }
}

/* ════════════════════════════════════════════════════════════════════
   ANSWER → ENGINE INPUT MAPPERS
   Converts raw assessment answers to (segment, income) so the engine
   can be called directly from AssessmentFlow without extra logic.
════════════════════════════════════════════════════════════════════ */

/** Maps the `occupation` question answer → Segment */
const OCCUPATION_TO_SEGMENT: Record<string, Segment> = {
  'Salaried Employee':                    'Employee',
  'OFW (Overseas Filipino Worker)':       'OFW',
  'Business Owner':                       'Business Owner',
  'Freelancer / Professional / Commission': 'Professional',
}

/** Maps the old `incomeType` question answer → Segment (fallback) */
const INCOME_TYPE_TO_SEGMENT: Record<string, Segment> = {
  'Fixed salary (employee)':   'Employee',
  'Mixed (salary + commission)': 'Professional',
  'Pure commission / freelance': 'Professional',
  'Business owner':            'Business Owner',
}

/** Maps the new `monthlyIncome` question → PHP midpoint */
const MONTHLY_INCOME_TO_PHP: Record<string, number> = {
  'Below ₱30,000':          20_000,
  '₱30,001 – ₱60,000':     45_000,
  '₱60,001 – ₱100,000':    80_000,
  '₱100,001 – ₱150,000':  125_000,
  'Above ₱150,000':        175_000,
}

/** Maps the old `monthlyExpenses` question → estimated income proxy (expenses × 1.6) */
const EXPENSE_TO_INCOME_PROXY: Record<string, number> = {
  'Below ₱20,000':          28_000,
  '₱20,001 – ₱40,000':     50_000,
  '₱40,001 – ₱60,000':     80_000,
  '₱60,001 – ₱80,000':    115_000,
  'Above ₱80,000':         150_000,
}

type AnswerInputs = {
  occupation?: string
  monthlyIncome?: string
  incomeType?: string
  monthlyExpenses?: string
}

/**
 * Converts raw assessment answers into the (segment, income) pair
 * needed by the recommendation engine.
 *
 * Priority:
 *   segment → occupation answer > incomeType fallback > 'Professional'
 *   income  → monthlyIncome answer > monthlyExpenses proxy > 50,000
 */
export function answersToEngineInput(answers: AnswerInputs): { segment: Segment; income: number } {
  const segment: Segment =
    (answers.occupation ? OCCUPATION_TO_SEGMENT[answers.occupation] : undefined) ??
    (answers.incomeType ? INCOME_TYPE_TO_SEGMENT[answers.incomeType] : undefined) ??
    'Professional'

  const income: number =
    (answers.monthlyIncome ? MONTHLY_INCOME_TO_PHP[answers.monthlyIncome] : undefined) ??
    (answers.monthlyExpenses ? EXPENSE_TO_INCOME_PROXY[answers.monthlyExpenses] : undefined) ??
    50_000

  return { segment, income }
}

/**
 * One-shot helper — call this with the raw Answers object from AssessmentFlow
 * to get a full RecommendationResult without needing to extract segment/income manually.
 */
export function getRecommendationsFromAnswers(answers: AnswerInputs): RecommendationResult {
  const { segment, income } = answersToEngineInput(answers)
  return getRecommendations(segment, income)
}

/* ════════════════════════════════════════════════════════════════════
   UTILITY HELPERS
════════════════════════════════════════════════════════════════════ */

/**
 * Formats the recommendation result as a clean JSON string.
 * Useful for API responses or debugging.
 */
export function formatRecommendationJSON(result: RecommendationResult): string {
  return JSON.stringify(result, null, 2)
}

/**
 * Quick check — is a given product slug recommended for this client?
 */
export function isRecommended(
  slug: string,
  segment: Segment,
  income: number,
): boolean {
  const result = getRecommendations(segment, income)
  return result.recommended_products.some(p => p.slug === slug)
}

/**
 * Returns only the top-ranked product (priority 1).
 * Useful for a "best match" badge on recommendation cards.
 */
export function getTopRecommendation(
  segment: Segment,
  income: number,
): ProductRecommendation {
  return getRecommendations(segment, income).recommended_products[0]
}
