"use client";

import Image from "next/image";

export default function TrustStrip() {
  const logos = [
    "/logos/gama-logo.png",
    "/logos/iarfc-logo.png",
    "/logos/luap-logo.png",
    "/logos/mdrt-logo.png",
  ];

  return (
    <section className="w-full py-5 overflow-hidden relative mb-6" style={{ background: 'transparent' }}>

      {/* Label */}
      <div className="text-center mb-5">
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(17,17,17,0.5)' }}>
          Trusted by Industry Standards
        </p>
      </div>

      {/* Fade edges — match body background */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
        style={{ background: 'linear-gradient(to right, #f5f5f7, transparent)' }} />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
        style={{ background: 'linear-gradient(to left, #f5f5f7, transparent)' }} />

      {/* Scrolling */}
      <div className="flex gap-10 animate-scroll whitespace-nowrap">
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center min-w-[100px]"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <Image
                src={logo}
                alt="logo"
                width={48}
                height={48}
                className="h-9 w-auto object-contain transition duration-300"
                style={{ opacity: 1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}