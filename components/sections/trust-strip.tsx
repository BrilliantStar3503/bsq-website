"use client";

import Image from "next/image";
import { useState } from "react";

const LOGO_ALT: Record<string, string> = {
  "/logos/gama-logo.png":  "GAMA",
  "/logos/iarfc-logo.png": "IARFC",
  "/logos/luap-logo.png":  "LUAP",
  "/logos/mdrt-logo.png":  "MDRT",
}

function LogoBadge({ src }: { src: string }) {
  const [err, setErr] = useState(false)
  const alt = LOGO_ALT[src] ?? "logo"
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{
        width: 80, height: 80,
        borderRadius: 20,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = '0 4px 24px rgba(185,28,28,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
        el.style.borderColor = 'rgba(185,28,28,0.35)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = '0 2px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)'
        el.style.borderColor = 'rgba(255,255,255,0.12)'
      }}
    >
      {/* Subtle inner glow top */}
      <div className="absolute inset-x-0 top-0 h-px rounded-t-[20px]"
        style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)' }} />

      {err ? (
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>{alt}</span>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={52}
          height={52}
          onError={() => setErr(true)}
          className="object-contain"
          style={{ filter: 'grayscale(1) brightness(1.6)', opacity: 0.92 }}
        />
      )}
    </div>
  )
}

export default function TrustStrip() {
  const logos = [
    "/logos/gama-logo.png",
    "/logos/iarfc-logo.png",
    "/logos/luap-logo.png",
    "/logos/mdrt-logo.png",
  ]

  return (
    <section
      className="w-full overflow-hidden relative"
      style={{
        paddingTop: 28,
        paddingBottom: 32,
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <style>{`
        @keyframes trust-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .trust-scroll { animation: trust-scroll 25s linear infinite; }
      `}</style>

      {/* Label */}
      <div className="text-center mb-7 relative z-10">
        <div className="inline-flex items-center gap-3">
          <div style={{ width: 24, height: 1, background: 'linear-gradient(to right, transparent, rgba(185,28,28,0.6))' }} />
          <p style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
          }}>
            Trusted by Industry Standards
          </p>
          <div style={{ width: 24, height: 1, background: 'linear-gradient(to left, transparent, rgba(185,28,28,0.6))' }} />
        </div>
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-32 z-10"
        style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.95), rgba(10,10,10,0))' }} />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-32 z-10"
        style={{ background: 'linear-gradient(to left, rgba(10,10,10,0.95), rgba(10,10,10,0))' }} />

      {/* Scrolling logos */}
      <div className="relative z-10 flex gap-6 trust-scroll whitespace-nowrap" style={{ paddingLeft: 40 }}>
        {[...logos, ...logos].map((logo, i) => (
          <LogoBadge key={i} src={logo} />
        ))}
      </div>
    </section>
  )
}
