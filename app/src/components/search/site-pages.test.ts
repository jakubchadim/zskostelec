import { describe, expect, it } from 'vitest'
import { matchesAllWords, searchSitePages, SITE_PAGES } from './site-pages'
import { STATIC_PAGE_SLUGS } from '@/components/static/meta'

describe('matchesAllWords', () => {
  it('needs every word, ignoring case and diacritics', () => {
    expect(matchesAllWords('Odhlašování obědů v PrimiApp', 'odhlasovani OBEDU')).toBe(true)
    expect(matchesAllWords('Odhlašování obědů', 'odhlasovani svacin')).toBe(false)
    expect(matchesAllWords('cokoli', '   ')).toBe(false)
  })
})

describe('searchSitePages', () => {
  it('finds pages by the words people use, not only their titles', () => {
    expect(searchSitePages('jídelníček').map((p) => p.path)).toEqual(['/skolni-stravovani/'])
    expect(searchSitePages('sikana').map((p) => p.path)).toContain('/prevence-rizikoveho-chovani/')
  })

  it('lists every hand-made page (except the redirected Školská rada)', () => {
    const paths = SITE_PAGES.map((p) => p.path)
    for (const slug of STATIC_PAGE_SLUGS.filter((s) => s !== 'skolska-rada')) {
      expect(paths).toContain(`/${slug}/`)
    }
  })
})
