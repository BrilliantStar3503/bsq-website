# PRUBSQ WEBSITE — Master Project Context
> BSQ Financial Health Platform by Brilliant Star Quartz
> Last updated: 2026-03-20
> Live URL: https://www.prubsq.com

---

## 🏗️ Project Overview

A modern Next.js financial advisory website for a PRU Life UK agent (Brilliant Star Quartz). Features a 3-minute AI-powered financial health assessment, lead capture funnel, Calendly booking, chatbot, and full CRM pipeline.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` — NOT v3 syntax) |
| Animation | Framer Motion v12 |
| 3D | Spline via `@splinetool/react-spline` v4.1.0 |
| Deployment | Vercel (auto-deploy from GitHub `main` branch) |
| Domain | www.prubsq.com via Cloudflare DNS → Vercel |
| Automation | n8n Cloud (lead capture webhook) |
| CRM | Google Sheets + Google Apps Script |
| Booking | Calendly: https://calendly.com/brilliantstarquartz/30min |

---

## 📁 Key File Structure

```
website/website/
├── app/
│   ├── page.tsx                        # Homepage (main layout)
│   ├── globals.css                     # Tailwind v4 config + overflow fix
│   ├── privacy-policy/
│   │   └── page.tsx                    # Privacy policy page
│   └── api/
│       ├── capture-lead/route.ts       # POST → n8n webhook (assessment leads)
│       ├── testimonial/route.ts        # POST → Google Apps Script
│       └── testimonials/route.ts       # GET → Google Apps Script (cached 5min)
├── components/
│   ├── assessment/
│   │   └── AssessmentFlow.tsx          # Full 3-min assessment + results + lead capture
│   ├── HeroSection.jsx                 # Hero with Spline 3D + rotating hook
│   └── ui/
│       ├── spline-scene.tsx            # Optimized Spline loader (IntersectionObserver)
│       ├── rotating-hook.tsx           # Typewriter AI hook headlines
│       ├── testimonial-form.tsx        # Star rating form (post-assessment)
│       └── testimonial-list.tsx        # Fetches + displays approved testimonials
├── docs/
│   └── n8n-bsq-lead-workflow.json     # n8n workflow (import into n8n canvas)
├── .env.local                          # Local env vars (not committed)
└── PRUBSQ_WEBSITE.md                  # ← THIS FILE (project memory)
```

---

## 🎨 Brand Constants

```
PRU Red:    #ed1b2e   (primary CTA color, borders, accents)
Dark Navy:  #1a1a2e   (dark backgrounds, dashboard headers)
White:      #ffffff
```

---

## 🔑 Environment Variables

### Vercel Dashboard (Settings → Environment Variables)
| Key | Purpose | Where to Get |
|---|---|---|
| `N8N_TESTIMONIAL_CRM` | n8n webhook URL for assessment leads | n8n → Webhook node → Production URL |
| `APPS_SCRIPT_URL` | Google Apps Script Web App URL | Apps Script → Deploy → Web App URL |

### .env.local (local development)
```
N8N_TESTIMONIAL_CRM=https://n8n.srv1432347.hstgr.cloud/webhook/bsq-lead-capture
APPS_SCRIPT_URL=<paste your Apps Script Web App URL>
```

---

## 🌐 Domain & DNS (Cloudflare)

| Type | Name | Value |
|---|---|---|
| CNAME | www | cname.vercel-dns.com |
| A | @ (root) | 216.198.79.1 |

- Domain registrar/DNS: Cloudflare
- Previously hosted on: systeme.io (migrated to Vercel)
- SSL: handled by Vercel automatically

---

## 🤖 n8n Lead Funnel

### Workflow: `BSQ Lead Capture → Google Sheets`
**File:** `docs/n8n-bsq-lead-workflow.json`

**Nodes:**
1. `📥 BSQ Lead Webhook` — POST trigger at path `bsq-lead-capture`
2. `🔧 Extract Lead Fields` — Maps `$json.lead.*` and `$json.assessment.*`
3. `📊 Save to Google Sheets` — Appends to "Leads" sheet
4. `✅ Respond 200 OK` — Returns `{success: true}`

**Payload structure sent from `/api/capture-lead`:**
```json
{
  "timestamp": "ISO string",
  "source": "bsq_financial_assessment",
  "lead": {
    "name": "string",
    "contactType": "email | phone",
    "contact": "string"
  },
  "assessment": {
    "score": 0-100,
    "statusLabel": "At Risk | Needs Attention | Fair | Good | Excellent",
    "riskLevel": "High | Moderate | Low",
    "gaps": [{ "title": "string" }],
    "gapCount": number
  },
  "attribution": {
    "agent": "string (utm_agent value or 'direct')",
    "utmSource": "string (utm_source value or 'direct')",
    "utmMedium": "string (utm_medium value or 'organic')"
  }
}
```

**Status:** ✅ Active and published on n8n Cloud

---

## 📊 Google Sheets CRM

### Setup Script
The full Google Apps Script is saved separately (BSQ_CRM.gs).
Run `setupCRM()` once to create all 5 tabs.

### Tabs
| Tab | Color | Source |
|---|---|---|
| 📊 Dashboard | Navy | Auto formulas |
| 🗂️ All Leads | Dark | All sources combined |
| 📋 Assessment | Red | n8n webhook (automatic) |
| 📅 Calendly | Blue | Calendly webhook (future) |
| 🤖 Chatbot | Purple | Chatbot webhook (future) |

### 📋 Assessment Tab — Column Headers (exact order)
| Col | Header | Value |
|---|---|---|
| A | Timestamp | ISO datetime from server |
| B | Name | Lead's full name |
| C | ContactType | email or phone |
| D | Contact | Email address or mobile number |
| E | Score | 0–100 numeric score |
| F | Status | At Risk / Moderate Risk / Well Protected |
| G | Risk Level | High / Moderate / Low |
| H | Gap Count | Number of financial gaps |
| I | Gaps | Comma-separated gap titles |
| J | Source | bsq_financial_assessment |
| K | Agent | utm_agent value or "direct" |
| L | UTM Source | utm_source value or "direct" |
| M | UTM Medium | utm_medium value or "organic" |
| N | Follow Up | New / Contacted / Meeting Booked / Proposal Sent / Converted ✅ / Not Interested ❌ |
| O | Remarks | Manual notes |

### 🔗 Agent UTM Links (give one per team member)
```
Maria  → https://www.prubsq.com?utm_agent=maria&utm_source=facebook&utm_medium=paid
John   → https://www.prubsq.com?utm_agent=john&utm_source=facebook&utm_medium=paid
Anna   → https://www.prubsq.com?utm_agent=anna&utm_source=facebook&utm_medium=paid
```
- Agent boosts their UTM link on Facebook
- Lead clicks → takes assessment → submits
- Google Sheet logs the agent name automatically

### 🔍 Filter Views (share per agent — they see only their leads)
In Google Sheets: View → Filter Views → Create new filter view
- Filter Column K (Agent) = agent name
- Share the filter view URL to that agent only

### Follow-Up Stages
`New` → `Contacted` → `Meeting Booked` → `Proposal Sent` → `Converted ✅` / `Not Interested ❌`

---

## 📱 3 Lead Sources

| Source | Entry Point | CRM Tab |
|---|---|---|
| BSQ Assessment | "Run Your 3-Minute Assessment" button | 📋 Assessment |
| Calendly Booking | "Book a Consultation" button | 📅 Calendly |
| Chatbot | "Talk to Financial Advisor" nav link | 🤖 Chatbot |

---

## ⚡ Key Components Explained

### AssessmentFlow.tsx
- Multi-step financial health assessment (questions → score → results → lead capture)
- `ScoreResult` type contains: score, statusLabel, riskLevel, gaps[], recommendations[]
- `LeadCaptureModal` — full form (name + email/SMS toggle), POSTs to `/api/capture-lead`
- `ResultsScreen` — PRU Life UK-style dark hero card, 4 metric cards, gap cards, solution cards
- `TestimonialForm` — shown after results

### HeroSection.jsx
- Two-column layout (text left, Spline 3D right)
- `RotatingHook` component for typewriter headline
- Spline scene URL: `https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode`
- "Book a Consultation" → https://calendly.com/brilliantstarquartz/30min
- Fixed: `min-w-0` on columns + `overflow-x: hidden` on html/body

### spline-scene.tsx
- Dynamic import (ssr: false) — excludes ~800KB from initial bundle
- IntersectionObserver with 300px rootMargin — only loads when near viewport
- Skeleton shimmer placeholder → fade-in on load (0.7s opacity)
- Error fallback: 🤖 emoji

### rotating-hook.tsx
- 10 AI-powered hook phrases (typewriter effect)
- State machine: `typing → pausing → deleting → waiting`
- Speeds: TYPE=52ms, DELETE=22ms, PAUSE_AFTER=1400ms, PAUSE_BEFORE=300ms
- Layout shift fix: `display:block; minHeight:3.75em`
- Gradient text: `linear-gradient(95deg, #ffffff 0%, #f0f0f0 55%, #ed1b2e 100%)`
- Hover to pause/resume

---

## 🔧 Tailwind v4 Config (IMPORTANT)

**DO NOT use v3 syntax.** Always use:
```css
/* globals.css */
@import "tailwindcss";
@source "../components/**/*.{js,jsx,ts,tsx}";
@source "../app/**/*.{js,jsx,ts,tsx}";
```

PostCSS plugin: `@tailwindcss/postcss` in `postcss.config.mjs`
No `tailwind.config.js` needed.

---

## 📅 Calendly

- URL: https://calendly.com/brilliantstarquartz/30min
- Used in: Hero "Book a Consultation" button + Assessment results advisor CTA
- Status: ✅ Live and working

---

## 🔐 Privacy Policy

- URL: https://www.prubsq.com/privacy-policy
- File: `app/privacy-policy/page.tsx`
- Copied and enhanced from original systeme.io page
- Used as Meta Developer App privacy policy URL

---

## ✅ Completed Features

- [x] Hero section (two-column, Spline 3D, rotating hook)
- [x] 3-minute BSQ Financial Assessment
- [x] AI-powered results dashboard (PRU Life UK style)
- [x] Lead capture modal (email/SMS, sends to n8n)
- [x] n8n → Google Sheets lead pipeline
- [x] Testimonial system (form + display)
- [x] About section
- [x] Footer
- [x] Privacy Policy page
- [x] Calendly booking integration
- [x] Domain migration (systeme.io → Vercel via Cloudflare)
- [x] Google Sheets CRM (5 tabs, dashboard, follow-up pipeline)
- [x] Performance optimization (Spline lazy load)

---

## 🚧 Pending / Future Upgrades

- [ ] Set `APPS_SCRIPT_URL` in Vercel env vars (Google Apps Script Web App URL)
- [ ] Connect Calendly webhook → n8n → CRM 📅 Calendly tab
- [ ] Connect Chatbot webhook → n8n → CRM 🤖 Chatbot tab
- [ ] Spline 3D optimization (reduce polygon count in Spline.design editor)
- [ ] Add more testimonials to Google Sheet
- [ ] A/B test rotating hook phrases
- [ ] Add WhatsApp CTA option in lead capture
- [ ] Analytics (Vercel Analytics or Google Analytics)

---

## 🆘 How to Resume This Project in a New Claude Session

1. Open Claude Code in the project folder:
   ```
   /Users/christophergarcia/prubsq_website/website/website
   ```
2. Say: *"Read PRUBSQ_WEBSITE.md and continue development"*
3. Claude will have full context instantly ✅

---

*Generated by Claude — BSQ Financial Health Platform*
