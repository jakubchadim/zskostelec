import { describe, expect, it } from 'vitest'
import type { DateString } from '@/lib/wp'
import { formatArticleDate } from './format-date'

describe('formatArticleDate', () => {
  it('formats as DD.MM. YYYY, matching the legacy Gatsby date format string', () => {
    expect(formatArticleDate('2024-03-05T10:00:00' as DateString)).toBe('05.03. 2024')
  })

  it('returns an empty string for an unparseable date rather than "Invalid Date"', () => {
    expect(formatArticleDate('not-a-date' as DateString)).toBe('')
  })
})
