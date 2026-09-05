/**
 * Sorts by a plain WP REST date string, newest first. WP date strings are
 * zero-padded ISO (`YYYY-MM-DDTHH:mm:ss`), so plain string comparison already
 * sorts chronologically - no `Date` parsing/timezone risk needed.
 *
 * Ported behavior: the legacy `allGalleryQuery` had no default order until
 * "Fix galleries ordering" (77aa212) added an explicit
 * `sort: { fields: date, order: DESC }` - this keeps that same guarantee
 * independent of whatever order the REST data layer happens to return.
 */
export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.date === b.date) {
      return 0
    }

    return a.date > b.date ? -1 : 1
  })
}
