import type { Block } from '@/lib/wp'
import type { BlockColorPalette } from './color/color'

export type BlockSection = BlockColorPalette & {
  blocks: Block[]
}

/**
 * Groups a flat top-level block list into consecutive runs sharing the same
 * `backgroundColor`, so `BlockContent` can render one `<Section>` (with its
 * own background/wave-divider) per run instead of per block. Ported
 * verbatim from `web/src/components/block/utils.ts`.
 */
export function getBlockSections(blocks: Block<BlockColorPalette>[]): BlockSection[] {
  const sections: BlockSection[] = []
  let lastSection: BlockSection | undefined

  for (const block of blocks) {
    if (!lastSection || lastSection.backgroundColor !== block.attrs.backgroundColor) {
      lastSection = {
        backgroundColor: block.attrs.backgroundColor,
        textColor: block.attrs.textColor,
        blocks: []
      }

      sections.push(lastSection)
    }

    lastSection.blocks.push(block)
  }

  return sections
}
