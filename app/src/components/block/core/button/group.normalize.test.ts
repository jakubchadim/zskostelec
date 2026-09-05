import { describe, expect, it } from 'vitest'
import { toJson, type TransformedBlock } from '@/lib/wp'
import { blockCoreButtonGroupNormalize } from './group.normalize'

const rawBlock: TransformedBlock = {
  blockId: 'foo' as TransformedBlock['blockId'],
  parentId: null,
  type: 'core/buttons',
  content: '<div>Some html content</div>' as TransformedBlock['content'],
  attrs: toJson({ backgroundColor: 'white', textColor: 'black' })
}

// Ported from web/src/components/block/core/button/group.normalize.test.ts.
describe('blockCoreButtonGroupNormalize', () => {
  it('nulls out content, leaving the rest of the block unchanged', () => {
    expect(blockCoreButtonGroupNormalize(rawBlock)).toStrictEqual({ ...rawBlock, content: null })
  })
})
