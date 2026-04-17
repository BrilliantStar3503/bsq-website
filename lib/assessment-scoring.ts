export interface Answers {
  lifeStage?: string
  age?: string           // 'Under 25' | '25–34' | '35–44' | '45–54' | '55 and above'
  /** Engine inputs */
  occupation?: string    // 'Salaried Employee' | 'OFW (Overseas Filipino Worker)' | 'Business Owner' | 'Freelancer / Professional / Commission'
  monthlyIncome?: string // 'Below ₱30,000' | '₱30,001 – ₱60,000' | '₱60,001 – ₱100,000' | '₱100,001 – ₱150,000' | 'Above ₱150,000'
  dependents?: string
  monthlyExpenses?: string
  incomeType?: string
  incomeProtection?: string
  existingCoverage?: string // 'No insurance at all' | 'HMO only ...' | 'Life insurance only' | 'Both life and health insurance'
  medical?: string
  savings?: string
  retirement?: string
  priority?: string
  realProperty?: string  // 'No — I do not own any real property' | 'Yes — I own 1 property' | 'Yes — I own 2 or more properties'
  // ── Conditional: Education Funding ──────────────────────────────
  childrenAge?: string   // 'More than 15 years' | '10–15 years' | '5–10 years' | 'Less than 5 years'
  // ── Conditional: Freelancer / Professional ───────────────────────
  freelancerRisk?: string  // 'I have no HMO or health coverage of my own'
                           // | 'I have no disability protection if I cannot work'
                           // | 'My income is highly irregular month to month'
                           // | 'I rely on 1–2 major clients for most of my income'
  // ── Conditional: Business Owner ─────────────────────────────────
  businessStructure?: string  // 'Sole Proprietorship / Professional Practice' | 'Partnership' | 'Corporation'
  businessValue?: string      // 'Below ₱1 million' | '₱1M – ₱5M' | '₱5M – ₱10M' | '₱10M – ₱50M' | 'Above ₱50M'
  ownershipShare?: string     // 'Less than 25%' | '25–49%' | '50–74%' | '75% or more'
  businessRole?: string       // 'Owner / Sole Proprietor' | 'Managing Partner' | 'President / CEO ...' | 'VP / C-Suite ...'
  numberOfEmployees?: string  // 'None yet — just myself' | '1–10 employees' | '11–50 employees' | 'More than 50 employees'
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

// Protection factor: income resilience (behavioral fact, not confidence)
const incomeMap: Record<string, number> = {
  'Less than 1 month':  0,
  '1–3 months':         1,
  '3–6 months':         2,
  'More than 6 months': 3,
}

// Protection factor: dependent exposure (more dependents = higher risk if unprotected)
const dependentsMap: Record<string, number> = {
  'No — only myself':                    3,
  'Yes — my partner':                    2,
  'Yes — children':                      1,
  'Yes — parents or other family members': 0,
}

// Protection factor: medical coverage (factual instrument anchors, not self-assessment)
// PhilHealth/SSS = minimal (high deductibles, low benefit caps)
// HMO = moderate (annual limits, excludes CI)
// Personal CI/health plan = fully covered (CI riders, surgical, hospitalisation)
const medicalMap: Record<string, number> = {
  'None — I pay out of pocket':                    0,
  'PhilHealth / SSS only':                         1,
  'HMO coverage (employer or personal)':           2,
  'Personal critical illness or health insurance plan': 3,
}

// Savings factor — behavioral anchors, not confidence self-assessment.
// "I set aside a fixed amount" is a verifiable habit; "I have a plan" is not.
const savingsMap: Record<string, number> = {
  "I don't set aside savings regularly":            0,
  'I save when I have extra money (inconsistent)':  1,
  'I set aside a fixed amount every month':         2,
  'I have an active investment or structured savings plan': 3,
}

// Retirement factor — instrument inventory, not confidence.
// SSS/GSIS pension avg ₱8K–₱15K/month; informal savings have no compounding;
// structured plans (VUL, pension) are measurable; multiple strategies = diversified.
const retirementMap: Record<string, number> = {
  "No — I'm relying on SSS / GSIS pension only":          0,
  'No — but I save informally (bank account, piggy bank, etc.)': 1,
  'Yes — I have a structured plan (VUL, pension plan, MP2, etc.)': 2,
  'Yes — I have multiple retirement strategies in place':  3,
}

// Awareness factor: financial concern (not biased by goal type).
// Protection concern = highest awareness of actual financial risk exposure.
// All goals are valid; this measures alignment of concern with protection need.
const priorityAwarenessMap: Record<string, number> = {
  'I have no safety net if something happens to me': 3,
  "I won't have enough money when I retire":          2,
  "I can't fund my children's education":             2,
  "My money isn't growing fast enough":               1,
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

  /* ── Existing coverage modifiers ──────────────────────────────── */
  // Use declared existing coverage to modulate severity — not to suppress
  // gaps entirely (declared coverage may be under-valued or insufficient).
  const hasExistingLife   = answers.existingCoverage === 'Life insurance only' ||
                            answers.existingCoverage === 'Both life and health insurance'
  const hasExistingHealth = answers.existingCoverage === 'HMO only (employer-provided or personal)' ||
                            answers.existingCoverage === 'Both life and health insurance'

  /* ── Age → retirement urgency ──────────────────────────────────── */
  // Older clients with retirement gaps have less time to recover —
  // severity should reflect this, not just the answer value.
  const retirementUrgencyMap: Record<string, number> = {
    'Under 25':      0,  // 35+ years — low urgency even with low score
    '25–34':         1,  // 25–30 years — moderate
    '35–44':         2,  // 15–25 years — elevated
    '45–54':         3,  // 5–15 years — high
    '55 and above':  3,  // fewer than 5 years — critical
  }
  const ageUrgency = retirementUrgencyMap[answers.age ?? ''] ?? 1

  /* ── Gap detection ─────────────────────────────────────────────── */
  const gaps: Gap[] = []

  // Segment flags — used to modulate gap severity and descriptions below
  const isFreelancer = answers.occupation === 'Freelancer / Professional / Commission'

  // Income / life protection gap
  // Downgrade from high → medium if client already has life insurance,
  // since some base coverage exists (even if the amount may be insufficient).
  // Freelancers: no employer sick pay, no 13th month, no group life —
  // consequence language is upgraded to reflect structural exposure.
  if (incomeRaw < 2 || depRaw < 2) {
    const baseSeverity: Gap['severity'] = incomeRaw === 0 ? 'high' : 'medium'
    const freelancerConsequence = isFreelancer
      ? 'As a freelancer, there is no employer sick pay, no 13th month, and no group life insurance to fall back on. A single illness, disability, or death leaves your household with zero income replacement — immediately.'
      : 'If this happens, your family may lose their primary income source with little financial buffer.'
    gaps.push({
      id: 'income',
      title: 'Income Protection Gap',
      description: isFreelancer
        ? 'Your income is not protected if you become unable to work. Unlike salaried employees, freelancers and professionals have no employer-mandated sick leave, disability pay, or income continuation under the Labor Code (RA 6727).'
        : 'Your income is not fully protected if you become unable to work due to illness, disability, or death.',
      consequence: freelancerConsequence,
      severity: hasExistingLife && baseSeverity === 'high' ? 'medium' : baseSeverity,
    })
  }

  // Medical coverage gap
  // PhilHealth (score 1) and HMO (score 2) both leave meaningful gaps in
  // critical illness and major surgery — flag unless they have a personal plan.
  // Freelancers: no employer-provided HMO ever — severity is always HIGH
  // regardless of current HMO status, because there is no employer fallback.
  if (medRaw < 3) {
    const noRealCoverage = medRaw <= 1 && !hasExistingHealth
    // Freelancers without a personal plan are always high — no employer HMO fallback exists
    const freelancerHighRisk = isFreelancer && medRaw <= 2 && !hasExistingHealth
    gaps.push({
      id: 'medical',
      title: 'Medical Coverage Gap',
      description: medRaw === 0
        ? 'You have no health coverage. A single hospitalisation can cost ₱100,000–₱500,000+ out of pocket.'
        : medRaw === 1
          ? 'PhilHealth / SSS covers only a fraction of actual hospital costs and excludes critical illness.'
          : isFreelancer
            ? 'HMO plans have annual limits and exclude critical illness payouts. As a freelancer, you also have no employer-provided HMO to fall back on — your personal plan is your only safety net.'
            : 'HMO plans have annual limits and typically exclude critical illness payouts — a major diagnosis could exhaust your benefit quickly.',
      consequence: 'Medical debt is the leading cause of wiped-out savings in the Philippines.',
      severity: (noRealCoverage || freelancerHighRisk) ? 'high' : 'medium',
    })
  }

  // Savings / growth gap
  if (savRaw < 2) {
    gaps.push({
      id: 'savings',
      title: 'Savings & Growth Gap',
      description: savRaw === 0
        ? 'You are not saving regularly. Without a savings habit, every financial shock hits your daily cash directly.'
        : 'Your savings are inconsistent. Irregular saving means your long-term goals have no reliable funding engine.',
      consequence: 'Without a structured plan, unexpected costs can permanently derail your financial future.',
      severity: savRaw === 0 ? 'high' : 'medium',
    })
  }

  // Retirement gap — severity is amplified by age (fewer years to recover)
  if (retRaw < 2) {
    const ageSeverity: Gap['severity'] =
      ageUrgency >= 3 ? 'high' :
      ageUrgency >= 2 ? 'medium' :
      'low'
    gaps.push({
      id: 'retirement',
      title: 'Retirement Income Gap',
      description: retRaw === 0
        ? 'SSS/GSIS pension alone provides ₱8,000–₱15,000/month — well below the average Filipino family\'s cost of living.'
        : 'Informal savings (bank, piggy bank) have no compounding engine. Without a structured plan, inflation erodes your purchasing power over time.',
      consequence: 'You may outlive your savings without a guaranteed income stream.',
      severity: ageSeverity,
    })
  }

  if (awarenessScore < 50) {
    gaps.push({
      id: 'awareness',
      title: 'Financial Awareness Gap',
      description: 'Your current financial concerns may not be fully aligned with your most urgent protection needs.',
      consequence: 'Misaligned priorities often lead to underinsurance and missed planning opportunities.',
      severity: 'medium',
    })
  }

  if (gaps.length === 0) {
    gaps.push({
      id: 'optimization',
      title: 'Optimization Opportunity',
      description: 'Your foundation is strong, but there may still be gaps in legacy planning or wealth transfer.',
      consequence: 'Without a wealth transfer plan, accumulated assets may not reach the next generation efficiently.',
      severity: 'low',
    })
  }

  // ── Freelancer / Self-Employed Protection gap ───────────────────
  // Always triggered for freelancers — this is a STRUCTURAL gap, not a
  // behavioral one. Regardless of savings/retirement score, freelancers
  // permanently lack the employer safety net that salaried employees have.
  // Description and consequence are personalised by freelancerRisk answer.
  if (isFreelancer) {
    const risk = answers.freelancerRisk ?? ''
    const isDisability   = risk === 'I have no disability protection if I cannot work'
    const isConcentration = risk === 'I rely on 1–2 major clients for most of my income'
    const isIrregular    = risk === 'My income is highly irregular month to month'

    let freelancerDesc: string
    let freelancerConseq: string

    if (isDisability) {
      freelancerDesc =
        'You have identified disability as your top income risk — and it is the most overlooked gap ' +
        'for Filipino freelancers and professionals. Under the Labor Code (RA 6727), independent ' +
        'contractors and self-employed professionals are excluded from mandatory employer benefits: ' +
        'no sick leave pay, no disability leave, no income continuation. SSS Disability Benefit ' +
        'averages only ₱5,000–₱12,000/month — far below the income of most professionals. ' +
        'If you cannot work due to illness, injury, or disability, your income stops the same day.'
      freelancerConseq =
        'A doctor who cannot perform surgery, a lawyer who cannot appear in court, a designer who ' +
        'cannot use their hands — all face immediate, total income loss with no employer buffer. ' +
        'A life insurance plan with disability income and critical illness riders is the only ' +
        'instrument that replaces your income while you recover — keeping your household running ' +
        'and your professional practice alive until you return.'

    } else if (isConcentration) {
      freelancerDesc =
        'You rely on 1–2 major clients for the majority of your income — a concentration risk that ' +
        'exposes your household to sudden income collapse if any one of those clients exits, delays ' +
        'payment, or reduces scope. Unlike a salaried employee whose employer bears the business ' +
        'risk, you absorb 100% of that revenue shock personally. Freelancers with no emergency fund ' +
        'and no income protection coverage are one client termination away from financial hardship.'
      freelancerConseq =
        'Client concentration combined with no emergency fund means a 30-day non-payment or contract ' +
        'termination can cascade into missed mortgage payments, depleted savings, and debt within ' +
        '60–90 days. A structured income protection plan — combined with a 9–12 month emergency fund ' +
        '— is the professional safety net that replaces what an employer salary would normally provide.'

    } else if (isIrregular) {
      freelancerDesc =
        'Your income fluctuates significantly month to month — a defining feature of commission, ' +
        'project-based, and freelance work. The financial planning industry recommends a 9–12 month ' +
        'emergency fund for variable income earners (vs. 3–6 months for salaried employees) precisely ' +
        'because income gaps are unpredictable. Without a structured emergency fund and income ' +
        'protection coverage, a slow month or a gap between contracts directly hits your household expenses.'
      freelancerConseq =
        'Irregular income earners who lack both an adequate emergency fund and life/disability ' +
        'coverage are the most financially vulnerable segment in the Philippines — because every ' +
        'financial shock is amplified by income uncertainty. Structuring a plan that auto-funds your ' +
        'emergency reserve while providing a death and disability safety net removes both risks simultaneously.'

    } else {
      // Default / no HMO selected or no answer
      freelancerDesc =
        'As a freelancer or self-employed professional, you operate outside the Labor Code\'s mandatory ' +
        'employer benefit framework (RA 6727). You have no employer-provided HMO, no group life insurance, ' +
        'no 13th month pay, no sick leave pay, and no employer contribution to your SSS (you pay both ' +
        'the employee and employer share as a voluntary member). Every financial protection that salaried ' +
        'employees receive automatically must be personally sourced and personally funded by you.'
      freelancerConseq =
        'Without a structured personal protection plan, a single medical event, disability period, or ' +
        'income gap hits your household directly — with no employer buffer, no group coverage, and no ' +
        'income continuation mechanism. The longer this gap goes unaddressed, the larger the exposure ' +
        'becomes relative to your income level and lifestyle obligations.'
    }

    gaps.push({
      id: 'freelancerProtection',
      title: 'Freelancer / Self-Employed Protection Gap',
      description: freelancerDesc,
      consequence: freelancerConseq,
      severity: 'high',
    })
  }

  // ── Educational Funding gap ─────────────────────────────────────
  // Triggered when client has children. Urgency = years to enrollment.
  // Recommended when protection baseline is met (existing coverage present)
  // OR always flagged so the advisor can sequence the conversation.
  if (answers.dependents === 'Yes — children') {
    const eduSeverity: Gap['severity'] =
      answers.childrenAge === 'Less than 5 years'  ? 'high'   :
      answers.childrenAge === '5–10 years'         ? 'medium' : 'low'
    gaps.push({
      id: 'education',
      title: 'Educational Funding Gap',
      description: answers.childrenAge === 'Less than 5 years'
        ? 'Your child is close to college age and an education fund has not yet been identified. Top Philippine universities now cost ₱200,000–₱500,000/year in tuition.'
        : 'No dedicated education fund detected. Starting now builds the corpus gradually — the earlier you start, the lower the annual premium required.',
      consequence: 'Without a funded plan, education costs will come directly from savings or income at the time — competing with retirement and emergency needs.',
      severity: eduSeverity,
    })
  }

  // ── Estate Tax gap ──────────────────────────────────────────────
  // Triggered when the client owns real property OR has a business value
  // declared — both are taxable estate assets under TRAIN Law (RA 10963).
  // Severity:
  //   HIGH  → has taxable assets but NO existing life insurance (no liquidity)
  //   MEDIUM → has taxable assets AND life insurance (may be insufficient)
  // Life insurance with an IRREVOCABLE beneficiary is excluded from gross
  // estate (NIRC Sec. 85[e]) — making it the primary estate tax planning tool.
  const ownsProperty   = answers.realProperty === 'Yes — I own 1 property' ||
                         answers.realProperty === 'Yes — I own 2 or more properties'
  const multipleProps  = answers.realProperty === 'Yes — I own 2 or more properties'
  const hasBusinessAssets = answers.occupation === 'Business Owner' && !!answers.businessValue
  const hasEstatableAssets = ownsProperty || hasBusinessAssets

  if (hasEstatableAssets) {
    // Build a context-aware description based on what assets they have
    const assetContext = hasBusinessAssets && ownsProperty
      ? 'real property and business interests'
      : hasBusinessAssets
        ? 'business interests'
        : multipleProps
          ? 'multiple real properties'
          : 'real property'

    // Rough estate tax estimate for business owners (we know their business value range)
    const businessValueMap: Record<string, number> = {
      'Below ₱1 million':   500_000,
      '₱1M – ₱5M':       3_000_000,
      '₱5M – ₱10M':      7_500_000,
      '₱10M – ₱50M':    30_000_000,
      'Above ₱50M':      75_000_000,
    }
    const bizVal        = businessValueMap[answers.businessValue ?? ''] ?? 0
    const standardDed   = 5_000_000
    const familyHomeDed = ownsProperty ? 10_000_000 : 0
    const netEstateFloor = Math.max(0, bizVal - standardDed - familyHomeDed)
    const estTaxFloor    = Math.round(netEstateFloor * 0.06)
    const taxEstimate    = hasBusinessAssets && estTaxFloor > 0
      ? ` Based on your declared business value alone, the minimum estate tax your heirs could face is approximately ₱${estTaxFloor.toLocaleString()} — before adding the value of any real property or other assets.`
      : ''

    gaps.push({
      id: 'estateTax',
      title: 'Estate Tax Liability Gap',
      description:
        `Under the TRAIN Law (Republic Act 10963), your ${assetContext} form part of your gross taxable estate. ` +
        `Upon your death, your heirs are legally required to file an Estate Tax Return (BIR Form 1801) and pay ` +
        `a flat 6% estate tax on the net taxable estate within one year from the date of death — regardless of ` +
        `whether the estate has been legally settled. The net taxable estate is computed as: Gross Estate minus ` +
        `the standard deduction of ₱5,000,000, family home deduction of up to ₱10,000,000, allowable debts, ` +
        `and other deductions.${taxEstimate} ` +
        `Life insurance proceeds payable to an irrevocable beneficiary are fully excluded from the gross estate ` +
        `under the National Internal Revenue Code (NIRC), Section 85(e) — making life insurance the most ` +
        `tax-efficient liquidity instrument for estate settlement in the Philippines.`,
      consequence:
        `Without liquid funds readily available, your heirs face a hard deadline: pay the estate tax within ` +
        `1 year or face a 25% surcharge plus 12% annual interest on the unpaid amount (TRAIN Law, Sec. 249). ` +
        `If your estate consists primarily of real property or a business — both illiquid assets — your ` +
        `family may be forced to sell the property or business at a distressed price just to meet the ` +
        `BIR deadline. A life insurance policy with an irrevocable beneficiary designation delivers the ` +
        `death benefit directly to your family — bypassing estate settlement entirely, zero estate tax on ` +
        `the proceeds, immediately available to pay the BIR bill and preserve the rest of the estate intact.`,
      severity: hasExistingLife ? 'medium' : 'high',
    })
  }

  // ── Business Insurance gap ──────────────────────────────────────
  // Triggered for all Business Owners who answered the business questions.
  // Coverage formula and legal basis differ by business structure:
  //   Sole Prop   → DTI / RA 3883 + Civil Code (no juridical separation)
  //   Partnership → Civil Code Arts. 1767–1867 (Art. 1816 + Art. 1830)
  //   Corporation → RA 11232 Revised Corporation Code (Secs. 2, 95–104)
  if (answers.occupation === 'Business Owner' && answers.businessValue) {
    const struct       = answers.businessStructure ?? 'Sole Proprietorship / Professional Practice'
    const isSoleProp   = struct === 'Sole Proprietorship / Professional Practice'
    const isPartnership = struct === 'Partnership'
    // isCorp retained for downstream recommendation logic
    const isCorp = !isSoleProp

    let gapDescription: string
    let gapConsequence: string

    if (isSoleProp) {
      gapDescription =
        'Under Philippine law, a sole proprietorship has no separate juridical personality from its owner. ' +
        'It is registered under the Business Name Law (RA 3883) through the DTI, but legally, you and your ' +
        'business are one and the same entity. Every peso of business debt is your personal debt. ' +
        'The Civil Code of the Philippines holds you personally liable for all business obligations — ' +
        'there is no corporate veil, no limited liability, and no legal firewall between your personal ' +
        'estate and your business liabilities. Without life insurance equal to the full business value, ' +
        'your family inherits both the business and all of its outstanding obligations.'
      gapConsequence =
        'Upon your death, creditors of the sole proprietorship can go after your personal and family assets — ' +
        'your home, bank accounts, vehicles, and personal property — to settle unpaid business liabilities ' +
        '(Civil Code, Art. 1816 principles applied by analogy). Your family may be forced into a distressed ' +
        'sale of the business at a fraction of its real value just to cover debts you leave behind. ' +
        'Life insurance equal to the full business value is the only instrument that provides immediate ' +
        'liquidity to settle these obligations without sacrificing family assets.'

    } else if (isPartnership) {
      gapDescription =
        'Under the Civil Code of the Philippines, Articles 1767 to 1867, a partnership is a contract ' +
        'where two or more persons bind themselves to contribute money, property, or industry to a common fund, ' +
        'with the intention of dividing the profits among themselves. Critically, Article 1830, paragraph 5, ' +
        'provides that a partnership is dissolved by the death of any general partner — unless the Articles ' +
        'of Partnership expressly provide for continuation by the surviving partners. Article 1816 further ' +
        'holds that all general partners are liable pro rata with their personal property for all obligations ' +
        'contracted by the partnership — meaning your death exposes your estate to full personal liability ' +
        'collection. A life insurance-funded buy-sell agreement — documented in the Articles of Partnership ' +
        'or a separate buy-sell deed — is the legally recognised mechanism that allows surviving partners to ' +
        'purchase your interest cleanly and continue operations without forced dissolution.'
      gapConsequence =
        'Without a funded buy-sell agreement, your death legally dissolves the partnership under Article 1830. ' +
        'Surviving partners must either liquidate and wind down the business or renegotiate new Articles of ' +
        'Partnership — often at a loss, under time pressure, and in conflict with your heirs. Your estate ' +
        'inherits your ownership interest, your share of undistributed profits and losses, and your exposure ' +
        'under Article 1816 (unlimited personal liability for general partners). Disputes between heirs and ' +
        'surviving partners over valuation, liabilities, and settlement terms frequently escalate to ' +
        'litigation — destroying the business and the estate simultaneously.'

    } else {
      // Corporation
      gapDescription =
        'Under the Revised Corporation Code of the Philippines (RA 11232, signed February 2019), Section 2, ' +
        'a corporation is a juridical person separate and distinct from its stockholders and directors. ' +
        'Unlike a sole proprietorship or general partnership, a corporation does not automatically dissolve ' +
        'upon the death of a shareholder. However, your shares of stock pass to your estate and heirs who ' +
        'may have no business intent, no operational role, and no alignment with co-shareholders or the ' +
        'board. For close corporations (RA 11232, Sections 95–104), the Articles of Incorporation may ' +
        'restrict share transfers — but without a life insurance-funded buy-sell agreement, surviving ' +
        'shareholders have no guaranteed, pre-funded mechanism to acquire your shares at a fair, pre-agreed ' +
        'value. The buy-sell agreement, incorporated by reference into the Articles of Incorporation, is ' +
        'the standard corporate governance tool used to manage this risk.'
      gapConsequence =
        'Your heirs become involuntary co-shareholders with full statutory rights under RA 11232 — ' +
        'including the right to inspect books and records (Section 74), demand dividends, vote on major ' +
        'corporate decisions, or petition for dissolution under Sections 133–136. Without a funded buy-sell ' +
        'agreement, surviving shareholders cannot compel a buyout at fair value — and must either accept ' +
        'unwanted co-owners, negotiate an expensive buyout against an adversarial estate, or face business ' +
        'disruption that collapses the valuation for everyone. A life insurance-funded buy-sell agreement, ' +
        'structured within the close corporation framework of RA 11232, gives surviving shareholders the ' +
        'liquidity to purchase your estate\'s shares at the pre-agreed price — cleanly and immediately.'
    }

    gaps.push({
      id: 'businessInsurance',
      title: 'Business Insurance Gap',
      description: gapDescription,
      consequence: gapConsequence,
      severity: 'high',
    })
  }

  // ── Key Man Insurance gap ───────────────────────────────────────
  // Triggered when the client is a high-level executive whose death
  // would materially impact business operations and valuation.
  const isKeyManRole = ['President / CEO / Managing Director', 'Vice President / C-Suite Executive']
    .includes(answers.businessRole ?? '')
  if (answers.occupation === 'Business Owner' && answers.businessValue && isKeyManRole) {
    gaps.push({
      id: 'keyMan',
      title: 'Key Man Insurance Gap',
      description: `As ${answers.businessRole}, your skills, relationships, and leadership are embedded in your business value. Your loss would trigger client attrition, revenue decline, and valuation collapse that the company may not recover from without a cash buffer.`,
      consequence: 'Companies that lose a key executive without insurance funding face an average 20–30% valuation drop in the 12 months following the loss.',
      severity: 'high',
    })
  }

  // ── Employee Retirement gap ─────────────────────────────────────
  // Triggered when Business Owner has 11+ regular employees — the
  // threshold where a structured group retirement benefit becomes
  // both a legal best-practice and a competitive retention tool.
  const hasGroupEligibility = ['11–50 employees', 'More than 50 employees']
    .includes(answers.numberOfEmployees ?? '')
  if (answers.occupation === 'Business Owner' && hasGroupEligibility) {
    gaps.push({
      id: 'employeeRetirement',
      title: 'Employee Retirement Gap',
      description: `With ${answers.numberOfEmployees}, a structured Group Retirement Plan is both a legal best-practice and a powerful staff retention tool. SSS alone is insufficient for your employees' retirement needs.`,
      consequence: 'Businesses without structured retirement benefits have 2× higher employee turnover in the 3–5 year tenure window — directly impacting productivity and recruitment costs.',
      severity: 'medium',
    })
  }

  /* ── Recommendations — sourced from /lib/products.ts primers ─── */
  const recommendations: Recommendation[] = []
  const gapIds = gaps.map(g => g.id)

  // ── Income / Life Protection Gap → PRUMillion Protect ─────────
  if (gapIds.includes('income')) {
    const depExposed = answers.dependents && answers.dependents !== 'No — only myself'
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
      why: answers.savings === "I don't set aside savings regularly"
        ? 'You\'re not saving regularly yet. PAA Plus is designed exactly for this — it builds both protection and investment simultaneously, starting at ₱30,000/year, turning a passive habit into a working financial plan.'
        : 'Your savings are inconsistent. A structured VUL plan automates regular investing while keeping your family protected — removing the discipline problem.',
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
    // Use age for an objective runway calculation instead of life-stage proxies
    const yearsToRetirementMap: Record<string, string> = {
      'Under 25':      '35 or more',
      '25–34':         '25–30',
      '35–44':         '15–25',
      '45–54':         '10–15',
      '55 and above':  'fewer than 10',
    }
    const yearsToRetirement = yearsToRetirementMap[answers.age ?? ''] ??
      (answers.lifeStage === 'Preparing for retirement' ? 'very few' : 'several')
    const urgencyLine = ageUrgency >= 3
      ? 'Every year you delay reduces your guaranteed payout pool significantly.'
      : 'Starting now locks in the highest lifetime payout — the earlier, the more you earn.'
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
      why: `You have no structured retirement fund yet — and SSS/GSIS pension alone won't be enough. With approximately ${yearsToRetirement} years to retirement, establishing a guaranteed income stream now is critical. ${urgencyLine} PRULifetime Income starts paying you back in as early as 6 years — and never stops.`,
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

  // ── Estate Tax Liquidity → PRUMillion Protect ──────────────────
  // Life insurance with irrevocable beneficiary is the only instrument
  // whose proceeds (a) bypass estate settlement and (b) are excluded from
  // gross estate under NIRC Sec. 85(e) — zero estate tax on the payout.
  // Product: PRUMillion Protect — 500% guaranteed death benefit, VUL growth.
  if (gapIds.includes('estateTax')) {
    const hasMultipleProps = answers.realProperty === 'Yes — I own 2 or more properties'
    const hasBizAndProp    = hasBusinessAssets && ownsProperty

    const estateContext = hasBizAndProp
      ? 'Your estate includes both real property and business interests — two illiquid asset classes that your heirs cannot quickly convert to cash to pay the BIR.'
      : hasBusinessAssets
        ? 'Your business is an illiquid asset — your heirs cannot split it into portions to pay the estate tax. Without a separate liquidity source, they face a forced sale.'
        : hasMultipleProps
          ? 'Your multiple properties create a meaningful estate tax obligation. Selling one property to pay the BIR bill takes months — but the 1-year deadline does not.'
          : 'Your real property is part of your gross estate. Without liquid funds set aside, your heirs must raise cash within 1 year to pay the estate tax or face surcharges.'

    const whyNote = hasExistingLife
      ? `You have existing life insurance — but it is critical to verify that the beneficiary designation is IRREVOCABLE. Only irrevocable beneficiary policies are excluded from the gross estate under NIRC Section 85(e). If your policy names a revocable beneficiary or "the estate," the death benefit is included in the taxable estate and taxed at 6%. ${estateContext}`
      : `You currently have no life insurance. ${estateContext} A PRUMillion Protect policy with an irrevocable beneficiary designation delivers the death benefit directly to your family — bypassing estate proceedings entirely, with zero estate tax on the proceeds — available immediately to settle the BIR obligation.`

    recommendations.push({
      id: 11,
      productId: 'pru-million-protect',
      name: 'PRUMillion Protect (Estate Tax Fund)',
      shortName: 'Estate Fund',
      emoji: '🏛️',
      layer: 'Estate Planning Layer',
      category: 'Estate Planning',
      color: '#b45309',
      dot: '#f59e0b',
      slug: 'pru-million-protect',
      what: 'A life insurance policy with an irrevocable beneficiary designation creates an estate tax fund that bypasses settlement, is excluded from the gross estate under NIRC Section 85(e), and delivers liquidity to your heirs within days — not months.',
      why: whyNote,
      keyBenefits: [
        {
          title: 'Excluded from Gross Estate — Zero Estate Tax on Proceeds',
          description: 'Under the National Internal Revenue Code (NIRC), Section 85(e), life insurance proceeds payable to an irrevocable beneficiary are fully excluded from the gross taxable estate. Your heirs receive the full death benefit — no 6% deduction, no BIR claim on it.',
        },
        {
          title: 'Bypasses Estate Settlement — Immediate Liquidity',
          description: 'Unlike property, bank accounts, or business shares (which are frozen during estate settlement), life insurance proceeds are paid directly to the irrevocable beneficiary — available immediately to pay the estate tax bill, settle debts, and preserve the rest of the estate intact.',
        },
      ],
      idealFor: [
        'Property owners and business owners whose estates are primarily illiquid assets',
        'Families who want to prevent a forced sale of the family home or business just to pay the BIR',
      ],
      entryPoint: 'Coverage sized to cover projected estate tax liability (6% of net taxable estate)',
      paymentTerm: 'Regular pay or limited pay — aligned to expected estate settlement timeline',
    })
  }

  // ── Freelancer Protection → PAA Plus (disability + medical riders) ─
  // Freelancers' primary protection need is disability income + medical
  // cost coverage — PAA Plus with CI/disability riders addresses both.
  // Personalised rationale driven by freelancerRisk answer.
  if (gapIds.includes('freelancerProtection')) {
    const risk          = answers.freelancerRisk ?? ''
    const isDisability  = risk === 'I have no disability protection if I cannot work'
    const isConcentration = risk === 'I rely on 1–2 major clients for most of my income'

    const whyRationale = isDisability
      ? 'You flagged disability as your top risk. PAA Plus with Life Care Benefit (LCB) and Daily Hospital Income (DHI) riders pays you a lump sum on diagnosis of any of 36 critical conditions AND a daily cash allowance during hospitalisation — replacing your professional income while you cannot work.'
      : isConcentration
        ? 'With income concentrated in 1–2 clients, a single contract gap or medical event can wipe your cash reserves. PAA Plus builds a growing investment fund alongside disability and medical coverage — so your protection scales as your freelance income grows.'
        : 'As a freelancer with no employer benefits, PAA Plus is your one-plan solution: life protection, critical illness coverage (36 conditions), daily hospital income, and a growing investment account — everything an employer benefit package would cover, owned personally by you.'

    recommendations.push({
      id: 10,
      productId: 'prulink-assurance-account-plus',
      name: 'PRULink Assurance Account Plus',
      shortName: 'PAA Plus',
      emoji: '🔒',
      layer: 'Freelancer Protection Layer',
      category: 'Protection',
      color: '#7c3aed',
      dot: '#a78bfa',
      slug: 'prulink-assurance-account-plus',
      what: 'VUL plan with attachable critical illness (36 conditions), daily hospital income, ICU, and disability riders — the only plan that replaces both your medical costs AND your lost income when you cannot work. No employer benefit package needed.',
      why: whyRationale,
      keyBenefits: [
        {
          title: 'Disability & Critical Illness Income Replacement',
          description: 'Life Care Benefit (LCB) pays 100% of Sum Assured on diagnosis of any of 36 critical conditions. Daily Hospital Income (DHI) pays cash per day of confinement. Together, they replace your professional income while you cannot bill clients.',
        },
        {
          title: 'Your Personal Benefits Package — All in One Plan',
          description: 'No employer HMO, no group life, no sick leave pay — PAA Plus fills all three gaps: life coverage, critical illness protection, and a growing investment fund, starting from ₱30,000/year (Peso) or USD 580/year (Dollar).',
        },
      ],
      idealFor: [
        'Freelancers, consultants, doctors, lawyers, and commission-based professionals with no employer HMO or group life',
        'Self-employed professionals who need disability income protection and personal health coverage in a single plan',
      ],
      entryPoint: 'From ₱30,000/year (Peso) or USD 580/year (Dollar)',
      paymentTerm: 'Regular pay (whole life to pay, up to age 100)',
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
          description: 'Elite 5: ₱200K/yr | Elite 7: ₱150K/yr | Elite 10: ₱120K/yr | Elite 15: ₱85K/yr. Pay a limited term, stop premiums, stay covered and invested for life.',
        },
        {
          title: 'Proven Education & Retirement Tool',
          description: 'Elite 5 at ₱600K/year funds ₱1,178,000/year college tuition at top universities for 4 years. Elite 10 at ₱120K/year generates ₱245,400/year retirement withdrawal for 15 years.',
        },
      ],
      idealFor: [
        'Corporate executives, business owners, OFWs with monthly family income ₱50,000+',
        'Parents funding education at Ateneo, La Salle, UST, or international schools',
      ],
      entryPoint: 'From ₱85,000/year (Elite 15) to ₱200,000/year (Elite 5)',
      paymentTerm: 'Choose: 5, 7, 10, or 15 years — then covered for life',
    })
  }

  // ── Educational Funding → PRUMillion Protect + Elite Series ────
  // Product selection driven by 10% income rule:
  //   Below ₱60K/mo  → PRUMillion Protect (₱21K min, fits budget)
  //   ₱60K–₱100K/mo  → Elite 15 (₱85K/yr ≈ 10% of ₱80K/mo income)
  //   ₱100K–₱150K/mo → Elite 7 (₱150K/yr ≈ 10% of ₱125K/mo income)
  //   Above ₱150K/mo  → Elite 5 (₱200K/yr ≈ 10% of ₱175K/mo income)
  if (gapIds.includes('education')) {
    const incomeMonthly: Record<string, number> = {
      'Below ₱30,000':          20_000,
      '₱30,001 – ₱60,000':     45_000,
      '₱60,001 – ₱100,000':    80_000,
      '₱100,001 – ₱150,000':  125_000,
      'Above ₱150,000':        175_000,
    }
    const monthly = incomeMonthly[answers.monthlyIncome ?? ''] ?? 45_000
    const annualBudget = Math.round(monthly * 0.10 * 12)

    const elitePlan =
      monthly >= 150_000 ? 'Elite 5 (₱200,000/yr)'  :
      monthly >= 100_000 ? 'Elite 7 (₱150,000/yr)'  :
      monthly >=  60_000 ? 'Elite 15 (₱85,000/yr)'  :
      'PRUMillion Protect (from ₱21,000/yr)'

    const eliteSlug = monthly >= 60_000 ? 'elite-series' : 'pru-million-protect'
    const urgencyNote =
      answers.childrenAge === 'Less than 5 years'
        ? 'Your child is near college age — a shorter pay-term plan builds the fund fastest.'
        : answers.childrenAge === '5–10 years'
          ? 'You have a 5–10 year window — enough time to build a meaningful education fund with a structured plan.'
          : 'You have time on your side. Starting now means lower annual premiums and a larger fund at enrollment.'

    recommendations.push({
      id: 6,
      productId: eliteSlug,
      name: monthly >= 60_000 ? 'PRUlink Elite Protector Series' : 'PRUMillion Protect',
      shortName: 'Education Fund',
      emoji: '🎓',
      layer: 'Educational Funding Layer',
      category: 'Education',
      color: '#0ea5e9',
      dot: '#38bdf8',
      slug: eliteSlug,
      what: 'A limited-pay VUL plan used as an education funding vehicle — premiums stop at the end of the pay term, leaving a fully invested fund that covers college tuition without touching retirement savings.',
      why: `Based on the 10% income rule, your recommended education fund budget is approximately ₱${annualBudget.toLocaleString()}/year. The best fit for your income level is ${elitePlan}. ${urgencyNote}`,
      keyBenefits: [
        {
          title: '10% Income Rule — The Right Premium Level',
          description: `At your income level, ₱${annualBudget.toLocaleString()}/year (10% of monthly income × 12) builds sufficient education corpus without over-extending your budget. The fund value grows inside a market-linked investment account.`,
        },
        {
          title: 'Built-In Life Protection for the Payor',
          description: 'If something happens to you before your child reaches college, the plan still pays out — protecting the education goal regardless of what happens to your income.',
        },
      ],
      idealFor: [
        'Parents with children 0–17 years old building a dedicated education corpus',
        'Families targeting top Philippine universities (Ateneo, La Salle, UST) or international schools',
      ],
      entryPoint: monthly >= 60_000 ? `₱85,000/year (Elite 15)` : '₱21,000/year (PRUMillion Protect)',
      paymentTerm: monthly >= 60_000 ? 'Choose: 5, 7, 10, or 15 years — aligned to child\'s enrollment date' : 'Regular pay (whole life)',
    })
  }

  // ── Business Insurance → PRUMillion Protect + Elite Series ─────
  if (gapIds.includes('businessInsurance')) {
    const businessValueMap: Record<string, number> = {
      'Below ₱1 million':   500_000,
      '₱1M – ₱5M':       3_000_000,
      '₱5M – ₱10M':      7_500_000,
      '₱10M – ₱50M':    30_000_000,
      'Above ₱50M':      75_000_000,
    }
    const ownershipMap: Record<string, number> = {
      'Less than 25%': 0.20,
      '25–49%':        0.37,
      '50–74%':        0.62,
      '75% or more':   0.875,
    }
    const rawValue    = businessValueMap[answers.businessValue ?? ''] ?? 3_000_000
    const struct      = answers.businessStructure ?? 'Sole Proprietorship / Professional Practice'
    const isSolePropRec  = struct === 'Sole Proprietorship / Professional Practice'
    const isPartnershipRec = struct === 'Partnership'
    const isCorp      = !isSolePropRec
    const ownership   = ownershipMap[answers.ownershipShare ?? ''] ?? 1.0
    const coverageNeed = isCorp ? Math.round(rawValue * ownership) : rawValue
    const premLow     = Math.round(coverageNeed * 0.03)
    const premHigh    = Math.round(coverageNeed * 0.05)

    const coverageFmt  = `₱${(coverageNeed / 1_000_000).toFixed(1)}M`
    const premFmt      = `₱${(premLow / 1000).toFixed(0)}K – ₱${(premHigh / 1000).toFixed(0)}K`

    let coverageNote: string
    if (isSolePropRec) {
      coverageNote =
        `Under RA 3883 (Business Name Law / DTI) and the Civil Code of the Philippines, a sole ` +
        `proprietorship has no separate juridical personality — you and your business are legally one. ` +
        `You bear 100% personal liability for all business obligations. Full business value coverage ` +
        `of ${coverageFmt} is recommended to protect your family from inheriting your liabilities. ` +
        `Estimated annual premium: ${premFmt}/year (3–5% of insured business value).`
    } else if (isPartnershipRec) {
      coverageNote =
        `Under Civil Code of the Philippines, Articles 1767–1867, your insurable interest as a ` +
        `general partner is your proportional ownership stake — estimated at ${coverageFmt}. ` +
        `Article 1816 holds all general partners personally liable for partnership obligations; ` +
        `Article 1830 dissolves the partnership upon a partner's death unless the Articles of ` +
        `Partnership provide otherwise. A buy-sell agreement funded by this life insurance ensures ` +
        `surviving partners can acquire your interest cleanly without forced dissolution or litigation. ` +
        `Estimated annual premium: ${premFmt}/year.`
    } else {
      coverageNote =
        `Under the Revised Corporation Code (RA 11232, Sec. 2), your corporation is a separate ` +
        `juridical person — but your ${answers.ownershipShare ?? 'proportional'} ownership stake ` +
        `(${coverageFmt}) passes to your estate upon death. Without a buy-sell agreement funded by ` +
        `this life insurance, surviving shareholders have no pre-funded mechanism to acquire your ` +
        `shares at fair value under Sections 95–104 of RA 11232. This prevents heirs from becoming ` +
        `involuntary co-owners or forcing dissolution under Sections 133–136. ` +
        `Estimated annual premium: ${premFmt}/year.`
    }

    recommendations.push({
      id: 7,
      productId: 'pru-million-protect',
      name: 'PRUMillion Protect (Business Insurance)',
      shortName: 'Business Cover',
      emoji: '🏢',
      layer: 'Business Protection Layer',
      category: 'Business',
      color: '#0891b2',
      dot: '#22d3ee',
      slug: 'pru-million-protect',
      what: 'Life insurance vehicle that funds buy-sell agreements, business continuity, and debt protection — ensuring your business value is preserved for your family or partners if something happens to you.',
      why: `${coverageNote} PRUMillion Protect provides the life insurance backbone; Elite Series or PAA Plus can be layered for higher coverage needs.`,
      keyBenefits: [
        {
          title: 'Business Continuity Funding',
          description: `A ${coverageFmt} death benefit ensures your family, partners, or shareholders have the liquidity to settle business obligations, buy out your share, or sustain operations without a distressed sale.`,
        },
        {
          title: 'Protection + Investment in One Plan',
          description: 'Premiums grow inside a PRULink investment fund — your business insurance also builds a cash value asset accessible while you are alive.',
        },
      ],
      idealFor: [
        `${struct} owners with business valued at ${answers.businessValue ?? 'significant value'}`,
        'Business owners with partners, creditors, or staff who depend on the business continuing',
      ],
      entryPoint: `Estimated annual premium: ${premFmt} (3–5% of coverage need)`,
      paymentTerm: 'Regular pay or limited-pay depending on coverage amount',
    })
  }

  // ── Key Man Insurance → PRUMillion Protect ─────────────────────
  if (gapIds.includes('keyMan')) {
    const businessValueMap2: Record<string, number> = {
      'Below ₱1 million':   500_000,
      '₱1M – ₱5M':       3_000_000,
      '₱5M – ₱10M':      7_500_000,
      '₱10M – ₱50M':    30_000_000,
      'Above ₱50M':      75_000_000,
    }
    const keyManCoverage = businessValueMap2[answers.businessValue ?? ''] ?? 3_000_000
    const keyManFmt      = `₱${(keyManCoverage / 1_000_000).toFixed(1)}M`

    recommendations.push({
      id: 8,
      productId: 'pru-million-protect',
      name: 'Key Man Insurance',
      shortName: 'Key Man',
      emoji: '🔑',
      layer: 'Business Continuity Layer',
      category: 'Business',
      color: '#7c3aed',
      dot: '#a78bfa',
      slug: 'pru-million-protect',
      what: 'A life insurance policy owned by the company on the life of a key executive — the death benefit is paid directly to the business to fund continuity, recruitment of a replacement, and value stabilisation.',
      why: `As ${answers.businessRole ?? 'a key executive'}, your contribution is embedded in the company's ${keyManFmt} valuation. Key Man Insurance ensures the company receives a ${keyManFmt} liquidity injection to absorb the financial impact of your loss — protecting employees, clients, and shareholders.`,
      keyBenefits: [
        {
          title: 'Company-Owned, Company-Beneficiary',
          description: 'The business owns the policy and receives the death benefit — bypassing estate settlement delays and ensuring immediate liquidity for business continuity decisions.',
        },
        {
          title: 'Valuation Protection',
          description: `The ${keyManFmt} benefit equals your business valuation — the maximum loss the company faces. This prevents forced liquidation or fire-sale of assets to cover the operational gap.`,
        },
      ],
      idealFor: [
        `${answers.businessRole ?? 'Executive-level'} leaders whose relationships, skills, or contracts are irreplaceable in the short term`,
        'Companies with investors, creditors, or long-term client contracts that depend on specific leadership',
      ],
      entryPoint: 'Minimum Sum Assured: matches business valuation',
      paymentTerm: 'Regular pay (whole life) or limited pay aligned to tenure horizon',
    })
  }

  // ── Employee Retirement → Flexible Product (budget-dependent) ──
  if (gapIds.includes('employeeRetirement')) {
    recommendations.push({
      id: 9,
      productId: 'prulifetime-income',
      name: 'Group Employee Retirement Plan',
      shortName: 'Group Retirement',
      emoji: '👥',
      layer: 'Employee Benefits Layer',
      category: 'Business',
      color: '#059669',
      dot: '#34d399',
      slug: 'prulifetime-income',
      what: 'A structured group retirement benefit where the employer funds individual PRU Life UK policies for eligible employees — any product can be used depending on per-employee budget.',
      why: `With ${answers.numberOfEmployees ?? '11+ employees'}, a Group Retirement Plan is both a legal best-practice and a powerful retention tool. SSS pension (₱8K–₱15K/month average) is insufficient. A funded group plan supplements this and makes your business a preferred employer.`,
      keyBenefits: [
        {
          title: 'Flexible Product Per Employee Budget',
          description: 'Any PRU Life UK product can be structured as a group plan — PRULifetime Income for guaranteed retirement income, Elite Series for wealth accumulation, or PAA Plus for health + retirement in one plan.',
        },
        {
          title: 'Retention + Tax Efficiency',
          description: 'Group retirement premiums paid by the employer are treated as business expense. Employees stay longer when a retirement benefit is vested — reducing the cost of turnover.',
        },
      ],
      idealFor: [
        `Business owners with ${answers.numberOfEmployees ?? '11+'} regular employees seeking competitive retention benefits`,
        'Companies that want to differentiate as an employer of choice in their industry',
      ],
      entryPoint: 'Depends on per-employee budget — as low as ₱21,000/employee/year',
      paymentTerm: 'Annual premium per employee — employer-funded or co-funded with employee',
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
    'No — only myself':                    0,
    'Yes — my partner':                    1,
    'Yes — children':                      2,
    'Yes — parents or other family members': 2,
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
