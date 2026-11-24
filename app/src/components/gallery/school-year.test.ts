import { describe, expect, it } from 'vitest'
import { parseSchoolYearSlug, schoolYearOf, schoolYearRange, schoolYearSlug, schoolYearsUntil } from './school-year'

describe('school years', () => {
  it('starts the school year on 1 September in Prague', () => {
    // Midnight 1 September in Prague is still 31 August in UTC.
    expect(schoolYearOf('2025-08-31T22:00:00.000Z')).toBe(2025)
    expect(schoolYearOf('2025-08-31T21:59:00.000Z')).toBe(2024)
    expect(schoolYearOf('2026-06-15T10:00:00.000Z')).toBe(2025)
  })

  it('round-trips the URL segment and rejects anything else', () => {
    expect(schoolYearSlug(2025)).toBe('rok-2025-2026')
    expect(parseSchoolYearSlug('rok-2025-2026')).toBe(2025)
    expect(parseSchoolYearSlug('rok-2025-2027')).toBeNull()
    expect(parseSchoolYearSlug('vylet-do-prahy')).toBeNull()
  })

  it('covers exactly one school year', () => {
    expect(schoolYearRange(2025)).toEqual({ from: '2025-08-31T22:00:00.000Z', to: '2026-08-31T22:00:00.000Z' })
  })

  it('lists the years from now back to 2019/2020', () => {
    const years = schoolYearsUntil(new Date('2026-10-29T12:00:00Z'))
    expect(years[0]).toBe(2026)
    expect(years.at(-1)).toBe(2019)
    expect(years).toHaveLength(8)
  })
})
