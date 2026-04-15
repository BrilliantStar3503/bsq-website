import { NextRequest, NextResponse } from 'next/server'
import { validateCalendlyUri } from '@/lib/api-guard'

export async function POST(req: NextRequest) {
  try {
    const { invitee_uri, event_uri } = await req.json()

    if (!invitee_uri || !event_uri) {
      return NextResponse.json({ error: 'Missing Calendly URIs' }, { status: 400 })
    }

    // SSRF guard — only allow real Calendly API URIs
    try {
      validateCalendlyUri(invitee_uri)
      validateCalendlyUri(event_uri)
    } catch {
      return NextResponse.json({ error: 'Invalid Calendly URI' }, { status: 400 })
    }

    const calendlyToken = process.env.CALENDLY_API_TOKEN
    const n8nUrl = process.env.N8N_CALENDLY_WEBHOOK

    let inviteeData: Record<string, any> = {}
    let eventData: Record<string, any> = {}

    // Fetch booking details from Calendly API (requires Personal Access Token)
    if (calendlyToken) {
      const headers = {
        Authorization: `Bearer ${calendlyToken}`,
        'Content-Type': 'application/json',
      }

      const [inviteeRes, eventRes] = await Promise.all([
        fetch(invitee_uri, { headers }),
        fetch(event_uri, { headers }),
      ])

      if (inviteeRes.ok) {
        const json = await inviteeRes.json()
        inviteeData = json.resource || {}
      }

      if (eventRes.ok) {
        const json = await eventRes.json()
        eventData = json.resource || {}
      }
    }

    // Forward to n8n — always fire even if Calendly API fetch failed
    if (n8nUrl) {
      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'calendly_booking',
          timestamp: new Date().toISOString(),
          invitee: {
            name:     inviteeData.name     || '',
            email:    inviteeData.email    || '',
            timezone: inviteeData.timezone || '',
          },
          event: {
            start_time:      eventData.start_time || '',
            end_time:        eventData.end_time   || '',
            event_type_name: eventData.name       || 'Quick Chat about your Financial Goals',
          },
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[BSQ] Calendly booking handler error:', err)
    // Always return 200 — never block the user's booking confirmation
    return NextResponse.json({ success: true })
  }
}
