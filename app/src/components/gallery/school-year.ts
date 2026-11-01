/**
 * School years for the galleries index: a school year runs from 1 September
 * to 31 August and is identified by the year it starts in (2025 = 2025/2026).
 */

/** The oldest galleries come from the 2011/2012 school year. */
export const FIRST_SCHOOL_YEAR = 2011

const PRAGUE_YEAR_MONTH = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague', year: 'numeric', month: 'numeric' })

/** The school year a date falls in, judged by the Czech calendar (a gallery dated 1 September belongs to the new year). */
export function schoolYearOf(date: Date | string): number {
  const parts = PRAGUE_YEAR_MONTH.formatToParts(new Date(date))
  const year = Number(parts.find((part) => part.type === 'year')?.value)
  const month = Number(parts.find((part) => part.type === 'month')?.value)
  return month >= 9 ? year : year - 1
}

/** URL segment of a school year: `rok-2025-2026`. */
export function schoolYearSlug(year: number): string {
  return `rok-${year}-${year + 1}`
}

/** The school year a URL segment names, or null for anything that isn't `rok-YYYY-(YYYY+1)`. */
export function parseSchoolYearSlug(segment: string): number | null {
  const match = segment.match(/^rok-(\d{4})-(\d{4})$/)
  if (!match || Number(match[2]) !== Number(match[1]) + 1) {
    return null
  }
  return Number(match[1])
}

export function schoolYearLabel(year: number): string {
  return `${year}/${year + 1}`
}

/** `[from, to)` of a school year as ISO instants (1 September, midnight in Prague - always summer time). */
export function schoolYearRange(year: number): { from: string; to: string } {
  return { from: new Date(`${year}-09-01T00:00:00+02:00`).toISOString(), to: new Date(`${year + 1}-09-01T00:00:00+02:00`).toISOString() }
}

/** Every school year with galleries, newest first. */
export function schoolYearsUntil(now: Date = new Date()): number[] {
  const current = schoolYearOf(now)
  return Array.from({ length: current - FIRST_SCHOOL_YEAR + 1 }, (_, idx) => current - idx)
}
