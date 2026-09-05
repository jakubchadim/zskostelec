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
  'inline-flex min-w-[6em] items-center justify-center rounded-small px-3 py-2 text-sm font-medium text-white-1'

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
      <span className={cn(pageButtonClass, 'cursor-not-allowed bg-gray-7 opacity-50')} aria-disabled="true">
        <Icon className="size-5" aria-hidden />
      </span>
    )
  }

  return (
    <Link href={href} className={cn(pageButtonClass, 'bg-gray-7 hover:bg-gray-8')}>
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
    <div className="flex flex-wrap items-center justify-center gap-2">
      <ArrowButton direction="prev" href={generateLink(Math.max(1, current - 1))} disabled={current === 1} />
      {pages.map((page) => (
        <Link
          key={page}
          href={generateLink(page)}
          className={cn(
            pageButtonClass,
            page === current ? 'bg-secondary-1 hover:bg-secondary-2' : 'bg-gray-7 hover:bg-gray-8'
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
    </div>
  )
}
