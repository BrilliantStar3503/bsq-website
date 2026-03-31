'use client'

import { useState } from 'react'
import { useAgentContact, getPrimaryContactUrl, getPhoneUrl } from '@/hooks/useAgentContact'

/**
 * MessengerChat
 * ──────────────────────────────────────────────────────────────────────
 * Floating chat button with hover popup.
 * Shows Chat (Messenger) and Call options — agent-aware via useAgentContact.
 */
export function MessengerChat() {
  const [open, setOpen] = useState(false)
  const { contact } = useAgentContact()

  const chatUrl  = getPrimaryContactUrl(contact, 'floating_btn')
  const phoneUrl = getPhoneUrl(contact)
  const agentName = contact.name || 'Your BSQ Advisor'

  return (
    <div
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Popup card */}
      {open && (
        <div style={{
          position:     'absolute',
          bottom:       '68px',
          right:        0,
          width:        '220px',
          background:   '#1a1a1a',
          border:       '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding:      '16px',
          boxShadow:    '0 8px 32px rgba(0,0,0,0.5)',
          animation:    'fadeSlideUp 0.2s ease',
        }}>
          <style>{`
            @keyframes fadeSlideUp {
              from { opacity: 0; transform: translateY(8px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <p style={{ color: '#aaa', fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Talk to
          </p>
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 14px' }}>
            {agentName}
          </p>

          {/* Chat button */}
          <a
            href={chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '10px',
              background:     'linear-gradient(135deg, #D92D20, #ff6b35)',
              color:          '#fff',
              borderRadius:   '10px',
              padding:        '10px 14px',
              textDecoration: 'none',
              fontSize:       '13px',
              fontWeight:     600,
              marginBottom:   phoneUrl ? '8px' : 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
              <path d="M14 2C7.373 2 2 7.09 2 13.333c0 3.311 1.42 6.278 3.7 8.4V26l4.2-2.31A12.7 12.7 0 0014 24c6.627 0 12-5.09 12-10.667S20.627 2 14 2z" fill="white"/>
              <path d="M15.273 17.067l-3.054-3.254-5.965 3.254 6.563-6.967 3.127 3.254 5.892-3.254-6.563 6.967z" fill="#D92D20"/>
            </svg>
            Chat on Messenger
          </a>

          {/* Call button — only shown if phone available */}
          {phoneUrl && (
            <a
              href={phoneUrl}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '10px',
                background:     'rgba(255,255,255,0.08)',
                color:          '#fff',
                borderRadius:   '10px',
                padding:        '10px 14px',
                textDecoration: 'none',
                fontSize:       '13px',
                fontWeight:     600,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="white"/>
              </svg>
              Call Now
            </a>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        aria-label="Chat with us"
        style={{
          width:        '56px',
          height:       '56px',
          borderRadius: '50%',
          background:   'linear-gradient(135deg, #D92D20 0%, #ff6b35 100%)',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          boxShadow:    open ? '0 6px 20px rgba(217,45,32,0.7)' : '0 4px 16px rgba(217,45,32,0.5)',
          cursor:       'pointer',
          border:       'none',
          transform:    open ? 'scale(1.1)' : 'scale(1)',
          transition:   'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 2C7.373 2 2 7.09 2 13.333c0 3.311 1.42 6.278 3.7 8.4V26l4.2-2.31A12.7 12.7 0 0014 24c6.627 0 12-5.09 12-10.667S20.627 2 14 2z" fill="white"/>
          <path d="M15.273 17.067l-3.054-3.254-5.965 3.254 6.563-6.967 3.127 3.254 5.892-3.254-6.563 6.967z" fill="#D92D20"/>
        </svg>
      </button>
    </div>
  )
}
