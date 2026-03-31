'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    FB?: { init: (opts: object) => void }
    fbAsyncInit?: () => void
  }
}

/**
 * MessengerChat
 * ──────────────────────────────────────────────────────────────────────
 * Embeds the Facebook Messenger Customer Chat bubble.
 * Powered by your existing n8n Facebook Messenger chatbot workflow.
 *
 * Prerequisites:
 *   1. Set NEXT_PUBLIC_FB_PAGE_ID in .env.local + Vercel env vars
 *      (Facebook Page → Settings → About → Page ID)
 *   2. Your FB Page must have Messenger enabled
 *
 * If NEXT_PUBLIC_FB_PAGE_ID is not set, renders nothing.
 */
export function MessengerChat() {
  const pageId = process.env.NEXT_PUBLIC_FB_PAGE_ID

  useEffect(() => {
    if (!pageId) return

    window.fbAsyncInit = function () {
      window.FB?.init({ xfbml: true, version: 'v19.0' })
    }

    if (!document.getElementById('facebook-jssdk')) {
      const script    = document.createElement('script')
      script.id       = 'facebook-jssdk'
      script.async    = true
      script.defer    = true
      script.crossOrigin = 'anonymous'
      script.src      = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
      document.body.appendChild(script)
    }
  }, [pageId])

  if (!pageId) return null

  return (
    <>
      <div id="fb-root" />
      <div
        className="fb-customerchat"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({
          attribution:          'biz_inbox',
          page_id:              pageId,
          theme_color:          '#D92D20',
          logged_in_greeting:   "Hi! 👋 I'm your BSQ financial advisor. How can I help you today?",
          logged_out_greeting:  "Hi! 👋 I'm your BSQ financial advisor. How can I help you today?",
        } as any)}
      />
    </>
  )
}
