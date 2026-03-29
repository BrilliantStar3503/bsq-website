export interface Answers {
  lifeStage?: string
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
  name: string
  layer: string
  what: string
  why: string
  dot: string
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

  /* ── Recommendations ───────────────────────────────────────────── */
  const recommendations: Recommendation[] = []
  const gapIds = gaps.map(g => g.id)

  if (gapIds.includes('income')) {
    recommendations.push({
      id: 1,
      name: 'PRUMillion Protect',
      layer: 'Income Replacement Layer',
      what: 'Delivers a lump-sum benefit that replaces years of lost income if you pass away or become permanently disabled.',
      why: 'Your income protection score indicates your family is exposed if your earnings stop.',
      dot: '#ef4444',
    })
  }

  if (gapIds.includes('medical')) {
    recommendations.push({
      id: 2,
      name: 'PRU Health Prime',
      layer: 'Medical Risk Layer',
      what: 'Covers hospitalization, surgeries, and critical illness costs — separating medical costs from your savings.',
      why: 'No adequate medical coverage buffer was detected in your financial profile.',
      dot: '#0ea5e9',
    })
  }

  if (gapIds.includes('savings')) {
    recommendations.push({
      id: 3,
      name: 'PRULink Assurance Account Plus',
      layer: 'Protection + Growth Layer',
      what: 'Combines life insurance with market-linked investment funds — one plan doing two jobs.',
      why: 'Your savings pattern indicates a need for a structured plan that grows alongside coverage.',
      dot: '#22c55e',
    })
  }

  if (gapIds.includes('retirement')) {
    recommendations.push({
      id: 4,
      name: 'PRULifetime Income',
      layer: 'Retirement Income Layer',
      what: 'Converts your savings into a guaranteed monthly income that continues for life.',
      why: 'Your retirement confidence score falls below the protected threshold.',
      dot: '#f59e0b',
    })
  }

  if (recommendations.length === 0 || gapIds.includes('optimization')) {
    recommendations.push({
      id: 5,
      name: 'PRU Elite Series',
      layer: 'Wealth & Legacy Layer',
      what: 'A premium plan for wealth accumulation and clean asset transfer to the next generation.',
      why: 'Your strong foundation is ready for a legacy and wealth optimization strategy.',
      dot: '#8b5cf6',
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
