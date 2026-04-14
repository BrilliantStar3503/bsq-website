'use client'

import React from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { LucideIcon } from 'lucide-react'
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button'
import { useAgentContact } from '@/hooks/useAgentContact'
import {
  ClipboardList,
  ShieldCheck,
  HeartPulse,
  TrendingUp,
  GraduationCap,
  Sunset,
  Wallet,
  LineChart,
  MessageCircle,
  Users,
  Star,
  BookOpen,
  ArrowRight,
} from 'lucide-react'

/* ══════════════════════════════════════════════════════════════════════════
   BSQ HEADER — Brilliant Star Quartz Financial System
   Sticky · Dark-glassmorphism on scroll · BSQ-branded
   ══════════════════════════════════════════════════════════════════════════ */

type LinkItem = {
  title: string
  href: string
  icon: LucideIcon
  description?: string
}

/* ─── Assessment sub-links ──────────────────────────────────────────── */
const assessmentLinks: LinkItem[] = [
  {
    title: 'Start Assessment',
    href:  '/assessment',
    icon:  ClipboardList,
    description: 'Get your full financial gap report in 3 minutes',
  },
  {
    title: 'Life Protection',
    href:  '/assessment',
    icon:  ShieldCheck,
    description: 'How much life coverage does your family need?',
  },
  {
    title: 'Health Coverage',
    href:  '/assessment',
    icon:  HeartPulse,
    description: 'Evaluate your health insurance gaps',
  },
  {
    title: 'Income Protection',
    href:  '/assessment',
    icon:  TrendingUp,
    description: 'Protect your earning capacity',
  },
  {
    title: 'Retirement Funding',
    href:  '/assessment',
    icon:  Sunset,
    description: 'Are you on track for retirement?',
  },
  {
    title: 'Education Funding',
    href:  '/assessment',
    icon:  GraduationCap,
    description: 'Plan your children\'s future tuition costs',
  },
]

/* ─── About sub-links ───────────────────────────────────────────────── */
const aboutLinks: LinkItem[] = [
  {
    title: 'About BSQ',
    href:  '/about',
    icon:  Star,
    description: 'Our mission and financial philosophy',
  },
  {
    title: 'Emergency Fund',
    href:  '/#accordion',
    icon:  Wallet,
    description: 'Build your 3–6 month liquidity buffer',
  },
  {
    title: 'Wealth Accumulation',
    href:  '/#accordion',
    icon:  LineChart,
    description: 'Long-term investment strategies',
  },
]

const aboutLinks2: LinkItem[] = [
  { title: 'Our Advisors',    href: '/about',    icon: Users    },
  { title: 'Certifications',  href: '/about',    icon: BookOpen },
  { title: 'Talk to Us',      href: 'https://m.me/Bstarquartzarea', icon: MessageCircle },
]

/* ─── Scroll hook ───────────────────────────────────────────────────── */
function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false)
  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold)
  }, [threshold])
  React.useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])
  React.useEffect(() => { onScroll() }, [onScroll])
  return scrolled
}

/* ─── BSQ Logo ──────────────────────────────────────────────────────── */
function BsqLogo({ scrolled }: { scrolled: boolean }) {
  const [imgError, setImgError] = React.useState(false)
  return (
    <a href="/" className="flex items-center gap-2.5 shrink-0 group">
      <div className="relative w-10 h-10 flex items-center justify-center">
        {imgError ? (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(220,38,38,0.12)',
              border: '1px solid rgba(220,38,38,0.3)',
            }}
          >
            <span className="text-red-400 font-black text-xs">BSQ</span>
          </div>
        ) : (
          /* Black-bg logo — displayed in a clipped rounded container */
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-black">
            <Image
              src="/images/bsq-logo.png"
              alt="BSQ"
              width={40}
              height={40}
              onError={() => setImgError(true)}
              style={{ objectFit: 'contain', width: 40, height: 40 }}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col leading-none">
        <span
          className="font-black text-sm tracking-wide transition-colors duration-300"
          style={{ color: scrolled ? '#111111' : '#ffffff' }}
        >
          Brilliant Star Quartz
        </span>
        <span className="text-[9px] tracking-[0.15em] uppercase font-bold flex items-center gap-1">
          <span style={{ color: scrolled ? 'rgba(17,17,17,0.5)' : 'rgba(255,255,255,0.4)', transition: 'color 0.3s' }}>Tied Branch &amp; Area</span>
          <span style={{ color: scrolled ? 'rgba(17,17,17,0.25)' : 'rgba(255,255,255,0.25)', transition: 'color 0.3s' }}>·</span>
          <span style={{ color: '#D92D20', fontWeight: 800, letterSpacing: '0.12em' }}>PRU&nbsp;LIFE&nbsp;UK</span>
        </span>
      </div>
    </a>
  )
}

/* ─── Nav list item with icon ───────────────────────────────────────── */
function ListItem({
  title,
  description,
  icon: Icon,
  className,
  href,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
  return (
    <NavigationMenuLink
      className={cn(
        'w-full flex flex-row gap-x-3 rounded-lg p-2.5',
        'hover:bg-white/08 hover:text-white',
        'focus:bg-white/08 focus:text-white',
        'transition-colors duration-150 cursor-pointer',
        className,
      )}
      style={
        {
          '--tw-bg-opacity': 1,
        } as React.CSSProperties
      }
      {...props}
      asChild
    >
      <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
        <div
          className="flex aspect-square size-10 shrink-0 items-center justify-center rounded-md"
          style={{
            background: 'rgba(220,38,38,0.12)',
            border: '1px solid rgba(220,38,38,0.18)',
          }}
        >
          <Icon className="size-4 text-red-400" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold text-white">{title}</span>
          {description && (
            <span className="text-[11px] text-white/45 leading-snug mt-0.5">{description}</span>
          )}
        </div>
      </a>
    </NavigationMenuLink>
  )
}

/* ─── Mobile menu portal ────────────────────────────────────────────── */
type MobileMenuProps = React.ComponentProps<'div'> & { open: boolean }

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === 'undefined') return null
  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        'fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-t md:hidden',
      )}
      style={{
        background: 'rgba(5,6,10,0.97)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div
        data-slot={open ? 'open' : 'closed'}
        className={cn(
          'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
          'size-full p-5',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

/* ─── Main Header Export ────────────────────────────────────────────── */
export function BsqHeader() {
  const [open, setOpen]   = React.useState(false)
  const scrolled          = useScroll(10)
  const { openContact }   = useAgentContact()

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
        scrolled ? 'border-b' : 'border-b border-transparent',
      )}
      style={
        scrolled
          ? {
              background:    'rgba(255,255,255,0.90)',
              backdropFilter: 'saturate(180%) blur(12px)',
              WebkitBackdropFilter: 'saturate(180%) blur(12px)',
              borderColor:   'rgba(0,0,0,0.06)',
              boxShadow:     '0 1px 0 rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.08)',
              willChange:    'background, box-shadow',
            }
          : {
              background:    'rgba(5,6,10,0)',
              backdropFilter: 'saturate(180%) blur(0px)',
              WebkitBackdropFilter: 'saturate(180%) blur(0px)',
              willChange:    'background, box-shadow',
            }
      }
    >
      <style>{`
        [data-scrolled="true"] .nav-menu button,
        [data-scrolled="true"] .nav-link {
          color: rgba(17,17,17,0.75) !important;
        }
        [data-scrolled="true"] .nav-menu button:hover,
        [data-scrolled="true"] .nav-link:hover {
          color: #111111 !important;
        }
      `}</style>
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6 md:px-10">

        {/* ── Logo ── */}
        <BsqLogo scrolled={scrolled} />

        {/* ── Desktop nav ── */}
        <NavigationMenu className="hidden md:flex nav-menu">
          <NavigationMenuList>

            {/* Assessment dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className="text-sm transition-colors duration-300"
                style={{ color: scrolled ? 'rgba(17,17,17,0.75)' : 'rgba(255,255,255,0.75)' }}
              >
                Assessment
              </NavigationMenuTrigger>
              <NavigationMenuContent style={{ background: '#0d1117' }}>
                <div className="p-3 w-[540px]">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 px-2 mb-2">
                    Financial Gap Analysis
                  </p>
                  <ul className="grid grid-cols-2 gap-1">
                    {assessmentLinks.map((item) => (
                      <li key={item.title}>
                        <ListItem {...item} />
                      </li>
                    ))}
                  </ul>
                  <div
                    className="mt-3 mx-2 rounded-lg px-4 py-3 flex items-center justify-between"
                    style={{
                      background: 'linear-gradient(135deg, rgba(220,38,38,0.12) 0%, rgba(185,28,28,0.08) 100%)',
                      border: '1px solid rgba(220,38,38,0.2)',
                    }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">Ready to find your gaps?</p>
                      <p className="text-[11px] text-white/40">Free · 3 minutes · No obligation</p>
                    </div>
                    <a
                      href="/assessment"
                      className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                    >
                      Start now <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* About dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className="text-sm transition-colors duration-300"
                style={{ color: scrolled ? 'rgba(17,17,17,0.75)' : 'rgba(255,255,255,0.75)' }}
              >
                About
              </NavigationMenuTrigger>
              <NavigationMenuContent style={{ background: '#0d1117' }}>
                <div className="grid grid-cols-2 gap-2 p-3 w-[420px]">
                  <ul className="space-y-1">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 px-2 mb-2">
                      Our Approach
                    </p>
                    {aboutLinks.map((item) => (
                      <li key={item.title}>
                        <ListItem {...item} />
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-1 border-l border-white/05 pl-3">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 px-2 mb-2">
                      Connect
                    </p>
                    {aboutLinks2.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/08 transition-colors duration-150"
                        >
                          <item.icon className="size-4 text-white/35 shrink-0" />
                          {item.title}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Recruitment link */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/recruitment"
                className="nav-link px-4 py-2 text-sm rounded-md transition-colors duration-150 inline-flex items-center"
                style={{ color: scrolled ? 'rgba(17,17,17,0.65)' : 'rgba(255,255,255,0.65)' }}
              >
                Recruitment
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Simple link */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                onClick={(e) => { e.preventDefault(); openContact('nav_contact') }}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link px-4 py-2 text-sm rounded-md transition-colors duration-150 inline-flex items-center"
                style={{ color: scrolled ? 'rgba(17,17,17,0.65)' : 'rgba(255,255,255,0.65)' }}
              >
                Contact
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex items-center gap-2">
          <AnimatedGradientButton
            preset="pru"
            duration={5}
            className="text-sm px-5 py-2 rounded-md"
            style={{ color: '#ffffff' }}
            onClick={() => openContact('nav_consult')}
          >
            Talk to Advisor
          </AnimatedGradientButton>
          <AnimatedGradientButton
            preset="pru"
            duration={5}
            className="text-sm font-bold px-5 py-2 rounded-md"
            style={{ color: '#ffffff' }}
            onClick={() => window.location.href = '/assessment'}
          >
            Start Assessment
            <ArrowRight size={14} />
          </AnimatedGradientButton>
        </div>

        {/* ── Mobile hamburger ── */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setOpen(!open)}
          className="md:hidden text-white hover:bg-white/10"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      {/* ── Mobile menu ── */}
      <MobileMenu open={open} className="flex flex-col justify-between gap-4">
        <div className="space-y-5 overflow-y-auto">
          {/* Assessment section */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-2 px-1">
              Assessment
            </p>
            <div className="space-y-1">
              {assessmentLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/75 hover:text-white hover:bg-white/08 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.18)' }}
                  >
                    <link.icon size={14} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none mb-0.5">{link.title}</p>
                    {link.description && (
                      <p className="text-[11px] text-white/35">{link.description}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Recruitment section */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-2 px-1">
              Join Us
            </p>
            <a
              href="/recruitment"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-2 py-2 rounded-xl text-white/65 hover:text-white hover:bg-white/08 transition-colors"
            >
              <Users size={14} className="text-white/35 shrink-0" />
              <span className="text-sm">Recruitment</span>
            </a>
          </div>

          {/* About section */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-2 px-1">
              About
            </p>
            <div className="space-y-1">
              {[...aboutLinks, ...aboutLinks2].map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-2 py-2 rounded-xl text-white/65 hover:text-white hover:bg-white/08 transition-colors"
                >
                  <link.icon size={14} className="text-white/35 shrink-0" />
                  <span className="text-sm">{link.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile CTAs */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/08">
          <AnimatedGradientButton
            preset="pru"
            duration={5}
            className="w-full py-3 text-sm rounded-md"
            onClick={() => { setOpen(false); openContact('mobile_consult') }}
          >
            <MessageCircle size={14} />
            Talk to an Advisor
          </AnimatedGradientButton>
          <AnimatedGradientButton
            preset="pru"
            duration={5}
            className="w-full py-3 text-sm font-bold rounded-md"
            onClick={() => { setOpen(false); window.location.href = '/assessment' }}
          >
            Start Free Assessment
            <ArrowRight size={14} />
          </AnimatedGradientButton>
        </div>
      </MobileMenu>
    </header>
  )
}
