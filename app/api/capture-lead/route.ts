import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      name,
      contactType,
      contact,
      score,
      statusLabel,
      riskLevel,
      gaps,
      recommendations,
      agent,
      utmSource,
      utmMedium,
    } = body

    // ── Validate required fields ──────────────────────────────────────
    if (!name || !contact || score === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ── Build n8n payload ─────────────────────────────────────────────
    const payload = {
      source:    'bsq_financial_assessment',
      timestamp: new Date().toISOString(),
      lead: {
        name,
        contactType,   // 'email' | 'phone'
        contact,       // email address or mobile number
      },
      assessment: {
        score,
        statusLabel,
        riskLevel,
        gaps:            gaps ?? [],
        recommendations: recommendations ?? [],
      },
      attribution: {
        agent:     agent     ?? 'direct',
        utmSource: utmSource ?? 'direct',
        utmMedium: utmMedium ?? 'organic',
      },
    }

    // ── Forward to n8n webhook ────────────────────────────────────────
    const webhookUrl = process.env.N8N_TESTIMONIAL_CRM

    if (!webhookUrl) {
      // Webhook not configured yet — still return success so UX works
      console.warn('[capture-lead] N8N_TESTIMONIAL_CRM is not set. Lead not forwarded.')
      return NextResponse.json({ success: true, forwarded: false })
    }

    const n8nRes = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    if (!n8nRes.ok) {
      console.error('[capture-lead] n8n returned', n8nRes.status)
      // Still return success to the user — don't expose backend errors
      return NextResponse.json({ success: true, forwarded: false })
    }

    return NextResponse.json({ success: true, forwarded: true })

  } catch (err) {
    console.error('[capture-lead] Unexpected error:', err)
    return NextResponse.json({ success: true, forwarded: false })
  }
}
