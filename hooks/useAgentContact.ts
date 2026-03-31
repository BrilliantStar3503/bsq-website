'use client'

import { useState, useEffect } from 'react'

/* ─── Types ─────────────────────────────────────────────────────────── */
export interface AgentContact {
  name:      string
  messenger: string | null   // full URL: https://m.me/username
  whatsapp:  string | null   // number with country code: 639171234567
  viber:     string | null   // number with country code: 639171234567
  cell:      string | null   // display: 0917 123 4567
  email:     string | null
}

/* ─── BSQ branch defaults (Chris Garcia) ────────────────────────────── */
const BSQ_DEFAULT: AgentContact = {
  name:      'BSQ Financial Advisory',
  messenger: 'https://m.me/Bstarquartzarea',
  whatsapp:  null,
  viber:     null,
  cell:      null,
  email:     'bstarquartz@gmail.com',
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

/* ─── Primary contact URL (priority: Messenger → WhatsApp → cell) ───── */
export function getPrimaryContactUrl(contact: AgentContact, ref?: string): string {
  if (contact.messenger) {
    return ref ? `${contact.messenger}?ref=${ref}` : contact.messenger
  }
  if (contact.whatsapp) {
    const msg = ref ? `?text=Hi! I came from ${ref}` : ''
    return `https://wa.me/${contact.whatsapp}${msg}`
  }
  if (contact.viber) {
    return `viber://chat?number=${encodeURIComponent('+' + contact.viber)}`
  }
  if (contact.cell) {
    return `tel:${contact.cell.replace(/\s/g, '')}`
  }
  return BSQ_DEFAULT.messenger!
}

/* ─── Hook ──────────────────────────────────────────────────────────── */
export function useAgentContact() {
  const [contact, setContact] = useState<AgentContact>(BSQ_DEFAULT)
  const [agentId, setAgentId]  = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('bsq_utm_agent')
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
