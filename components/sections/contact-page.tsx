'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MessageCircle, MapPin, Clock, ArrowRight } from 'lucide-react'
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button'

const PRU_RED = '#ed1b2e'

const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: 'Call or Text',
    value: '+63 917 823 2799',
    sub: 'Available Mon–Sat, 9AM–7PM',
    href: 'tel:+639178232799',
    cta: 'Call Now',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'contact.us@prubsq.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:contact.us@prubsq.com',
    cta: 'Send Email',
  },
  {
    icon: MessageCircle,
    label: 'Facebook Messenger',
    value: 'Brilliant Star Quartz',
    sub: 'Quick questions? Chat with us',
    href: 'https://m.me/Bstarquartzarea',
    cta: 'Open Messenger',
    external: true,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }),
}

export default function ContactPage() {
  return (
    <section className="relative min-h-screen" style={{ background: '#ffffff' }}>

      {/* Red top accent */}
      <div style={{ height: 3, background: `linear-gradient(to right, transparent, ${PRU_RED}, transparent)` }} />

      <div className="relative max-w-4xl mx-auto px-6 py-20">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block text-xs font-bold tracking-[0.25em] uppercase mb-4 px-3 py-1 rounded-full"
            style={{ color: PRU_RED, background: 'rgba(237,27,46,0.08)', border: `1px solid rgba(237,27,46,0.2)` }}
          >
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight" style={{ color: '#1a1a2e' }}>
            Let&apos;s Talk About<br />
            <span style={{ color: PRU_RED }}>Your Financial Future</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6b7280' }}>
            Reach out via any channel below. We&apos;re here to help you understand your options and build a plan that works for you.
          </p>
        </motion.div>

        {/* ── Contact Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {CONTACT_ITEMS.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="group flex flex-col gap-4 rounded-2xl p-6 transition-all duration-300"
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = 'rgba(237,27,46,0.35)'
                el.style.boxShadow = '0 4px 16px rgba(237,27,46,0.10)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = '#e5e7eb'
                el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'
              }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(237,27,46,0.08)', color: PRU_RED }}
              >
                <item.icon size={20} />
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: '#9ca3af' }}>{item.label}</p>
                <p className="font-semibold text-sm leading-snug mb-1 break-all" style={{ color: '#1a1a2e' }}>{item.value}</p>
                <p className="text-xs" style={{ color: '#9ca3af' }}>{item.sub}</p>
              </div>

              {/* CTA */}
              <div
                className="flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: PRU_RED }}
              >
                {item.cta}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* ── Info strip ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Office */}
          <div
            className="flex items-start gap-4 rounded-2xl p-5"
            style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: '#f3f4f6', color: '#6b7280' }}
            >
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: '#9ca3af' }}>Office</p>
              <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>18th Floor, Exquadra Tower<br />Ortigas, Pasig City, Philippines</p>
            </div>
          </div>

          {/* Hours */}
          <div
            className="flex items-start gap-4 rounded-2xl p-5"
            style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: '#f3f4f6', color: '#6b7280' }}
            >
              <Clock size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: '#9ca3af' }}>Office Hours</p>
              <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>Monday – Saturday<br />9:00 AM – 7:00 PM (PHT)</p>
            </div>
          </div>
        </motion.div>

        {/* ── Calendly CTA ── */}
        <motion.div
          className="text-center rounded-2xl px-8 py-10"
          style={{ background: 'rgba(237,27,46,0.05)', border: '1px solid rgba(237,27,46,0.15)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: PRU_RED }}>Prefer a scheduled call?</p>
          <h2 className="text-2xl font-black mb-2" style={{ color: '#1a1a2e' }}>Book a Free 30-Minute Consultation</h2>
          <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: '#6b7280' }}>
            Pick a time that works for you. No pressure, no commitment — just a genuine conversation about your financial goals.
          </p>
          <AnimatedGradientButton
            preset="pru"
            duration={5}
            className="text-sm font-bold px-6 py-3 rounded-xl"
            onClick={() => window.open('https://calendly.com/brilliantstarquartz/30min', '_blank')}
          >
            Schedule a Call
            <ArrowRight size={14} />
          </AnimatedGradientButton>
        </motion.div>

      </div>
    </section>
  )
}
