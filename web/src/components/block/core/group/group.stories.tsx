import React from 'react'
import { ID, RawHTML } from '../../../../types'
import { BlockColor } from '../../color/color'
import { BlockType } from '../../constants'
import { Block } from '../../types'
import BlockCoreGroup, { BlockCoreGroupAttrs } from './group'

const baseBlock: Block = {
  id: 'id' as ID,
  type: BlockType.CORE_GROUP,
  content: null,
  attrs: {},
  blocks: [
    {
      id: 'id' as ID,
      type: null,
      content: '<p>Test string</p>' as RawHTML,
      attrs: {},
      blocks: []
    }
  ]
}

const themedBlock: Block<BlockCoreGroupAttrs> = {
  ...baseBlock,
  attrs: {
    backgroundColor: BlockColor.SECONDARY,
    textColor: BlockColor.BLACK
  }
}

export default {
  title: 'Block/Core/Group'
}

export const Default = () => <BlockCoreGroup block={baseBlock} />

export const Themed = () => <BlockCoreGroup block={themedBlock} />
