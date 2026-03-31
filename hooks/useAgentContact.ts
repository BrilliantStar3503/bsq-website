'use client'

import { useState, useEffect } from 'react'

/* ─── Types ─────────────────────────────────────────────────────────── */
export interface AgentContact {
  name:      string
  messenger: string | null   // full URL: https://m.me/username (add Messenger column to sheet later)
  phone:     string | null   // from "Contacts" column → tel: link
  email:     string | null
  // legacy fields kept for backward compat
  whatsapp:  string | null
  viber:     string | null
  cell:      string | null
}

/* ─── BSQ branch defaults (Chris Garcia) ────────────────────────────── */
const BSQ_DEFAULT: AgentContact = {
  name:      'BSQ Financial Advisory',
  messenger: 'https://m.me/Bstarquartzarea',
  phone:     null,
  email:     'bstarquartz@gmail.com',
  whatsapp:  null,
  viber:     null,
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
      const contact = data?.found ? data.contact : BSQ_DEFAULT
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

/* ─── Primary contact URL (priority: Messenger → phone) ─────────────── */
export function getPrimaryContactUrl(contact: AgentContact, ref?: string): string {
  if (contact.messenger) {
    return ref ? `${contact.messenger}?ref=${ref}` : contact.messenger
  }
  if (contact.phone) {
    return `tel:${contact.phone.replace(/\s/g, '')}`
  }
  // legacy fallbacks
  if (contact.whatsapp) {
    return `https://wa.me/${contact.whatsapp}`
  }
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
    /** Opens the best contact channel */
    openContact: (ref?: string) => {
      window.open(getPrimaryContactUrl(contact, ref), '_blank')
    },
  }
}
