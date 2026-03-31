import { NextResponse } from 'next/server'

/**
 * GET /api/agent?id=agentCode
 * ──────────────────────────────────────────────────────────────────────
 * Reads the BSQ agent roster from Google Sheets (Sheet1 tab).
 *
 * Actual sheet columns (row 1 headers):
 *   Agent Name | Email | Contacts | Agent Code | Date Appointed |
 *   Birthday   | UM    | Branch Name | Date Terminated | LINK
 *
 * Lookup key  : "Agent Code"  (matches utm_agent in the URL)
 * Phone       : "Contacts"    (used for tel: call links)
 * Messenger   : "Messenger"   (add this column later when agents provide links)
 * Active check: "Date Terminated" is empty = active agent
 *
 * Prerequisites:
 *   1. Share the Google Sheet: Share → Anyone with the link → Viewer
 *   2. Set GOOGLE_SHEETS_API_KEY in Vercel env vars
 *
 * Falls back gracefully to { found: false } → BSQ owner defaults shown.
 */

const SHEET_ID  = '1LC4XVI2jDc4omL3heyZxqhv8UTpOqd4-F7lS1ssAD18'
const TAB_NAME  = 'Sheet1'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/* ─── In-memory cache ───────────────────────────────────────────────── */
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
    // Active = "Date Terminated" column is empty
    .filter(r => !r['Date Terminated'])

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

    // Match by Agent Code (case-insensitive for safety)
    const agent = agents.find(
      a => a['Agent Code']?.toLowerCase() === id.toLowerCase()
    )
    if (!agent) return NextResponse.json({ found: false })

    return NextResponse.json({
      found: true,
      contact: {
        name:      agent['Agent Name']  || null,
        phone:     agent['Contacts']    || null,   // → tel: link
        messenger: agent['Messenger']   || null,   // → add column later
        email:     agent['Email']       || null,
      },
    })
  } catch {
    return NextResponse.json({ found: false })
  }
}
