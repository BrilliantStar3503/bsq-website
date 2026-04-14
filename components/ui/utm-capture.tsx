'use client'

import { useEffect } from 'react'

export default function UtmCapture() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const agent  = params.get('utm_agent')
    const source = params.get('utm_source')
    const medium = params.get('utm_medium')
    if (agent)  localStorage.setItem('bsq_utm_agent',  agent)
    if (source) localStorage.setItem('bsq_utm_source', source)
    if (medium) localStorage.setItem('bsq_utm_medium', medium)
  }, [])

  return null
}
