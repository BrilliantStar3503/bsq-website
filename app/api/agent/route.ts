import { NextResponse } from 'next/server'

/**
 * GET /api/agent?id=agentCode
 * ──────────────────────────────────────────────────────────────────────
 * Reads the BSQ agent roster from Google Sheets (Sheet1 tab).
 *
 * Actual sheet columns (row 1 headers):
 *   Agent Name | Email | Agent Code | Date Appointed |
 *   Birthday   | UM    | Branch Name | Date Terminated | LINK
 *
 * Lookup key  : "Agent Code"  (matches utm_agent in the URL)
 * Phone       : "WhatsApp" column (Contacts column removed 2026-04-02)
 * Messenger   : "Messenger"   (add this column later when agents provide links)
 * Active check: "Date Terminated" is empty = active agent
 *
 * Prerequisites:
 *   1. Share the Google Sheet: Share → Anyone with the link → Viewer
 *   2. Set GOOGLE_SHEETS_API_KEY in Vercel env vars
 *
 * Falls back gracefully to { found: false } → BSQ owner defaults shown.
 */

/** Normalises any Facebook/Messenger URL — preserves direct Messenger links as-is. */
function toMessengerUrl(raw: string): string | null {
  if (!raw) return null
  const s = raw.trim()
  // Already an m.me link
  if (s.startsWith('https://m.me/') || s.startsWith('http://m.me/')) return s
  // Any messenger.com link (e2ee, t/, etc.) — keep as-is
  if (s.includes('messenger.com/')) return s
  // facebook.com/username
  const fbMatch = s.match(/facebook\.com\/([^\s/?#]+)/)
  if (fbMatch) return `https://m.me/${fbMatch[1]}`
  // Plain username
  if (!s.includes('/') && !s.includes(' ')) return `https://m.me/${s}`
  return null
}

const SHEET_ID  = '1LC4XVI2jDc4omL3heyZxqhv8UTpOqd4-F7lS1ssAD18'
const TAB_NAME  = 'BSQ Agent List'
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
    // Active = Agent Status is not Suspended or Terminated
    .filter(r => {
      const status = r['Agent Status']?.toLowerCase()
      return status !== 'suspended' && status !== 'terminated'
    })

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

    // Match by Agent Code first, then fall back to utm_agent slug in LINK column
    const agent = agents.find(a => {
      if (a['Agent Code']?.toLowerCase() === id.toLowerCase()) return true
      // Extract utm_agent value from full LINK URL e.g. https://www.prubsq.com?utm_agent=slug
      const link = a['LINK'] ?? ''
      try {
        const slug = new URL(link).searchParams.get('utm_agent') ?? ''
        if (slug.toLowerCase() === id.toLowerCase()) return true
      } catch {
        // LINK is not a valid URL — skip
      }
      return false
    })
    if (!agent) return NextResponse.json({ found: false })

    return NextResponse.json({
      found: true,
      contact: {
        name:      agent['Nickname']   || agent['Agent Name'] || null,
        phone:     agent['WhatsApp']   || agent['Contacts'] || null,
        messenger: toMessengerUrl(agent['FB Page']) || null,
        whatsapp:  agent['WhatsApp']   || null,
        viber:     agent['Viber']      || null,
        telegram:  agent['Telegram']   || null,
        email:     agent['Email']      || null,
      },
    })
  } catch {
    return NextResponse.json({ found: false })
  }
}
