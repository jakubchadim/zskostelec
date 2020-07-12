import React from 'react'
import { BlockColorPalette } from '../../color/color'
import BlockList from '../../list'
import { BlockFC } from '../../types'
import UiGroup from '../../../ui/group/group'
import UiContainer from '../../../ui/container/container'

export type BlockCoreGroupAttrs = BlockColorPalette

const BlockCoreGroup: BlockFC<BlockCoreGroupAttrs> = ({ block, nested }) => (
  <UiGroup
    backgroundColor={block.attrs.backgroundColor}
    textColor={block.attrs.textColor}
  >
    {!nested ? (
      <UiContainer>
        <BlockList blocks={block.blocks} nested />
      </UiContainer>
    ) : (
      <BlockList blocks={block.blocks} nested />
    )}
  </UiGroup>
)

export default BlockCoreGroup
