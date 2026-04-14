import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      firstName,
      lastName,
      phone,
      location,
      // Hidden tracking fields — passed silently from QR code URL params
      branch,
      recruiter,
      agentCode,
      unitManager,
      eventName,
      eventDate,
    } = body

    // ── Validate required fields ──────────────────────────────────────
    if (!firstName || !lastName || !phone || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ── Build n8n payload ─────────────────────────────────────────────
    const payload = {
      type:      'recruitment_lead',
      source:    'byb_event_registration',
      timestamp: new Date().toISOString(),
      lead: {
        name:     `${firstName} ${lastName}`,
        phone:    `+63${phone}`,
        location,
      },
      attribution: {
        branch:      branch      ?? 'Brilliant Star Quartz',
        recruiter:   recruiter   ?? 'Christopher Garcia',
        agentCode:   agentCode   ?? '70003503',
        unitManager: unitManager ?? 'Christopher Garcia',
      },
      event: {
        name: eventName ?? 'Mega BYB 2026',
        date: eventDate ?? 'April 13, 2026',
      },
    }

    // ── Forward to n8n webhook ────────────────────────────────────────
    const webhookUrl = process.env.N8N_WEBHOOK_RECRUITMENT_LEADS

    if (!webhookUrl) {
      // Webhook not configured yet — still return success so UX works
      console.warn('[recruitment-lead] N8N_WEBHOOK_RECRUITMENT_LEADS is not set. Lead not forwarded.')
      return NextResponse.json({ success: true, forwarded: false })
    }

    const n8nRes = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    if (!n8nRes.ok) {
      console.error('[recruitment-lead] n8n returned', n8nRes.status)
      return NextResponse.json({ success: true, forwarded: false })
    }

    return NextResponse.json({ success: true, forwarded: true })

  } catch (err) {
    console.error('[recruitment-lead] Unexpected error:', err)
    return NextResponse.json({ success: true, forwarded: false })
  }
}
