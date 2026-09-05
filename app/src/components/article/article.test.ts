import { describe, expect, it } from 'vitest'
import { formatArticleDate, isExternalHref } from './article'
import type { DateString } from '@/lib/wp'

function date(iso: string): DateString {
  return iso as DateString
}

describe('formatArticleDate', () => {
  it('formats a WP date string as DD.MM. YYYY', () => {
    expect(formatArticleDate(date('2024-03-05T10:00:00'))).toBe('05.03. 2024')
  })

  it('pads single-digit day and month', () => {
    expect(formatArticleDate(date('2024-01-02T00:00:00'))).toBe('02.01. 2024')
  })

  it('does not depend on the runtime timezone', () => {
    // A naive datetime near midnight would shift to a different calendar day
    // if this parsed via `new Date(...)` and read back local getters in a
    // non-UTC timezone. Regex-based parsing avoids that entirely.
    expect(formatArticleDate(date('2024-12-31T23:59:59'))).toBe('31.12. 2024')
  })

  it('falls back to the raw string when it does not match the expected shape', () => {
    expect(formatArticleDate(date('not-a-date'))).toBe('not-a-date')
  })
})

describe('isExternalHref', () => {
  it('treats absolute http(s) urls as external', () => {
    expect(isExternalHref('https://example.com/file.pdf')).toBe(true)
    expect(isExternalHref('http://example.com')).toBe(true)
  })

  it('treats relative paths as internal', () => {
    expect(isExternalHref('/aktuality/clanek/')).toBe(false)
  })
})
