import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WP_CACHE_TAGS, WpApiError, wpFetch, wpFetchAllPages, wpFetchCollection, wpFetchOrNull } from './client'

function jsonResponse(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'content-type': 'application/json', ...init?.headers }
  })
}

describe('client', () => {
  beforeEach(() => {
    process.env.WP_URL = 'https://example.test'
    vi.restoreAllMocks()
  })

  afterEach(() => {
    delete process.env.WP_URL
  })

  it('builds the request URL under /wp-json/ with _fields and params, and applies the default revalidate window', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(jsonResponse({ ok: true }))

    await wpFetch('wp/v2/posts', { fields: ['id', 'slug'], params: { status: 'publish', page: 2 } })

    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe('https://example.test/wp-json/wp/v2/posts?_fields=id%2Cslug&status=publish&page=2')
    expect(init?.next).toMatchObject({ revalidate: 300 })
  })

  it('passes tags through to next.tags', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(jsonResponse([]))

    await wpFetch('wp/v2/categories', { tags: [WP_CACHE_TAGS.categories] })

    expect(fetchMock.mock.calls[0][1]?.next).toMatchObject({ tags: [WP_CACHE_TAGS.categories] })
  })

  it('lets a per-call revalidate override the default', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(jsonResponse([]))

    await wpFetch('wp/v2/posts/1', { revalidate: false })

    expect(fetchMock.mock.calls[0][1]?.next).toMatchObject({ revalidate: false })
  })

  it('throws WpApiError on a non-ok response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(jsonResponse({ message: 'nope' }, { status: 500 }))

    await expect(wpFetch('wp/v2/posts')).rejects.toBeInstanceOf(WpApiError)
  })

  it('wpFetchOrNull swallows a 404 into null', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(jsonResponse({ message: 'not found' }, { status: 404 }))

    await expect(wpFetchOrNull('wp/v2/posts/999')).resolves.toBeNull()
  })

  it('wpFetchOrNull rethrows non-404 errors', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(jsonResponse({}, { status: 500 }))

    await expect(wpFetchOrNull('wp/v2/posts/999')).rejects.toBeInstanceOf(WpApiError)
  })

  it('wpFetchCollection reads the X-WP-Total / X-WP-TotalPages headers', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      jsonResponse([{ id: 1 }, { id: 2 }], { headers: { 'X-WP-Total': '32', 'X-WP-TotalPages': '3' } })
    )

    await expect(wpFetchCollection('wp/v2/posts')).resolves.toEqual({
      items: [{ id: 1 }, { id: 2 }],
      totalCount: 32,
      totalPages: 3
    })
  })

  it('wpFetchAllPages loops through every page and concatenates items', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockImplementation(async (input) => {
      const url = new URL(String(input))
      const page = Number(url.searchParams.get('page'))
      const totalPages = 3
      return jsonResponse([{ id: page }], { headers: { 'X-WP-Total': '3', 'X-WP-TotalPages': String(totalPages) } })
    })

    await expect(wpFetchAllPages('wp/v2/posts')).resolves.toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('wpFetchAllPages makes a single request when there is only one page', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(jsonResponse([{ id: 1 }], { headers: { 'X-WP-Total': '1', 'X-WP-TotalPages': '1' } }))

    await expect(wpFetchAllPages('wp/v2/categories')).resolves.toEqual([{ id: 1 }])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
