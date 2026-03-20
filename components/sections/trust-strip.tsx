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
    <section className="w-full bg-black py-10 overflow-hidden relative mb-16">
      
      {/* Label */}
      <div className="text-center mb-8">
        <p className="text-xs tracking-[0.3em] text-white/50 uppercase">
          Trusted by Industry Standards
        </p>
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-black to-transparent z-10" />

      {/* Scrolling */}
      <div className="flex gap-16 animate-scroll whitespace-nowrap">
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center min-w-[120px]"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-md">
              <Image
                src={logo}
                alt="logo"
                width={60}
                height={60}
                className="h-10 w-auto object-contain opacity-90 hover:opacity-100 transition duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}