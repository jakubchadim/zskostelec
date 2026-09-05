const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/

/**
 * WP REST date fields are ISO-ish strings (`YYYY-MM-DDTHH:mm:ss`, site-local
 * time, no timezone offset). Formats to the Czech `DD.MM. YYYY` shape the
 * legacy Gatsby GraphQL layer produced via `date(formatString: "DD.MM. YYYY")`.
 * Done via plain string splitting rather than `new Date(...)` so there's no
 * risk of the runtime's timezone reinterpreting the (already timezone-less)
 * WP date string across a midnight boundary.
 */
export function formatGalleryDate(date: string): string {
  const match = date.match(DATE_PATTERN)

  if (!match) {
    return date
  }

  const [, year, month, day] = match
  return `${day}.${month}. ${year}`
}
