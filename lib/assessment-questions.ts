export interface Question {
  id: string
  question: string
  subtitle?: string
  options: string[]
  /**
   * Optional condition — if provided, this question is only shown when the
   * function returns true for the current answers collected so far.
   * Use Record<string,string> to avoid a circular import with assessment-scoring.ts.
   */
  showIf?: (answers: Record<string, string>) => boolean
}

export const questions: Question[] = [

  // ══════════════════════════════════════════════════════════════════
  //  CORE QUESTIONS  (shown to every client — 13 total)
  // ══════════════════════════════════════════════════════════════════

  // ── 1. Life Stage ────────────────────────────────────────────────
  // Anchors the advisor to the client's family/financial lifecycle.
  // Drives awarenessScore and personalises recommendation copy.
  {
    id: 'lifeStage',
    question: 'Which best describes your current life stage?',
    subtitle: 'This helps us frame your financial priorities in context.',
    options: [
      'Starting out (single / early career)',
      'Building a family',
      'With children',
      'Preparing for retirement',
      'Retired',
    ],
  },

  // ── 2. Age ───────────────────────────────────────────────────────
  // Replaces the subjective "retirement confidence" proxy.
  // Enables an objective retirement runway calculation — a 45-year-old
  // with no retirement plan is in a fundamentally different position
  // than a 25-year-old with the same answer.
  {
    id: 'age',
    question: 'What is your age range?',
    subtitle: 'This calculates your retirement runway and how urgent your protection gaps are.',
    options: [
      'Under 25',
      '25–34',
      '35–44',
      '45–54',
      '55 and above',
    ],
  },

  // ── 3. Occupation ────────────────────────────────────────────────
  // The single most important segmentation variable.
  // Determines the entire product recommendation ladder — Employee vs
  // OFW / Professional / Business Owner have fundamentally different
  // risk profiles, benefit structures, and premium capacities.
  // Also gates the business-specific questions below.
  {
    id: 'occupation',
    question: 'What best describes your work setup?',
    subtitle: 'Your income source shapes which products are actually right for you.',
    options: [
      'Salaried Employee',
      'OFW (Overseas Filipino Worker)',
      'Business Owner',
      'Freelancer / Professional / Commission',
    ],
  },

  // ── 4. Monthly Income ────────────────────────────────────────────
  // Directly determines which product tier is financially accessible.
  // Also drives the 10% education funding budget calculation.
  {
    id: 'monthlyIncome',
    question: 'What is your estimated gross monthly income?',
    subtitle: 'This determines which plans fit your budget — not to judge, only to match.',
    options: [
      'Below ₱30,000',
      '₱30,001 – ₱60,000',
      '₱60,001 – ₱100,000',
      '₱100,001 – ₱150,000',
      'Above ₱150,000',
    ],
  },

  // ── 5. Dependents ────────────────────────────────────────────────
  // The presence and type of dependents affects both life coverage
  // urgency and the emergency fund multiplier.
  // Also gates the education funding question below.
  {
    id: 'dependents',
    question: 'Do you financially support anyone?',
    subtitle: 'Anyone who relies on your income to live — partner, children, parents.',
    options: [
      'No — only myself',
      'Yes — my partner',
      'Yes — children',
      'Yes — parents or other family members',
    ],
  },

  // ── 6. Monthly Expenses ─────────────────────────────────────────
  // Used to calculate the emergency fund target in PHP.
  {
    id: 'monthlyExpenses',
    question: 'What are your estimated monthly essential expenses?',
    subtitle: 'Include housing, utilities, food, transportation, and debt payments only.',
    options: [
      'Below ₱20,000',
      '₱20,001 – ₱40,000',
      '₱40,001 – ₱60,000',
      '₱60,001 – ₱80,000',
      'Above ₱80,000',
    ],
  },

  // ── 7. Income Stability ──────────────────────────────────────────
  // Determines recommended emergency fund duration (months).
  // Freelancers need 9–12 months; salaried employees need 3–6.
  {
    id: 'incomeType',
    question: 'How stable is your income month to month?',
    subtitle: 'Variable income earners need a larger financial cushion than salaried employees.',
    options: [
      'Fixed salary (employee)',
      'Mixed (salary + commission)',
      'Pure commission / freelance',
      'Business owner',
    ],
  },

  // ── 8. Income Resilience ─────────────────────────────────────────
  // Strongest single indicator of financial vulnerability.
  // Unlike confidence questions, this is a behavioral fact — exactly
  // how long the client can survive without income.
  {
    id: 'incomeProtection',
    question: 'If your income stopped today, how long could you cover your expenses?',
    subtitle: 'Be honest — this is the most important question for your protection score.',
    options: [
      'Less than 1 month',
      '1–3 months',
      '3–6 months',
      'More than 6 months',
    ],
  },

  // ── 9. Existing Coverage ─────────────────────────────────────────
  // Prevents recommending products the client already has.
  // Used to modulate gap severity — existing coverage downgrades
  // severity rather than suppressing gaps entirely.
  {
    id: 'existingCoverage',
    question: 'Do you currently have any life or health insurance?',
    subtitle: 'This prevents us from recommending what you already have.',
    options: [
      'No insurance at all',
      'HMO only (employer-provided or personal)',
      'Life insurance only',
      'Both life and health insurance',
    ],
  },

  // ── 10. Medical Coverage Quality ─────────────────────────────────
  // Factual instrument anchors — not self-assessment.
  // PhilHealth alone covers very little; HMO has annual limits;
  // personal CI plans are most comprehensive.
  {
    id: 'medical',
    question: 'Which best describes your current health coverage?',
    subtitle: 'PhilHealth and HMO alone leave significant gaps in critical illness and major surgery.',
    options: [
      'None — I pay out of pocket',
      'PhilHealth / SSS only',
      'HMO coverage (employer or personal)',
      'Personal critical illness or health insurance plan',
    ],
  },

  // ── 11. Savings Behaviour ────────────────────────────────────────
  // Behavioral anchors — not confidence self-assessment.
  // "I set aside a fixed amount" is verifiable; "I have a plan" is not.
  {
    id: 'savings',
    question: 'Which best describes your savings behaviour right now?',
    subtitle: 'What you actually do matters more than what you plan to do.',
    options: [
      "I don't set aside savings regularly",
      'I save when I have extra money (inconsistent)',
      'I set aside a fixed amount every month',
      'I have an active investment or structured savings plan',
    ],
  },

  // ── 12. Retirement Readiness (Fact-Based) ────────────────────────
  // Instrument inventory — not confidence.
  // SSS/GSIS pension averages ₱8K–₱15K/month.
  {
    id: 'retirement',
    question: 'Do you have a dedicated retirement fund or plan?',
    subtitle: 'SSS pension alone averages ₱8,000–₱15,000/month — far below most comfort levels.',
    options: [
      "No — I'm relying on SSS / GSIS pension only",
      'No — but I save informally (bank account, piggy bank, etc.)',
      'Yes — I have a structured plan (VUL, pension plan, MP2, etc.)',
      'Yes — I have multiple retirement strategies in place',
    ],
  },

  // ── 13. Primary Financial Concern ────────────────────────────────
  // Concern-based — less biased than "priority".
  // All goals are valid; used for awarenessScore and results narrative.
  {
    id: 'priority',
    question: 'What is your biggest financial concern right now?',
    subtitle: 'Choose the one that worries you most.',
    options: [
      'I have no safety net if something happens to me',
      "I won't have enough money when I retire",
      "I can't fund my children's education",
      "My money isn't growing fast enough",
    ],
  },


  // ══════════════════════════════════════════════════════════════════
  //  CONDITIONAL — EDUCATION FUNDING
  //  Shown only when client has children (dependents Q5)
  // ══════════════════════════════════════════════════════════════════

  // ── 14. Children's Education Timeline ───────────────────────────
  // WHY: Urgency of education funding is determined by years to
  // enrollment. A child starting college in 3 years requires a
  // completely different plan than one starting in 15 years.
  // Also determines gap severity in the scoring engine.
  {
    id: 'childrenAge',
    question: 'How many years until your youngest child starts college?',
    subtitle: 'Based on the 10% income rule, we will match an education fund to your budget.',
    options: [
      'More than 15 years',
      '10–15 years',
      '5–10 years',
      'Less than 5 years',
    ],
    showIf: (a) => a.dependents === 'Yes — children',
  },


  // ══════════════════════════════════════════════════════════════════
  //  CONDITIONAL — BUSINESS OWNER QUESTIONS
  //  Shown only when occupation = Business Owner (Q3)
  //  Covers: Business Insurance, Key Man, Employee Retirement
  // ══════════════════════════════════════════════════════════════════

  // ── 15. Business Legal Structure ────────────────────────────────
  // WHY: The insurance formula changes completely by business type.
  // Sole prop → 3–5% of business value as premium.
  // Corporation → coverage = ownership % × company valuation.
  // Partnership → coverage = partnership share % × total value.
  {
    id: 'businessStructure',
    question: 'What is the legal structure of your business?',
    subtitle: 'This determines the correct formula for calculating your business insurance need.',
    options: [
      'Sole Proprietorship / Professional Practice',
      'Partnership',
      'Corporation',
    ],
    showIf: (a) => a.occupation === 'Business Owner',
  },

  // ── 16. Business Value ──────────────────────────────────────────
  // WHY: Coverage amount = current market value if the business were
  // sold today (3-year valuation method as instructed).
  // For sole prop: annual premium = 3–5% of this value.
  // For corp/partnership: coverage = ownership% × this value.
  {
    id: 'businessValue',
    question: 'What is the estimated current value of your business if sold today?',
    subtitle: 'Think of what a buyer would pay for it today — not future projections.',
    options: [
      'Below ₱1 million',
      '₱1M – ₱5M',
      '₱5M – ₱10M',
      '₱10M – ₱50M',
      'Above ₱50M',
    ],
    showIf: (a) => a.occupation === 'Business Owner',
  },

  // ── 17. Ownership Share ──────────────────────────────────────────
  // WHY: For corporations and partnerships, the insurable interest is
  // the client's proportional ownership — not the full company value.
  // Coverage = ownership% × business valuation.
  {
    id: 'ownershipShare',
    question: 'What percentage of the business do you own?',
    subtitle: 'For corporations and partnerships, your coverage is based on your ownership stake.',
    options: [
      'Less than 25%',
      '25–49%',
      '50–74%',
      '75% or more',
    ],
    showIf: (a) =>
      a.occupation === 'Business Owner' &&
      (a.businessStructure === 'Partnership' || a.businessStructure === 'Corporation'),
  },

  // ── 18. Business Role ────────────────────────────────────────────
  // WHY: Key Man Insurance is specifically for high-level executives
  // whose death or departure would materially damage the business.
  // President, VP, CEO, C-suite = eligible for Key Man coverage.
  {
    id: 'businessRole',
    question: 'What is your primary role in the business?',
    subtitle: 'Key Man Insurance applies to executives whose loss would significantly impact operations.',
    options: [
      'Owner / Sole Proprietor',
      'Managing Partner',
      'President / CEO / Managing Director',
      'Vice President / C-Suite Executive',
    ],
    showIf: (a) => a.occupation === 'Business Owner',
  },

  // ── 19. Number of Employees ─────────────────────────────────────
  // WHY: Employee Retirement plans are recommended when there are at
  // least 11 regular employees — the threshold for group benefit
  // eligibility and legal best-practice in the Philippines.
  {
    id: 'numberOfEmployees',
    question: 'How many regular employees does your business have?',
    subtitle: 'A structured employee retirement benefit is recommended for businesses with 11 or more regular staff.',
    options: [
      'None yet — just myself',
      '1–10 employees',
      '11–50 employees',
      'More than 50 employees',
    ],
    showIf: (a) => a.occupation === 'Business Owner',
  },
]
