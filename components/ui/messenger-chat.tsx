'use client'

import { useState, useRef, useEffect } from 'react'
import { useAgentContact, getPrimaryContactUrl } from '@/hooks/useAgentContact'

/**
 * ChatLauncher
 * ──────────────────────────────────────────────────────────────────────
 * Custom click-to-messenger widget.
 * Dynamically routes to the correct agent's Messenger based on ?agent_id=
 * Falls back to BSQ default (m.me/Bstarquartzarea) if no agent param.
 */
export function MessengerChat() {
  const [open,    setOpen]    = useState(false)
  const [name,    setName]    = useState('')
  const [message, setMessage] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const { contact, agentId } = useAgentContact()

  const agentName    = contact.name || 'BSQ Financial Advisor'
  const messengerUrl = contact.messenger || 'https://m.me/Bstarquartzarea'

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function handleSend() {
    if (!message.trim()) return
    const intro = name.trim() ? `Hi, I'm ${name.trim()}. ` : ''
    const text   = encodeURIComponent(`${intro}${message.trim()}`)
    // Open Messenger chat — text param not appended as it causes redirect issues
    window.open(messengerUrl, '_blank')
    setOpen(false)
    setName('')
    setMessage('')
  }

  return (
    <div ref={panelRef} style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>

      {/* Chat panel */}
      {open && (
        <div style={{
          position:     'absolute',
          bottom:       '68px',
          right:        0,
          width:        '300px',
          background:   '#111',
          border:       '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          overflow:     'hidden',
          boxShadow:    '0 8px 40px rgba(0,0,0,0.6)',
          animation:    'chatSlideUp 0.25s ease',
        }}>
          <style>{`
            @keyframes chatSlideUp {
              from { opacity:0; transform:translateY(12px); }
              to   { opacity:1; transform:translateY(0); }
            }
            .bsq-chat-input {
              width: 100%;
              background: rgba(255,255,255,0.07);
              border: 1px solid rgba(255,255,255,0.12);
              border-radius: 10px;
              color: #fff;
              font-size: 13px;
              padding: 10px 12px;
              outline: none;
              box-sizing: border-box;
              font-family: inherit;
            }
            .bsq-chat-input::placeholder { color: rgba(255,255,255,0.35); }
            .bsq-chat-input:focus { border-color: rgba(217,45,32,0.6); }
            .bsq-send-btn {
              width: 100%;
              padding: 11px;
              background: linear-gradient(135deg,#D92D20,#ff6b35);
              color: #fff;
              font-size: 13px;
              font-weight: 700;
              border: none;
              border-radius: 10px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              transition: opacity 0.15s;
            }
            .bsq-send-btn:hover { opacity: 0.88; }
            .bsq-send-btn:disabled { opacity: 0.4; cursor: default; }
          `}</style>

          {/* Header */}
          <div style={{
            background:  'linear-gradient(135deg,#D92D20,#ff6b35)',
            padding:     '16px 18px',
            display:     'flex',
            alignItems:  'center',
            gap:         '12px',
          }}>
            <div style={{
              width:        '40px',
              height:       '40px',
              borderRadius: '50%',
              background:   'rgba(255,255,255,0.2)',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              flexShrink:   0,
            }}>
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <path d="M14 2C7.373 2 2 7.09 2 13.333c0 3.311 1.42 6.278 3.7 8.4V26l4.2-2.31A12.7 12.7 0 0014 24c6.627 0 12-5.09 12-10.667S20.627 2 14 2z" fill="white"/>
                <path d="M15.273 17.067l-3.054-3.254-5.965 3.254 6.563-6.967 3.127 3.254 5.892-3.254-6.563 6.967z" fill="#D92D20"/>
              </svg>
            </div>
            <div>
              <p style={{ color:'#fff', fontWeight:700, fontSize:'14px', margin:0 }}>{agentName}</p>
              <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'11px', margin:0 }}>Typically replies instantly</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,0.7)', cursor:'pointer', fontSize:'18px', lineHeight:1, padding:'4px' }}
            >×</button>
          </div>

          {/* Body */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'12px', margin:0, textAlign:'center' }}>
              Send a message — we'll reply on Messenger
            </p>

            <input
              className="bsq-chat-input"
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <textarea
              className="bsq-chat-input"
              placeholder="Type your message..."
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              style={{ resize: 'none' }}
            />

            <button className="bsq-send-btn" onClick={handleSend} disabled={!message.trim()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Send on Messenger
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        aria-label="Chat with us on Messenger"
        onClick={() => setOpen(o => !o)}
        style={{
          width:          '56px',
          height:         '56px',
          borderRadius:   '50%',
          background:     'linear-gradient(135deg,#D92D20 0%,#ff6b35 100%)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          boxShadow:      open ? '0 6px 24px rgba(217,45,32,0.7)' : '0 4px 16px rgba(217,45,32,0.5)',
          cursor:         'pointer',
          border:         'none',
          transform:      open ? 'scale(1.1)' : 'scale(1)',
          transition:     'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2C7.373 2 2 7.09 2 13.333c0 3.311 1.42 6.278 3.7 8.4V26l4.2-2.31A12.7 12.7 0 0014 24c6.627 0 12-5.09 12-10.667S20.627 2 14 2z" fill="white"/>
            <path d="M15.273 17.067l-3.054-3.254-5.965 3.254 6.563-6.967 3.127 3.254 5.892-3.254-6.563 6.967z" fill="#D92D20"/>
          </svg>
        )}
      </button>
    </div>
  )
}
