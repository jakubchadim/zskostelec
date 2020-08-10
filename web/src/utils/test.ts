import { BlockType } from '../components/block/constants'
import { Block } from '../components/block/types'

export function generateBlock<Attrs extends any>(
  type: BlockType | null,
  attrs: Attrs,
  content: string | null = null,
  blocks: Block[] = []
): Block<Attrs> {
  return <Block>{
    id: 'foo',
    attrs,
    type,
    content,
    blocks
  }
}
