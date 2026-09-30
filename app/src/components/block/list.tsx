import { BlockContainer as Container } from './block-container'
import type { Block } from '@/lib/wp'
import type { BlockType } from './constants'
import { Content } from './html-content'
import { componentByType } from './register'

type BlockListProps = {
  blocks?: Block[]
  nested?: boolean
}

/**
 * Ported from `web/src/components/block/list.tsx`: walks a parsed block
 * tree, rendering each block via its registered component
 * (`componentByType`) or, for an unregistered type (heading, embed, etc.),
 * falling back to raw HTML content - wrapped in `<Container>` unless
 * already nested inside another block's own container.
 */
export function BlockList({ blocks, nested }: BlockListProps) {
  if (!blocks || !blocks.length) {
    return null
  }

  return (
    <>
      {blocks.map((block) => {
        const Component = block.type ? componentByType[block.type as BlockType] : undefined

        if (Component) {
          return <Component key={block.id} block={block} nested={nested} />
        }

        if (nested) {
          return <Content key={block.id} content={block.content} />
        }

        return (
          <Container key={block.id}>
            <Content content={block.content} />
          </Container>
        )
      })}
    </>
  )
}
