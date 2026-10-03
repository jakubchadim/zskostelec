import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { accentAt, type Accent } from '@/components/ui/accent'

export type Activity = { icon: LucideIcon; title: string; text?: ReactNode }

/** Short activities as icon tiles instead of a bullet list. */
export function ActivityGrid({ items, accent, className }: { items: Activity[]; accent?: Accent; className?: string }) {
  return (
    <ul className={cn('m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {items.map((item, idx) => {
        const a = accent ?? accentAt(idx)
        const Icon = item.icon
        return (
          <li key={item.title} className="sticker flex gap-3 p-4">
            <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink', a.tint)}>
              <Icon className={cn('size-5', a.text)} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="m-0 font-display leading-tight font-bold">{item.title}</p>
              {item.text && <p className="m-0 mt-1 text-sm text-gray-7">{item.text}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export type GlossaryTerm = { term: string; full: string; text: ReactNode }

/** "Slovníček" of the acronyms parents run into (SVP, IVP, PPP...). */
export function Glossary({ terms, className }: { terms: GlossaryTerm[]; className?: string }) {
  return (
    <dl className={cn('m-0 grid gap-3 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {terms.map((t, idx) => {
        const a = accentAt(idx + 2)
        return (
          <div key={t.term} className="flex gap-3 rounded-[var(--radius-large)] border-2 border-ink/15 bg-paper p-4">
            <dt
              className={cn(
                'h-fit shrink-0 rounded-lg border-2 border-ink px-2 py-0.5 font-display text-sm font-extrabold',
                a.tint
              )}
            >
              {t.term}
            </dt>
            <dd className="m-0 min-w-0">
              <span className="block font-bold leading-tight">{t.full}</span>
              <span className="mt-1 block text-sm text-gray-7">{t.text}</span>
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
