import { describe, expect, it } from 'vitest'
import { getNavData } from './data'
import { EDUPAGE_URL } from './menu'
import { STATIC_PAGE_SLUGS } from '@/components/static/meta'
import type { NavItem } from './types'

function flatten(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => [item, ...flatten(item.items)])
}

describe('getNavData', () => {
  it('serves the menus from code, without touching WP', async () => {
    const menus = await getNavData()

    expect(menus.main.length).toBeGreaterThan(0)
    expect(menus.fastFirst.some((item) => item.url === EDUPAGE_URL)).toBe(true)
  })

  it('links every hand-made static page (except the redirected Školská rada) from the main menu', async () => {
    const urls = flatten((await getNavData()).main).map((item) => item.url)

    for (const slug of STATIC_PAGE_SLUGS.filter((s) => s !== 'skolska-rada' && s !== 'prohlaseni-o-pristupnosti')) {
      expect(urls).toContain(`/${slug}/`)
    }
  })

  it('only uses trailing-slash internal urls, matching `trailingSlash: true`', async () => {
    const menus = await getNavData()
    const internal = flatten([...menus.main, ...menus.fastFirst, ...menus.fastSecond])
      .map((item) => item.url)
      .filter((url) => url.startsWith('/'))

    for (const url of internal) {
      expect(url.endsWith('/')).toBe(true)
    }
  })
})
