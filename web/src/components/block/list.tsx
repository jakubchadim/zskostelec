import React from 'react'
import Content from '../content/content'
import { Block } from './utils'

type BlockListProps = {
  blocks?: Block[]
}

const BlockList: React.FC<BlockListProps> = ({ blocks }) => {
  if (!blocks || !blocks.length) {
    return null
  }

  return (
    <>
      {blocks.map((block, blockIdx) => (
        <Content
          key={blockIdx}
          content={block.content}
        />
      ))}
    </>
  )

}

export default BlockList
