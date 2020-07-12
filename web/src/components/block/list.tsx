import React from 'react'
import Content from '../content/content'
import UiContainer from '../ui/container/container'
import { componentByType } from './register'
import { Block } from './types'

type BlockListProps = {
  blocks?: Block[]
  nested?: boolean
}

const BlockList: React.FC<BlockListProps> = ({ blocks, nested }) => {
  if (!blocks || !blocks.length) {
    return null
  }

  console.log(JSON.stringify(blocks))

  return (
    <>
      {blocks.map((block, blockIdx) => {
        const Block = block.type && componentByType[block.type]

        if (Block) {
          return <Block key={blockIdx} block={block} nested={nested} />
        }

        if (nested) {
          return <Content content={block.content} />
        }

        return (
          <UiContainer key={blockIdx}>
            <Content content={block.content} />
          </UiContainer>
        )
      })}
    </>
  )
}

export default BlockList
