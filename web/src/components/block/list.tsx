import React from 'react'
import Content from '../content/content'
import { BlockType } from './constants'
import BlockCoreButton from './core/button'
import { BlockFC } from './types'
import { Block } from './utils'

const componentByType: Partial<{ [type in BlockType]: BlockFC }> = {
  [BlockType.CORE_BUTTON]: BlockCoreButton
}

type BlockListProps = {
  blocks?: Block[]
}

const BlockList: React.FC<BlockListProps> = ({ blocks }) => {
  if (!blocks || !blocks.length) {
    return null
  }

  return (
    <>
      {blocks.map((block, blockIdx) => {
        const Block = block.type && componentByType[block.type]

        if (Block) {
          return <Block key={blockIdx} block={block} />
        }

        return <Content key={blockIdx} content={block.content} />
      })}
    </>
  )
}

export default BlockList
