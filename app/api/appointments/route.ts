import { NextRequest, NextResponse } from 'next/server'
import { sanitize, sanitizeSource } from '@/lib/api-guard'

/* ─────────────────────────────────────────────────────────────────────
   POST /api/appointments
   ───────────────────────
   Shared appointment-booking intake for ALL appointment types across
   the site — product consultations today, with room for recruitment
   interviews, financial reviews, and any future booking flow.

   Each call site sends a `type` plus a free-form `context` object
   carrying type-specific fields (e.g. productInterest, role, branch).
   This route only validates/sanitizes the fields common to every
   appointment type and forwards the rest as-is.

   Environment variable:
     N8N_WEBHOOK_APPOINTMENTS — primary webhook for appointment leads.
     Falls back to N8N_WEBHOOK_ASSESSMENT_LEADS if unset, so leads are
     never dropped while the dedicated webhook is being provisioned.
───────────────────────────────────────────────────────────────────── */

const APPOINTMENT_TYPES = new Set([
  'product_consultation',
  'recruitment_interview',
  'financial_review',
  'general',
])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const type = sanitize(body.type, 32)
    if (!APPOINTMENT_TYPES.has(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid appointment type' },
        { status: 400 },
      )
    }

    const lead = body.lead && typeof body.lead === 'object' ? body.lead : {}
    const name   = sanitize(lead.name,   120)
    const mobile = sanitize(lead.mobile, 20)
    const email  = sanitize(lead.email,  200)

    if (!name || !mobile) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const schedule = body.schedule && typeof body.schedule === 'object' ? body.schedule : {}
    const preferredDate = sanitize(schedule.preferredDate, 32)
    const preferredTime = sanitize(schedule.preferredTime, 32)

    const questions = sanitize(body.questions, 1000)

    // Type-specific payload (e.g. productInterest, role, branch) —
    // shallow-sanitized so future appointment types don't need a new route.
    const rawContext: Record<string, unknown> =
      body.context && typeof body.context === 'object' ? body.context : {}
    const context: Record<string, string> = {}
    for (const [key, value] of Object.entries(rawContext).slice(0, 20)) {
      context[sanitize(key, 64)] = sanitize(value, 300)
    }

    const attribution = body.attribution && typeof body.attribution === 'object' ? body.attribution : {}
    const agent     = sanitize(attribution.agent,     64)
    const utmSource = sanitizeSource(attribution.utmSource)
    const utmMedium = sanitize(attribution.utmMedium, 64)

    const payload = {
      type,
      source:    'bsq_appointments',
      timestamp: new Date().toISOString(),
      lead: { name, mobile, email },
      schedule: { preferredDate, preferredTime },
      questions,
      context,
      attribution: {
        agent:     agent     || 'direct',
        utmSource: utmSource || 'direct',
        utmMedium: utmMedium || 'organic',
      },
    }

    const webhookUrl =
      process.env.N8N_WEBHOOK_APPOINTMENTS ??
      process.env.N8N_WEBHOOK_ASSESSMENT_LEADS

    if (!webhookUrl) {
      console.warn('[appointments] No n8n webhook configured — lead not forwarded.')
      return NextResponse.json({ success: true, forwarded: false })
    }

    const n8nRes = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    if (!n8nRes.ok) {
      console.error('[appointments] n8n returned', n8nRes.status)
      return NextResponse.json({ success: true, forwarded: false })
    }

    return NextResponse.json({ success: true, forwarded: true })

  } catch (err) {
    console.error('[appointments] Unexpected error:', err)
    return NextResponse.json({ success: true, forwarded: false })
  }
}
