import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/track-click
 * ──────────────────────────────────────────────────────────────────────
 * Logs all lead-generating button clicks to n8n → per-agent CRM tab + master sheet.
 * Fires and forgets — never blocks the user action.
 *
 * Sources: advisor_btn_* | chat_launcher | call_btn | etc.
 * Payload: { source, agent, name?, message?, platform?, utmSource, utmMedium }
 */
export async function POST(req: NextRequest) {
  try {
    const {
      source,
      agent,
      name,
      message,
      platform,
      utmSource,
      utmMedium,
    } = await req.json()

    const webhookUrl = process.env.N8N_WEBHOOK_ASSESSMENT_LEADS
    if (!webhookUrl) return NextResponse.json({ ok: true })

    fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type:      'click',
        source:    source    ?? 'advisor_btn',
        timestamp: new Date().toISOString(),
        lead: {
          name:        name     ?? '',
          contactType: '',
          contact:     '',
          message:     message  ?? '',
          platform:    platform ?? '',
        },
        assessment: {
          score:           '',
          statusLabel:     '',
          riskLevel:       '',
          gaps:            [],
          recommendations: [],
        },
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
