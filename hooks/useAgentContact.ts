'use client'

import { useState, useEffect, useCallback } from 'react'

/* ─── Types ─────────────────────────────────────────────────────────── */
export interface AgentContact {
  name:      string
  messenger: string | null   // FB Page converted to m.me link
  phone:     string | null   // from "Contacts" column → tel: link
  whatsapp:  string | null   // raw number/wa.me URL from "WhatsApp" column
  viber:     string | null   // raw number from "Viber" column
  telegram:  string | null   // username or t.me URL from "Telegram" column
  email:     string | null
  // legacy fields kept for backward compat
  cell:      string | null
}

/* ─── BSQ branch defaults ────────────────────────────────────────────── */
const BSQ_DEFAULT: AgentContact = {
  name:      'BSQ Financial Advisory',
  messenger: 'https://m.me/Bstarquartzarea',
  phone:     null,
  whatsapp:  null,
  viber:     null,
  telegram:  null,
  email:     'bstarquartz@gmail.com',
  cell:      null,
}

/* ─── Module-level cache — fetches once per browser session ─────────── */
let _cache: Record<string, AgentContact> = {}
let _pending: Record<string, Promise<AgentContact>> = {}

async function fetchAgentContact(agentId: string): Promise<AgentContact> {
  if (_cache[agentId]) return _cache[agentId]
  if (_pending[agentId] !== undefined) return _pending[agentId]

  _pending[agentId] = fetch(`/api/agent?id=${encodeURIComponent(agentId)}`)
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      const raw = data?.found ? data.contact : BSQ_DEFAULT
      // Ensure new platform fields default to null if absent
      const contact: AgentContact = {
        ...BSQ_DEFAULT,
        ...raw,
      }
      _cache[agentId] = contact
      delete _pending[agentId]
      return contact
    })
    .catch(() => {
      delete _pending[agentId]
      return BSQ_DEFAULT
    })

  return _pending[agentId]
}

/* ─── Build a clean WhatsApp URL ─────────────────────────────────────── */
export function getWhatsAppUrl(contact: AgentContact, message?: string): string | null {
  const raw = contact.whatsapp
  if (!raw) return null
  // Already a wa.me link
  const base = raw.startsWith('https://wa.me/') || raw.startsWith('http://wa.me/')
    ? raw
    : `https://wa.me/${raw.replace(/[^\d+]/g, '')}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/* ─── Build a Viber URL ──────────────────────────────────────────────── */
export function getViberUrl(contact: AgentContact, message?: string): string | null {
  const raw = contact.viber
  if (!raw) return null
  // Already a viber:// link
  if (raw.startsWith('viber://')) return raw
  const num = raw.replace(/[^\d+]/g, '')
  return message
    ? `viber://chat?number=${num}&text=${encodeURIComponent(message)}`
    : `viber://chat?number=${num}`
}

/* ─── Build a Telegram URL ───────────────────────────────────────────── */
export function getTelegramUrl(contact: AgentContact, message?: string): string | null {
  const raw = contact.telegram
  if (!raw) return null
  // Already a t.me or telegram.me link
  if (raw.startsWith('https://t.me/') || raw.startsWith('http://t.me/') || raw.startsWith('https://telegram.me/')) return raw
  // Username with or without @
  const username = raw.replace(/^@/, '')
  return message
    ? `https://t.me/${username}?text=${encodeURIComponent(message)}`
    : `https://t.me/${username}`
}

/**
 * Chat URL — picks the best platform for the chat widget
 * Priority: WhatsApp (supports pre-fill) → Viber → Telegram → FB Page → BSQ default
 */
export function getChatUrl(contact: AgentContact, message?: string): string {
  const wa = getWhatsAppUrl(contact, message)
  if (wa) return wa

  const viber = getViberUrl(contact, message)
  if (viber) return viber

  const tg = getTelegramUrl(contact, message)
  if (tg) return tg

  if (contact.messenger) return contact.messenger
  return BSQ_DEFAULT.messenger!
}

/**
 * getChatPlatform — returns the highest-priority single platform
 */
export function getChatPlatform(contact: AgentContact): 'whatsapp' | 'viber' | 'telegram' | 'messenger' {
  if (contact.whatsapp) return 'whatsapp'
  if (contact.viber)    return 'viber'
  if (contact.telegram) return 'telegram'
  return 'messenger'
}

export type ChatPlatform = 'whatsapp' | 'viber' | 'telegram' | 'messenger'

/**
 * getAvailablePlatforms — returns ALL platforms the agent has configured,
 * each with a ready-to-open URL (message pre-filled where supported).
 * Falls back to BSQ Messenger if nothing is configured.
 */
export function getAvailablePlatforms(
  contact: AgentContact,
  message?: string,
): { platform: ChatPlatform; url: string }[] {
  const list: { platform: ChatPlatform; url: string }[] = []

  const wa = getWhatsAppUrl(contact, message)
  if (wa) list.push({ platform: 'whatsapp', url: wa })

  const viber = getViberUrl(contact, message)
  if (viber) list.push({ platform: 'viber', url: viber })

  const tg = getTelegramUrl(contact, message)
  if (tg) list.push({ platform: 'telegram', url: tg })

  if (contact.messenger) list.push({ platform: 'messenger', url: contact.messenger })

  // Default fallback
  if (list.length === 0) list.push({ platform: 'messenger', url: BSQ_DEFAULT.messenger! })

  return list
}

/* ─── Primary contact URL (priority: WhatsApp → Messenger → phone) ──── */
export function getPrimaryContactUrl(contact: AgentContact, ref?: string): string {
  const wa = getWhatsAppUrl(contact)
  if (wa) return wa

  if (contact.messenger) {
    return ref ? `${contact.messenger}?ref=${ref}` : contact.messenger
  }
  if (contact.phone) {
    return `tel:${contact.phone.replace(/\s/g, '')}`
  }
  // legacy fallbacks
  if (contact.cell) {
    return `tel:${contact.cell.replace(/\s/g, '')}`
  }
  return BSQ_DEFAULT.messenger!
}

/* ─── Phone-only URL (for explicit Call buttons) ─────────────────────── */
export function getPhoneUrl(contact: AgentContact): string | null {
  const num = contact.phone || contact.cell
  return num ? `tel:${num.replace(/\s/g, '')}` : null
}

/* ─── Hook ──────────────────────────────────────────────────────────── */
export function useAgentContact() {
  const [contact, setContact] = useState<AgentContact>(BSQ_DEFAULT)
  const [agentId, setAgentId]  = useState<string | null>(null)

  useEffect(() => {
    // Support both ?agent_id= (new spec) and ?utm_agent= (existing CRM param)
    const params   = new URLSearchParams(window.location.search)
    const fromUrl  = params.get('agent_id') || params.get('utm_agent')
    if (fromUrl) {
      localStorage.setItem('bsq_utm_agent', fromUrl)
    }
    const id = fromUrl || localStorage.getItem('bsq_utm_agent')
    if (!id) return
    setAgentId(id)
    fetchAgentContact(id).then(setContact)
  }, [])

  return {
    contact,
    agentId,
    /** Returns the best contact URL for a given ref tag */
    contactUrl: (ref?: string) => getPrimaryContactUrl(contact, ref),
    /** Opens the best contact channel and logs the click to CRM */
    openContact: (ref?: string) => {
      // Silent CRM tracking — fire and forget
      fetch('/api/track-click', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source:    ref ? `advisor_btn_${ref}` : 'advisor_btn',
          agent:     agentId ?? 'direct',
          utmSource: typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('utm_source') ?? 'direct'
            : 'direct',
          utmMedium: typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('utm_medium') ?? 'organic'
            : 'organic',
        }),
      }).catch(() => {})
      window.open(getPrimaryContactUrl(contact, ref), '_blank')
    },
  }
}
