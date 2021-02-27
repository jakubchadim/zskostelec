import React from 'react'
import styled from 'styled-components'
import { BlockFC } from '../../types'
import Content from '../../../content/content'
import UiContainer from '../../../ui/container/container'

const BlockParagraph = styled.div<{ align?: string }>`
  ${(p) => p.align === 'left' && 'text-align: left'};
  ${(p) => p.align === 'center' && 'text-align: center'};
  ${(p) => p.align === 'right' && 'text-align: right'};
`

type BlockCoreParagraphAttrs = {
  align: string
}

const BlockCoreParagraph: BlockFC<BlockCoreParagraphAttrs> = ({ block, nested }) => {
  const paragraph = (
    <BlockParagraph align={block.attrs.align}>
      <Content content={block.content} />
    </BlockParagraph>
  )

  return nested ? paragraph : <UiContainer>{paragraph}</UiContainer>
}
export default BlockCoreParagraph
