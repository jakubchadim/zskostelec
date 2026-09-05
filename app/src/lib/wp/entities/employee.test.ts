import { describe, expect, it } from 'vitest'
import { normalizeEmployee } from './employee'

// Finding 1 of the T1 review: `acf.photo` is ACF's flat "array" image
// format, not the /wp/v2/media shape - this fixture reproduces that raw
// shape faithfully.
const rawPhoto = {
  ID: 7,
  url: 'https://admin.example.test/wp-content/uploads/employee-7.jpg',
  alt: 'Jana Nováková',
  sizes: {
    medium_large: 'https://admin.example.test/wp-content/uploads/employee-7-768x512.jpg',
    'medium_large-width': 768,
    'medium_large-height': 512
  }
}

describe('normalizeEmployee', () => {
  it('reshapes the raw ACF photo into WpMediaLike', () => {
    const result = normalizeEmployee({
      id: 7,
      title: { rendered: 'Jana Nováková' },
      positions: [1, 2],
      building: [3],
      acf: { email: 'jana@example.test', phone: '123456789', priority: 10, photo: rawPhoto }
    })

    expect(result.photo?.source_url).toBe('https://admin.example.test/wp-content/uploads/employee-7.jpg')
    expect(result.photo?.media_details?.sizes?.medium_large.source_url).toBe(
      'https://admin.example.test/wp-content/uploads/employee-7-768x512.jpg'
    )
  })

  it('resolves photo to null when acf.photo is absent', () => {
    const result = normalizeEmployee({ id: 1, title: { rendered: 'X' }, positions: [], building: [] })
    expect(result.photo).toBeNull()
  })

  it('defaults priority/email/phone when acf is absent', () => {
    const result = normalizeEmployee({ id: 1, title: { rendered: 'X' }, positions: [], building: [] })
    expect(result.priority).toBe(50)
    expect(result.email).toBe('')
    expect(result.phone).toBe('')
  })
})
