import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getGalleries, getGalleryPreviewImages, getGalleryRouteEntries, normalizeGallery, type WpGallery } from './gallery'
import type { WpMediaLike } from '../types'

function image(id: string): WpMediaLike {
  return { id: id as WpMediaLike['id'], source_url: `https://example.test/${id}.jpg` }
}

function gallery(preview: WpMediaLike | null, images: WpMediaLike[]): WpGallery {
  return {
    id: 'g1' as WpGallery['id'],
    slug: 'g1',
    link: '/fotogalerie/g1/',
    title: 'Gallery' as WpGallery['title'],
    date: '01.01.2024' as WpGallery['date'],
    acf: { preview, gallery: images }
  }
}

describe('getGalleryPreviewImages', () => {
  it('leads with the explicit preview image, then the gallery array, deduped', () => {
    const preview = image('1')
    const result = getGalleryPreviewImages(gallery(preview, [image('1'), image('2'), image('3')]))
    expect(result.map((img) => img.id)).toEqual(['1', '2', '3'])
  })

  it('falls back to the first gallery image when there is no explicit preview', () => {
    const result = getGalleryPreviewImages(gallery(null, [image('1'), image('2')]))
    expect(result.map((img) => img.id)).toEqual(['1', '2'])
  })

  it('caps the result at `limit` (default 4)', () => {
    const images = ['1', '2', '3', '4', '5'].map(image)
    const result = getGalleryPreviewImages(gallery(null, images))
    expect(result).toHaveLength(4)
  })

  it('respects a custom limit', () => {
    const images = ['1', '2', '3'].map(image)
    expect(getGalleryPreviewImages(gallery(null, images), 2)).toHaveLength(2)
  })
})

// Finding 1 of the T1 review: the raw acf.preview/acf.gallery values are
// ACF's flat "array" format (top-level `url`, flat `sizes` map), NOT
// already the WpMediaLike/media_details shape - this fixture reproduces
// that real raw shape, not the pre-normalized one.
describe('normalizeGallery', () => {
  const rawImage = (n: number) => ({
    ID: n,
    url: `https://admin.example.test/wp-content/uploads/photo-${n}.jpg`,
    alt: `Photo ${n}`,
    width: 1600,
    height: 1067,
    sizes: {
      medium_large: `https://admin.example.test/wp-content/uploads/photo-${n}-768x512.jpg`,
      'medium_large-width': 768,
      'medium_large-height': 512
    }
  })

  beforeEach(() => {
    process.env.WP_URL = 'https://admin.example.test'
  })

  it('reshapes raw ACF image arrays into WpMediaLike for preview and gallery', () => {
    const result = normalizeGallery({
      id: 1,
      slug: 'vylet',
      link: 'https://admin.example.test/fotogalerie/vylet/',
      title: { rendered: 'Výlet' },
      date: '2024-01-01',
      acf: { preview: rawImage(1), gallery: [rawImage(1), rawImage(2)] }
    })

    expect(result.link).toBe('/fotogalerie/vylet/')
    expect(result.acf.preview?.source_url).toBe('https://admin.example.test/wp-content/uploads/photo-1.jpg')
    expect(result.acf.preview?.media_details?.sizes?.medium_large.width).toBe(768)
    // Full-size original's dimensions carry through too, so buildSrcSet can
    // offer it as a candidate above medium_large (T1 fast-follow backlog item).
    expect(result.acf.preview?.media_details?.width).toBe(1600)
    expect(result.acf.preview?.media_details?.height).toBe(1067)
    expect(result.acf.gallery).toHaveLength(2)
  })

  it('keeps image URLs absolute even though the gallery link itself gets relative-ized', () => {
    const result = normalizeGallery({
      id: 1,
      slug: 'vylet',
      link: 'https://admin.example.test/fotogalerie/vylet/',
      title: { rendered: 'Výlet' },
      date: '2024-01-01',
      acf: { preview: rawImage(1) }
    })

    expect(result.acf.preview?.source_url).toContain('https://admin.example.test')
  })

  it('falls back to the first gallery image when there is no explicit preview', () => {
    const result = normalizeGallery({
      id: 1,
      slug: 'vylet',
      link: 'https://admin.example.test/fotogalerie/vylet/',
      title: { rendered: 'Výlet' },
      date: '2024-01-01',
      acf: { gallery: [rawImage(1)] }
    })

    expect(result.acf.preview?.source_url).toBe('https://admin.example.test/wp-content/uploads/photo-1.jpg')
  })

  // acf-to-rest-api serializes an empty ACF repeater/gallery field as the
  // boolean `false`, not `null`/`[]` - confirmed against live data (~6 of
  // 900 galleries on this WP install). `?? []` alone doesn't catch it and
  // previously crashed with "TypeError: ((intermediate value) ?? []).map is
  // not a function".
  it('treats acf.gallery serialized as `false` (empty repeater) as an empty array', () => {
    const result = normalizeGallery({
      id: 1,
      slug: 'prazdna',
      link: 'https://admin.example.test/fotogalerie/prazdna/',
      title: { rendered: 'Prázdná' },
      date: '2024-01-01',
      acf: { preview: false, gallery: false }
    })

    expect(result.acf.gallery).toEqual([])
    expect(result.acf.preview).toBeNull()
  })
})

function jsonResponse(body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json', ...headers } })
}

describe('getGalleries', () => {
  beforeEach(() => {
    process.env.WP_URL = 'https://admin.example.test'
    vi.restoreAllMocks()
  })

  // The full `acf.gallery` image repeater (every image, every size, across
  // every gallery) was what pushed this listing fetch past Next's 2MB
  // data-cache entry limit - the index page/cards only ever read
  // `acf.preview`, so trimming to that is what fixes the overflow.
  it('requests only `acf.preview`, never the full `acf.gallery` image repeater', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(jsonResponse([], { 'X-WP-Total': '0', 'X-WP-TotalPages': '1' }))

    await getGalleries()

    const [url] = fetchMock.mock.calls[0]
    const fields = new URL(String(url)).searchParams.get('_fields')
    expect(fields).toContain('acf.preview')
    expect(fields).not.toContain('acf.gallery')
  })
})

describe('getGalleryRouteEntries', () => {
  beforeEach(() => {
    process.env.WP_URL = 'https://admin.example.test'
    vi.restoreAllMocks()
  })

  it('requests only `id`/`link`, never `acf`', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(jsonResponse([], { 'X-WP-Total': '0', 'X-WP-TotalPages': '1' }))

    await getGalleryRouteEntries()

    const [url] = fetchMock.mock.calls[0]
    const fields = new URL(String(url)).searchParams.get('_fields')
    expect(fields).not.toContain('acf')
  })

  it('relative-izes the link the same way normalizeGallery does', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      jsonResponse([{ id: 1, link: 'https://admin.example.test/fotogalerie/vylet/' }], {
        'X-WP-Total': '1',
        'X-WP-TotalPages': '1'
      })
    )

    const [entry] = await getGalleryRouteEntries()

    expect(entry).toEqual({ id: '1', link: '/fotogalerie/vylet/' })
  })
})
