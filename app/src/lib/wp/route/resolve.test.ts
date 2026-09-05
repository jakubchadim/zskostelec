import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../entities/page', async () => {
  const actual = await vi.importActual<typeof import('../entities/page')>('../entities/page')
  return { ...actual, getPages: vi.fn() }
})
vi.mock('../entities/post', async () => {
  const actual = await vi.importActual<typeof import('../entities/post')>('../entities/post')
  return { ...actual, getPostRouteEntries: vi.fn(), getPostPreviews: vi.fn() }
})
vi.mock('../entities/category', () => ({ getCategories: vi.fn() }))
vi.mock('../entities/gallery', () => ({ getGalleries: vi.fn() }))

import { getPages, PageTemplateType } from '../entities/page'
import { getPostPreviews, getPostRouteEntries } from '../entities/post'
import { getCategories } from '../entities/category'
import { getGalleries } from '../entities/gallery'
import { getStaticRoutes, resolveRoute } from './resolve'

// These fixtures stand in for the fully-normalized WpPage/WpPost/WpCategory/
// WpGallery shapes (which use branded ID/RawHTML/etc. types) - `as never`
// sidesteps that branding for test fixtures without changing runtime shape.
const page = (overrides: Record<string, unknown>) =>
  ({
    id: 'page-1',
    slug: 'o-skole',
    link: '/o-skole/',
    title: '',
    content: '',
    blocks: [],
    template: PageTemplateType.DEFAULT,
    acf: {},
    ...overrides
  }) as never

describe('resolveRoute', () => {
  beforeEach(() => {
    vi.mocked(getPages).mockResolvedValue([
      page({ id: 'page-1', link: '/o-skole/', template: PageTemplateType.DEFAULT }),
      page({ id: 'page-2', link: '/fotogalerie/', template: PageTemplateType.GALLERIES })
    ])
    vi.mocked(getCategories).mockResolvedValue([
      { id: 'cat-1', slug: 'aktuality', name: 'Aktuality', link: '/aktuality/', parent: null } as never
    ])
    vi.mocked(getPostRouteEntries).mockResolvedValue([
      { id: 'post-1', link: '/aktuality/nazev/', categories: ['cat-1'] } as never,
      { id: 'post-external', link: 'https://partner.example/event', categories: ['cat-1'] } as never
    ])
    vi.mocked(getGalleries).mockResolvedValue([{ id: 'gallery-1', link: '/fotogalerie/vylet/' } as never])
  })

  it('resolves a page path', async () => {
    await expect(resolveRoute(['o-skole'])).resolves.toEqual({
      kind: 'page',
      id: 'page-1',
      templateType: PageTemplateType.DEFAULT
    })
  })

  it('resolves a post path with its first category', async () => {
    await expect(resolveRoute(['aktuality', 'nazev'])).resolves.toEqual({
      kind: 'post',
      id: 'post-1',
      categoryId: 'cat-1'
    })
  })

  it('never resolves a post whose effective link is external', async () => {
    await expect(resolveRoute(['event'])).resolves.toBeNull()
  })

  it('resolves a category path to page 1', async () => {
    await expect(resolveRoute(['aktuality'])).resolves.toEqual({
      kind: 'category',
      id: 'cat-1',
      rootCategoryId: 'cat-1',
      basePath: '/aktuality/',
      pageNumber: 1
    })
  })

  it('resolves a `strana-N` suffix against the category base path', async () => {
    await expect(resolveRoute(['aktuality', 'strana-3'])).resolves.toEqual({
      kind: 'category',
      id: 'cat-1',
      rootCategoryId: 'cat-1',
      basePath: '/aktuality/',
      pageNumber: 3
    })
  })

  it('resolves a gallery path', async () => {
    await expect(resolveRoute(['fotogalerie', 'vylet'])).resolves.toEqual({
      kind: 'gallery',
      id: 'gallery-1',
      allGalleryLink: '/fotogalerie/'
    })
  })

  it('resolves to null for an unknown path', async () => {
    await expect(resolveRoute(['neexistuje'])).resolves.toBeNull()
  })

  it('first-wins on a path collision (page indexed before post), and logs a warning', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // A content-less "link article" whose real WP permalink happens to
    // alias the existing '/o-skole/' page's path.
    vi.mocked(getPostRouteEntries).mockResolvedValue([
      { id: 'post-1', link: '/aktuality/nazev/', categories: ['cat-1'] } as never,
      { id: 'post-collides', link: '/o-skole/', categories: ['cat-1'] } as never
    ])

    await expect(resolveRoute(['o-skole'])).resolves.toEqual({
      kind: 'page',
      id: 'page-1',
      templateType: PageTemplateType.DEFAULT
    })

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('/o-skole/'))
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('keeping page'))
  })
})

describe('getStaticRoutes', () => {
  beforeEach(() => {
    vi.mocked(getPages).mockResolvedValue([])
    vi.mocked(getPostRouteEntries).mockResolvedValue([])
    vi.mocked(getGalleries).mockResolvedValue([])
    vi.mocked(getCategories).mockResolvedValue([
      { id: 'cat-1', slug: 'aktuality', name: 'Aktuality', link: '/aktuality/', parent: null } as never
    ])
  })

  it('enumerates every strana-N pagination page for a category', async () => {
    vi.mocked(getPostPreviews).mockResolvedValue({ posts: [], totalCount: 32 })

    const routes = await getStaticRoutes()
    const categoryRoutes = routes.filter((r) => r.route.kind === 'category')

    // ceil(32 / 15) = 3 pages
    expect(categoryRoutes).toHaveLength(3)
    expect(categoryRoutes.map((r) => r.path)).toEqual(['/aktuality/', '/aktuality/strana-2/', '/aktuality/strana-3/'])
  })
})
