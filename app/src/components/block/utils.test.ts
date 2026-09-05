import { describe, expect, it } from 'vitest'
import type { Block, ID } from '@/lib/wp'
import { BlockColor, type BlockColorPalette } from './color/color'
import { BlockType } from './constants'
import { getBlockSections } from './utils'

// Inlined from `web/src/utils/test.ts`'s `generateBlock` - only this test file uses it.
// Defaults `Attrs` to `BlockColorPalette` (the only shape `getBlockSections` cares
// about) rather than legacy's `any`, since this data layer's `Block<Attrs>` defaults
// to `unknown` - a stricter default that isn't assignable into `BlockColorPalette`.
function generateBlock<Attrs = BlockColorPalette>(
  type: BlockType | null,
  attrs: Attrs,
  content: string | null = null,
  blocks: Block[] = []
): Block<Attrs> {
  return { id: 'foo' as ID, attrs, type, content: content as Block['content'], blocks }
}

// Ported from web/src/components/block/utils.test.ts.
describe('getBlockSections', () => {
  it('groups consecutive blocks with the same backgroundColor into one section', () => {
    const blocks: Block<BlockColorPalette>[] = [
      generateBlock(BlockType.CORE_PARAGRAPH, {}),
      generateBlock(BlockType.CORE_PARAGRAPH, {})
    ]

    expect(getBlockSections(blocks)).toHaveLength(1)

    const twoSections: Block<BlockColorPalette>[] = [
      ...blocks,
      generateBlock(BlockType.CORE_PARAGRAPH, { backgroundColor: BlockColor.WHITE }),
      generateBlock(BlockType.CORE_PARAGRAPH, { backgroundColor: BlockColor.WHITE })
    ]

    expect(getBlockSections(twoSections)).toHaveLength(2)

    const threeSections: Block<BlockColorPalette>[] = [
      ...twoSections,
      generateBlock(BlockType.CORE_PARAGRAPH, { backgroundColor: BlockColor.BLACK })
    ]

    expect(getBlockSections(threeSections)).toHaveLength(3)
  })
})
