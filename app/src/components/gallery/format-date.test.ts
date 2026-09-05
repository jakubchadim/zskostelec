import { describe, expect, it } from 'vitest'
import { formatGalleryDate } from './format-date'

describe('formatGalleryDate', () => {
  it('formats a WP ISO date string to the Czech DD.MM. YYYY shape', () => {
    expect(formatGalleryDate('2024-01-05T10:30:00')).toBe('05.01. 2024')
  })

  it('passes through a string that does not look like a WP date', () => {
    expect(formatGalleryDate('not-a-date')).toBe('not-a-date')
  })
})
