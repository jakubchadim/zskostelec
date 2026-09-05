import type { DateString } from '@/lib/wp'

/**
 * `DD.MM. YYYY` - matches the legacy Gatsby `date(formatString: "DD.MM. YYYY")`
 * used in `web/.gatsby/gql/{singlePost,filteredPost}.query.ts` for the
 * homepage's article-preview dates.
 */
export function formatArticleDate(date: DateString): string {
  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  const day = String(parsed.getDate()).padStart(2, '0')
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const year = parsed.getFullYear()

  return `${day}.${month}. ${year}`
}
