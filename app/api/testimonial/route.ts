import { NextRequest, NextResponse } from 'next/server'
import { sanitize, isValidRating } from '@/lib/api-guard'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const rating  = body.rating
    const message = sanitize(body.message, 1000)
    const name    = sanitize(body.name,    120)
    const role    = sanitize(body.role,    120)
    const consent = Boolean(body.consent)

    if (!isValidRating(rating) || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const webhookUrl = process.env.APPS_SCRIPT_URL

    if (!webhookUrl) {
      console.warn('[testimonial] APPS_SCRIPT_URL not set — submission not forwarded.')
      return NextResponse.json({ success: true, forwarded: false })
    }

    const res = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating,
        message,
        name,
        role,
        consent,
        source:  'bsq_assessment_form',
        timestamp: new Date().toISOString(),
      }),
    })

    if (!res.ok) {
      console.error('[testimonial] Apps Script returned', res.status)
      return NextResponse.json({ success: true, forwarded: false })
    }

    return NextResponse.json({ success: true, forwarded: true })

  } catch (err) {
    console.error('[testimonial] Error:', err)
    return NextResponse.json({ success: true, forwarded: false })
  }
}
