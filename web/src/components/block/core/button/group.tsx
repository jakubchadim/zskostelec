import React from 'react'
import BlockList from '../../list'
import { BlockFC } from '../../types'
import UiContainer from '../../../ui/container/container'
import UiButtonGroup, { UiButtonGroupAlign } from '../../../ui/button/group'

export type BlockCoreButtonGroupAttrs = {
  align?: UiButtonGroupAlign
}

const BlockCoreButtonGroup: BlockFC<BlockCoreButtonGroupAttrs> = ({
  block,
  nested
}) => {
  const group = (
    <UiButtonGroup align={block.attrs.align}>
      <BlockList blocks={block.blocks} nested />
    </UiButtonGroup>
  )

  return nested ? group : <UiContainer>{group}</UiContainer>
}

export default BlockCoreButtonGroup
