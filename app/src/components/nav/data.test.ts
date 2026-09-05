import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getNavData } from './data'

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}

describe('getNavData', () => {
  beforeEach(() => {
    process.env.WP_URL = 'https://example.test'
  })

  afterEach(() => {
    delete process.env.WP_URL
    vi.restoreAllMocks()
  })

  it('resolves with an empty menu (not a throw) when one menu fetch fails, keeping the others', async () => {
    const menuList = [
      { ID: 1, slug: 'top-menu' },
      { ID: 2, slug: 'fast-menu-1' },
      { ID: 3, slug: 'fast-menu-2' }
    ]

    vi.spyOn(global, 'fetch').mockImplementation(async (input) => {
      const url = String(input)

      if (url.includes('/menus/1')) {
        return jsonResponse({ items: [{ ID: 10, parent: 0, title: 'Domů', url: '/' }] })
      }

      if (url.includes('/menus/2')) {
        throw new Error('network error')
      }

      if (url.includes('/menus/3')) {
        return jsonResponse({ items: [{ ID: 30, parent: 0, title: 'GDPR', url: '/gdpr/' }] })
      }

      return jsonResponse(menuList)
    })

    const menus = await getNavData()

    expect(menus.main).toHaveLength(1)
    expect(menus.fastFirst).toEqual([])
    expect(menus.fastSecond).toHaveLength(1)
  })

  it('resolves with an empty menu for a slug the WP menu list has no entry for', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(async (input) => {
      const url = String(input)

      if (url.includes('/menus/1')) {
        return jsonResponse({ items: [{ ID: 10, parent: 0, title: 'Domů', url: '/' }] })
      }

      return jsonResponse([{ ID: 1, slug: 'top-menu' }])
    })

    const menus = await getNavData()

    expect(menus.main).toHaveLength(1)
    expect(menus.fastFirst).toEqual([])
    expect(menus.fastSecond).toEqual([])
  })
})
