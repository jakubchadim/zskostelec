import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PayloadRequest, SanitizedCollectionConfig } from 'payload'

const revalidatePath = vi.fn()
vi.mock('next/cache', () => ({ revalidatePath }))

const { listingPaths, pathsFor, rememberPathsBeforeDelete, revalidateAfterChange, revalidateAfterDelete } = await import('./revalidate')

const CATEGORIES = [
  { id: 1, slug: 'aktuality', parent: null },
  { id: 2, slug: 'skola', parent: null },
  { id: 3, slug: 'uspechy-zaku', parent: 2 }
]

const TAGS = [{ id: 9, slug: '1-stupen' }]

/** `found`: what a lookup in other collections returns (by default nothing, posts: `postsWithGallery`). */
function fakeReq(postsWithGallery: { slug: string }[] = [], context: Record<string, unknown> = {}, found: Record<string, object[]> = {}) {
  const find = vi.fn(async ({ collection }: { collection: string }) => ({
    docs: found[collection] ?? (collection === 'categories' ? CATEGORIES : collection === 'tags' ? TAGS : collection === 'posts' ? postsWithGallery : [])
  }))
  const findByID = vi.fn(async ({ id }: { id: number }) => ({ id, slug: 'smazana' }))
  return { req: { payload: { find, findByID }, context } as unknown as PayloadRequest, find }
}

const collection = (slug: string, drafts = false) => ({ slug, versions: drafts ? { drafts: true } : false }) as unknown as SanitizedCollectionConfig

// The hooks' own arguments beyond the ones revalidate.ts reads.
type HookArgs = Parameters<typeof revalidateAfterChange>[0]
const changeArgs = (args: Partial<HookArgs>) => args as HookArgs

beforeEach(() => revalidatePath.mockClear())

describe('listingPaths', () => {
  it('covers the first listing page and the next strana-N pages', () => {
    expect(listingPaths('/fotogalerie/')).toEqual([
      '/fotogalerie/',
      '/fotogalerie/strana-2/',
      '/fotogalerie/strana-3/',
      '/fotogalerie/strana-4/',
      '/fotogalerie/strana-5/'
    ])
  })
})

describe('pathsFor', () => {
  it('post: home, its old and new URL, its category listings and the parent listing', async () => {
    const { req } = fakeReq()
    const paths = await pathsFor(
      'posts',
      [
        { id: 7, slug: 'novy-nazev', categories: [{ id: 3 }] },
        { id: 7, slug: 'stary-nazev', categories: [1] }
      ],
      req
    )
    expect(paths).toEqual(
      expect.arrayContaining([
        '/',
        '/novy-nazev/',
        '/stary-nazev/',
        '/clanky/skola/uspechy-zaku/',
        '/clanky/skola/uspechy-zaku/strana-2/',
        '/clanky/skola/',
        '/clanky/aktuality/'
      ])
    )
    expect(paths).not.toContain('/clanky/')
  })

  it('tagged post and gallery: also the listings filtered by their tags', async () => {
    const { req } = fakeReq()
    const post = await pathsFor('posts', [{ id: 7, slug: 'vylet', categories: [1], tags: [{ id: 9 }] }], req)
    expect(post).toEqual(expect.arrayContaining(['/clanky/aktuality/stitek-1-stupen/', '/clanky/aktuality/stitek-1-stupen/strana-2/']))

    const gallery = await pathsFor('galleries', [{ id: 4, slug: 'praha', tags: [9], publishedAt: '2025-10-03T00:00:00.000Z' }], req)
    expect(gallery).toEqual(expect.arrayContaining(['/fotogalerie/stitek-1-stupen/', '/fotogalerie/rok-2025-2026/stitek-1-stupen/']))
  })

  it('gallery: its page, the galleries index, home and the articles that embed it', async () => {
    const { req, find } = fakeReq([{ slug: 'vylet-do-prahy' }])
    const paths = await pathsFor('galleries', [{ id: 4, slug: 'praha', publishedAt: '2025-10-03T00:00:00.000Z' }], req)
    expect(paths).toEqual(
      expect.arrayContaining(['/', '/fotogalerie/', '/fotogalerie/strana-2/', '/fotogalerie/rok-2025-2026/', '/fotogalerie/praha/', '/vylet-do-prahy/'])
    )
    expect(find).toHaveBeenCalledWith(expect.objectContaining({ collection: 'posts', where: { galleries: { in: [4] } } }))
  })

  it('staff, documents, Guťák: only their own pages', async () => {
    const { req } = fakeReq()
    expect(await pathsFor('staff-buildings', [{ id: 1 }], req)).toEqual(['/zamestnanci/', '/pracoviste/'])
    expect(await pathsFor('document-categories', [{ id: 1 }], req)).toEqual(['/dokumenty/', '/skolni-vzdelavaci-program/'])
    expect(await pathsFor('gutak', [{ id: 1 }], req)).toEqual(['/gutak/'])
  })

  it('tag: every listing with its chips and its filtered variants, not the articles', async () => {
    const { req } = fakeReq()
    const paths = await pathsFor('tags', [{ id: 9, slug: '1-stupen' }, { id: 9, slug: 'prvni-stupen' }], req)
    expect(paths).toEqual(
      expect.arrayContaining([
        '/clanky/aktuality/',
        '/clanky/aktuality/strana-2/',
        '/clanky/skola/uspechy-zaku/stitek-1-stupen/',
        '/clanky/skola/uspechy-zaku/stitek-prvni-stupen/',
        '/fotogalerie/stitek-prvni-stupen/',
        '/fotogalerie/rok-2025-2026/stitek-1-stupen/strana-3/'
      ])
    )
    expect(paths).not.toContain('/')
  })

  it('category: home, its listings under the old and new slug, all sub-category chips, its articles', async () => {
    const { req } = fakeReq([], {}, { posts: [{ slug: 'zavody' }] })
    const paths = await pathsFor('categories', [{ id: 3, slug: 'uspechy', parent: 2 }, { id: 3, slug: 'uspechy-zaku', parent: 2 }], req)
    expect(paths).toEqual(
      expect.arrayContaining(['/', '/clanky/skola/uspechy/', '/clanky/skola/uspechy-zaku/stitek-1-stupen/', '/clanky/skola/', '/clanky/aktuality/', '/zavody/'])
    )
  })

  it('media: the galleries, articles and pages that use the file', async () => {
    const { req } = fakeReq([], {}, { galleries: [{ id: 4, slug: 'praha', publishedAt: '2025-10-03T00:00:00.000Z' }], gutak: [{ id: 2 }] })
    const paths = await pathsFor('media', [{ id: 50 }], req)
    expect(paths).toEqual(expect.arrayContaining(['/fotogalerie/praha/', '/fotogalerie/rok-2025-2026/', '/gutak/']))
    expect(paths).not.toContain('/zamestnanci/')
  })

  it('media used nowhere: nothing', async () => {
    const { req } = fakeReq()
    expect(await pathsFor('media', [{ id: 50 }], req)).toEqual([])
  })
})

describe('hooks', () => {
  it('skip draft autosaves that never were published', async () => {
    const { req } = fakeReq()
    await revalidateAfterChange(
      changeArgs({ collection: collection('posts', true), doc: { _status: 'draft' }, previousDoc: { _status: 'draft' }, req })
    )
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('revalidate when a post is unpublished', async () => {
    const { req } = fakeReq()
    await revalidateAfterChange(
      changeArgs({ collection: collection('posts', true), doc: { slug: 'a', _status: 'draft' }, previousDoc: { slug: 'a', _status: 'published' }, req })
    )
    expect(revalidatePath).toHaveBeenCalledWith('/a/')
    expect(revalidatePath).not.toHaveBeenCalledWith('/', 'layout')
  })

  it('never flush the whole site', async () => {
    const { req } = fakeReq()
    await revalidateAfterChange(changeArgs({ collection: collection('categories'), doc: { id: 1, slug: 'aktuality' }, previousDoc: { id: 1, slug: 'aktuality' }, req }))
    expect(revalidatePath).toHaveBeenCalledWith('/clanky/aktuality/')
    expect(revalidatePath).not.toHaveBeenCalledWith('/', 'layout')
  })

  it('skip a new tag or an uploaded file - nothing shows them yet', async () => {
    const { req } = fakeReq()
    await revalidateAfterChange(changeArgs({ collection: collection('tags'), doc: { id: 9, slug: 'novy' }, operation: 'create', req }))
    await revalidateAfterChange(changeArgs({ collection: collection('media'), doc: { id: 50 }, operation: 'create', req }))
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('delete: refresh the pages found before the references were gone', async () => {
    const { req } = fakeReq([{ slug: 'vylet-do-prahy' }])
    const deleteArgs = { collection: collection('galleries'), id: 4, req }
    await rememberPathsBeforeDelete(deleteArgs as Parameters<typeof rememberPathsBeforeDelete>[0])
    // After the delete nothing references the gallery any more.
    ;(req.payload.find as ReturnType<typeof vi.fn>).mockResolvedValue({ docs: [] })
    await revalidateAfterDelete({ ...deleteArgs, doc: { id: 4, slug: 'smazana' } } as Parameters<typeof revalidateAfterDelete>[0])
    expect(revalidatePath).toHaveBeenCalledWith('/fotogalerie/smazana/')
    expect(revalidatePath).toHaveBeenCalledWith('/vylet-do-prahy/')
  })

  it('respect skipRevalidate (bulk imports)', async () => {
    const { req } = fakeReq([], { skipRevalidate: true })
    await revalidateAfterDelete({ collection: collection('gutak'), doc: { id: 1 }, req } as Parameters<typeof revalidateAfterDelete>[0])
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
