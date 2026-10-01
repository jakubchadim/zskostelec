import Link from 'next/link'
import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react'
import type { DateString, Nullable, RawHTML } from '@/lib/wp'
import { cn } from '@/lib/utils'
import { accentAt, type Accent } from '@/components/ui/accent'

/**
 * Formats a WP REST date string (`YYYY-MM-DD...`) as `"DD.MM. YYYY"`.
 * Parses the string directly with a regex rather than going through a
 * `Date` object, so the result doesn't depend on the runtime's timezone.
 */
export function formatArticleDate(date: DateString): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date)

  if (!match) {
    return date
  }

  const [, year, month, day] = match
  return `${day}.${month}. ${year}`
}

const MONTHS = ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro']

/** `{ day: '26', month: 'srp', year: '2026' }` for the calendar-sheet date badge. */
export function splitArticleDate(date: DateString): { day: string; month: string; year: string } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date)

  if (!match) {
    return null
  }

  const [, year, month, day] = match
  return { day: String(Number(day)), month: MONTHS[Number(month) - 1] ?? month, year }
}

/** True for an absolute URL, matching the legacy `getExternalLinkTarget`. */
export function isExternalHref(href: string): boolean {
  return href.startsWith('http')
}

/** A little tear-off calendar sheet showing the date. */
export function DateBadge({ date, accent, className }: { date: DateString; accent: Accent; className?: string }) {
  const parts = splitArticleDate(date)

  if (!parts) {
    return null
  }

  return (
    <time
      dateTime={date.slice(0, 10)}
      className={cn(
        'block w-14 shrink-0 overflow-hidden rounded-xl border-[2.5px] border-ink bg-paper text-center leading-none shadow-pop-sm',
        className
      )}
    >
      <span className="sr-only">{formatArticleDate(date)}</span>
      <span aria-hidden className="block">
        <span className={cn('block border-b-2 border-ink py-1 text-[0.7rem] font-extrabold tracking-wider text-ink uppercase', accent.bg)}>
          {parts.month}
        </span>
        <span className="block pt-1.5 font-display text-2xl font-extrabold">{parts.day}</span>
        <span className="block pb-1 text-[0.65rem] font-bold text-gray-7">{parts.year}</span>
      </span>
    </time>
  )
}

type ArticlePost = {
  title: RawHTML
  excerpt: RawHTML
  date: DateString
  link: Nullable<string>
}

type ArticleProps = {
  post: ArticlePost
  /** Cycles the card's colour. */
  index?: number
  /** Optional category label shown on the card. */
  label?: string
  className?: string
}

/**
 * Article preview card: date sheet, title, excerpt, and a "Číst dál" cue.
 * The whole card is one link (stretched ::after), so the tap target is big
 * on phones. Link-only/file-only posts (see `resolvePostLink`) open in a
 * new tab with an "external" cue instead.
 */
export function Article({ post, index = 0, label, className }: ArticleProps) {
  const accent = accentAt(index)
  const external = post.link != null && isExternalHref(post.link)

  const title = <span dangerouslySetInnerHTML={{ __html: post.title }} />
  const stretched = 'after:absolute after:inset-0 after:rounded-[inherit] after:content-[""] focus-visible:outline-none'

  return (
    <article
      className={cn(
        'group sticker hover-lift relative flex h-full flex-col p-5 focus-within:ring-4 focus-within:ring-sky',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <DateBadge date={post.date} accent={accent} />
        <div className="min-w-0 pt-0.5">
          {label && (
            <span className={cn('mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-extrabold', accent.tint, accent.text)}>
              {label}
            </span>
          )}
          <h3 className="line-clamp-3 text-[1.2rem] leading-snug">
            {post.link ? (
              external ? (
                <a href={post.link} target="_blank" rel="noopener noreferrer" className={stretched}>
                  {title}
                </a>
              ) : (
                <Link href={post.link} className={stretched}>
                  {title}
                </Link>
              )
            ) : (
              title
            )}
          </h3>
        </div>
      </div>
      <div
        className="mt-3 line-clamp-3 text-[0.95rem] text-gray-7 [&_p]:m-0"
        dangerouslySetInnerHTML={{ __html: post.excerpt }}
      />
      {post.link && (
        <div className={cn('mt-auto flex items-center gap-1.5 pt-4 font-display font-bold', accent.text)}>
          {external ? 'Otevřít' : 'Číst dál'}
          {external ? (
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          ) : (
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          )}
        </div>
      )}
    </article>
  )
}

/** Compact row variant (sidebars, notice lists). */
export function ArticleRow({ post, index = 0 }: { post: ArticlePost; index?: number }) {
  const accent = accentAt(index)
  const external = post.link != null && isExternalHref(post.link)
  const inner = (
    <>
      <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink', accent.tint)}>
        <CalendarDays className="size-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold text-gray-6">{formatArticleDate(post.date)}</span>
        <span className="line-clamp-2 font-bold leading-snug group-hover:underline" dangerouslySetInnerHTML={{ __html: post.title }} />
      </span>
    </>
  )
  const cls = 'group flex items-start gap-3 rounded-2xl p-2 transition-colors hover:bg-cream'

  if (!post.link) {
    return <div className={cls}>{inner}</div>
  }

  return external ? (
    <a href={post.link} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={post.link} className={cls}>
      {inner}
    </Link>
  )
}
