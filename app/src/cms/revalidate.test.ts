import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PayloadRequest, SanitizedCollectionConfig } from 'payload'

const revalidatePath = vi.fn()
vi.mock('next/cache', () => ({ revalidatePath }))

const { listingPaths, pathsFor, revalidateAfterChange, revalidateAfterDelete } = await import('./revalidate')

const CATEGORIES = [
  { id: 1, slug: 'aktuality', parent: null },
  { id: 2, slug: 'skola', parent: null },
  { id: 3, slug: 'uspechy-zaku', parent: 2 }
]

function fakeReq(postsWithGallery: { slug: string }[] = [], context: Record<string, unknown> = {}) {
  const find = vi.fn(async ({ collection }: { collection: string }) => ({
    docs: collection === 'categories' ? CATEGORIES : postsWithGallery
  }))
  return { req: { payload: { find }, context } as unknown as PayloadRequest, find }
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

  it('categories and media: the whole site', async () => {
    const { req } = fakeReq()
    expect(await pathsFor('categories', [{ id: 1 }], req)).toBe('all')
    expect(await pathsFor('media', [{ id: 1 }], req)).toBe('all')
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

  it('flush the whole site for a category change', async () => {
    const { req } = fakeReq()
    await revalidateAfterChange(changeArgs({ collection: collection('categories'), doc: { id: 1 }, previousDoc: { id: 1 }, req }))
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
  })

  it('respect skipRevalidate (bulk imports)', async () => {
    const { req } = fakeReq([], { skipRevalidate: true })
    await revalidateAfterDelete({ collection: collection('gutak'), doc: { id: 1 }, req } as Parameters<typeof revalidateAfterDelete>[0])
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
