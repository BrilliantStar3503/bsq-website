import { NextResponse } from 'next/server'

/**
 * POST /api/track-assessment
 * ──────────────────────────────────────────────────────────────────────
 * Fires silently when a visitor reaches the Results screen.
 * Forwards a minimal payload to n8n which appends a row to Google Sheets.
 *
 * To activate: set N8N_ASSESSMENT_COMPLETE in .env.local + Vercel env vars.
 * n8n workflow: Webhook trigger → Google Sheets (append row with timestamp).
 */
export async function POST(req: Request) {
  const webhookUrl = process.env.N8N_ASSESSMENT_COMPLETE

  // If no webhook configured, silently succeed — never break the user flow
  if (!webhookUrl) {
    return NextResponse.json({ ok: true, tracked: false })
  }

  try {
    const body = await req.json().catch(() => ({}))

    await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event:     'assessment_complete',
        timestamp: new Date().toISOString(),
        score:     body.score     ?? null,
        segment:   body.segment   ?? null,
        riskLevel: body.riskLevel ?? null,
      }),
    })

    return NextResponse.json({ ok: true, tracked: true })
  } catch {
    // Silent fail — never expose errors to client or block UX
    return NextResponse.json({ ok: true, tracked: false })
  }
}
