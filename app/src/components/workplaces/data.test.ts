import { describe, expect, it } from 'vitest'
import { extractPhotos } from './data'

const HTML = `
<figure><img src="http://example.com/mapa.jpg" alt=""/></figure>
<p>Palackého náměstí 45 Kostelec nad Orlicí, škola 2. stupeň </p>
<p></p>
<figure><img src="http://example.com/namesti.jpg"/></figure>
<p>Komenského 80 Kostelec nad Orlicí, škola 1. stupeň </p>
<p>Drtinova 662, Kostelec nad Orlicí, škola 1. stupeň a školní družina</p>
<figure><img src="https://example.com/skala.jpg"/></figure>
`

describe('extractPhotos', () => {
  it('takes the map from before the first paragraph and the photo following each building', () => {
    const { map, photos } = extractPhotos(HTML)
    expect(map).toBe('https://example.com/mapa.jpg')
    expect(photos.palackeho).toBe('https://example.com/namesti.jpg')
    expect(photos.drtinova).toBe('https://example.com/skala.jpg')
  })

  it('returns null for a building without its own photo or paragraph', () => {
    const { photos } = extractPhotos(HTML)
    // Komenského's paragraph is directly followed by Drtinova's - no photo in between.
    expect(photos.komenskeho).toBeNull()
    expect(photos.erbenova).toBeNull()
  })
})
