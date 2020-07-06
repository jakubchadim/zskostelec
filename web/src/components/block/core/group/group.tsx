import React from 'react'
import { BlockColorPalette } from '../../color/color'
import BlockList from '../../list'
import { BlockFC } from '../../types'
import UiGroup from '../../../ui/group/group'

export type BlockCoreGroupAttrs = BlockColorPalette

const BlockCoreGroup: BlockFC<BlockCoreGroupAttrs> = ({ block }) => (
  <UiGroup
    backgroundColor={block.attrs.backgroundColor}
    textColor={block.attrs.textColor}
  >
    <BlockList blocks={block.blocks} nested />
  </UiGroup>
)

export default BlockCoreGroup
