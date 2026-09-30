import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Squiggle } from '@/components/ui/doodles'

/** "Všechna upozornění" vs "Všechny aktuality" - Czech plural gender for the see-all link. */
export function allLabel(categoryName: string): string {
  const name = categoryName.toLowerCase()
  return `${name.endsWith('í') ? 'Všechna' : 'Všechny'} ${name}`
}

type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  /** Tailwind text colour for the eyebrow + squiggle. */
  color: string
  action?: { href: string; label: string }
  className?: string
  id?: string
}

/** Section title with a small coloured eyebrow, a doodle squiggle and an optional "see all" pill. */
export function SectionHeading({ eyebrow, title, color, action, className, id }: SectionHeadingProps) {
  return (
    <div className={cn('mb-8 flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        <span className={cn('font-display text-base font-extrabold tracking-wider uppercase', color)}>{eyebrow}</span>
        <h2 id={id} className="mt-1">
          {title}
        </h2>
        <Squiggle className={cn('mt-2 w-24', color)} />
      </div>
      {action && (
        <Link href={action.href} className="btn bg-paper py-2 text-base">
          {action.label}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  )
}
