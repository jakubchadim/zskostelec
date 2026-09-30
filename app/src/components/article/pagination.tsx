import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * A sliding window of up to 5 page numbers, centered on `current` but
 * clamped so it never runs past `[1, total]`. Ported verbatim from
 * `web/src/components/nav/pagination.tsx`'s `getPageNumbers`.
 */
export function getPageNumbers(total: number, current: number): number[] {
  const firstItem = Math.max(1, Math.min(total - 4, current - 2))
  const maxNumbers = Math.min(total, 5)
  const numbers: number[] = []

  for (let i = 0; i < maxNumbers; i++) {
    numbers.push(firstItem + i)
  }

  return numbers
}

type ArticlePaginationProps = {
  totalPages: number
  current: number
  generateLink: (page: number) => string
}

const pageButtonClass =
  'inline-grid size-11 place-items-center rounded-full border-[2.5px] border-ink font-display text-lg font-bold transition-all'

function ArrowButton({
  direction,
  href,
  disabled
}: {
  direction: 'prev' | 'next'
  href: string
  disabled: boolean
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight

  if (disabled) {
    return (
      <span className={cn(pageButtonClass, 'cursor-not-allowed bg-paper opacity-30')} aria-disabled="true">
        <Icon className="size-5" aria-hidden />
      </span>
    )
  }

  return (
    <Link
      href={href}
      aria-label={direction === 'prev' ? 'Předchozí strana' : 'Další strana'}
      className={cn(pageButtonClass, 'bg-sun shadow-pop-sm hover:-translate-y-0.5 hover:shadow-pop')}
    >
      <Icon className="size-5" aria-hidden />
    </Link>
  )
}

/**
 * Numbered pagination controls for a category listing. Ports
 * `web/src/components/nav/pagination.tsx` to Tailwind — placed under
 * `article/` rather than `nav/` (see plan notes: `nav/` belongs to another
 * task). Pure links, no client state, so this stays a server component.
 */
export function ArticlePagination({ totalPages, current, generateLink }: ArticlePaginationProps) {
  const pages = getPageNumbers(totalPages, current)

  return (
    <nav aria-label="Stránkování" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <ArrowButton direction="prev" href={generateLink(Math.max(1, current - 1))} disabled={current === 1} />
      {pages.map((page) => (
        <Link
          key={page}
          href={generateLink(page)}
          aria-current={page === current ? 'page' : undefined}
          aria-label={`Strana ${page}`}
          className={cn(
            pageButtonClass,
            page === current ? 'scale-110 bg-ink text-white-1' : 'bg-paper shadow-pop-sm hover:-translate-y-0.5 hover:shadow-pop'
          )}
        >
          {page}
        </Link>
      ))}
      <ArrowButton
        direction="next"
        href={generateLink(Math.min(totalPages, current + 1))}
        disabled={current === totalPages}
      />
    </nav>
  )
}
