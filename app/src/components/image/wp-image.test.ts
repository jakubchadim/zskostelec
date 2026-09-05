import { describe, expect, it } from 'vitest'
import { buildSrcSet } from './wp-image'

describe('buildSrcSet', () => {
  it('sorts sizes ascending by width and appends the full image last', () => {
    const media = {
      source_url: 'https://example.com/photo.jpg',
      media_details: {
        width: 2000,
        height: 1500,
        sizes: {
          thumbnail: { source_url: 'https://example.com/photo-150x113.jpg', width: 150, height: 113 },
          medium_large: { source_url: 'https://example.com/photo-768x576.jpg', width: 768, height: 576 }
        }
      }
    }

    expect(buildSrcSet(media)).toEqual([
      { source_url: 'https://example.com/photo-150x113.jpg', width: 150, height: 113 },
      { source_url: 'https://example.com/photo-768x576.jpg', width: 768, height: 576 },
      { source_url: 'https://example.com/photo.jpg', width: 2000, height: 1500 }
    ])
  })

  it('de-duplicates a size whose source_url matches the full image', () => {
    const media = {
      source_url: 'https://example.com/photo.jpg',
      media_details: {
        width: 300,
        sizes: {
          full: { source_url: 'https://example.com/photo.jpg', width: 300 }
        }
      }
    }

    const result = buildSrcSet(media)

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ source_url: 'https://example.com/photo.jpg', width: 300 })
  })

  it('omits the full image when its width is unknown', () => {
    const media = { source_url: 'https://example.com/photo.jpg' }

    expect(buildSrcSet(media)).toEqual([])
  })

  it('ignores size entries missing a source_url or width', () => {
    const media = {
      source_url: 'https://example.com/photo.jpg',
      media_details: {
        width: 800,
        sizes: {
          broken: { source_url: '', width: 0 },
          thumbnail: { source_url: 'https://example.com/photo-150x113.jpg', width: 150 }
        }
      }
    }

    const result = buildSrcSet(media)

    expect(result.map((v) => v.source_url)).toEqual([
      'https://example.com/photo-150x113.jpg',
      'https://example.com/photo.jpg'
    ])
  })
})
