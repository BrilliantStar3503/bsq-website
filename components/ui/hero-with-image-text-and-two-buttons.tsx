import { MoveRight, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

/* ─────────────────────────────────────────────────────────────────────
   BYB HERO
   ─────────────────────────────────────────────────────────────────────
   Props:
     eventImage  – path to the BYB invite/event photo (from /public/images/events/)
                   Leave as undefined to show the placeholder slot.
   ───────────────────────────────────────────────────────────────────── */
interface HeroProps {
  eventImage?: string
  eventLabel?: string
  onReserveSeat?: () => void
  onDiscoverMore?: () => void
}

function Hero({
  eventImage,
  eventLabel = "Now Recruiting · Build Your Business",
  onReserveSeat,
  onDiscoverMore,
}: HeroProps) {
  return (
    <div className="w-full py-20 lg:py-40" style={{ background: '#ffffff' }}>
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">

          {/* ── Left — text ── */}
          <div className="flex gap-6 flex-col">
            <div>
              <Badge
                variant="outline"
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ borderColor: '#ed1b2e', color: '#ed1b2e' }}
              >
                {eventLabel}
              </Badge>
            </div>

            {/* We Are Hiring block */}
            <div
              className="rounded-2xl px-5 py-4 flex flex-col gap-3"
              style={{ background: 'rgba(237,27,46,0.04)', border: '1px solid rgba(237,27,46,0.15)' }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#ed1b2e' }} />
                <p className="font-black text-lg tracking-tight" style={{ color: '#ed1b2e' }}>
                  We Are Hiring!
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: 'PRU Venture Apprentice', href: '#hiring' },
                  { label: 'iLeader',                 href: '#hiring' },
                  { label: 'Financial Advisor',        href: '#hiring', sub: 'Part-time or Full-time' },
                ].map(role => (
                  <a
                    key={role.label}
                    href={role.href}
                    className="flex items-center gap-2.5 group"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200"
                      style={{ background: '#ed1b2e' }}
                    />
                    <span
                      className="text-sm font-semibold transition-colors duration-200 group-hover:underline"
                      style={{ color: '#1a1a2e' }}
                    >
                      {role.label}
                    </span>
                    {role.sub && (
                      <span className="text-xs font-normal" style={{ color: '#9ca3af' }}>
                        ({role.sub})
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-6xl max-w-lg tracking-tighter text-left font-bold text-gray-900 leading-[1.08]">
                Build Your Business{' '}
                <span style={{ color: '#ed1b2e' }}>with PRU.</span>
              </h1>
              <p className="text-lg leading-relaxed tracking-tight text-gray-500 max-w-md text-left font-light">
                Join a licensed financial advisory team backed by AI, digital
                systems, and a culture that rewards ambition. Your next chapter
                starts with one conversation.
              </p>
            </div>

            <div className="flex flex-row flex-wrap gap-4">
              <Button
                size="lg"
                className="gap-3 rounded-full font-semibold"
                variant="outline"
                style={{ borderColor: '#ed1b2e', color: '#ed1b2e' }}
                onClick={onDiscoverMore}
                asChild={!onDiscoverMore}
              >
                {onDiscoverMore ? (
                  <><PhoneCall className="w-4 h-4" /> Book a Private Call</>
                ) : (
                  <a href="#events">
                    <PhoneCall className="w-4 h-4" /> See Upcoming Events
                  </a>
                )}
              </Button>

              <Button
                size="lg"
                className="gap-3 rounded-full font-semibold text-white"
                style={{ background: '#ed1b2e', boxShadow: '0 4px 20px #ed1b2e44' }}
                onClick={onReserveSeat}
                asChild={!onReserveSeat}
              >
                {onReserveSeat ? (
                  <>Reserve a Seat <MoveRight className="w-4 h-4" /></>
                ) : (
                  <a href="#book">
                    Reserve a Seat <MoveRight className="w-4 h-4" />
                  </a>
                )}
              </Button>
            </div>
          </div>

          {/* ── Right — event image ── */}
          <div
            className="rounded-2xl overflow-hidden aspect-[4/5] relative"
            style={{
              background: eventImage ? undefined : '#f3f4f6',
              border: eventImage ? 'none' : '1.5px dashed rgba(0,0,0,0.12)',
              backgroundImage: 'none',
            }}
          >
            {eventImage ? (
              <Image
                src={eventImage}
                alt="Build Your Business Event"
                fill
                className="object-cover object-center"
                priority
              />
            ) : (
              /* Placeholder — shows until you pass an eventImage prop */
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: '#ed1b2e15' }}
                >
                  <PhoneCall className="w-6 h-6" style={{ color: '#ed1b2e' }} />
                </div>
                <p className="text-sm font-medium text-gray-400">BYB Event Photo</p>
                <p className="text-xs text-gray-300 text-center px-8">
                  Pass an <code className="bg-gray-100 px-1 rounded text-[10px]">eventImage</code> prop<br />
                  or place your invite photo here
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export { Hero }
