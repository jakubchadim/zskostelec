import { Container } from '@/components/ui/container'
import { Content } from '../../html-content'
import type { BlockFC } from '../../types'

type BlockCoreParagraphAttrs = {
  align?: string
}

/** Ported from `web/src/components/block/core/paragraph/paragraph.tsx`. */
export const BlockCoreParagraph: BlockFC<BlockCoreParagraphAttrs> = ({ block, nested }) => {
  const alignClass =
    block.attrs.align === 'left'
      ? 'text-left'
      : block.attrs.align === 'center'
        ? 'text-center'
        : block.attrs.align === 'right'
          ? 'text-right'
          : undefined

  const paragraph = (
    <div className={alignClass}>
      <Content content={block.content} />
    </div>
  )

  return nested ? paragraph : <Container>{paragraph}</Container>
}
