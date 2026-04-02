# BSQ System — Full Project Documentation
**Last Updated:** April 2, 2026
**Project:** prubsq.com — PRU Life UK / Brilliant Star Quartz Agency
**Owner:** Chris Garcia (AM Christopher Bantoc Garcia)

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [Google Sheets Setup](#google-sheets-setup)
4. [Agent Routing System](#agent-routing-system)
5. [Chat Widget](#chat-widget)
6. [Financial Assessment Tool](#financial-assessment-tool)
7. [CRM & Lead Tracking](#crm--lead-tracking)
8. [Email Template](#email-template)
9. [n8n Workflows](#n8n-workflows)
10. [Vercel Environment Variables](#vercel-environment-variables)
11. [Pending Tasks](#pending-tasks)

---

## System Overview

```
Agent shares personalized link → visitor lands on prubsq.com?utm_agent=AGENT_CODE
       ↓
Website reads agent code → fetches agent contact from Google Sheets
       ↓
All buttons, chat widget, and CTAs dynamically route to THAT agent
       ↓
Visitor takes financial assessment → submits lead
       ↓
n8n receives lead → writes to agent's own CRM tab + master sheet
       ↓
Visitor receives personalized email with assessment results + agent contact
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Website | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Hosting | Vercel (Hobby plan) |
| Database | Google Sheets (via Sheets API v4) |
| Automation | n8n (self-hosted or cloud) |
| Analytics | Vercel Analytics |

---

## Google Sheets Setup

### BSQ Agent List
- **Sheet ID:** `1LC4XVI2jDc4omL3heyZxqhv8UTpOqd4-F7lS1ssAD18`
- **Tab Name:** `BSQ Agent List`
- **API Key:** `GOOGLE_SHEETS_API_KEY` (set in Vercel)
- **Cache TTL:** 5 minutes (server-side, no redeploy needed when agents update their data)

#### Column Headers (in order)
| Col | Header | Notes |
|---|---|---|
| A | Agent Name | Full name |
| B | Nickname | Displayed in chat widget header |
| C | Email | Agent email |
| D | Contacts | Phone number (used for Call buttons) |
| E | Agent Code | Lookup key — matches `utm_agent` in URLs |
| F | Date Appointed | |
| G | Birthday | |
| H | UM | |
| I | Branch Name | |
| J | Agent Status | `Active` / `Suspended` / `Terminated` |
| K | Date Terminated | |
| L | LINK | Full agent URL e.g. `https://www.prubsq.com?utm_agent=slug` |
| M | FB Page | Facebook page URL → auto-converted to `m.me/` link |
| N | WhatsApp | Number in international format e.g. `639178232799` |
| O | Viber | Number in international format e.g. `639178232799` |
| P | Telegram | Username e.g. `@username` |

#### Agent Status Filtering
- `Suspended` or `Terminated` → excluded from API results
- All other statuses → active, included

#### Agent Lookup Logic
1. Match `Agent Code` column exactly (case-insensitive)
2. If not found, extract `utm_agent` param from `LINK` column URL and match that

---

## Agent Routing System

### How it works
Each agent shares their personalized link:
```
https://www.prubsq.com?utm_agent=AGENT_CODE
```

The website:
1. Reads `?utm_agent=` (or `?agent_id=`) from URL
2. Stores it in `localStorage` (persists across pages)
3. Fetches agent contact from `/api/agent?id=AGENT_CODE`
4. All buttons + chat widget dynamically update to that agent's contacts

### Key Files
| File | Purpose |
|---|---|
| `app/api/agent/route.ts` | Google Sheets lookup API |
| `hooks/useAgentContact.ts` | Client-side hook — reads URL, fetches agent, caches |

### Platform Priority (chat widget)
WhatsApp → Viber → Telegram → FB Page → BSQ default (m.me/Bstarquartzarea)

### BSQ Default (when no agent in URL)
```
Name:      BSQ Financial Advisory
Messenger: https://m.me/Bstarquartzarea
Email:     bstarquartz@gmail.com
```

---

## Chat Widget

### File
`components/ui/messenger-chat.tsx`

### How it works
- Floating button (bottom-right, fixed position)
- Opens popup with: agent name, name field (optional), message textarea
- Shows **one button per platform** the agent has configured
- **WhatsApp / Viber / Telegram** — message pre-filled via URL params (`?text=`)
- **Messenger** — message auto-copied to clipboard (Messenger doesn't support URL pre-fill)
- Sends lead silently to `/api/track-click` (CRM tracking)

### Platform Button Behavior
| Platform | Pre-fill | URL Format |
|---|---|---|
| WhatsApp | ✅ Yes | `https://wa.me/NUMBER?text=MESSAGE` |
| Viber | ✅ Yes | `viber://chat?number=NUMBER&text=MESSAGE` |
| Telegram | ✅ Yes | `https://t.me/USERNAME?text=MESSAGE` |
| Messenger | ❌ No (clipboard) | `https://m.me/USERNAME` |

---

## Financial Assessment Tool

### Flow
1. Visitor answers questions about their financial situation
2. System calculates a **Financial Health Score** (0–100)
3. Identifies **protection gaps**
4. Recommends **PRU Life products**
5. Visitor submits name + contact (email or phone)
6. Lead sent to `/api/capture-lead` → n8n → Google Sheets + email

### Products
| Slug | Product Name |
|---|---|
| `prulifetime-income` | PRULifetime Income |
| `pru-million-protect` | PRU Million Protect |
| `elite-series` | Elite Series |
| `prulink-assurance-account-plus` | PRULink Assurance Account Plus |
| `prulove-for-life` | PRULove for Life |

### Product Images
Located at `/public/images/products/`
- `prulifetime-income.jpg` ✅ uploaded
- Others: pending upload

---

## CRM & Lead Tracking

### Track Click API
**File:** `app/api/track-click/route.ts`
**Webhook:** `N8N_WEBHOOK_TESTIMONIAL_CRM`
**Fires on:** every advisor button click, chat widget send

**Payload:**
```json
{
  "source": "advisor_btn_hero | chat_launcher | ...",
  "agent": "utm_agent_code",
  "name": "visitor name (if provided)",
  "message": "message (if chat)",
  "platform": "whatsapp | viber | telegram | messenger",
  "utmSource": "facebook | direct | ...",
  "utmMedium": "organic | paid | ..."
}
```

### Capture Lead API
**File:** `app/api/capture-lead/route.ts`
**Webhook:** `N8N_WEBHOOK_TESTIMONIAL_CRM`
**Fires on:** financial assessment form submission

**Payload:**
```json
{
  "source": "bsq_financial_assessment",
  "timestamp": "ISO string",
  "lead": { "name": "", "contactType": "email|phone", "contact": "" },
  "assessment": { "score": 72, "statusLabel": "", "riskLevel": "Moderate", "gaps": [], "recommendations": [] },
  "attribution": { "agent": "utm_code", "utmSource": "", "utmMedium": "" },
  "email": { "subject": "...", "html": "...full HTML email..." }
}
```

### Google Sheets CRM
- **Sheet ID:** `1gEa5mu9d4ZHZBX_oi1eSKbzoG9tlyJKh-uNFaUCYxzQ`
- **Master tab:** `Assessment_Leads` — all agents combined
- **Per-agent tabs:** auto-created by n8n (tab named after agent code)

#### Master Sheet Column Headers
```
Date | Name | Contact Type | Contact | Score | Status | Risk Level | Gaps | Recommendations | Agent | UTM Source | UTM Medium
```

---

## Email Template

**File:** `lib/email-template.ts`
**Function:** `generateAssessmentEmail(data: EmailData): string`

### Features
- Inline-styled HTML (email client compatible)
- Personalized greeting with first name
- Color-coded risk badge (green/yellow/orange/red)
- Protection gaps list
- Product cards with images/icons
- Agent contact section (Messenger + phone CTA)
- Falls back to BSQ advisor CTA if no agent

### Risk Colors
| Level | Color |
|---|---|
| Low | Green `#15803d` |
| Moderate | Amber `#b45309` |
| High | Orange `#c2410c` |
| Critical | Red `#b91c1c` |

---

## n8n Workflows

### Workflow 1: Assessment Lead → Per-Agent CRM
**File:** `docs/n8n_agent_crm_workflow.json`
**Import this into n8n**

#### Node flow
```
Webhook → Prepare Data → Get Sheet List → Check Tab Exists → Tab Exists?
                                                                   ↓ YES          ↓ NO
                                                           Write to Agent Tab ← Create Agent Tab
                                                                   ↓
                                                           Write to Master Sheet
                                                                   ↓
                                                              Respond OK
```

#### Setup after import
1. Set Google Sheets OAuth2 credentials on all Google Sheets nodes
2. Copy Webhook URL → paste as `N8N_WEBHOOK_TESTIMONIAL_CRM` in Vercel
3. Make sure `Assessment_Leads` tab exists in the CRM sheet with correct headers

### Facebook Messenger Chatbot (existing)
- Routes to: POLICYHOLDER / RECRUITMENT / GENERAL modes
- Writes to: BSQ CRM (Google Sheet)
- Escalation booking: `https://cal.com/am-chris-garcia-ygazu1/quick-chat-about-your-financial-goals`

---

## Vercel Environment Variables

| Variable | Purpose |
|---|---|
| `GOOGLE_SHEETS_API_KEY` | Read BSQ Agent List from Google Sheets |
| `N8N_WEBHOOK_TESTIMONIAL_CRM` | Send leads + clicks to n8n CRM workflow |
| `NEXT_PUBLIC_SITE_URL` | Site URL for internal API calls (set to `https://www.prubsq.com`) |
| `NEXT_PUBLIC_FB_PAGE_ID` | BSQ Facebook Page ID (for legacy FB SDK references) |

---

## Pending Tasks

### High Priority
- [ ] **Import n8n workflow** (`docs/n8n_agent_crm_workflow.json`) and activate
- [ ] **Update `N8N_WEBHOOK_TESTIMONIAL_CRM`** in Vercel with new n8n webhook URL after import
- [ ] **Add headers to Assessment_Leads tab** in CRM sheet if not already there

### Medium Priority
- [ ] **Upload product photos** for: pru-million-protect, elite-series, prulink-assurance-account-plus, prulove-for-life → `/public/images/products/`
- [ ] **Test email delivery** — verify n8n Send Email node reads `{{ $json.email.html }}`
- [ ] **Share CRM tab links** with agents — each agent gets `https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=TABNUMBER`

### Nice to Have
- [ ] Agent onboarding instructions — simple guide for agents on how to fill their platform columns
- [ ] Admin dashboard — summary view of all agent lead counts

---

## Key URLs

| Resource | URL |
|---|---|
| Website | https://www.prubsq.com |
| BSQ Messenger | https://m.me/Bstarquartzarea |
| Chris Garcia Page | https://m.me/AMChrisGarcia |
| Booking link | https://cal.com/am-chris-garcia-ygazu1/quick-chat-about-your-financial-goals |
| Agent List Sheet | https://docs.google.com/spreadsheets/d/1LC4XVI2jDc4omL3heyZxqhv8UTpOqd4-F7lS1ssAD18 |
| CRM Sheet | https://docs.google.com/spreadsheets/d/1gEa5mu9d4ZHZBX_oi1eSKbzoG9tlyJKh-uNFaUCYxzQ |
| GitHub Repo | https://github.com/BrilliantStar3503/bsq-website |

---

## Testing Your Agent Link
```
https://www.prubsq.com?utm_agent=christopher_bantoc_garcia
```
Check API directly:
```
https://www.prubsq.com/api/agent?id=christopher_bantoc_garcia
```
