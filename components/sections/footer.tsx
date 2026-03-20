"use client"

import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10">

      {/* TOP CTA */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <h2 className="text-xl md:text-2xl font-semibold text-center md:text-left">
          Know your financial gaps. Fix them with a plan.
        </h2>

        <a
          href="#"
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-medium transition"
        >
          Start Your Free Assessment →
        </a>
      </div>

      {/* MAIN FOOTER */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

        {/* LEFT */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/images/bsq-logo.png"
              alt="BSQ Logo"
              width={40}
              height={40}
            />
            <div>
              <div className="font-semibold text-sm">
                BRILLIANT STAR QUARTZ
              </div>
              <div className="text-xs text-white/50">
                FINANCIAL SYSTEM
              </div>
            </div>
          </div>

          <p className="text-sm text-white/60 leading-relaxed">
            AI-powered financial assessment designed to identify your protection gaps 
            and connect you with the right financial solutions.
          </p>

          <div className="mt-4 text-sm text-white/50 space-y-1">
            <p>Ortigas Center, Pasig City</p>
            <p>+63 917 823 2799</p>
            <p>bstarquartz@gmail.com</p>
          </div>
        </div>

        {/* MIDDLE */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Navigate</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="#" className="hover:text-white">Start Assessment</a></li>
            <li><a href="#" className="hover:text-white">How It Works</a></li>
            <li><a href="#" className="hover:text-white">Solutions</a></li>
            <li><a href="#" className="hover:text-white">Contact Advisor</a></li>
          </ul>
        </div>

        {/* RIGHT */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Affiliation</h3>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-white/40 mb-1">Affiliated with</p>
            <p className="font-semibold">PRU Life UK</p>
            <p className="text-xs text-white/50 mt-1">
              Licensed under the Insurance Commission of the Philippines.
            </p>
          </div>

          {/* Socials */}
          <div className="flex gap-3 mt-4">
            <div className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center hover:bg-white/20 cursor-pointer">F</div>
            <div className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center hover:bg-white/20 cursor-pointer">in</div>
            <div className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center hover:bg-white/20 cursor-pointer">@</div>
          </div>
        </div>

      </div>

      {/* BOTTOM STRIP */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Brilliant Star Quartz. All rights reserved.
      </div>

    </footer>
  )
}