import { ID, Nullable } from '../../types'
import { BlockColorPalette } from './color/color'
import { Block, BlockSection, TransformedBlock } from './types'

export function parseBlockAttrs(rawAttrs: string): any {
  const attrs = JSON.parse(rawAttrs)

  return attrs
}

export function parseBlocks(
  rawBlocks: TransformedBlock[],
  parentId: Nullable<ID> = null
): Block[] {
  return rawBlocks
    .filter((rawBlock) => rawBlock.parentId === parentId)
    .map((rawBlock) => {
      return {
        id: rawBlock.blockId,
        type: rawBlock.type,
        content: rawBlock.content,
        attrs: parseBlockAttrs(rawBlock.attrs),
        blocks: parseBlocks(rawBlocks, rawBlock.blockId)
      }
    })
}

export function getBlockSections(
  blocks: Block<BlockColorPalette>[]
): BlockSection[] {
  const sections: BlockSection[] = []
  let lastSection: BlockSection

  blocks.forEach((block) => {
    if (
      !lastSection ||
      lastSection.backgroundColor !== block.attrs.backgroundColor
    ) {
      lastSection = {
        backgroundColor: block.attrs.backgroundColor,
        textColor: block.attrs.textColor,
        blocks: []
      }

      sections.push(lastSection)
    }

    lastSection.blocks.push(block)
  })

  return sections
}
