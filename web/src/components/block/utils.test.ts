import { generateBlock } from '../../utils/test'
import { BlockColor, BlockColorPalette } from './color/color'
import { BlockType } from './constants'
import { Block } from './types'
import { getBlockSections } from './utils'

describe('Block', () => {
  describe('utils', () => {
    it('getBlockSections', () => {
      const blocks: Block[] = [
        generateBlock(BlockType.CORE_PARAGRAPH, {}),
        generateBlock(BlockType.CORE_PARAGRAPH, {})
      ]

      expect(getBlockSections(blocks)).toHaveLength(1)

      const twoSections: Block[] = [
        ...blocks,
        generateBlock<BlockColorPalette>(BlockType.CORE_PARAGRAPH, {
          backgroundColor: BlockColor.WHITE
        }),
        generateBlock<BlockColorPalette>(BlockType.CORE_PARAGRAPH, {
          backgroundColor: BlockColor.WHITE
        })
      ]

      expect(getBlockSections(twoSections)).toHaveLength(2)

      const threeSections: Block[] = [
        ...twoSections,
        generateBlock<BlockColorPalette>(BlockType.CORE_PARAGRAPH, {
          backgroundColor: BlockColor.BLACK
        })
      ]

      expect(getBlockSections(threeSections)).toHaveLength(3)
    })
  })
})
