import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getPostRouteEntries, resolvePostLink } from './post'

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
