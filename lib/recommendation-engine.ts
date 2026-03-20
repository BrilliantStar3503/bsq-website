/* ─────────────────────────────────────────────────────────────────────────
   BSQ Financial Recommendation Engine
   Detects financial gaps from user profile data and maps each gap to the
   most suitable PRU Life UK product using rules-based advisor logic.
   ───────────────────────────────────────────────────────────────────────── */

/* ══════════════════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════════════════ */

export interface ClientGoals {
  protection:  boolean
  savings:     boolean
  investment:  boolean
  retirement:  boolean
  education:   boolean
}

export interface ClientProfile {
  age:                number
  gender:             'male' | 'female' | string
  /** Annual gross income (PHP) */
  income:             number
  /** Total liquid savings (PHP) */
  savings:            number
  /** Number of financial dependents */
  dependents:         number
  /** Total in-force life insurance coverage (PHP) */
  existingInsurance:  number
  /** Existing health fund / health insurance coverage (PHP) */
  healthFund:         number
  /** Current retirement savings / fund value (PHP) */
  retirementSavings:  number
  /** User-declared financial goals */
  goals:              ClientGoals
  /** Optional: age of youngest child — used for education projection */
  youngestChildAge?:  number
  /** Optional: client payment preference */
  preferShortPay?:    boolean
  /** Optional: indicate budget-conscious client */
  budgetConscious?:   boolean
}

export type GapType =
  | 'life'
  | 'health'
  | 'retirement'
  | 'education'
  | 'multi-gap'
  | 'none'

export type ClientType = 'wealth-builder' | 'protector' | 'planner'

export type ProductPriority = 1 | 2 | 3 | 4

export interface ProductRecommendation {
  product:      string
  category:     string
  priority:     ProductPriority
  reason:       string
  gapAddressed: string
  gapAmount?:   number
}

/* ─── Internal gap analysis output ─────────────────────────────────────── */

interface GapAnalysis {
  lifeGap:       number
  retirementGap: number
  healthGap:     number
  educationGap:  number
  activeGaps:    GapType[]
  totalGaps:     number
}

/* ══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════════════════════ */

const RETIREMENT_AGE            = 65
const RETIREMENT_INCOME_FACTOR  = 0.50   // 50% of projected income
const RETIREMENT_YEARS          = 20     // 20-year retirement fund
const INCOME_GROWTH_RATE        = 0.04   // 4% pa for income projection
const TUITION_GROWTH_RATE       = 0.10   // 10% pa tuition inflation
const COLLEGE_START_AGE         = 18
const DEFAULT_COLLEGE_YEARS     = 4
const BASE_ANNUAL_TUITION       = 120_000  // PHP — conservative baseline
const MIN_HEALTH_FUND           = 1_500_000
const WEALTH_THRESHOLD          = 1_000_000
const HIGH_INCOME_THRESHOLD     = 2_400_000  // PHP 200k/month

/* ══════════════════════════════════════════════════════════════════════════
   STEP 1 — GAP CALCULATIONS
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Life Protection Gap
 * = (annualIncome × yearsOfDependency) − existingInsurance
 * yearsOfDependency: how many working years remain × dependency weight
 */
function calcLifeGap(profile: ClientProfile): number {
  const yearsOfDependency = Math.max(RETIREMENT_AGE - profile.age, 0)
  const totalNeeded       = profile.income * yearsOfDependency
  return Math.max(totalNeeded - profile.existingInsurance, 0)
}

/**
 * Retirement Gap
 * futureIncome = income × (1 + 4%)^yearsToRetirement
 * annualNeed   = futureIncome × 50%
 * fundNeeded   = annualNeed × 20
 * gap          = fundNeeded − retirementSavings
 */
function calcRetirementGap(profile: ClientProfile): number {
  const yearsToRetirement   = Math.max(RETIREMENT_AGE - profile.age, 0)
  const futureIncome        = profile.income * Math.pow(1 + INCOME_GROWTH_RATE, yearsToRetirement)
  const annualNeed          = futureIncome * RETIREMENT_INCOME_FACTOR
  const retirementFundNeeded = annualNeed * RETIREMENT_YEARS
  return Math.max(retirementFundNeeded - profile.retirementSavings, 0)
}

/**
 * Health Gap
 * If (savings + healthFund) < 1,500,000 → gap exists
 * Gap = 1,500,000 − (savings + healthFund)
 */
function calcHealthGap(profile: ClientProfile): number {
  const available = profile.savings + profile.healthFund
  return Math.max(MIN_HEALTH_FUND - available, 0)
}

/**
 * Education Gap
 * yearsToCollege = 18 − youngestChildAge
 * tuitionAt18    = baseTuition × (1 + 10%)^yearsToCollege
 * totalCost      = Σ tuitionAt18 × (1 + 10%)^i  for each college year
 * gap            = totalCost − existingFund (approx: 0 if no child)
 */
function calcEducationGap(profile: ClientProfile): number {
  if (!profile.goals.education) return 0
  if (profile.youngestChildAge === undefined || profile.youngestChildAge >= COLLEGE_START_AGE) return 0

  const yearsToCollege = COLLEGE_START_AGE - profile.youngestChildAge
  const tuitionAt18    = BASE_ANNUAL_TUITION * Math.pow(1 + TUITION_GROWTH_RATE, yearsToCollege)

  let totalCost = 0
  for (let i = 0; i < DEFAULT_COLLEGE_YEARS; i++) {
    totalCost += tuitionAt18 * Math.pow(1 + TUITION_GROWTH_RATE, i)
  }

  // Use a portion of savings as proxy existing education fund
  const existingFund = 0   // recommendation engine doesn't assume earmarked savings
  return Math.max(Math.round(totalCost) - existingFund, 0)
}

/* ══════════════════════════════════════════════════════════════════════════
   STEP 2 — RUN ALL GAPS
   ══════════════════════════════════════════════════════════════════════════ */

function analyzeGaps(profile: ClientProfile): GapAnalysis {
  const lifeGap       = profile.dependents > 0 ? calcLifeGap(profile)       : 0
  const retirementGap = profile.goals.retirement ? calcRetirementGap(profile) : 0
  const healthGap     = calcHealthGap(profile)
  const educationGap  = calcEducationGap(profile)

  const activeGaps: GapType[] = []
  if (healthGap       > 0) activeGaps.push('health')
  if (lifeGap         > 0) activeGaps.push('life')
  if (retirementGap   > 0) activeGaps.push('retirement')
  if (educationGap    > 0) activeGaps.push('education')
  if (activeGaps.length > 2) activeGaps.push('multi-gap')

  return {
    lifeGap,
    retirementGap,
    healthGap,
    educationGap,
    activeGaps,
    totalGaps: activeGaps.filter(g => g !== 'multi-gap').length,
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   STEP 3 — CLIENT TYPE DETECTION
   ══════════════════════════════════════════════════════════════════════════ */

function detectClientType(profile: ClientProfile, gaps: GapAnalysis): ClientType {
  const activeGoalCount = Object.values(profile.goals).filter(Boolean).length
  if (profile.savings >= WEALTH_THRESHOLD && gaps.totalGaps <= 1)  return 'wealth-builder'
  if (activeGoalCount >= 3 || gaps.totalGaps >= 3)                  return 'planner'
  return 'protector'
}

/* ══════════════════════════════════════════════════════════════════════════
   STEP 4 — PRODUCT RECOMMENDATION RULES
   ══════════════════════════════════════════════════════════════════════════ */

function buildRecommendations(
  profile:    ClientProfile,
  gaps:       GapAnalysis,
  clientType: ClientType,
): ProductRecommendation[] {
  const recs: ProductRecommendation[] = []
  const php = (n: number) => `₱${Math.round(n).toLocaleString('en-PH')}`

  /* ── Rule 1 · HEALTH — Always surface first if gap exists ────────────── */
  if (gaps.healthGap > 0) {
    recs.push({
      product:      'PRU Health Prime',
      category:     'Health & Critical Illness',
      priority:     1,
      reason:       `Your current health and savings buffer is below the ₱1.5M minimum recommended for a serious medical event. A single hospitalization or critical illness diagnosis could wipe out your existing savings and halt every other financial plan you've worked toward. PRU Health Prime ensures that medical expenses are covered separately — so your savings, retirement fund, and family's lifestyle remain intact.`,
      gapAddressed: 'Health Protection Gap',
      gapAmount:    gaps.healthGap,
    })
  }

  /* ── Rule 2 · LIFE PROTECTION ─────────────────────────────────────────── */
  if (gaps.lifeGap > 0 && profile.dependents > 0) {
    const shortPayOrBudget = profile.preferShortPay || profile.budgetConscious || profile.income < 600_000

    if (shortPayOrBudget) {
      recs.push({
        product:      'PRUMillion Protect',
        category:     'Life Protection',
        priority:     1,
        reason:       `With ${profile.dependents} dependent${profile.dependents > 1 ? 's' : ''} relying on your income, there is currently a life protection gap of approximately ${php(gaps.lifeGap)}. PRUMillion Protect gives you high coverage at an affordable premium, so your family's financial future is secured — even if the unexpected happens.`,
        gapAddressed: 'Life Protection Gap',
        gapAmount:    gaps.lifeGap,
      })
    } else {
      recs.push({
        product:      'PRULove for Life',
        category:     'Life Protection',
        priority:     1,
        reason:       `Your income supports ${profile.dependents} dependent${profile.dependents > 1 ? 's' : ''}, and your current coverage leaves a gap of approximately ${php(gaps.lifeGap)}. PRULove for Life provides lifetime protection that grows with your family — ensuring your loved ones are financially secure at every stage of life.`,
        gapAddressed: 'Life Protection Gap',
        gapAmount:    gaps.lifeGap,
      })
    }
  }

  /* ── Rule 3 · MULTI-GAP — More than 2 active gaps ────────────────────── */
  if (gaps.totalGaps > 2) {
    recs.push({
      product:      'PRULink Assurance Account Plus',
      category:     'Multi-Gap: Protection + Investment',
      priority:     2,
      reason:       `You have ${gaps.totalGaps} financial gaps that need attention simultaneously — ${gaps.activeGaps.filter(g => g !== 'multi-gap').join(', ')}. PRULink Assurance Account Plus is a single, flexible plan that addresses protection, savings, and investment growth in one policy. This means you can close multiple gaps without juggling separate premiums.`,
      gapAddressed: 'Life, Retirement & Savings Gaps',
    })
  }

  /* ── Rule 4 · RETIREMENT ──────────────────────────────────────────────── */
  if (gaps.retirementGap > 0 && profile.goals.retirement) {
    recs.push({
      product:      'PRULifetime Income',
      category:     'Retirement Planning',
      priority:     3,
      reason:       `Based on your current income and savings, your projected retirement fund falls short by approximately ${php(gaps.retirementGap)}. PRULifetime Income gives you a guaranteed stream of income during retirement — so you can maintain your lifestyle at 65 and beyond, without relying on family or depleting your savings.`,
      gapAddressed: 'Retirement Fund Gap',
      gapAmount:    gaps.retirementGap,
    })
  }

  /* ── Rule 5 · EDUCATION ───────────────────────────────────────────────── */
  if (gaps.educationGap > 0 && profile.goals.education) {
    recs.push({
      product:      'PRULink Assurance Account Plus',
      category:     'Education & Legacy Fund',
      priority:     2,
      reason:       `With tuition growing at 10% per year, the projected cost of your child's college education is approximately ${php(gaps.educationGap)}. Starting an education fund today through PRULink ensures you build toward that target systematically — protecting your child's future without sacrificing your current cash flow.`,
      gapAddressed: 'Education Funding Gap',
      gapAmount:    gaps.educationGap,
    })
  }

  /* ── Rule 6 · WEALTH BUILDER ──────────────────────────────────────────── */
  if (clientType === 'wealth-builder' && profile.savings >= WEALTH_THRESHOLD && gaps.totalGaps <= 1) {
    recs.push({
      product:      'PRUMillionaire',
      category:     'Wealth Accumulation',
      priority:     4,
      reason:       `Your financial foundation is strong — your savings and protection levels are in good shape. PRUMillionaire allows you to grow your wealth through a premium investment-linked plan with a life coverage component, so your money works harder while your legacy continues to build.`,
      gapAddressed: 'Wealth Growth & Legacy',
    })
  }

  /* ── Rule 7 · HIGH INCOME / ASSET CLIENT ──────────────────────────────── */
  if (profile.income >= HIGH_INCOME_THRESHOLD || profile.savings >= 5_000_000) {
    recs.push({
      product:      'PRU Elite Series',
      category:     'Premium Wealth & Protection',
      priority:     4,
      reason:       `Given your income and asset profile, you qualify for the PRU Elite Series — a comprehensive suite offering premium life coverage, investment management, estate planning, and exclusive advisory services. This is designed for clients who want institutional-grade financial protection and wealth structuring.`,
      gapAddressed: 'High-Net-Worth Financial Strategy',
    })
  }

  /* ── Dedup: remove PRULink duplicates (keep highest priority instance) ── */
  const seen     = new Map<string, number>()
  const deduped: ProductRecommendation[] = []

  for (const rec of recs) {
    const key = rec.product
    if (!seen.has(key)) {
      seen.set(key, deduped.length)
      deduped.push(rec)
    } else {
      const existingIdx = seen.get(key)!
      if (rec.priority < deduped[existingIdx].priority) {
        deduped[existingIdx] = rec
      }
    }
  }

  return deduped
}

/* ══════════════════════════════════════════════════════════════════════════
   STEP 5 — SORT BY PRIORITY
   ══════════════════════════════════════════════════════════════════════════ */

function sortByPriority(recs: ProductRecommendation[]): ProductRecommendation[] {
  return [...recs].sort((a, b) => a.priority - b.priority)
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT — runRecommendationEngine
   ══════════════════════════════════════════════════════════════════════════ */

export interface RecommendationEngineOutput {
  clientType:      ClientType
  gaps:            GapAnalysis
  recommendations: ProductRecommendation[]
}

/**
 * Full recommendation pipeline.
 *
 * 1. Calculates all financial gaps from the client profile
 * 2. Detects client type (wealth-builder / planner / protector)
 * 3. Applies rules-based product matching tied to each gap
 * 4. Returns recommendations sorted by urgency (priority 1 = act now)
 *
 * @example
 * const output = runRecommendationEngine({
 *   age: 32, gender: 'male', income: 600_000, savings: 200_000,
 *   dependents: 2, existingInsurance: 0, healthFund: 0,
 *   retirementSavings: 0, youngestChildAge: 4, preferShortPay: false,
 *   budgetConscious: false,
 *   goals: { protection: true, savings: true, investment: false,
 *             retirement: true, education: true },
 * })
 * // output.recommendations[0].product → 'PRU Health Prime'
 * // output.clientType → 'planner'
 */
export function runRecommendationEngine(
  profile: ClientProfile,
): RecommendationEngineOutput {
  const gaps        = analyzeGaps(profile)
  const clientType  = detectClientType(profile, gaps)
  const raw         = buildRecommendations(profile, gaps, clientType)
  const sorted      = sortByPriority(raw)

  return { clientType, gaps, recommendations: sorted }
}

/* ─── Named re-exports for granular use ────────────────────────────────── */

export {
  analyzeGaps,
  detectClientType,
  calcLifeGap,
  calcRetirementGap,
  calcHealthGap,
  calcEducationGap,
}
