import { describe, expect, it } from 'vitest'
import { buildLightboxSlides } from './build-slides'
import type { WpMediaLike } from '@/lib/wp'

function media(overrides: Partial<WpMediaLike> = {}): WpMediaLike {
  return {
    id: '1' as WpMediaLike['id'],
    source_url: 'https://example.test/photo.jpg',
    ...overrides
  }
}

describe('buildLightboxSlides', () => {
  it('uses the largest available named size as the main slide image, with a full srcSet', () => {
    const [slide] = buildLightboxSlides([
      media({
        media_details: {
          sizes: {
            medium: { source_url: 'https://example.test/photo-300.jpg', width: 300, height: 200 },
            large: { source_url: 'https://example.test/photo-1024.jpg', width: 1024, height: 683 }
          }
        }
      })
    ])

    expect(slide.src).toBe('https://example.test/photo-1024.jpg')
    expect(slide.width).toBe(1024)
    expect(slide.height).toBe(683)
    expect(slide.srcSet).toEqual([
      { src: 'https://example.test/photo-300.jpg', width: 300, height: 200 },
      { src: 'https://example.test/photo-1024.jpg', width: 1024, height: 683 }
    ])
  })

  it('falls back to source_url with no srcSet when no sizes are available', () => {
    const [slide] = buildLightboxSlides([media()])

    expect(slide.src).toBe('https://example.test/photo.jpg')
    expect(slide.srcSet).toBeUndefined()
  })
})
