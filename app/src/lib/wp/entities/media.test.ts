import { describe, expect, it } from 'vitest'
import { normalizeAcfImage } from './media'

// A realistic raw ACF "image" field, return_format "array" - NOT the
// /wp/v2/media shape. Flat top-level `url`/`alt`, and a flat `sizes` map
// interleaving size-name -> URL strings with `<name>-width`/`<name>-height`
// -> numbers. This is the exact shape gallery.preview/gallery.gallery[],
// employee.photo, and gutak.preview return - see Finding 1 of the review.
const rawAcfImage = {
  ID: 42,
  id: 42,
  title: 'photo',
  filename: 'photo.jpg',
  url: 'https://admin.example.test/wp-content/uploads/2024/01/photo.jpg',
  alt: 'A photo',
  width: 1200,
  height: 800,
  sizes: {
    thumbnail: 'https://admin.example.test/wp-content/uploads/2024/01/photo-150x150.jpg',
    'thumbnail-width': 150,
    'thumbnail-height': 150,
    medium: 'https://admin.example.test/wp-content/uploads/2024/01/photo-300x200.jpg',
    'medium-width': 300,
    'medium-height': 200,
    medium_large: 'https://admin.example.test/wp-content/uploads/2024/01/photo-768x512.jpg',
    'medium_large-width': 768,
    'medium_large-height': 512
  }
}

describe('normalizeAcfImage', () => {
  it('reshapes the flat ACF array format into WpMediaLike/media_details.sizes', () => {
    const result = normalizeAcfImage(rawAcfImage)

    expect(result).toEqual({
      id: '42',
      source_url: 'https://admin.example.test/wp-content/uploads/2024/01/photo.jpg',
      filename: 'photo.jpg',
      alt_text: 'A photo',
      media_details: {
        sizes: {
          thumbnail: {
            source_url: 'https://admin.example.test/wp-content/uploads/2024/01/photo-150x150.jpg',
            width: 150,
            height: 150
          },
          medium: {
            source_url: 'https://admin.example.test/wp-content/uploads/2024/01/photo-300x200.jpg',
            width: 300,
            height: 200
          },
          medium_large: {
            source_url: 'https://admin.example.test/wp-content/uploads/2024/01/photo-768x512.jpg',
            width: 768,
            height: 512
          }
        }
      }
    })
  })

  it('passes an already-hydrated WpMediaLike (has source_url) through unchanged', () => {
    const alreadyNormalized = { id: '1', source_url: 'https://example.test/x.jpg' }
    expect(normalizeAcfImage(alreadyNormalized)).toBe(alreadyNormalized)
  })

  it('resolves to null for null/undefined', () => {
    expect(normalizeAcfImage(null)).toBeNull()
    expect(normalizeAcfImage(undefined)).toBeNull()
  })

  it('resolves to null when the value has no `url` string (not a real ACF image array)', () => {
    expect(normalizeAcfImage({ foo: 'bar' })).toBeNull()
    expect(normalizeAcfImage('a string')).toBeNull()
  })

  it('falls back to the url itself as the id when ID/id are both missing', () => {
    const result = normalizeAcfImage({ url: 'https://example.test/no-id.jpg' })
    expect(result?.id).toBe('https://example.test/no-id.jpg')
    expect(result?.media_details).toBeUndefined()
  })
})
