import { NextRequest, NextResponse } from 'next/server'

/* ─────────────────────────────────────────────────────────────────────
   POST /api/pli-lead
   ──────────────────
   Captures a lead from the PRULifetime Income planner page and
   forwards it to the n8n CRM webhook for routing/follow-up.

   Environment variable required:
     N8N_WEBHOOK_PLI_LEADS — webhook URL from your n8n instance

   If the env var is not set the lead is still accepted (returns 200)
   so the UX never breaks, but it logs a warning to the console.
───────────────────────────────────────────────────────────────────── */

function sanitize(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return ''
  return val.trim().slice(0, maxLen)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const name     = sanitize(body.name,     120)
    const phone    = sanitize(body.phone,    20)
    const email    = sanitize(body.email,    200)
    const bestTime = sanitize(body.bestTime, 64)
    const plan     = typeof body.plan === 'object' && body.plan !== null ? body.plan : null
    const utm      = typeof body.utm  === 'object' && body.utm  !== null ? body.utm  : {}

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const payload = {
      type:      'pli_lead',
      source:    'prulifetime_planner',
      timestamp: new Date().toISOString(),
      lead: { name, phone, email, bestTime },
      plan,
      attribution: {
        utmSource: sanitize(utm.utm_source, 64) || 'direct',
        utmMedium: sanitize(utm.utm_medium, 64) || 'organic',
        agentId:   sanitize(utm.agent_id ?? utm.utm_agent, 64) || 'direct',
      },
    }

    const webhookUrl = process.env.N8N_WEBHOOK_PLI_LEADS

    if (!webhookUrl) {
      console.warn('[pli-lead] N8N_WEBHOOK_PLI_LEADS is not set — lead not forwarded to CRM.')
      return NextResponse.json({ success: true, forwarded: false })
    }

    const n8nRes = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    if (!n8nRes.ok) {
      console.error('[pli-lead] n8n returned', n8nRes.status)
    }

    // Always return success — never expose backend errors to the client
    return NextResponse.json({ success: true, forwarded: n8nRes.ok })

  } catch (err) {
    console.error('[pli-lead] Unexpected error:', err)
    return NextResponse.json({ success: true, forwarded: false })
  }
}
