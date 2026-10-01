import { BlockContainer as Container } from '../../block-container'
import { cn } from '@/lib/utils'
import { BlockList } from '../../list'
import type { BlockColorPalette } from '../../color/color'
import { getBackgroundColorClass, getTextColorClass } from '../../color/utils'
import type { BlockFC } from '../../types'

/** Gutenberg group; with a background colour it becomes an outlined, padded panel. */
export const BlockCoreGroup: BlockFC<BlockColorPalette> = ({ block, nested }) => {
  const { backgroundColor, textColor } = block.attrs
  const className = cn(
    'overflow-hidden',
    getBackgroundColorClass(backgroundColor),
    getTextColorClass(textColor),
    // A coloured group is a padded, rounded panel rather than a bare tinted strip.
    backgroundColor && 'my-6 rounded-[1.25rem] border-[2.5px] border-ink p-5 shadow-pop-sm sm:p-7 [&>*:last-child]:mb-0',
    textColor && '[--prose-link:currentColor] [--prose-strong:currentColor]'
  )

  return nested ? (
    <div className={className}>
      <BlockList blocks={block.blocks} nested />
    </div>
  ) : (
    <Container>
      <div className={className}>
        <BlockList blocks={block.blocks} nested />
      </div>
    </Container>
  )
}
