# BSQ Financial System — Technical Documentation
**Brilliant Star Quartz · PRU Life UK Tied Branch & Area**
*Last updated: April 2026*

---

## 1. System Overview

A Next.js web app with three core functions:
- **Lead Generation** — assessment, Calendly bookings, direct contact
- **Financial Gap Analysis** — 13–19 question assessment → score 0–100 → product recommendations
- **Agent Recruitment** — Join Us / career section

All leads flow through **n8n** → Google Sheets CRM + email.

---

## 2. Tech Stack

| Layer | Package | Version |
|---|---|---|
| Framework | Next.js | 16.1.7 |
| Language | TypeScript | 5 |
| UI | React | 19.2.3 |
| Styling | Tailwind CSS | 4.2.2 |
| Animation | Framer Motion | 12.38.0 |
| Components | Radix UI | 1.1–1.2 |
| Icons | Lucide React | 0.577.0 |
| 3D Scene | @splinetool/react-spline | 4.1.0 |
| Globe | cobe | 2.0.1 |
| Booking | react-calendly | 4.4.0 |
| Analytics | @vercel/analytics | 2.0.1 |

---

## 3. Pages

| URL | Description |
|---|---|
| `/` | Homepage — hero, trust strip, accordion, testimonials |
| `/assessment` | Financial gap assessment (13–19 questions) |
| `/about` | Company background |
| `/advisors` | Team profiles |
| `/recruitment` | Join Us / career page |
| `/products/[slug]` | 5 PRU product pages (SSG pre-rendered) |
| `/privacy-policy` | RA 10173 / GDPR |

---

## 4. API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/agent` | Fetch agent contact from Google Sheets by `?id=` |
| POST | `/api/capture-lead` | Main lead capture — sanitize → email HTML → n8n |
| POST | `/api/track-click` | Button click analytics → n8n (fire-and-forget) |
| POST | `/api/track-assessment` | Assessment completion ping → Google Sheets |
| POST | `/api/calendly-booking` | Calendly webhook → fetch details → n8n |
| POST | `/api/testimonial` | Submit testimonial → Google Apps Script |
| GET | `/api/testimonials` | Fetch approved testimonials (5-min ISR cache) |

---

## 5. Assessment Engine

### Question Flow
- **13 core questions** — everyone sees these (life stage, age, occupation, income, dependents, expenses, income type, emergency fund, existing coverage, medical, savings, retirement, priority)
- **+6 conditional questions** — unlocked by answers:

| Question | Condition |
|---|---|
| Children's age (for college timeline) | Has children |
| Business structure | Business Owner |
| Business value | Business Owner |
| Ownership % | Business Owner + Corp/Partnership |
| Business role | Business Owner |
| Number of employees | Business Owner |

**Max: 19 questions** (Business Owner + children + Corporation)

### Scoring (4 Pillars)

| Pillar | Weight |
|---|---|
| Protection (life insurance adequacy) | 35% |
| Savings (emergency fund months) | 25% |
| Retirement (strategy + age urgency) | 25% |
| Awareness (financial literacy) | 15% |

### Risk Levels
| Score | Label |
|---|---|
| 0–34 | Critical |
| 35–54 | At Risk |
| 55–74 | Moderate |
| 75–100 | Well Protected |

### Gaps Detected (up to 8)
`income` · `medical` · `savings` · `retirement` · `awareness` · `optimization` · `education` · `businessInsurance` · `keyMan` · `employeeRetirement`

### Emergency Fund Formula
```
Target = monthly_expenses × coverage_months × dependent_multiplier

coverage_months:  Salary=6 · Commission=9 · Business=12.5 · Irregular=12
dependent_multiplier:  None=1.0 · Partner=1.1 · Children=1.25 · Parents=1.15
```

---

## 6. Product Recommendation Engine

### Products
| Product | Entry Premium | Best For |
|---|---|---|
| PRUMillion Protect | ₱21,000/yr | All segments, base protection |
| Elite 5-Pay | ₱200,000/yr | High income, short pay period |
| Elite 7-Pay | ₱150,000/yr | High income |
| Elite 10-Pay | ₱120,000/yr | Mid-high income |
| Elite 15-Pay | ₱85,000/yr | Mid income |
| PRULifetime Income | — | Retirement + wealth accumulation |
| PRULink Assurance Account Plus | — | Investment-linked |
| PRULove | — | OFW / overseas workers |

### Business Insurance Formulas
```
Sole Proprietorship  →  3–5% × business value
Corporation/Partner  →  ownership% × business valuation
Key Man              →  full business valuation
Education funding    →  10% × monthly_income × 12/yr
Employee Retirement  →  qualifies at 11+ regular employees
```

---

## 7. Lead Data Flow

```
User answers assessment
  → computeScore() + getRecommendations()
  → User submits contact info
  → POST /api/capture-lead
      1. Sanitize inputs
      2. GET /api/agent → agent contact info
      3. Generate HTML email with product cards
      4. POST to N8N_WEBHOOK_ASSESSMENT_LEADS
          → Slack alert to agent
          → Google Sheets (master + per-agent tab)
          → Brevo email to client
```

---

## 8. External Integrations

| Service | How | Purpose |
|---|---|---|
| **n8n** | Webhook POST | Lead routing, Sheets, Slack, Email |
| **Google Sheets API** | REST + API key | Agent directory (read-only) |
| **Google Apps Script** | Webhook | Testimonials (read + write) |
| **Calendly** | Widget + REST API | Booking calendar + booking details |
| **Spline** | WebGL (lazy-loaded) | 3D robot on homepage |
| **cobe** | Canvas | Animated globe on recruitment page |
| **Facebook Messenger** | m.me link | Floating chat widget |
| **Vercel Analytics** | Auto-injected | Page view tracking |

---

## 9. Environment Variables

| Variable | Side | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CALENDLY_URL` | Client | Calendly booking link |
| `NEXT_PUBLIC_MESSENGER_PAGE_ID` | Client | Facebook Page ID |
| `NEXT_PUBLIC_SITE_URL` | Client | Site domain |
| `GOOGLE_SHEETS_API_KEY` | Server | Agent directory read access |
| `CALENDLY_API_TOKEN` | Server | Calendly REST API |
| `N8N_WEBHOOK_ASSESSMENT_LEADS` | Server | Leads + click events webhook |
| `N8N_CALENDLY_WEBHOOK` | Server | Booking events webhook |
| `N8N_ASSESSMENT_COMPLETE` | Server | Completion tracking webhook |
| `APPS_SCRIPT_URL` | Server | Testimonials webhook |

> ⚠️ `NEXT_PUBLIC_*` vars are visible in browser JS. Never put secrets in them.

---

## 10. Security

| Layer | Implementation |
|---|---|
| **Security Headers** | CSP, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy (next.config.ts) |
| **Rate Limiting** | 20 POST req/min per IP on all /api/* routes (middleware.ts, Edge) |
| **Input Sanitization** | All strings: strip HTML tags + dangerous chars, enforce max length (lib/api-guard.ts) |
| **SSRF Protection** | Calendly URIs validated to start with `https://api.calendly.com/` |
| **Score Validation** | Numeric scores validated 0–100 before forwarding |
| **Error Handling** | All endpoints return 200 to client — no stack traces exposed |

---

## 11. Deployment

- **Platform:** Vercel (auto-deploy on push to `main`)
- **Domain:** www.prubsq.com
- **Build:** `npm run build` (Next.js Turbopack)

### Go-Live Checklist
- [ ] All env vars set in Vercel Dashboard
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://www.prubsq.com`
- [ ] n8n webhook URLs active
- [ ] Google Sheets API key has read access to BSQ Agent List
- [ ] Calendly API token active (not expired)
- [ ] Apps Script webhook URL active

---

*Brilliant Star Quartz · PRU Life UK Tied Branch & Area · Ortigas, Pasig City*
