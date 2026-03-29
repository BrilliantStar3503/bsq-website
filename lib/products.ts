/**
 * PRU Life UK — Product Knowledge Base
 * Source: Official Product Primers (extracted March 2026)
 * District: Brilliant Star Quartz (BSQ) / Quartz District
 *
 * This file is the single source of truth for all product data used across
 * the prubsq.com website — recommendations, funnel pages, and insights.
 */

export interface PruProduct {
  id: string
  name: string
  shortName: string
  tagline: string
  category: 'protection' | 'vul' | 'traditional' | 'income'
  color: string           // hex accent for UI
  emoji: string
  // Core identity
  whatItIs: string        // 1-sentence definition
  problemItSolves: string // the pain point it addresses
  idealFor: string[]      // target client profile bullet points
  notFor: string[]        // who should NOT get this
  // Key benefits (for recommendation cards and funnel pages)
  keyBenefits: {
    title: string
    description: string
  }[]
  // Numbers and figures
  specs: {
    productType: string
    paymentTerms: string
    issueAge: string
    minPremium?: string
    minSumAssured?: string
    deathBenefit: string
    maturityBenefit?: string
    benefitTerm: string
    currency: string
  }
  // Facebook Ad hooks — emotional angles
  fbHooks: string[]
  // Unique selling points (USPs)
  usps: string[]
  // Riders available
  riders: string[]
  // Assessment gap IDs this product addresses
  addressesGaps: string[]  // matches Gap.id in assessment-scoring.ts
  // Funnel page slug
  slug: string
}

export const products: PruProduct[] = [

  /* ══════════════════════════════════════════════════════════════
     1. PRUMillion Protect (PMP)
     ══════════════════════════════════════════════════════════════ */
  {
    id: 'pru-million-protect',
    name: 'PRUMillion Protect',
    shortName: 'PMP',
    tagline: 'Million-Peso Protection That Grows With You',
    category: 'vul',
    color: '#ef4444',
    emoji: '🛡️',
    whatItIs:
      'A Variable Unit-Linked (VUL) life insurance plan that guarantees a minimum death benefit of 500% of your annual premium — whichever is higher between that or your fund value.',
    problemItSolves:
      'Most Filipinos are underinsured. If something happens to the breadwinner, families are left with insufficient funds to maintain their lifestyle, pay off debts, or cover future needs.',
    idealFor: [
      'Primary breadwinners with dependents',
      'Individuals who want guaranteed high-coverage life insurance with investment upside',
      'Those who want protection that does not shrink — death benefit is the HIGHER of 500% premium or fund value',
      'Clients in their 20s–50s building a financial legacy',
      'Employees and self-employed professionals who need income replacement protection',
    ],
    notFor: [
      'Those looking only for pure savings with no life coverage need',
      'Retirees with no dependents',
    ],
    keyBenefits: [
      {
        title: '500% Premium Death Benefit Guarantee',
        description:
          'Your beneficiaries receive whichever is HIGHER — 500% of your annual premium or your fund value. If you paid ₱250,000/year and your fund is ₱1,000,000, your family gets ₱1,250,000.',
      },
      {
        title: 'Investment Growth Component',
        description:
          'Premiums are invested in PRULink funds (equity, bonds, balanced) based on your risk profile — your money grows while you stay protected.',
      },
      {
        title: 'Flexible Fund Options',
        description:
          'Choose from multiple Peso and Dollar investment funds based on your risk appetite — conservative, moderate, or aggressive.',
      },
      {
        title: 'Adjustable Coverage',
        description:
          'Increase or decrease regular premiums as your life situation changes. Top-ups allowed for additional investment.',
      },
      {
        title: 'Comprehensive Rider Options',
        description:
          'Add critical illness, disability, hospital income, and accident riders for complete financial protection.',
      },
    ],
    specs: {
      productType: 'Variable Unit-Linked (VUL) Life Insurance',
      paymentTerms: 'Regular pay (up to age 100)',
      issueAge: '0 to 70 years old',
      minPremium: 'Ask your advisor for current minimum',
      deathBenefit: 'Higher of: 500% of annual premium OR fund value (plus 125% of top-ups, less 125% of withdrawals)',
      maturityBenefit: 'Sum assured + fund value at age 100',
      benefitTerm: 'Up to age 100',
      currency: 'Philippine Peso and US Dollar',
    },
    fbHooks: [
      'What happens to your family if you\'re gone tomorrow? This plan guarantees they get 500% of what you paid.',
      'Ang laki ng trabaho mo para sa pamilya mo. Siguraduhin na protektado sila kahit wala ka na.',
      'Most Filipinos are UNDERINSURED. Are you one of them? Find out in 2 minutes.',
      'Your family deserves more than just love — they deserve financial security. See how PRUMillion Protect works.',
      'If you stopped earning today, how long would your family survive? This plan answers that question.',
    ],
    usps: [
      'Death benefit = HIGHER of 500% premium or fund value (guaranteed floor)',
      'Investment growth potential on top of protection',
      'Dollar option available for inflation protection',
      'Riders for critical illness, disability, hospitalization, and accident',
    ],
    riders: [
      'Total and Permanent Disability (TPD)',
      'Accidental Death and Disablement (ADD)',
      'Critical Illness (LCB, LCP, MLCP, LCAP)',
      'Hospital Income (DHI, ICU, LTH, SER)',
      'Personal Accident (PA)',
      'Waiver of Premium on TPD',
      'Life Care Waiver',
      'Payor Waiver of Premium',
    ],
    addressesGaps: ['income', 'savings', 'awareness'],
    slug: 'pru-million-protect',
  },

  /* ══════════════════════════════════════════════════════════════
     2. PRUlink Elite Protector Series
     ══════════════════════════════════════════════════════════════ */
  {
    id: 'pru-elite-series',
    name: 'PRUlink Elite Protector Series',
    shortName: 'Elite Series',
    tagline: 'Premium Protection for Life\'s Biggest Milestones',
    category: 'vul',
    color: '#7c3aed',
    emoji: '👑',
    whatItIs:
      'A limited-pay Variable Unit-Linked (VUL) life insurance plan with 4 payment term variants (5, 7, 10, 15 years), designed for higher-income clients who want maximum protection and investment growth with a defined payment period.',
    problemItSolves:
      'Higher-income Filipinos need a plan that matches their financial ambitions — funding children\'s education at top schools, building a retirement nest egg, achieving major life goals, AND maintaining family protection — all in one premium plan.',
    idealFor: [
      'Corporate executives and senior management',
      'Business owners and entrepreneurs',
      'OFWs (overseas Filipino workers) with high remittances',
      'High-earning professionals (doctors, lawyers, engineers)',
      'Families with monthly income of ₱50,000 and above',
      'Those wanting to fund education at top universities (Ateneo, La Salle, UST, UP)',
      'Those planning for retirement income at age 60',
    ],
    notFor: [
      'Those with monthly family income below ₱25,000',
      'Those whose primary need is emergency fund building',
      'Short-term investors',
    ],
    keyBenefits: [
      {
        title: 'Pay for Only 5–15 Years, Protected for Life',
        description:
          'Choose Elite 5, 7, 10, or 15 — pay premiums for a limited period while your policy stays active and invested until age 100.',
      },
      {
        title: 'Education Funding Power',
        description:
          'Elite 5 with ₱600,000/year can fund ₱1,178,000/year tuition at Ateneo or La Salle for 4 years of college. Total premiums paid: ₱3,000,000 vs. college cost ₱4,711,392.',
      },
      {
        title: 'Retirement Income Builder',
        description:
          'Elite 10 with ₱125,000/year can provide ₱245,400/year withdrawal for 15 years of retirement starting at age 60.',
      },
      {
        title: 'Legacy & Income Protection',
        description:
          'Elite 15 with just ₱75,000/year can build a ₱5,600,000+ sum assured to protect your family for 16+ years.',
      },
      {
        title: 'Loyalty Bonus (Elite 15)',
        description:
          'Pay for 10 years consistently and earn a 10% loyalty bonus on years 11–15 — your premiums buy more units as a reward.',
      },
    ],
    specs: {
      productType: 'Limited-Pay Variable Unit-Linked (VUL) Life Insurance',
      paymentTerms: 'Elite 5 (5 years), Elite 7 (7 years), Elite 10 (10 years), Elite 15 (15 years)',
      issueAge: '0 to 70 years old',
      minPremium:
        'Elite 5: ₱200,000/year | Elite 7: ₱150,000/year | Elite 10: ₱110,000/year | Elite 15: ₱75,000/year',
      deathBenefit:
        'Sum assured + fund value + 125% of top-ups (less 125% of withdrawals)',
      maturityBenefit: 'Sum assured + fund value at age 100',
      benefitTerm: 'Up to age 100',
      currency: 'Philippine Peso and US Dollar',
    },
    fbHooks: [
      'Pay for only 5 years. Protected for LIFE. Is that even possible? Yes — and here\'s how.',
      'Planning your child\'s education at Ateneo or La Salle? This single plan can cover all 4 years.',
      'You worked hard for your money. Make it work harder for you — with protection + investment in one.',
      'Retire at 60 with guaranteed income for 15 years. Start with as low as ₱125,000/year.',
      'What if you could stop paying premiums after 7 years and still be covered until age 100?',
    ],
    usps: [
      'Limited payment terms — stop paying, stay covered',
      'Multiple variants for different income levels (Elite 5/7/10/15)',
      'Proven education and retirement funding tool',
      'High allocation to investment from Year 1 vs. competitors',
      'Lower surrender charges than major competitors',
      'Loyalty bonus on Elite 15 for consistent payers',
    ],
    riders: [
      'Accelerated Crisis Cover Benefit (CCB)',
      'Accelerated Life Care Benefit (LCB)',
      'Life Care Plus (LCP)',
      'Multiple Life Care Plus (MLCP)',
      'Life Care Advance Plus (LCAP)',
      'Daily Hospital Income (DHI)',
      'Intensive Care Unit (ICU)',
      'Long Term Hospitalization (LTH)',
      'Surgical Expense Reimbursement (SER)',
      'Additional Term',
      'Payor Term',
      'Personal Accident (PA)',
      'Waiver of Premium on TPD (WPTPD)',
      'Life Care Waiver (LCW)',
      'Payor Waiver of Regular Premium',
    ],
    addressesGaps: ['income', 'savings', 'retirement'],
    slug: 'elite-series',
  },

  /* ══════════════════════════════════════════════════════════════
     3. PRULifetime Income
     ══════════════════════════════════════════════════════════════ */
  {
    id: 'pru-lifetime-income',
    name: 'PRULifetime Income',
    shortName: 'PLI',
    tagline: 'Guaranteed Income for Life — Starting Year 6',
    category: 'traditional',
    color: '#f97316',
    emoji: '🌅',
    whatItIs:
      'A limited-pay whole life participating plan that provides guaranteed cash payouts starting at the END of the 6th policy year and every year after — for life — PLUS a 200% sum assured death benefit.',
    problemItSolves:
      'Most Filipinos have no guaranteed retirement income. When savings run out, they become financially dependent on their children. PRULifetime Income provides a stream of cash that arrives every year — regardless of markets — until age 100.',
    idealFor: [
      'Individuals who want GUARANTEED income (not market-dependent)',
      'Those planning for retirement who want certainty over market exposure',
      'Parents who want to leave a 200% death benefit to their children',
      'Business owners who want to plan around volatile income periods',
      'Anyone who wants cash payouts starting in as early as 6 years',
      'Families who want guaranteed education fund triggered on year 6',
    ],
    notFor: [
      'Those looking for high investment returns (this is a traditional plan)',
      'Clients above 60 years old (issue age limit)',
    ],
    keyBenefits: [
      {
        title: 'Guaranteed Payouts Starting Year 6',
        description:
          'Starting at the end of your 6th policy year, you receive a guaranteed lump sum cash payout every year — for as long as you live, up to age 100.',
      },
      {
        title: '200% Death Benefit',
        description:
          'Your beneficiaries receive 200% of the Sum Assured plus accumulated dividends if you pass away before age 100. Minimum SA: ₱250,000.',
      },
      {
        title: '200% Maturity Benefit at Age 100',
        description:
          'If you\'re alive at policy maturity, you receive 200% of your Sum Assured plus all accumulated dividends and payouts — a full windfall.',
      },
      {
        title: 'Non-Guaranteed Dividends on Top',
        description:
          'Annual dividends are payable from the 3rd policy year. Current dividend accumulation rate: 4.00%. These compound on top of your guaranteed payouts.',
      },
      {
        title: 'Pay for Only 5 or 10 Years',
        description:
          'Choose your premium payment term — 5 years or 10 years — then receive payouts for life. Pay once, earn forever.',
      },
      {
        title: 'Policy Loan Up to 80% of Cash Value',
        description:
          'Need cash fast? Access up to 80% of your accumulated cash value as a policy loan without terminating your plan.',
      },
    ],
    specs: {
      productType: 'Limited-Pay Whole Life Participating Traditional Plan',
      paymentTerms: '5 years or 10 years',
      issueAge: '0 to 60 years old (insured); policyowner must be 18+',
      minSumAssured: '₱250,000',
      deathBenefit: '200% of Sum Assured + accumulated dividends — less any outstanding policy loans',
      maturityBenefit: '200% of Sum Assured + accumulated dividends at age 100',
      benefitTerm: 'Up to age 100',
      currency: 'Philippine Peso',
    },
    fbHooks: [
      'What if you could retire with a guaranteed paycheck every year — for life? Not a dream. This is real.',
      'Start receiving cash payouts in as early as 6 years. No stock market. No gamble. GUARANTEED.',
      'Paano mo malalaman kung may pera kang natitira pagkatapos mag-retire? Ang sagot ay PRULifetime Income.',
      'Your retirement should not depend on your savings account balance. Secure a guaranteed income stream today.',
      'Pay for only 10 years. Get paid for the rest of your life. That\'s the math of PRULifetime Income.',
    ],
    usps: [
      'Guaranteed payouts — NOT subject to market performance',
      'Payouts start in as early as 6 years (while still working)',
      '200% death AND maturity benefit',
      'Non-guaranteed dividends add extra upside at 4.00% accumulation rate',
      'Policy loan available — cash access without surrendering the plan',
      '5 or 10-year payment options',
    ],
    riders: [
      'Total and Permanent Disability Plus (TPD Plus)',
      'Accidental Death and Disablement (ADD)',
      'Personal Accident (PA)',
      'Waiver of Premium on TPD',
      'Payor Waiver of Premium',
    ],
    addressesGaps: ['retirement', 'income', 'savings'],
    slug: 'prulifetime-income',
  },

  /* ══════════════════════════════════════════════════════════════
     4. PRULink Assurance Account Plus (PAA Plus)
     ══════════════════════════════════════════════════════════════ */
  {
    id: 'prulink-assurance-account-plus',
    name: 'PRULink Assurance Account Plus',
    shortName: 'PAA Plus',
    tagline: 'Insurance + Investment — One Affordable Plan',
    category: 'vul',
    color: '#22c55e',
    emoji: '📈',
    whatItIs:
      'A regular-pay Variable Unit-Linked (VUL) life insurance plan that combines life protection with market-linked investment — available in Peso and Dollar — with one of the most affordable entry points in the PRU Life UK lineup.',
    problemItSolves:
      'Many Filipinos want to invest but don\'t know where to start, or they have insurance but no investment. PAA Plus solves both problems in one plan — you get life protection today AND your money grows through professional fund management.',
    idealFor: [
      'First-time insurance buyers starting their financial journey',
      'Young professionals (mid-20s to early 40s) building wealth',
      'Those who want to invest regularly through insurance',
      'OFWs who want a Dollar-denominated plan',
      'Families who want both protection AND savings',
      'Those who want flexibility to switch between investment funds',
      'Starting with as low as ₱30,000/year (Peso) or USD 580/year (Dollar)',
    ],
    notFor: [
      'Those seeking guaranteed returns (returns depend on fund performance)',
      'Those who need income payouts immediately',
    ],
    keyBenefits: [
      {
        title: 'Protection + Investment in One',
        description:
          'Your premium buys life insurance protection AND invests your money in professionally managed funds — equity, bonds, balanced, or money market.',
      },
      {
        title: 'Loyalty Bonus: Free Units Years 11–20',
        description:
          'Pay consistently for 10 years and earn an EXTRA 10% (Peso) or 5% (Dollar) allocation on Years 11–20 — meaning your premiums buy more units as a loyalty reward.',
      },
      {
        title: 'Death Benefit: Coverage + Fund',
        description:
          'Your beneficiaries receive your Sum Assured PLUS the full value of your investment fund — giving your family both immediate protection and accumulated wealth.',
      },
      {
        title: 'Multiple Investment Fund Options',
        description:
          'Choose from 8 Peso funds and 5 Dollar funds — from conservative (money market, bond) to aggressive (equity, growth) — and switch between them based on market conditions.',
      },
      {
        title: 'Comprehensive Health & Accident Riders',
        description:
          'Add critical illness (36 conditions), hospital income, surgical reimbursement, ICU benefit, and personal accident coverage for total financial protection.',
      },
      {
        title: 'Peso and Dollar Options',
        description:
          'Available in both Peso and Dollar — perfect for OFWs who earn in foreign currency and want to invest in dollar-denominated funds.',
      },
    ],
    specs: {
      productType: 'Regular-Pay Variable Unit-Linked (VUL) Life Insurance',
      paymentTerms: 'Regular pay (whole life to pay, up to age 100)',
      issueAge: '0 to 70 years old',
      minPremium: 'Peso: ₱30,000/year regular (₱20,000 low premium) | Dollar: USD 580/year',
      deathBenefit:
        'Sum assured + fund value + 125% of top-ups (less 125% of withdrawals)',
      maturityBenefit: 'Sum assured + fund value at age 100',
      benefitTerm: 'Up to age 100',
      currency: 'Philippine Peso and US Dollar',
    },
    fbHooks: [
      'Hindi lang insurance. Hindi lang investment. It\'s BOTH — for as low as ₱2,500/month.',
      'Your savings account earns 0.5%. Your PRULink fund can earn so much more. Start with ₱30,000/year.',
      'OFW ka? Start investing in USD. Protect your family while your dollar fund grows.',
      'For every peso you pay, part of it protects your family — and part of it grows your wealth.',
      '10 years of paying = Loyalty Bonus units for free on Years 11–20. Your discipline pays dividends.',
    ],
    usps: [
      'Most accessible VUL entry point in PRU Life UK (₱30,000/year)',
      'Peso AND Dollar options',
      'Loyalty bonus Years 11–20 (10% Peso / 5% Dollar)',
      '8 Peso funds + 5 Dollar funds — widest fund selection',
      'Packages available: Protection Plus, Advance Care Plus, Multicare Plus',
      'Switch between funds anytime (1 free switch per year)',
      'Top-up option for additional investment',
    ],
    riders: [
      'Accelerated Life Care Benefit (LCB)',
      'Life Care Plus (LCP)',
      'Multiple Life Care Plus (MLCP)',
      'Life Care Advance Plus (LCAP)',
      'Daily Hospital Income (DHI)',
      'Intensive Care Unit (ICU)',
      'Long Term Hospitalization (LTH)',
      'Surgical Expense Reimbursement (SER)',
      'Future Safe Rider (guaranteed 5% annual SA increase)',
      'Payor Term Benefit',
      'Personal Accident (PA) — Standard, Executive, Power, Junior',
      'Waiver of Premium on TPD (WPTPD)',
      'Life Care Waiver (LCW)',
      'Payor Waiver of Regular Premium',
    ],
    addressesGaps: ['income', 'savings', 'medical', 'awareness'],
    slug: 'prulink-assurance-account-plus',
  },

  /* ══════════════════════════════════════════════════════════════
     5. PRULove for Life
     ══════════════════════════════════════════════════════════════ */
  {
    id: 'prulove-for-life',
    name: 'PRULove for Life',
    shortName: 'PLfL',
    tagline: 'Whole Life Protection — Pay Now, Protected Forever',
    category: 'traditional',
    color: '#ec4899',
    emoji: '❤️',
    whatItIs:
      'A limited-pay whole life participating traditional plan that provides guaranteed lifetime protection coverage with living benefits (cash values + non-guaranteed dividends) and a 100% Sum Assured death benefit.',
    problemItSolves:
      'Many Filipinos want a simple, guaranteed life insurance plan without market exposure — one they can pay off quickly, then keep for life. PRULove for Life is the traditional answer: guaranteed coverage, accumulating cash values, and dividends that grow over time.',
    idealFor: [
      'Risk-averse individuals who prefer guaranteed traditional insurance',
      'Parents who want to leave a guaranteed inheritance to their children',
      'Those who want to pay for a limited time (5, 10, 15, or 20 years) then stop',
      'Individuals who want a plan that builds cash values they can borrow against',
      'Those who value dividend income from a participating plan',
      'Anyone who wants simple, predictable, guaranteed whole life coverage',
    ],
    notFor: [
      'Those seeking investment growth or market-linked returns',
      'Issue age above 55 for 15/20-year pay variants',
      'Issue age above 60 for 5/10-year pay variants',
    ],
    keyBenefits: [
      {
        title: 'Guaranteed Lifetime Protection',
        description:
          'Your 100% Sum Assured death benefit is guaranteed for life — not dependent on fund performance. Minimum SA: ₱500,000.',
      },
      {
        title: 'Pay for 5, 10, 15, or 20 Years — Covered Forever',
        description:
          'Choose how long you\'d like to pay premiums. After your payment term ends, your policy stays active and covered until age 100 — automatically.',
      },
      {
        title: 'Non-Guaranteed Annual Dividends',
        description:
          'Earn annual dividends starting from your 3rd policy year. Current dividend accumulation rate: 4.00%. Dividends can be taken in cash, applied to premiums, or left to compound.',
      },
      {
        title: 'Withdrawable Cash Values',
        description:
          'Your policy builds cash values from Year 2. These are YOUR money — withdraw or borrow up to 80% as a policy loan without terminating coverage.',
      },
      {
        title: '100% Maturity Benefit at Age 100',
        description:
          'If you\'re alive at policy maturity (age 100), you receive 100% of your Sum Assured plus all accumulated dividends — a guaranteed windfall for you.',
      },
      {
        title: 'Riders for Total Protection',
        description:
          'Customize with critical illness, hospital income, disability, and accident riders for a comprehensive financial shield.',
      },
    ],
    specs: {
      productType: 'Limited-Pay Whole Life Participating Traditional Plan',
      paymentTerms: '5, 10, 15, or 20 years',
      issueAge:
        '5/10-year pay: 0 to 60 years old | 15/20-year pay: 0 to 55 years old (policyowner must be 18+)',
      minSumAssured: '₱500,000',
      deathBenefit:
        '100% of Sum Assured + accumulated non-guaranteed dividends — less any outstanding policy loans',
      maturityBenefit:
        '100% of Sum Assured + accumulated dividends at age 100',
      benefitTerm: 'Up to age 100',
      currency: 'Philippine Peso',
    },
    fbHooks: [
      'Mahal mo ang pamilya mo. Ipakita — with a guaranteed plan that pays them 100% when you\'re gone.',
      'Pay for only 10 years. Your family is protected for LIFE. That\'s the promise of PRULove for Life.',
      'No stock market risk. No guessing. Just guaranteed whole life protection for your loved ones.',
      'Ang pinaka-simpleng paraan para protektahan ang pamilya mo — habambuhay.',
      'You stop paying. Your policy doesn\'t. That\'s the power of a limited-pay whole life plan.',
    ],
    usps: [
      'Guaranteed 100% SA death benefit — no market risk',
      '4 payment term options (5/10/15/20 years)',
      'Annual dividends at 4.00% accumulation rate (from Year 3)',
      'Cash values from Year 2 — liquid safety net',
      'Policy loan up to 80% of cash value',
      'Simplest traditional plan — easy to explain, easy to understand',
    ],
    riders: [
      'Total and Permanent Disability Plus (TPD Plus)',
      'Accidental Death and Disablement (ADD)',
      'Personal Accident (PA)',
      'Hospital Income Benefit (DHI, ICU, LTH, SER)',
      'Life Care Plus (36 critical illnesses)',
      'Waiver of Premium on TPD',
      'Life Care Waiver',
      'Payor Waiver of Premium',
    ],
    addressesGaps: ['income', 'savings', 'retirement', 'awareness'],
    slug: 'prulove-for-life',
  },
]

/* ══════════════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ══════════════════════════════════════════════════════════════ */

/** Get a product by its id */
export function getProduct(id: string): PruProduct | undefined {
  return products.find(p => p.id === id)
}

/** Get products that address a specific gap */
export function getProductsForGap(gapId: string): PruProduct[] {
  return products.filter(p => p.addressesGaps.includes(gapId))
}

/** Get the primary recommended product for a gap */
export function getPrimaryProductForGap(gapId: string): PruProduct | undefined {
  return getProductsForGap(gapId)[0]
}

/**
 * Map from existing recommendation product names → product IDs
 * Used to link recommendation cards to product pages
 */
export const PRODUCT_NAME_TO_ID: Record<string, string> = {
  'PRUMillion Protect':             'pru-million-protect',
  'PRU Health Prime':               'prulink-assurance-account-plus', // mapped to PAA Plus (health riders)
  'PRULink Assurance Account Plus': 'prulink-assurance-account-plus',
  'PRULifetime Income':             'pru-lifetime-income',
  'PRU Elite Series':               'pru-elite-series',
  'PRULove for Life':               'prulove-for-life',
  'PRULove for Life Product Primer':'prulove-for-life',
  'PRULink Assurance':              'prulink-assurance-account-plus',
}
