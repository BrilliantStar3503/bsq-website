export interface Question {
  id: string
  question: string
  subtitle?: string
  options: string[]
}

export const questions: Question[] = [
  {
    id: 'lifeStage',
    question: 'Which best describes your current life stage?',
    subtitle: 'This helps us understand your financial priorities.',
    options: [
      'Starting out (single / early career)',
      'Building a family',
      'With children',
      'Preparing for retirement',
      'Retired',
    ],
  },
  {
    id: 'priority',
    question: 'What is your top financial priority right now?',
    subtitle: 'Choose the one that matters most to you today.',
    options: [
      'Protect my income / family',
      'Grow my savings / investments',
      'Plan for my child\'s education',
      'Prepare for retirement',
    ],
  },
  {
    id: 'incomeProtection',
    question: 'If your income stopped today, how long could you sustain your lifestyle?',
    subtitle: 'Be honest — this directly affects your protection score.',
    options: [
      'Less than 3 months',
      '3–6 months',
      '6–12 months',
      'More than 1 year',
    ],
  },
  {
    id: 'dependents',
    question: 'Do you financially support anyone?',
    subtitle: 'Anyone who relies on your income counts.',
    options: [
      'No',
      'Yes — partner',
      'Yes — children',
      'Yes — parents / others',
    ],
  },
  {
    id: 'savings',
    question: 'How prepared are you for your future financial goals?',
    subtitle: 'Think retirement, education, or major life events.',
    options: [
      'I haven\'t started',
      'Started but inconsistent',
      'I have a plan',
      'Very confident',
    ],
  },
  {
    id: 'medical',
    question: 'If a medical emergency happens today, are you financially covered?',
    subtitle: 'A single hospital stay can cost ₱100,000 or more.',
    options: [
      'No coverage',
      'Minimal coverage',
      'Adequate',
      'Fully covered',
    ],
  },
  {
    id: 'retirement',
    question: 'How confident are you about your retirement?',
    subtitle: 'Will you have enough to live comfortably without working?',
    options: [
      'Not confident',
      'Unsure',
      'Somewhat confident',
      'Very confident',
    ],
  },
  {
    id: 'monthlyExpenses',
    question: 'What are your estimated monthly essential expenses?',
    subtitle: 'Include housing, utilities, food, transportation, insurance & debt payments only.',
    options: [
      'Below ₱20,000',
      '₱20,001 – ₱40,000',
      '₱40,001 – ₱60,000',
      '₱60,001 – ₱80,000',
      'Above ₱80,000',
    ],
  },
  {
    id: 'incomeType',
    question: 'How would you describe your income type?',
    subtitle: 'This determines your recommended emergency fund coverage period.',
    options: [
      'Fixed salary (employee)',
      'Mixed (salary + commission)',
      'Pure commission / freelance',
      'Business owner',
    ],
  },
]
