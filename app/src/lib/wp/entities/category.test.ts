import { beforeEach, describe, expect, it } from 'vitest'
import { normalizeCategory } from './category'

describe('normalizeCategory', () => {
  beforeEach(() => {
    process.env.WP_URL = 'https://admin.example.test'
  })

  it('resolves a category with no parent (WP parent id 0) to `parent: null`', () => {
    const raw = { id: 1, slug: 'aktuality', name: 'Aktuality', link: '/aktuality/', parent: 0 }
    const result = normalizeCategory(raw, new Map([[1, raw]]))
    expect(result.parent).toBeNull()
  })

  it('resolves a category with a parent present in the byId map', () => {
    const parentRaw = { id: 1, slug: 'aktuality', name: 'Aktuality', link: '/aktuality/', parent: 0 }
    const childRaw = { id: 2, slug: 'skolni-jidelna', name: 'Školní jídelna', link: '/aktuality/skolni-jidelna/', parent: 1 }
    const byId = new Map([
      [1, parentRaw],
      [2, childRaw]
    ])

    const result = normalizeCategory(childRaw, byId)
    expect(result.parent).toEqual({ id: '1', name: 'Aktuality', link: '/aktuality/' })
  })

  it('resolves to `parent: null` if the parent id is missing from the map', () => {
    const raw = { id: 2, slug: 'x', name: 'X', link: '/x/', parent: 99 }
    const result = normalizeCategory(raw, new Map([[2, raw]]))
    expect(result.parent).toBeNull()
  })

  // WP REST returns an absolute admin-origin `link` (confirmed against live
  // data) - left as-is, a `next/link` built from it (e.g. the homepage's
  // "Všechny aktuality" box footer link) navigates straight to the
  // API-only WP backend instead of routing within the app.
  it('relative-izes an absolute admin-origin link, for both the category and its parent', () => {
    const parentRaw = {
      id: 1,
      slug: 'aktuality',
      name: 'Aktuality',
      link: 'https://admin.example.test/clanky/aktuality/',
      parent: 0
    }
    const childRaw = {
      id: 2,
      slug: 'upozorneni',
      name: 'Upozornění',
      link: 'https://admin.example.test/clanky/upozorneni/',
      parent: 1
    }
    const byId = new Map([
      [1, parentRaw],
      [2, childRaw]
    ])

    const result = normalizeCategory(childRaw, byId)

    expect(result.link).toBe('/clanky/upozorneni/')
    expect(result.parent?.link).toBe('/clanky/aktuality/')
  })
})
