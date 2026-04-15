import { NextRequest, NextResponse } from 'next/server'

/**
 * BSQ Rate Limiter — edge middleware
 *
 * Uses an in-memory sliding window per IP per route.
 * Limits: 20 requests / 60 s on all /api/* POST routes.
 *
 * Edge-compatible (no Node APIs) — runs on Vercel Edge Network.
 */

const WINDOW_MS  = 60_000   // 1 minute
const MAX_REQ    = 20       // max requests per window per IP

// Lightweight in-memory store (edge runtime resets per cold start — acceptable)
const hits = new Map<string, { count: number; resetAt: number }>()

function getRateLimitKey(req: NextRequest): string {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  const route = new URL(req.url).pathname
  return `${ip}::${route}`
}

export function middleware(req: NextRequest) {
  // Only rate-limit POST requests to /api/*
  if (!req.nextUrl.pathname.startsWith('/api/') || req.method !== 'POST') {
    return NextResponse.next()
  }

  const key = getRateLimitKey(req)
  const now = Date.now()
  const entry = hits.get(key)

  if (!entry || now > entry.resetAt) {
    // New window
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return NextResponse.next()
  }

  entry.count++

  if (entry.count > MAX_REQ) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please try again in a moment.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After':  String(Math.ceil((entry.resetAt - now) / 1000)),
        },
      }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
