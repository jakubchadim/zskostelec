import React from 'react'
import UiContainer from '../../../ui/container/container'
import UiGroup from '../../../ui/group/group'
import { BlockColorPalette } from '../../color/color'
import BlockList from '../../list'
import { BlockFC } from '../../types'

export type BlockCoreGroupAttrs = BlockColorPalette

const BlockCoreGroup: BlockFC<BlockCoreGroupAttrs> = ({ block, nested }) => (
  <UiGroup
    backgroundColor={block.attrs.backgroundColor}
    textColor={block.attrs.textColor}
  >
    {nested ? (
      <BlockList blocks={block.blocks} nested />
    ) : (
      <UiContainer>
        <BlockList blocks={block.blocks} nested />
      </UiContainer>
    )}
  </UiGroup>
)

export default BlockCoreGroup
