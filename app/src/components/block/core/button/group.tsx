import { BlockContainer as Container } from '../../block-container'
import { cn } from '@/lib/utils'
import { BlockList } from '../../list'
import type { BlockFC } from '../../types'

export enum UiButtonGroupAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right'
}

export type BlockCoreButtonGroupAttrs = {
  align?: UiButtonGroupAlign
}

/**
 * Ported from `web/src/components/block/core/button/group.tsx`. Legacy's
 * `& > UiButton { margin: spacing(1) }` (a styled-components child
 * selector) becomes Tailwind's `[&>*]:m-1` arbitrary-child-combinator
 * utility - both spacing(-1)/(1) are clean 5px-unit multiples (-5px/5px).
 */
export const BlockCoreButtonGroup: BlockFC<BlockCoreButtonGroupAttrs> = ({ block, nested }) => {
  const alignClass =
    block.attrs.align === UiButtonGroupAlign.LEFT
      ? 'text-left'
      : block.attrs.align === UiButtonGroupAlign.CENTER
        ? 'text-center'
        : block.attrs.align === UiButtonGroupAlign.RIGHT
          ? 'text-right'
          : undefined

  const group = (
    <div className={cn('-m-1 [&>*]:m-1', alignClass)}>
      <BlockList blocks={block.blocks} nested />
    </div>
  )

  return nested ? group : <Container>{group}</Container>
}
