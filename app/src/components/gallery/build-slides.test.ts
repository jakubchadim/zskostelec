import { describe, expect, it } from 'vitest'
import { buildViewerSlides } from './build-slides'
import type { WpMediaLike } from '@/lib/wp'

function media(overrides: Partial<WpMediaLike> = {}): WpMediaLike {
  return {
    id: '1' as WpMediaLike['id'],
    source_url: 'https://example.test/photo.jpg',
    ...overrides
  }
}

describe('buildViewerSlides', () => {
  it('uses the largest available named size as the main image, with a full srcSet and a small thumb', () => {
    const [slide] = buildViewerSlides([
      media({
        media_details: {
          sizes: {
            thumbnail: { source_url: 'https://example.test/photo-150.jpg', width: 150, height: 150 },
            medium: { source_url: 'https://example.test/photo-300.jpg', width: 300, height: 200 },
            large: { source_url: 'https://example.test/photo-1024.jpg', width: 1024, height: 683 }
          }
        }
      })
    ])

    expect(slide.src).toBe('https://example.test/photo-1024.jpg')
    expect(slide.width).toBe(1024)
    expect(slide.height).toBe(683)
    expect(slide.srcSet).toBe(
      'https://example.test/photo-150.jpg 150w, https://example.test/photo-300.jpg 300w, https://example.test/photo-1024.jpg 1024w'
    )
    expect(slide.thumb).toBe('https://example.test/photo-150.jpg')
  })

  it('falls back to source_url with no srcSet when no sizes are available', () => {
    const [slide] = buildViewerSlides([media()])

    expect(slide.src).toBe('https://example.test/photo.jpg')
    expect(slide.srcSet).toBeUndefined()
    expect(slide.thumb).toBe('https://example.test/photo.jpg')
  })
})
