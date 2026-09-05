import type { DateString, Nullable, RawHTML } from '@/lib/wp'
import { cn } from '@/lib/utils'

/**
 * Formats a WP REST date string (`YYYY-MM-DD...`) as the legacy site's
 * `"DD.MM. YYYY"` display format (Gatsby's GraphQL layer used to do this
 * with `date(formatString: "DD.MM. YYYY")`). Parses the string directly
 * with a regex rather than going through a `Date` object, so the result
 * doesn't depend on the runtime's local timezone.
 */
export function formatArticleDate(date: DateString): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date)

  if (!match) {
    return date
  }

  const [, year, month, day] = match
  return `${day}.${month}. ${year}`
}

/** True for an absolute URL, matching the legacy `getExternalLinkTarget`. */
export function isExternalHref(href: string): boolean {
  return href.startsWith('http')
}

const buttonClass = 'inline-block rounded-small border border-black-1 px-3 py-2 text-sm font-medium hover:bg-gray-2'

type ArticlePost = {
  title: RawHTML
  excerpt: RawHTML
  date: DateString
  link: Nullable<string>
}

type ArticleProps = {
  post: ArticlePost
}

/**
 * Article preview card: title, excerpt, date and a "Zobrazit" link to the
 * post (or its effective ACF link/file). Ports
 * web/src/components/article/article.tsx (UiBox + UiArticle) to Tailwind.
 */
export function Article({ post }: ArticleProps) {
  return (
    <div className="flex h-full flex-col rounded-medium bg-white-1 px-4 pt-3 pb-4 shadow-lift xs:px-6 xs:pt-5 xs:pb-6">
      <h3 className="m-0 flex h-[3.3em] items-end overflow-hidden font-bold">
        <span className="line-clamp-3 max-h-[3.3em]" dangerouslySetInnerHTML={{ __html: post.title }} />
      </h3>
      <div className="mb-4 h-[2.8em] overflow-hidden [&_p]:m-0" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
      <div className="mt-auto flex items-end justify-between gap-2">
        {post.link ? (
          <a
            href={post.link}
            target={isExternalHref(post.link) ? '_blank' : undefined}
            rel={isExternalHref(post.link) ? 'noopener noreferrer' : undefined}
            className={buttonClass}
          >
            Zobrazit
          </a>
        ) : (
          <span className={cn(buttonClass, 'invisible')} aria-hidden>
            Zobrazit
          </span>
        )}
        <div className="opacity-70">{formatArticleDate(post.date)}</div>
      </div>
    </div>
  )
}
