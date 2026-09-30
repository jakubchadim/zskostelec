import { describe, expect, it } from 'vitest'
import { transformBlocks, registerBlockNormalizer, normalizeBlocks, parseBlocks } from './normalizer'
import type { RawBlock, TransformedBlock } from './types'

// Ported from web/src/components/block/normalizer.test.ts - transformBlocks
// behavior is unchanged from the Gatsby-era implementation.
describe('transformBlocks', () => {
  const paragraphBlock: RawBlock = {
    blockName: 'core/paragraph',
    attrs: [],
    innerBlocks: [],
    innerHTML: '\n<p>test</p>\n'
  }

  it('carries the block name through as `type`', () => {
    const [transformed] = transformBlocks([paragraphBlock], null)
    expect(transformed.type).toBe(paragraphBlock.blockName)
  })

  it('JSON-encodes attrs', () => {
    const [transformed] = transformBlocks([paragraphBlock], null)
    expect(transformed.attrs).toBe(JSON.stringify(paragraphBlock.attrs))
  })

  it('trims newlines out of content', () => {
    const [transformed] = transformBlocks([paragraphBlock], null)
    expect(transformed.content).toBe('<p>test</p>')
  })

  it('links nested blocks to their parent via a generated blockId', () => {
    const nestedBlock: RawBlock = { ...paragraphBlock, innerBlocks: [paragraphBlock] }
    const transformed = transformBlocks([nestedBlock], null)

    expect(transformed.length).toBe(2)
    const parent = transformed.find((b) => b.parentId === null)
    const child = transformed.find((b) => b.parentId === parent?.blockId)
    expect(parent?.parentId).toBe(null)
    expect(child?.parentId).toBe(parent?.blockId)
  })

  it('drops blocks with no name and no content', () => {
    const emptyBlock: RawBlock = { blockName: null, attrs: [], innerBlocks: [], innerHTML: '' }
    expect(transformBlocks([emptyBlock], null).length).toBe(0)
  })

  it('keeps a named block even with empty content', () => {
    const spacerBlock: RawBlock = { blockName: 'core/spacer', attrs: [], innerBlocks: [], innerHTML: '' }
    const transformed = transformBlocks([spacerBlock], null)
    expect(transformed.length).toBe(1)
    expect(transformed[0].content).toBe('')
  })
})

describe('registerBlockNormalizer + normalizeBlocks', () => {
  const raw: TransformedBlock = {
    blockId: 'block-1' as TransformedBlock['blockId'],
    parentId: null,
    type: 'test/fixture-block',
    attrs: JSON.stringify({ foo: 'bar' }) as TransformedBlock['attrs'],
    content: '<p>hi</p>' as TransformedBlock['content']
  }

  it('applies a registered normalizer for the block type', () => {
    registerBlockNormalizer('test/fixture-block', (block) => ({ ...block, content: null }))
    const [normalized] = normalizeBlocks([raw])
    expect(normalized.content).toBeNull()
  })

  it('drops a block whose normalizer returns null', () => {
    registerBlockNormalizer('test/dropped-block', () => null)
    const droppedRaw: TransformedBlock = { ...raw, type: 'test/dropped-block' }
    expect(normalizeBlocks([droppedRaw])).toHaveLength(0)
  })

  it('is idempotent - registering the same type twice uses the latest normalizer', () => {
    registerBlockNormalizer('test/idempotent-block', () => raw)
    registerBlockNormalizer('test/idempotent-block', (block) => ({ ...block, content: null }))
    const [normalized] = normalizeBlocks([{ ...raw, type: 'test/idempotent-block' }])
    expect(normalized.content).toBeNull()
  })

  it('runs a per-type normalizer at most once per block (fetch-time + render-time passes)', () => {
    // Mirrors core/image: drops blocks without content, clears content once normalized.
    registerBlockNormalizer('test/once-block', (block) => (block.content ? { ...block, content: null } : null))
    const search = { sourceUrl: 'https://admin.example.com', replacementUrl: '' }

    const fetchTimePass = normalizeBlocks([{ ...raw, type: 'test/once-block' }], search)
    const renderTimePass = normalizeBlocks(fetchTimePass)

    expect(renderTimePass).toHaveLength(1)
    expect(renderTimePass[0].content).toBeNull()
  })

  it('passes unregistered block types through unchanged', () => {
    const [normalized] = normalizeBlocks([{ ...raw, type: 'test/unregistered' }])
    expect(normalized).toEqual({ ...raw, type: 'test/unregistered' })
  })
})

describe('parseBlocks', () => {
  it('unflattens a TransformedBlock[] into a Block[] tree with parsed attrs', () => {
    const flat: TransformedBlock[] = [
      {
        blockId: 'a' as TransformedBlock['blockId'],
        parentId: null,
        type: 'core/group',
        attrs: JSON.stringify({ backgroundColor: 'white' }) as TransformedBlock['attrs'],
        content: null
      },
      {
        blockId: 'b' as TransformedBlock['blockId'],
        parentId: 'a' as TransformedBlock['blockId'],
        type: 'core/paragraph',
        attrs: JSON.stringify({}) as TransformedBlock['attrs'],
        content: '<p>hi</p>' as TransformedBlock['content']
      }
    ]

    const tree = parseBlocks(flat)
    expect(tree).toHaveLength(1)
    expect(tree[0].attrs).toEqual({ backgroundColor: 'white' })
    expect(tree[0].blocks).toHaveLength(1)
    expect(tree[0].blocks[0].content).toBe('<p>hi</p>')
  })
})
