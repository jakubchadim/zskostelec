import { describe, expect, it } from 'vitest'
import { toJson, type TransformedBlock } from '@/lib/wp'
import { blockCoreImageNormalize } from './image.normalize'

function rawBlock(content: string | null, attrs: unknown = {}): TransformedBlock {
  return {
    blockId: 'block-1' as TransformedBlock['blockId'],
    parentId: null,
    type: 'core/image',
    attrs: toJson(attrs),
    content: content as TransformedBlock['content']
  }
}

describe('blockCoreImageNormalize', () => {
  it('returns null when there is no content', () => {
    expect(blockCoreImageNormalize(rawBlock(null))).toBeNull()
  })

  it('returns null when the fragment has no <img>', () => {
    expect(blockCoreImageNormalize(rawBlock('<figure></figure>'))).toBeNull()
  })

  it('extracts src/alt, nulls content, and defaults rounded to false', () => {
    const result = blockCoreImageNormalize(
      rawBlock('<figure class="wp-block-image"><img src="https://example.com/a.jpg" alt="A photo" /></figure>')
    )

    expect(result?.content).toBeNull()
    const attrs = JSON.parse(result?.attrs ?? '{}')
    expect(attrs.src).toBe('https://example.com/a.jpg')
    expect(attrs.alt).toBe('A photo')
    expect(attrs.rounded).toBe(false)
  })

  it('falls back to the figcaption for alt when the <img> has none', () => {
    const result = blockCoreImageNormalize(
      rawBlock('<figure><img src="https://example.com/a.jpg" /><figcaption>Caption</figcaption></figure>')
    )

    const attrs = JSON.parse(result?.attrs ?? '{}')
    expect(attrs.alt).toBe('Caption')
    expect(attrs.fig).toBe('Caption')
  })

  it('reads rounded from the raw JSON attrs string, not the HTML', () => {
    const result = blockCoreImageNormalize(
      rawBlock('<figure><img src="https://example.com/a.jpg" /></figure>', { className: 'is-style-rounded' })
    )

    expect(JSON.parse(result?.attrs ?? '{}').rounded).toBe(true)
  })
})
