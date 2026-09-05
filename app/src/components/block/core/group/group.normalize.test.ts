import { describe, expect, it } from 'vitest'
import { toJson, type TransformedBlock } from '@/lib/wp'
import { blockCoreGroupNormalize } from './group.normalize'

const rawBlock: TransformedBlock = {
  blockId: 'foo' as TransformedBlock['blockId'],
  parentId: null,
  type: 'core/group',
  content: '<div>Some html content</div>' as TransformedBlock['content'],
  attrs: toJson({ backgroundColor: 'white', textColor: 'black' })
}

// Ported from web/src/components/block/core/group/group.normalize.test.ts.
describe('blockCoreGroupNormalize', () => {
  it('nulls out content, leaving the rest of the block unchanged', () => {
    expect(blockCoreGroupNormalize(rawBlock)).toStrictEqual({ ...rawBlock, content: null })
  })
})
