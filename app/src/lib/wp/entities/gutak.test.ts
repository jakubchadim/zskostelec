import { describe, expect, it } from 'vitest'
import { normalizeGutak } from './gutak'

// Finding 1 of the T1 review: `acf.preview` is ACF's flat "array" image
// format, not the /wp/v2/media shape - this fixture reproduces that raw
// shape faithfully.
const rawPreview = {
  ID: 9,
  url: 'https://admin.example.test/wp-content/uploads/gutak-9.jpg',
  alt: 'Guťák',
  sizes: {
    medium_large: 'https://admin.example.test/wp-content/uploads/gutak-9-768x512.jpg',
    'medium_large-width': 768,
    'medium_large-height': 512
  }
}

describe('normalizeGutak', () => {
  it('reshapes the raw ACF preview into WpMediaLike', () => {
    const result = normalizeGutak({
      id: 9,
      title: { rendered: 'Guťák - leden' },
      acf: { file: { url: 'https://admin.example.test/wp-content/uploads/gutak-9.pdf' }, preview: rawPreview }
    })

    expect(result.fileUrl).toBe('https://admin.example.test/wp-content/uploads/gutak-9.pdf')
    expect(result.preview?.source_url).toBe('https://admin.example.test/wp-content/uploads/gutak-9.jpg')
    expect(result.preview?.media_details?.sizes?.medium_large.width).toBe(768)
  })

  it('unwraps a nested {source_url} file.url shape too (T1 plan risk #2)', () => {
    const result = normalizeGutak({
      id: 9,
      title: { rendered: 'X' },
      acf: { file: { url: { source_url: 'https://admin.example.test/x.pdf' } } }
    })

    expect(result.fileUrl).toBe('https://admin.example.test/x.pdf')
  })

  it('resolves preview to null when acf.preview is absent', () => {
    const result = normalizeGutak({ id: 1, title: { rendered: 'X' } })
    expect(result.preview).toBeNull()
    expect(result.fileUrl).toBe('')
  })
})
