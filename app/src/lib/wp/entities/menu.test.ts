import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getMenuBySlug, normalizeMenuTree } from './menu'

// Ported from web/src/components/nav/normalizer.test.ts, adapted to this
// module's flatten-then-rebuild approach, which must handle either raw
// shape wp-api-menus might return (see T1 plan risk #3).
describe('normalizeMenuTree', () => {
  it('rebuilds a tree from an already-flat list (items carrying `parent`)', () => {
    const flat = [
      { ID: 31, parent: 0, title: 'A', url: '/a/' },
      { ID: 30, parent: 0, title: 'B', url: '/b/' },
      { ID: 33, parent: 30, title: 'B.1', url: '/b/1/' },
      { ID: 40, parent: 33, title: 'B.1.1', url: '/b/1/1/' }
    ]

    const tree = normalizeMenuTree(flat)
    expect(tree).toHaveLength(2)

    const b = tree.find((item) => item.title === 'B')
    expect(b?.items).toHaveLength(1)
    expect(b?.items[0].items).toHaveLength(1)
    expect(b?.items[0].items[0].title).toBe('B.1.1')
  })

  it('flattens a nested response (items carrying `children`) before rebuilding, ending with the same 4 total items', () => {
    const nested = [
      { ID: 31, parent: 0, title: 'A', url: '/a/' },
      {
        ID: 30,
        parent: 0,
        title: 'B',
        url: '/b/',
        children: [{ ID: 33, parent: 30, title: 'B.1', url: '/b/1/', children: [{ ID: 40, parent: 33, title: 'B.1.1', url: '/b/1/1/' }] }]
      }
    ]

    const tree = normalizeMenuTree(nested)
    expect(tree).toHaveLength(2)

    const b = tree.find((item) => item.title === 'B')
    expect(b?.items[0].items[0].title).toBe('B.1.1')
  })

  it('defaults missing target/slug to empty strings', () => {
    const [item] = normalizeMenuTree([{ ID: 1, parent: 0, title: 'A', url: '/a/' }])
    expect(item.target).toBe('')
    expect(item.slug).toBe('')
  })
})

describe('getMenuBySlug', () => {
  beforeEach(() => {
    process.env.WP_URL = 'https://admin.example.test'
    vi.restoreAllMocks()
  })

  function jsonResponse(body: unknown) {
    return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
  }

  // wp-api-menus returns absolute admin-origin URLs for internal menu items
  // (confirmed against live data) - left as-is, `NavLink`'s `isExternalLink`
  // (`url.startsWith('http')`) misclassifies every one of them as external
  // and links straight to the API-only WP backend instead of routing within
  // the app.
  it('relative-izes admin-origin menu item URLs, leaving genuinely external URLs untouched', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(async (input) => {
      const url = String(input)

      if (url.includes('/menus/9')) {
        return jsonResponse({
          items: [
            { ID: 1, parent: 0, title: 'Úvod', url: 'https://admin.example.test/' },
            { ID: 2, parent: 0, title: 'Aktuality', url: 'https://admin.example.test/clanky/aktuality/' },
            { ID: 3, parent: 0, title: 'Edupage', url: 'https://partner.example/', target: '_blank' }
          ]
        })
      }

      return jsonResponse([{ ID: 9, slug: 'top-menu' }])
    })

    const menu = await getMenuBySlug('top-menu')

    expect(menu?.items.map((item) => item.url)).toEqual(['/', '/clanky/aktuality/', 'https://partner.example/'])
  })
})
