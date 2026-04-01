'use client'

import { useState, useRef, useEffect } from 'react'
import {
  useAgentContact,
  getChatUrl,
  getChatPlatform,
} from '@/hooks/useAgentContact'

/**
 * ChatLauncher
 * ──────────────────────────────────────────────────────────────────────
 * Custom floating chat widget.
 * Routes to the agent's preferred platform (WhatsApp → Viber → Telegram → FB Page).
 * WhatsApp and Telegram support message pre-fill via URL params.
 * Viber pre-fills via viber://chat?text= on mobile.
 * FB Messenger: auto-copies message to clipboard (no URL pre-fill support).
 */

/* ─── Platform config ────────────────────────────────────────────────── */
const PLATFORM_CONFIG = {
  whatsapp: {
    label:     'Send on WhatsApp',
    icon:      (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.374 0 0 5.373 0 12c0 2.126.556 4.122 1.527 5.856L.057 23.882a.5.5 0 00.613.613l6.026-1.47A11.95 11.95 0 0012 24c6.626 0 12-5.373 12-12S18.626 0 12 0zm0 21.9a9.9 9.9 0 01-5.032-1.372l-.36-.214-3.742.912.928-3.742-.232-.374A9.866 9.866 0 012.1 12c0-5.467 4.432-9.9 9.9-9.9 5.467 0 9.9 4.433 9.9 9.9 0 5.468-4.433 9.9-9.9 9.9z"/>
      </svg>
    ),
    color:     '#25D366',
    supportsPreFill: true,
    confirmText: 'Opening WhatsApp with your message pre-filled!',
    confirmSub:  'Just hit Send in WhatsApp.',
  },
  viber: {
    label:     'Send on Viber',
    icon:      (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M11.4 0C6 .1 1.6 4.4 1.4 9.8c-.1 2.9.9 5.5 2.7 7.5.2.2.3.5.2.7l-.9 3.3c-.1.4.3.8.7.7l3.4-.9c.3-.1.5 0 .8.1 1.3.7 2.7 1 4.2 1.1 5.4.1 9.9-4.1 10.1-9.5C22.7 6.7 17.7.4 11.4 0zm5.8 15.6c-.6.6-1.3 1-2.1 1.1-.5.1-1.3.1-4.7-1.9-3.1-1.8-5.1-4.9-5.3-5.2-.2-.2-1.4-1.9-1.4-3.6 0-1.7.9-2.5 1.2-2.8.3-.3.7-.5 1.1-.5.1 0 .3 0 .4.1.4.1.7.5 1 1.2.2.6.8 2 .9 2.2.1.2.2.4.1.6-.1.2-.1.4-.3.5-.1.1-.3.3-.4.4-.1.2-.3.3-.1.6.2.3.8 1.2 1.7 2 1.1 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1 .2-.3.4-.2.7-.1.3.1 1.8.8 2.1 1 .3.1.5.2.6.3.1.4.1 1-.3 1.7z"/>
      </svg>
    ),
    color:     '#7360F2',
    supportsPreFill: true,
    confirmText: 'Opening Viber with your message!',
    confirmSub:  'Your message is pre-filled — just hit Send.',
  },
  telegram: {
    label:     'Send on Telegram',
    icon:      (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    color:     '#2CA5E0',
    supportsPreFill: true,
    confirmText: 'Opening Telegram with your message!',
    confirmSub:  'Your message is pre-filled — just hit Send.',
  },
  messenger: {
    label:     'Send on Messenger',
    icon:      (
      <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
        <path d="M14 2C7.373 2 2 7.09 2 13.333c0 3.311 1.42 6.278 3.7 8.4V26l4.2-2.31A12.7 12.7 0 0014 24c6.627 0 12-5.09 12-10.667S20.627 2 14 2z" fill="white"/>
        <path d="M15.273 17.067l-3.054-3.254-5.965 3.254 6.563-6.967 3.127 3.254 5.892-3.254-6.563 6.967z" fill="#D92D20"/>
      </svg>
    ),
    color:     '#0099FF',
    supportsPreFill: false,
    confirmText: 'Messenger is opening!',
    confirmSub:  'Your message is copied — just paste it and hit Send.',
  },
} as const

type Platform = keyof typeof PLATFORM_CONFIG

export function MessengerChat() {
  const [open,    setOpen]    = useState(false)
  const [name,    setName]    = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const { contact, agentId } = useAgentContact()

  const agentName = contact.name || 'BSQ Financial Advisor'
  const platform  = getChatPlatform(contact) as Platform
  const cfg       = PLATFORM_CONFIG[platform]

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

    const fullMessage = `${name.trim() ? `Hi, I'm ${name.trim()}. ` : ''}${message.trim()}`

    // Build platform URL — WhatsApp/Viber/Telegram support pre-fill via URL params
    const chatUrl = getChatUrl(contact, cfg.supportsPreFill ? fullMessage : undefined)

    // For Messenger (no pre-fill support), auto-copy to clipboard
    if (!cfg.supportsPreFill) {
      navigator.clipboard.writeText(fullMessage).catch(() => {})
    }

    // Save lead to CRM silently
    fetch('/api/track-click', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source:    'chat_launcher',
        agent:     agentId ?? 'direct',
        name:      name.trim() || 'Anonymous',
        message:   message.trim(),
        platform,
        utmSource: new URLSearchParams(window.location.search).get('utm_source') ?? 'direct',
        utmMedium: new URLSearchParams(window.location.search).get('utm_medium') ?? 'organic',
      }),
    }).catch(() => {})

    // Open chosen platform
    window.open(chatUrl, '_blank')

    setSent(true)
    setTimeout(() => {
      setOpen(false)
      setSent(false)
      setName('')
      setMessage('')
    }, 4000)
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
              width:          '40px',
              height:         '40px',
              borderRadius:   '50%',
              background:     'rgba(255,255,255,0.2)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              flexShrink:     0,
            }}>
              {/* Platform icon in header */}
              {platform === 'whatsapp' && (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.374 0 0 5.373 0 12c0 2.126.556 4.122 1.527 5.856L.057 23.882a.5.5 0 00.613.613l6.026-1.47A11.95 11.95 0 0012 24c6.626 0 12-5.373 12-12S18.626 0 12 0zm0 21.9a9.9 9.9 0 01-5.032-1.372l-.36-.214-3.742.912.928-3.742-.232-.374A9.866 9.866 0 012.1 12c0-5.467 4.432-9.9 9.9-9.9 5.467 0 9.9 4.433 9.9 9.9 0 5.468-4.433 9.9-9.9 9.9z"/>
                </svg>
              )}
              {platform === 'viber' && (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M11.4 0C6 .1 1.6 4.4 1.4 9.8c-.1 2.9.9 5.5 2.7 7.5.2.2.3.5.2.7l-.9 3.3c-.1.4.3.8.7.7l3.4-.9c.3-.1.5 0 .8.1 1.3.7 2.7 1 4.2 1.1 5.4.1 9.9-4.1 10.1-9.5C22.7 6.7 17.7.4 11.4 0zm5.8 15.6c-.6.6-1.3 1-2.1 1.1-.5.1-1.3.1-4.7-1.9-3.1-1.8-5.1-4.9-5.3-5.2-.2-.2-1.4-1.9-1.4-3.6 0-1.7.9-2.5 1.2-2.8.3-.3.7-.5 1.1-.5.1 0 .3 0 .4.1.4.1.7.5 1 1.2.2.6.8 2 .9 2.2.1.2.2.4.1.6-.1.2-.1.4-.3.5-.1.1-.3.3-.4.4-.1.2-.3.3-.1.6.2.3.8 1.2 1.7 2 1.1 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1 .2-.3.4-.2.7-.1.3.1 1.8.8 2.1 1 .3.1.5.2.6.3.1.4.1 1-.3 1.7z"/>
                </svg>
              )}
              {platform === 'telegram' && (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              )}
              {platform === 'messenger' && (
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2C7.373 2 2 7.09 2 13.333c0 3.311 1.42 6.278 3.7 8.4V26l4.2-2.31A12.7 12.7 0 0014 24c6.627 0 12-5.09 12-10.667S20.627 2 14 2z" fill="white"/>
                  <path d="M15.273 17.067l-3.054-3.254-5.965 3.254 6.563-6.967 3.127 3.254 5.892-3.254-6.563 6.967z" fill="#D92D20"/>
                </svg>
              )}
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
            {sent ? (
              <div style={{ textAlign:'center', padding:'12px 0' }}>
                <div style={{ fontSize:'32px', marginBottom:'6px' }}>
                  {platform === 'whatsapp' ? '💬' : platform === 'viber' ? '💜' : platform === 'telegram' ? '✈️' : '💬'}
                </div>
                <p style={{ color:'#fff', fontWeight:700, fontSize:'14px', margin:'0 0 4px' }}>{cfg.confirmText}</p>
                <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'12px', margin:'0 0 12px' }}>
                  {cfg.supportsPreFill ? (
                    cfg.confirmSub
                  ) : (
                    <>Your message is <strong style={{color:'#4ade80'}}>copied</strong> — just paste it and hit Send:</>
                  )}
                </p>
                {!cfg.supportsPreFill && (
                  <>
                    <div style={{
                      background: 'rgba(255,255,255,0.07)',
                      borderRadius: '8px',
                      padding: '10px',
                      fontSize: '12px',
                      color: '#fff',
                      textAlign: 'left',
                      marginBottom: '10px',
                      wordBreak: 'break-word',
                    }}>
                      {name.trim() ? `Hi, I'm ${name.trim()}. ` : ''}{message}
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(`${name.trim() ? `Hi, I'm ${name.trim()}. ` : ''}${message}`)}
                      className="bsq-send-btn"
                      style={{ fontSize:'12px', padding:'8px', background:'#333' }}
                    >
                      📋 Copy Message
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'12px', margin:0, textAlign:'center' }}>
                  {cfg.supportsPreFill
                    ? `Your message will open pre-filled in ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
                    : 'Send a message — we\'ll reply on Messenger'}
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

                <button
                  className="bsq-send-btn"
                  onClick={handleSend}
                  disabled={!message.trim()}
                  style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)` }}
                >
                  {cfg.icon}
                  {cfg.label}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        aria-label="Chat with us"
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
