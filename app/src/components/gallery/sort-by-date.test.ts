import { describe, expect, it } from 'vitest'
import { sortByDateDesc } from './sort-by-date'

describe('sortByDateDesc', () => {
  it('sorts newest first', () => {
    const items = [
      { date: '2023-01-01T00:00:00', id: 'old' },
      { date: '2024-06-01T00:00:00', id: 'new' },
      { date: '2024-01-01T00:00:00', id: 'mid' }
    ]

    expect(sortByDateDesc(items).map((item) => item.id)).toEqual(['new', 'mid', 'old'])
  })

  it('is stable on ties', () => {
    const items = [
      { date: '2024-01-01T00:00:00', id: 'a' },
      { date: '2024-01-01T00:00:00', id: 'b' }
    ]

    expect(sortByDateDesc(items).map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('does not mutate the input array', () => {
    const items = [{ date: '2024-01-01T00:00:00' }, { date: '2023-01-01T00:00:00' }]
    const copy = [...items]

    sortByDateDesc(items)

    expect(items).toEqual(copy)
  })
})
