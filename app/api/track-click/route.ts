import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/track-click
 * ──────────────────────────────────────────────────────────────────────
 * Silently logs "Talk to Advisor" button clicks to n8n → Assessment_Leads sheet.
 * Fires and forgets — never blocks the user action.
 *
 * Payload: { source, agent, utmSource, utmMedium }
 */
export async function POST(req: NextRequest) {
  try {
    const { source, agent, utmSource, utmMedium } = await req.json()

    const webhookUrl = process.env.N8N_WEBHOOK_TESTIMONIAL_CRM
    if (!webhookUrl) return NextResponse.json({ ok: true })

    fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source:    source ?? 'advisor_btn',
        timestamp: new Date().toISOString(),
        attribution: {
          agent:     agent     ?? 'direct',
          utmSource: utmSource ?? 'direct',
          utmMedium: utmMedium ?? 'organic',
        },
      }),
    }).catch(() => {}) // silent fail

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
