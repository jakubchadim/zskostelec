import { describe, expect, it } from 'vitest'
import { allLabel } from './section-heading'

describe('allLabel', () => {
  it('picks the plural by the first word', () => {
    expect(allLabel('Aktuality')).toBe('Všechny aktuality')
    expect(allLabel('Oznámení školy')).toBe('Všechna oznámení školy')
    expect(allLabel('Úspěchy žáků')).toBe('Všechny úspěchy žáků')
  })
})
