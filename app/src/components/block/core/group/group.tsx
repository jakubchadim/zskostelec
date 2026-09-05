import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'
import { BlockList } from '../../list'
import type { BlockColorPalette } from '../../color/color'
import { getBackgroundColorClass, getTextColorClass } from '../../color/utils'
import type { BlockFC } from '../../types'

/** Ported from `web/src/components/block/core/group/group.tsx`. */
export const BlockCoreGroup: BlockFC<BlockColorPalette> = ({ block, nested }) => (
  <div className={cn('overflow-hidden', getBackgroundColorClass(block.attrs.backgroundColor), getTextColorClass(block.attrs.textColor))}>
    {nested ? (
      <BlockList blocks={block.blocks} nested />
    ) : (
      <Container>
        <BlockList blocks={block.blocks} nested />
      </Container>
    )}
  </div>
)
