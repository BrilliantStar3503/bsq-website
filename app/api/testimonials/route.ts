import { NextResponse } from 'next/server'

export const revalidate = 300 // re-fetch from Apps Script every 5 minutes

export async function GET() {
  try {
    const webhookUrl = process.env.APPS_SCRIPT_URL

    if (!webhookUrl) {
      return NextResponse.json([])
    }

    const res = await fetch(webhookUrl, {
      method: 'GET',
      next:   { revalidate: 300 },
    })

    if (!res.ok) {
      return NextResponse.json([])
    }

    const data = await res.json()

    // Safety: ensure it's an array of valid objects
    if (!Array.isArray(data)) return NextResponse.json([])

    return NextResponse.json(data)

  } catch (err) {
    console.error('[testimonials] Fetch error:', err)
    return NextResponse.json([])
  }
}
