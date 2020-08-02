import { select } from '@storybook/addon-knobs'
import React from 'react'
import styled from 'styled-components'
import { ID, RawHTML } from '../../../../types'
import { BlockColor } from '../../color/color'
import { BlockType } from '../../constants'
import { Block } from '../../types'
import BlockCoreGroup from './group'

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

const Offset = styled.div`
  height: 5rem;
`

export default {
  title: 'Block/Core/Group'
}

export const Default = () => <BlockCoreGroup block={baseBlock} />

export const Themed = () => (
  <>
    <Offset />
    <BlockCoreGroup block={{
      ...baseBlock,
      attrs: {
        backgroundColor: select('Background color', BlockColor, BlockColor.SECONDARY),
        textColor: select('Text color', BlockColor, BlockColor.BLACK)
      }
    }} />
    <Offset />
    <h4>Nested block</h4>
    <BlockCoreGroup nested block={{
      ...baseBlock,
      attrs: {
        backgroundColor: select('Background color', BlockColor, BlockColor.SECONDARY),
        textColor: select('Text color', BlockColor, BlockColor.BLACK)
      }
    }} />
  </>
)
