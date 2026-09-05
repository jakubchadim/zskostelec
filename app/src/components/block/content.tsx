import type { TransformedBlock } from '@/lib/wp'

export type BlockContentProps = {
  blocks: TransformedBlock[]
}

/**
 * PLACEHOLDER — T3 replaces this file with the real Gutenberg block renderer
 * (per-block-type components, section/color grouping, `parseBlocks` tree walk)
 * and exports an idempotent `registerCoreBlockNormalizers()` alongside it.
 *
 * Until then: raw innerHTML fallback so templates that already render
 * `<BlockContent>` compile and show something during development.
 */
export function BlockContent({ blocks }: BlockContentProps) {
  return (
    <div>
      {blocks
        .filter((block) => block.parentId == null && block.content)
        .map((block) => (
          <div key={block.blockId} dangerouslySetInnerHTML={{ __html: block.content ?? '' }} />
        ))}
    </div>
  )
}
