import { NextRequest, NextResponse } from 'next/server'
import { sanitize, sanitizeSource } from '@/lib/api-guard'

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
    const raw = await req.json()

    // Sanitize every field — strip HTML, enforce max lengths
    const source    = sanitizeSource(raw.source)
    const agent     = sanitize(raw.agent,     64)
    const name      = sanitize(raw.name,      120)
    const message   = sanitize(raw.message,   500)
    const platform  = sanitize(raw.platform,  32)
    const utmSource = sanitize(raw.utmSource, 64)
    const utmMedium = sanitize(raw.utmMedium, 64)

    const webhookUrl = process.env.N8N_WEBHOOK_ASSESSMENT_LEADS
    if (!webhookUrl) return NextResponse.json({ ok: true })

    fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type:      'click',
        source,
        timestamp: new Date().toISOString(),
        lead: {
          name,
          contactType: '',
          contact:     '',
          message,
          platform,
        },
        assessment: {
          score:           '',
          statusLabel:     '',
          riskLevel:       '',
          gaps:            [],
          recommendations: [],
        },
        attribution: {
          agent:     agent     || 'direct',
          utmSource: utmSource || 'direct',
          utmMedium: utmMedium || 'organic',
        },
      }),
    }).catch(() => {}) // silent fail

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
