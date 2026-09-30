import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { accentFor } from './accent'
import { Container } from './container'
import { Circle, Sparkle, Squiggle, Star, WaveEdge } from './doodles'

type PageHeroProps = {
  /** Plain text or pre-rendered title node. */
  title: ReactNode
  /** Raw HTML title from WP (entities decoded by the browser). Wins over `title`. */
  titleHtml?: string
  /** Small label above the title (category, "Fotogalerie", date...). */
  eyebrow?: ReactNode
  /** Optional back link rendered as a pill above the title. */
  back?: { href: string; label: string }
  /** One-liner under the title. */
  lead?: ReactNode
  /** Extra content under the lead (chips, meta...). */
  children?: ReactNode
  /** Seeds the colour so each section keeps its own colour. */
  colorKey?: string
}

/**
 * Colourful title banner used on every subpage: tinted background, a few
 * floating doodles, and a wavy bottom edge melting into the cream page.
 * Replaces the legacy plain `<h1 className="top">` + wave-divider combo.
 */
export function PageHero({ title, titleHtml, eyebrow, back, lead, children, colorKey }: PageHeroProps) {
  const accent = accentFor(colorKey ?? (typeof title === 'string' ? title : titleHtml ?? ''))

  return (
    <section className={cn('relative overflow-hidden', accent.tint)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Star className={cn('absolute top-8 right-[8%] hidden w-12 rotate-12 animate-float sm:block', accent.fg)} />
        <Sparkle className="absolute right-[22%] bottom-14 hidden w-7 animate-float-slow text-white-1 md:block" />
        <Circle className="absolute top-16 left-[-22px] hidden w-12 text-white-1/80 animate-float-slow sm:block" />
        <Squiggle className={cn('absolute right-[-10px] bottom-20 hidden w-36 -rotate-6 opacity-70 md:block', accent.fg)} />
      </div>
      <Container className="relative pt-8 pb-18 sm:pt-12 sm:pb-22">
        {back && (
          <Link
            href={back.href}
            className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm font-bold shadow-pop-sm transition-transform hover:-translate-x-1"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {back.label}
          </Link>
        )}
        {eyebrow && (
          <div className={cn('mb-2 font-display text-base font-bold tracking-wide uppercase', accent.text)}>{eyebrow}</div>
        )}
        {titleHtml ? (
          <h1 className="max-w-4xl" dangerouslySetInnerHTML={{ __html: titleHtml }} />
        ) : (
          <h1 className="max-w-4xl">{title}</h1>
        )}
        {lead && <p className="mt-4 max-w-2xl text-lg text-gray-8">{lead}</p>}
        {children && <div className="mt-6">{children}</div>}
      </Container>
      <WaveEdge className="absolute inset-x-0 -bottom-px h-8 w-full text-cream sm:h-12" />
    </section>
  )
}
