import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { rating, message, name, role, consent } = body

    if (!rating || !message?.trim()) {
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
        message: message.trim(),
        name:    name?.trim()    || '',
        role:    role?.trim()    || '',
        consent: Boolean(consent),
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
