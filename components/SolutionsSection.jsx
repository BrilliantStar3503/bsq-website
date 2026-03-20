'use client'

import { motion } from "framer-motion";

const products = [
  {
    name: "PRULifetime Income",
    tag: "RETIREMENT",
    color: "text-yellow-400",
    what: "Creates a guaranteed income stream that continues even after retirement.",
    why: "Prevents your savings from running out when you stop working.",
    when: "Detected when there is no structured retirement income plan.",
  },
  {
    name: "PRUMillion Protect",
    tag: "PROTECTION",
    color: "text-red-400",
    what: "Provides high coverage that replaces your income if something happens to you.",
    why: "Ensures your family can continue their lifestyle without disruption.",
    when: "Detected when dependents rely heavily on your income.",
  },
  {
    name: "PRUlink Assurance Account Plus",
    tag: "GROWTH",
    color: "text-green-400",
    what: "Combines life protection with investment growth in one plan.",
    why: "Allows your money to grow while protecting your family.",
    when: "Detected when both protection and long-term growth are needed.",
  },
  {
    name: "PRU Elite Series",
    tag: "WEALTH",
    color: "text-blue-400",
    what: "Designed for wealth accumulation and legacy planning.",
    why: "Helps preserve and transfer wealth across generations.",
    when: "Detected when building or protecting significant assets.",
  },
  {
    name: "PRU Health Prime",
    tag: "HEALTH",
    color: "text-purple-400",
    what: "Covers hospitalization and major medical expenses.",
    why: "Protects your finances from unexpected health costs.",
    when: "Detected when there is limited or no health coverage.",
  },
];

export default function SolutionsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-[#0b0b0f] text-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">
          <p className="text-xs text-red-400 tracking-widest uppercase mb-3">
            System-Generated Recommendations
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Solutions Based on Your Financial Gaps
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm">
            Each solution is matched based on your income, coverage, and goals.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-7 transition hover:shadow-[0_0_30px_rgba(255,0,0,0.15)]"
            >
              {/* TAG */}
              <p className="text-[10px] tracking-widest text-gray-500 mb-2">
                {p.tag}
              </p>

              {/* TITLE */}
              <h3 className={`text-lg font-semibold mb-4 ${p.color}`}>
                {p.name}
              </h3>

              {/* CONTENT */}
              <div className="space-y-2 text-xs leading-relaxed">
                <p className="text-gray-300">
                  <span className="text-white/80">Function:</span> {p.what}
                </p>
                <p className="text-gray-400">
                  <span className="text-white/70">Impact:</span> {p.why}
                </p>
              </div>

              {/* DIVIDER */}
              <div className="h-px bg-white/10 my-4" />

              {/* SIGNAL */}
              <p className="text-[11px] text-gray-500 italic">
                {p.when}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-3 text-sm">
            Not sure which applies to you?
          </p>
          <button className="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-xl font-semibold transition shadow-lg">
            Run Your 3-Minute Assessment →
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Free • No obligation • Instant results
          </p>
        </div>

      </div>
    </section>
  );
}
