import { describe, expect, it } from 'vitest'
import { hasPreview } from './has-preview'
import type { WpGallery, WpMediaLike } from '@/lib/wp'

function gallery(preview: WpGallery['acf']['preview']): WpGallery {
  return {
    id: 'g1' as WpGallery['id'],
    slug: 'g1',
    link: '/fotogalerie/g1/',
    title: 'Gallery' as WpGallery['title'],
    date: '2024-01-01T00:00:00' as WpGallery['date'],
    acf: { preview, gallery: [] }
  }
}

describe('hasPreview', () => {
  it('is true when the gallery has a resolved preview image', () => {
    const withPreview = gallery({
      id: '1' as WpMediaLike['id'],
      source_url: 'https://example.test/a.jpg'
    })

    expect(hasPreview(withPreview)).toBe(true)
  })

  it('is false when the gallery has no preview at all', () => {
    expect(hasPreview(gallery(null))).toBe(false)
  })
})
