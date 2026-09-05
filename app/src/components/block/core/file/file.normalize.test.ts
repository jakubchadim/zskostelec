import { describe, expect, it } from 'vitest'
import { toJson, type TransformedBlock } from '@/lib/wp'
import { blockCoreFileNormalize } from './file.normalize'

function rawBlock(content: string | null): TransformedBlock {
  return {
    blockId: 'block-1' as TransformedBlock['blockId'],
    parentId: null,
    type: 'core/file',
    attrs: toJson({}),
    content: content as TransformedBlock['content']
  }
}

describe('blockCoreFileNormalize', () => {
  it('returns null when there is no content', () => {
    expect(blockCoreFileNormalize(rawBlock(null))).toBeNull()
  })

  it('returns null when the fragment has no <a>', () => {
    expect(blockCoreFileNormalize(rawBlock('<div>no link here</div>'))).toBeNull()
  })

  it('extracts the link text as content and href as attrs.src', () => {
    const result = blockCoreFileNormalize(
      rawBlock('<div class="wp-block-file"><a href="https://example.com/report.pdf">Report.pdf</a></div>')
    )

    expect(result?.content).toBe('Report.pdf')
    expect(JSON.parse(result?.attrs ?? '{}').src).toBe('https://example.com/report.pdf')
  })
})
