import { NextResponse } from 'next/server'

/**
 * GET /api/agent?id=agentSlug
 * ──────────────────────────────────────────────────────────────────────
 * Reads the "Agents" tab of the BSQ Google Sheet and returns contact
 * details for the requested agent_id.
 *
 * Sheet columns (row 1 = headers):
 *   agent_id | name | messenger | whatsapp | viber | cell | email | active
 *
 * Prerequisites:
 *   1. Share the Google Sheet as "Anyone with the link → Viewer"
 *   2. Set GOOGLE_SHEETS_API_KEY in .env.local + Vercel env vars
 *      (Google Cloud Console → APIs → Sheets API → Create API key)
 *
 * If GOOGLE_SHEETS_API_KEY is not set, returns { found: false }
 * so all buttons fall back to BSQ defaults gracefully.
 */

const SHEET_ID  = '1LC4XVI2jDc4omL3heyZxqhv8UTpOqd4-F7lS1ssAD18'
const TAB_NAME  = 'Agents'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/* ─── In-memory cache (resets on cold start, fine for this use case) ── */
let _cache: { rows: Record<string, string>[]; ts: number } | null = null

async function fetchAllAgents(): Promise<Record<string, string>[] | null> {
  if (_cache && Date.now() - _cache.ts < CACHE_TTL) return _cache.rows

  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  if (!apiKey) return null

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(TAB_NAME)}?key=${apiKey}`

  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) return null

  const json = await res.json()
  const [headers, ...rows]: string[][] = json.values ?? []
  if (!headers?.length) return null

  const parsed = rows
    .map(row => {
      const obj: Record<string, string> = {}
      headers.forEach((h, i) => { obj[h.trim()] = (row[i] ?? '').trim() })
      return obj
    })
    .filter(r => r.active?.toUpperCase() !== 'FALSE')

  _cache = { rows: parsed, ts: Date.now() }
  return parsed
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')?.trim()

  if (!id) return NextResponse.json({ found: false })

  try {
    const agents = await fetchAllAgents()
    if (!agents) return NextResponse.json({ found: false })

    const agent = agents.find(a => a.agent_id === id)
    if (!agent) return NextResponse.json({ found: false })

    return NextResponse.json({
      found: true,
      contact: {
        name:      agent.name      || null,
        messenger: agent.messenger || null,
        whatsapp:  agent.whatsapp  || null,
        viber:     agent.viber     || null,
        cell:      agent.cell      || null,
        email:     agent.email     || null,
      },
    })
  } catch {
    return NextResponse.json({ found: false })
  }
}
