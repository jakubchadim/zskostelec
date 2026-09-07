import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getPostBySlug, getPostPreviews, getPostRouteEntries, resolvePostLink } from './post'

// Ported from web/src/components/article/normalizer.ts's link/file override
// logic: a post with real content always keeps its own permalink; a
// content-less "article" post's effective link comes from the ACF `link`
// field, then the attached file, then null.
describe('resolvePostLink', () => {
  it('keeps the real permalink when the post has content', () => {
    const link = resolvePostLink({
      hasAcf: true,
      hasContent: true,
      permalink: '/aktuality/nazev/',
      acfLink: '/jina-stranka/',
      fileUrl: 'https://example.test/file.pdf'
    })
    expect(link).toBe('/aktuality/nazev/')
  })

  it('uses the ACF link field when there is no content', () => {
    const link = resolvePostLink({
      hasAcf: true,
      hasContent: false,
      permalink: '/aktuality/nazev/',
      acfLink: 'https://partner.example/event',
      fileUrl: null
    })
    expect(link).toBe('https://partner.example/event')
  })

  it('falls back to the attached file URL when there is no content and no ACF link', () => {
    const link = resolvePostLink({
      hasAcf: true,
      hasContent: false,
      permalink: '/aktuality/nazev/',
      acfLink: null,
      fileUrl: 'https://example.test/file.pdf'
    })
    expect(link).toBe('https://example.test/file.pdf')
  })

  it('prefers the ACF link over the file URL when both are set', () => {
    const link = resolvePostLink({
      hasAcf: true,
      hasContent: false,
      permalink: '/aktuality/nazev/',
      acfLink: '/jina-stranka/',
      fileUrl: 'https://example.test/file.pdf'
    })
    expect(link).toBe('/jina-stranka/')
  })

  it('resolves to null when there is no content, no ACF link, and no file', () => {
    const link = resolvePostLink({
      hasAcf: true,
      hasContent: false,
      permalink: '/aktuality/nazev/',
      acfLink: null,
      fileUrl: null
    })
    expect(link).toBeNull()
  })

  it('keeps the real permalink when there is no acf key at all, even with empty content (T1 review finding 4)', () => {
    const link = resolvePostLink({
      hasAcf: false,
      hasContent: false,
      permalink: '/aktuality/nazev/',
      acfLink: null,
      fileUrl: null
    })
    expect(link).toBe('/aktuality/nazev/')
  })
})

describe('getPostRouteEntries', () => {
  beforeEach(() => {
    process.env.WP_URL = 'https://admin.example.test'
    vi.restoreAllMocks()
  })

  function jsonResponse(body: unknown, headers: Record<string, string> = {}) {
    return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json', ...headers } })
  }

  it('never fetches `content`/`blocks` - only the trimmed route-index fields', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(jsonResponse([], { 'X-WP-Total': '0', 'X-WP-TotalPages': '1' }))

    await getPostRouteEntries()

    const [url] = fetchMock.mock.calls[0]
    const fields = new URL(String(url)).searchParams.get('_fields')
    expect(fields).not.toContain('content')
    expect(fields).not.toContain('blocks')
  })

  it('resolves a content-less post to its ACF link, using excerpt as the content-emptiness proxy', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      jsonResponse(
        [
          {
            id: 1,
            link: 'https://admin.example.test/aktuality/odkaz/',
            categories: [3],
            excerpt: { rendered: '' },
            acf: { link: 'https://partner.example/event' }
          }
        ],
        { 'X-WP-Total': '1', 'X-WP-TotalPages': '1' }
      )
    )

    const [entry] = await getPostRouteEntries()

    expect(entry.link).toBe('https://partner.example/event')
  })

  it('keeps the real permalink (relative-ized) for a post with a non-empty excerpt', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      jsonResponse(
        [
          {
            id: 2,
            link: 'https://admin.example.test/aktuality/nazev/',
            categories: [3],
            excerpt: { rendered: 'A short excerpt' },
            acf: { link: null }
          }
        ],
        { 'X-WP-Total': '1', 'X-WP-TotalPages': '1' }
      )
    )

    const [entry] = await getPostRouteEntries()

    expect(entry.link).toBe('/aktuality/nazev/')
  })
})

describe('getPostBySlug', () => {
  beforeEach(() => {
    process.env.WP_URL = 'https://admin.example.test'
    vi.restoreAllMocks()
  })

  function jsonResponse(body: unknown) {
    return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
  }

  // acf-to-rest-api serializes an empty relationship/repeater field (no
  // gallery attached to the post) as the boolean `false`, not `null`/`[]` -
  // confirmed against live data, where most posts hit this. `?? []` alone
  // doesn't catch it and previously crashed with
  // "TypeError: ((intermediate value) ?? []).map is not a function".
  it('treats an empty acf.gallery serialized as `false` as no embedded galleries', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      jsonResponse([
        {
          id: 1,
          slug: 'nazev',
          link: 'https://admin.example.test/aktuality/nazev/',
          title: { rendered: 'Název' },
          excerpt: { rendered: 'Popis' },
          content: { rendered: '<p>Obsah</p>' },
          date: '2024-03-01T00:00:00',
          categories: [3],
          acf: { link: null, file: false, gallery: false }
        }
      ])
    )

    const post = await getPostBySlug('nazev')

    expect(post?.acf.gallery).toEqual([])
    expect(post?.galleries).toBeUndefined()
  })
})

describe('getPostPreviews', () => {
  beforeEach(() => {
    process.env.WP_URL = 'https://admin.example.test'
    vi.restoreAllMocks()
  })

  function jsonResponse(body: unknown, headers: Record<string, string> = {}) {
    return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json', ...headers } })
  }

  it('never fetches `content`/`blocks`/`categories` - only the trimmed preview fields', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(jsonResponse([], { 'X-WP-Total': '0', 'X-WP-TotalPages': '1' }))

    await getPostPreviews('cat-1' as never, { limit: 15 })

    const [url] = fetchMock.mock.calls[0]
    const fields = new URL(String(url)).searchParams.get('_fields')
    expect(fields).not.toContain('content')
    expect(fields).not.toContain('blocks')
    expect(fields).not.toContain('categories')
  })

  it('returns title/excerpt/date/link plus the totalCount for pagination', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      jsonResponse(
        [
          {
            id: 1,
            link: 'https://admin.example.test/aktuality/nazev/',
            title: { rendered: 'Název' },
            excerpt: { rendered: 'Krátký popis' },
            date: '2024-03-01T00:00:00',
            acf: { link: null }
          }
        ],
        { 'X-WP-Total': '32', 'X-WP-TotalPages': '3' }
      )
    )

    const { posts, totalCount } = await getPostPreviews('cat-1' as never, { offset: 0, limit: 15 })

    expect(totalCount).toBe(32)
    expect(posts).toEqual([
      {
        id: '1',
        title: 'Název',
        excerpt: 'Krátký popis',
        date: '2024-03-01T00:00:00',
        link: '/aktuality/nazev/'
      }
    ])
  })

  it('passes offset/limit/exclude through as request params', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(jsonResponse([], { 'X-WP-Total': '0', 'X-WP-TotalPages': '1' }))

    await getPostPreviews('cat-1' as never, { limit: 3, excludePostId: 'post-5' as never })

    const [url] = fetchMock.mock.calls[0]
    const params = new URL(String(url)).searchParams
    expect(params.get('categories')).toBe('cat-1')
    expect(params.get('per_page')).toBe('3')
    expect(params.get('exclude')).toBe('post-5')
    expect(params.get('offset')).toBe('0')
  })
})
