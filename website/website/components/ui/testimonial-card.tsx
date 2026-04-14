import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

/* ══════════════════════════════════════════════════════════════════════════
   TESTIMONIAL CARD — BSQ Financial · PRU Life UK Brand
   ══════════════════════════════════════════════════════════════════════════ */

interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({
  author,
  text,
  href,
  className,
}: TestimonialCardProps) {
  const Content = (
    <div
      className={cn(
        'group relative flex w-[320px] shrink-0 flex-col gap-4 overflow-hidden rounded-2xl p-6',
        'bg-white border border-gray-100',
        'transition-all duration-300',
        'hover:-translate-y-1',
        className,
      )}
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          '0 12px 36px rgba(0,0,0,0.12)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(237,27,46,0.2)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          '0 2px 16px rgba(0,0,0,0.06)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgb(243,244,246)'
      }}
    >
      {/* PRU red accent top bar — reveals on hover */}
      <div
        className="absolute top-0 left-6 right-6 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(to right, #ed1b2e, #f87171)' }}
      />

      {/* Quote mark */}
      <span
        className="absolute top-4 right-5 text-5xl font-black leading-none select-none"
        style={{ color: 'rgba(237,27,46,0.08)' }}
        aria-hidden
      >
        "
      </span>

      {/* Body text */}
      <p className="text-sm text-gray-600 leading-relaxed relative z-10">
        &ldquo;{text}&rdquo;
      </p>

      {/* Author row */}
      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-50">
        <Avatar className="size-10 ring-2 ring-white" style={{ boxShadow: '0 0 0 2px rgba(237,27,46,0.15)' }}>
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback
            className="text-xs font-bold"
            style={{ background: '#fef2f2', color: '#ed1b2e' }}
          >
            {author.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-bold text-gray-900">{author.name}</span>
          <span className="text-[11px] text-gray-400 mt-0.5">{author.handle}</span>
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {Content}
      </a>
    )
  }

  return Content
}
