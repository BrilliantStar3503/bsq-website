export interface Answers {
  lifeStage?: string
  /** Engine inputs — new questions inserted after lifeStage */
  occupation?: string    // 'Salaried Employee' | 'OFW (Overseas Filipino Worker)' | 'Business Owner' | 'Freelancer / Professional / Commission'
  monthlyIncome?: string // 'Below ₱30,000' | '₱30,001 – ₱60,000' | '₱60,001 – ₱100,000' | '₱100,001 – ₱150,000' | 'Above ₱150,000'
  priority?: string
  incomeProtection?: string
  dependents?: string
  savings?: string
  medical?: string
  retirement?: string
  monthlyExpenses?: string
  incomeType?: string
}

export interface Gap {
  id: string
  title: string
  description: string
  consequence: string
  severity: 'high' | 'medium' | 'low'
}

export interface Recommendation {
  id: number
  productId: string
  name: string
  shortName: string
  emoji: string
  layer: string
  category: string
  color: string
  dot: string
  // Card copy — pulled from products.ts
  what: string          // one-liner product description
  why: string           // personalised rationale from assessment answers
  keyBenefits: { title: string; description: string }[]  // top 2 benefits
  idealFor: string[]    // top 2 client profile bullets
  entryPoint: string    // min premium or min SA
  paymentTerm: string
  slug: string          // future funnel page: /products/:slug
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical'

export interface ScoreResult {
  total: number                 // 0–100 weighted composite
  protectionScore: number       // 0–100
  savingsScore: number          // 0–100
  retirementScore: number       // 0–100
  awarenessScore: number        // 0–100
  riskLevel: RiskLevel
  statusLabel: string
  status: 'critical' | 'at-risk' | 'moderate' | 'good'
  explanation: string           // dynamic narrative
  gaps: Gap[]
  recommendations: Recommendation[]
  // Emergency fund calculation
  emergencyFundTarget: number   // in PHP
  emergencyFundMonths: number   // recommended months
  emergencyFundMonthlyExp: number // midpoint of selected expense range
}

/* ─── Answer → raw score maps (0–3) ────────────────────────────────── */

// Protection factor: income resilience
const incomeMap: Record<string, number> = {
  'Less than 3 months': 0,
  '3–6 months': 1,
  '6–12 months': 2,
  'More than 1 year': 3,
}

// Protection factor: dependent exposure (more dependents = higher risk if unprotected)
const dependentsMap: Record<string, number> = {
  'No': 3,
  'Yes — partner': 2,
  'Yes — children': 1,
  'Yes — parents / others': 0,
}

// Protection factor: medical coverage
const medicalMap: Record<string, number> = {
  'No coverage': 0,
  'Minimal coverage': 1,
  'Adequate': 2,
  'Fully covered': 3,
}

// Savings factor
const savingsMap: Record<string, number> = {
  "I haven't started": 0,
  'Started but inconsistent': 1,
  'I have a plan': 2,
  'Very confident': 3,
}

// Retirement factor
const retirementMap: Record<string, number> = {
  'Not confident': 0,
  'Unsure': 1,
  'Somewhat confident': 2,
  'Very confident': 3,
}

// Awareness factor: priority alignment (awareness = knowing what you need)
const priorityAwarenessMap: Record<string, number> = {
  'Protect my income / family': 3,       // highest awareness
  'Prepare for retirement': 2,
  "Plan for my child's education": 2,
  'Grow my savings / investments': 1,
}

// Awareness factor: life stage preparedness expectation
const lifeStageAwarenessMap: Record<string, number> = {
  'Starting out (single / early career)': 2,
  'Building a family': 2,
  'With children': 1,
  'Preparing for retirement': 1,
  'Retired': 3,
}

/* ─── Dynamic explanation generator ─────────────────────────────────── */
function buildExplanation(
  protectionScore: number,
  savingsScore: number,
  retirementScore: number,
  awarenessScore: number,
  riskLevel: RiskLevel
): string {
  const weakAreas: string[] = []
  if (protectionScore < 50) weakAreas.push('low income protection')
  if (savingsScore < 50)    weakAreas.push('limited savings preparedness')
  if (retirementScore < 50) weakAreas.push('insufficient retirement planning')
  if (awarenessScore < 50)  weakAreas.push('limited financial awareness')

  if (riskLevel === 'Critical') {
    return `Your financial profile shows critical exposure across multiple areas${weakAreas.length ? ' — particularly ' + weakAreas.slice(0, 2).join(' and ') : ''}. Immediate action is strongly recommended to prevent long-term financial hardship.`
  }
  if (riskLevel === 'High') {
    return `You currently have a high financial risk exposure due to ${weakAreas.length ? weakAreas.slice(0, 2).join(' and ') : 'gaps in key protection areas'}. Without addressing these gaps, your family's financial future may be at risk if an unexpected event occurs.`
  }
  if (riskLevel === 'Moderate') {
    return `Your financial situation shows moderate risk. You have a basic foundation, but ${weakAreas.length ? weakAreas.slice(0, 2).join(' and ') : 'key areas'} need strengthening to ensure full protection against life's uncertainties.`
  }
  return `Your financial profile indicates relatively low risk. You have strong foundations in most areas. Focusing on ${weakAreas.length ? weakAreas.join(' and ') : 'legacy and optimization strategies'} could further strengthen your long-term security.`
}

/* ─── Main scoring function ─────────────────────────────────────────── */
export function computeScore(answers: Answers): ScoreResult {
  // Raw scores 0–3
  const incomeRaw     = incomeMap[answers.incomeProtection ?? '']  ?? 1
  const depRaw        = dependentsMap[answers.dependents ?? '']    ?? 1
  const medRaw        = medicalMap[answers.medical ?? '']          ?? 1
  const savRaw        = savingsMap[answers.savings ?? '']          ?? 1
  const retRaw        = retirementMap[answers.retirement ?? '']    ?? 1
  const priorityRaw   = priorityAwarenessMap[answers.priority ?? '']       ?? 1
  const lifeStageRaw  = lifeStageAwarenessMap[answers.lifeStage ?? '']     ?? 1

  // Sub-scores normalized to 0–100
  // protectionScore: average of income resilience, dependent exposure, medical coverage
  const protectionScore = Math.round(((incomeRaw + depRaw + medRaw) / 9) * 100)

  // savingsScore: direct from savings answer
  const savingsScore = Math.round((savRaw / 3) * 100)

  // retirementScore: direct from retirement answer
  const retirementScore = Math.round((retRaw / 3) * 100)

  // awarenessScore: composite of priority awareness + life stage alignment
  const awarenessScore = Math.round(((priorityRaw + lifeStageRaw) / 6) * 100)

  // Weighted composite — financial planning model
  const total = Math.round(
    protectionScore  * 0.35 +
    savingsScore     * 0.25 +
    retirementScore  * 0.25 +
    awarenessScore   * 0.15
  )

  // Risk level thresholds
  let riskLevel: RiskLevel
  let statusLabel: string
  let status: ScoreResult['status']

  if (total < 30) {
    riskLevel = 'Critical'; statusLabel = 'Critical Risk'; status = 'critical'
  } else if (total < 50) {
    riskLevel = 'High'; statusLabel = 'At Risk'; status = 'at-risk'
  } else if (total < 70) {
    riskLevel = 'Moderate'; statusLabel = 'Partially Protected'; status = 'moderate'
  } else {
    riskLevel = 'Low'; statusLabel = 'Well Protected'; status = 'good'
  }

  const explanation = buildExplanation(
    protectionScore, savingsScore, retirementScore, awarenessScore, riskLevel
  )

  /* ── Gap detection ─────────────────────────────────────────────── */
  const gaps: Gap[] = []

  if (incomeRaw < 2 || depRaw < 2) {
    gaps.push({
      id: 'income',
      title: 'Income Protection Gap',
      description: 'Your income is not fully protected if you become unable to work due to illness, disability, or death.',
      consequence: 'If this happens, your family may lose their primary income source.',
      severity: incomeRaw === 0 ? 'high' : 'medium',
    })
  }

  if (medRaw < 2) {
    gaps.push({
      id: 'medical',
      title: 'Medical Coverage Gap',
      description: 'No adequate health buffer detected. A major medical event could directly drain your savings.',
      consequence: 'A single hospital event could significantly reduce your lifetime savings.',
      severity: medRaw === 0 ? 'high' : 'medium',
    })
  }

  if (savRaw < 2) {
    gaps.push({
      id: 'savings',
      title: 'Savings & Growth Gap',
      description: 'Your savings rate may not support long-term goals or major life events.',
      consequence: 'Without a structured plan, unexpected costs can derail your financial future.',
      severity: savRaw === 0 ? 'high' : 'medium',
    })
  }

  if (retRaw < 2) {
    gaps.push({
      id: 'retirement',
      title: 'Retirement Income Gap',
      description: 'Your current setup may not generate sufficient income after you stop working.',
      consequence: 'You may outlive your savings without a guaranteed income stream.',
      severity: retRaw === 0 ? 'high' : 'medium',
    })
  }

  if (awarenessScore < 50) {
    gaps.push({
      id: 'awareness',
      title: 'Financial Awareness Gap',
      description: 'Your current financial priorities may not be fully aligned with your protection needs.',
      consequence: 'Misaligned priorities often lead to underinsurance and missed planning opportunities.',
      severity: 'medium',
    })
  }

  if (gaps.length === 0) {
    gaps.push({
      id: 'optimization',
      title: 'Optimization Opportunity',
      description: 'Your foundation is strong, but there may still be gaps in legacy planning or wealth transfer.',
      consequence: 'Without a wealth transfer plan, accumulated assets may not reach the next generation.',
      severity: 'low',
    })
  }

  /* ── Recommendations — sourced from /lib/products.ts primers ─── */
  const recommendations: Recommendation[] = []
  const gapIds = gaps.map(g => g.id)

  // ── Income / Life Protection Gap → PRUMillion Protect ─────────
  if (gapIds.includes('income')) {
    const depExposed = answers.dependents && answers.dependents !== 'No'
    recommendations.push({
      id: 1,
      productId: 'pru-million-protect',
      name: 'PRUMillion Protect',
      shortName: 'PMP',
      emoji: '🛡️',
      layer: 'Income Replacement Layer',
      category: 'Protection',
      color: '#ef4444',
      dot: '#ef4444',
      slug: 'pru-million-protect',
      what: 'Death benefit guaranteed at 500% of your annual premium OR your fund value — whichever is HIGHER. Your family is protected no matter what.',
      why: depExposed
        ? 'You have dependents relying on your income. If your earnings stop, their lifestyle is directly at risk. PRUMillion Protect replaces years of lost income in a single guaranteed payout.'
        : 'Your income resilience score is below the protected threshold. A single critical event — illness, disability, or death — could leave your finances severely exposed.',
      keyBenefits: [
        {
          title: '500% Premium Death Benefit Guarantee',
          description: 'Your beneficiaries receive whichever is higher — 500% of your annual premium or your fund value. If you pay ₱250,000/year, your family gets at least ₱1,250,000.',
        },
        {
          title: 'Protection + Investment Growth',
          description: 'Premiums are invested in PRULink funds (equity, bonds, balanced) based on your risk profile — your money grows while your family stays protected.',
        },
      ],
      idealFor: [
        'Primary breadwinners with dependents',
        'Professionals who want guaranteed high-coverage life insurance with investment upside',
      ],
      entryPoint: 'Ask your advisor for current minimum premium',
      paymentTerm: 'Regular pay (up to age 100)',
    })
  }

  // ── Medical Gap → PRULink Assurance Account Plus (health riders) ─
  if (gapIds.includes('medical')) {
    recommendations.push({
      id: 2,
      productId: 'prulink-assurance-account-plus',
      name: 'PRULink Assurance Account Plus',
      shortName: 'PAA Plus',
      emoji: '🏥',
      layer: 'Medical Risk Layer',
      category: 'Health',
      color: '#0ea5e9',
      dot: '#0ea5e9',
      slug: 'prulink-assurance-account-plus',
      what: 'VUL plan with attachable critical illness (36 conditions), daily hospital income, ICU, surgical reimbursement, and long-term hospitalization riders — separating medical costs from your savings.',
      why: 'No adequate medical coverage was detected in your profile. A single hospital event in the Philippines can cost ₱100,000–₱500,000+. Without coverage, your savings take the hit directly.',
      keyBenefits: [
        {
          title: 'Critical Illness Coverage — 36 Conditions',
          description: 'Life Care Benefit (LCB), Life Care Plus (LCP), and Multiple Life Care Plus (MLCP) riders pay out 100–310% of the benefit amount on diagnosis — keeping your base sum assured intact.',
        },
        {
          title: 'Daily Hospital Income + ICU + Surgical Reimbursement',
          description: 'DHI, ICU, LTH, and SER riders pay daily cash during hospitalization, ICU confinement, and reimburse actual surgical expenses up to coverage limits.',
        },
      ],
      idealFor: [
        'Individuals with no or minimal HMO coverage',
        'Self-employed professionals with no employer health benefits',
      ],
      entryPoint: 'From ₱30,000/year (Peso) or USD 580/year (Dollar)',
      paymentTerm: 'Regular pay (whole life to pay, up to age 100)',
    })
  }

  // ── Savings Gap → PRULink Assurance Account Plus ───────────────
  if (gapIds.includes('savings')) {
    recommendations.push({
      id: 3,
      productId: 'prulink-assurance-account-plus',
      name: 'PRULink Assurance Account Plus',
      shortName: 'PAA Plus',
      emoji: '📈',
      layer: 'Protection + Growth Layer',
      category: 'Investment',
      color: '#22c55e',
      dot: '#22c55e',
      slug: 'prulink-assurance-account-plus',
      what: 'Regular-pay VUL that combines life insurance with market-linked investment across 8 Peso funds and 5 Dollar funds — one plan doing two jobs. Loyalty bonus kicks in on Years 11–20.',
      why: answers.savings === "I haven't started"
        ? 'You haven\'t started saving yet. PAA Plus is designed exactly for this — it builds both protection and investment simultaneously, starting at ₱30,000/year.'
        : 'Your savings pattern is inconsistent. A structured VUL plan automates regular investing while keeping your family protected — removing the discipline problem.',
      keyBenefits: [
        {
          title: 'Loyalty Bonus: Extra Units on Years 11–20',
          description: 'Pay consistently for 10 years and earn an extra 10% (Peso) or 5% (Dollar) allocation on Years 11–20 — your discipline is rewarded with more fund units at no extra cost.',
        },
        {
          title: '8 Peso + 5 Dollar Fund Options',
          description: 'Allocate across PRULink Equity, Growth, Managed, Bond, Proactive, and Money Market funds. Switch between funds (1 free switch per year) based on market conditions.',
        },
      ],
      idealFor: [
        'Young professionals (mid-20s to early 40s) building wealth',
        'First-time insurance buyers starting their financial journey',
      ],
      entryPoint: 'From ₱30,000/year (Peso) or USD 580/year (Dollar)',
      paymentTerm: 'Regular pay (whole life to pay, up to age 100)',
    })
  }

  // ── Retirement Gap → PRULifetime Income ───────────────────────
  if (gapIds.includes('retirement')) {
    const yearsToRetirement =
      answers.lifeStage === 'Preparing for retirement' ? 'few' :
      answers.lifeStage === 'Starting out (single / early career)' ? '30+' : 'several'
    recommendations.push({
      id: 4,
      productId: 'pru-lifetime-income',
      name: 'PRULifetime Income',
      shortName: 'PLI',
      emoji: '🌅',
      layer: 'Retirement Income Layer',
      category: 'Retirement',
      color: '#f97316',
      dot: '#f59e0b',
      slug: 'prulifetime-income',
      what: 'Limited-pay whole life plan that delivers GUARANTEED cash payouts starting at the end of Year 6, every year, for life — plus a 200% Sum Assured death benefit. Not market-dependent.',
      why: `Your retirement confidence is below the protected threshold. With ${yearsToRetirement} years to retirement, establishing a guaranteed income stream now is critical. PRULifetime Income starts paying you back in as early as 6 years — and never stops.`,
      keyBenefits: [
        {
          title: 'Guaranteed Payouts Starting Year 6',
          description: 'Receive a guaranteed lump sum cash payout every year starting at end of Year 6 — for as long as you live, up to age 100. No market dependency, no guessing.',
        },
        {
          title: '200% Death + Maturity Benefit',
          description: 'Beneficiaries receive 200% of Sum Assured + accumulated dividends on death. If you survive to age 100, you receive 200% SA + all accumulated payouts — a guaranteed windfall.',
        },
      ],
      idealFor: [
        'Risk-averse individuals who want guaranteed retirement income (not market-linked)',
        'Those who want cash payouts that start within 6 years of policy start',
      ],
      entryPoint: 'Minimum Sum Assured: ₱250,000',
      paymentTerm: '5 years or 10 years (then covered for life)',
    })
  }

  // ── Optimization / Well-Protected → PRU Elite Series ──────────
  if (recommendations.length === 0 || gapIds.includes('optimization')) {
    const isHighIncome = answers.monthlyExpenses === 'Above ₱80,000' || answers.monthlyExpenses === '₱60,001 – ₱80,000'
    recommendations.push({
      id: 5,
      productId: 'pru-elite-series',
      name: 'PRUlink Elite Protector Series',
      shortName: 'Elite Series',
      emoji: '👑',
      layer: 'Wealth & Legacy Layer',
      category: 'Wealth',
      color: '#7c3aed',
      dot: '#8b5cf6',
      slug: 'elite-series',
      what: 'Limited-pay VUL (pay 5, 7, 10, or 15 years — covered for life) designed for education funding, retirement building, and wealth legacy planning at scale.',
      why: isHighIncome
        ? 'Your financial foundation is strong. The Elite Series is the next level — it can fund your child\'s Ateneo or La Salle education, build a retirement corpus, AND leave a legacy, all in one premium plan.'
        : 'Your foundation is solid. Elite Series helps you scale it — fund major life goals (education, retirement, big-ticket plans) while your money grows inside a market-linked fund.',
      keyBenefits: [
        {
          title: 'Pay for 5–15 Years, Protected Until Age 100',
          description: 'Elite 5: ₱200K/yr | Elite 7: ₱150K/yr | Elite 10: ₱110K/yr | Elite 15: ₱75K/yr. Pay a limited term, stop premiums, stay covered and invested for life.',
        },
        {
          title: 'Proven Education & Retirement Tool',
          description: 'Elite 5 at ₱600K/year funds ₱1,178,000/year college tuition at top universities for 4 years. Elite 10 at ₱125K/year generates ₱245,400/year retirement withdrawal for 15 years.',
        },
      ],
      idealFor: [
        'Corporate executives, business owners, OFWs with monthly family income ₱50,000+',
        'Parents funding education at Ateneo, La Salle, UST, or international schools',
      ],
      entryPoint: 'From ₱75,000/year (Elite 15) to ₱200,000/year (Elite 5)',
      paymentTerm: 'Choose: 5, 7, 10, or 15 years — then covered for life',
    })
  }

  /* ── Emergency Fund Calculation (industry-grade) ───────────────── */

  // Monthly expense range → midpoint value (PHP)
  const expenseRangeMap: Record<string, number> = {
    'Below ₱20,000':       15_000,
    '₱20,001 – ₱40,000':  30_000,
    '₱40,001 – ₱60,000':  50_000,
    '₱60,001 – ₱80,000':  70_000,
    'Above ₱80,000':       90_000,
  }

  // Income type → recommended months (midpoint of industry range)
  const incomeTypeMonthsMap: Record<string, number> = {
    'Fixed salary (employee)':      4.5,   // 3–6 months
    'Mixed (salary + commission)':  7.5,   // 6–9 months
    'Pure commission / freelance':  10.5,  // 9–12 months
    'Business owner':               10.5,  // 9–12 months
  }

  // Dependent adjustment (+months)
  const depAdjMap: Record<string, number> = {
    'No':                    0,
    'Yes — partner':         1,
    'Yes — children':        2,
    'Yes — parents / others':2,
  }

  const emergencyFundMonthlyExp = expenseRangeMap[answers.monthlyExpenses ?? ''] ?? 30_000
  const baseMonths              = incomeTypeMonthsMap[answers.incomeType ?? '']  ?? 4.5
  const depAdjMonths            = depAdjMap[answers.dependents ?? '']            ?? 0
  const emergencyFundMonths     = baseMonths + depAdjMonths
  const emergencyFundTarget     = Math.round(emergencyFundMonthlyExp * emergencyFundMonths)

  return {
    total,
    protectionScore,
    savingsScore,
    retirementScore,
    awarenessScore,
    riskLevel,
    statusLabel,
    status,
    explanation,
    gaps,
    recommendations,
    emergencyFundTarget,
    emergencyFundMonths,
    emergencyFundMonthlyExp,
  }
}
