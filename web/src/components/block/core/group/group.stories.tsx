import { select, boolean } from '@storybook/addon-knobs'
import React from 'react'
import styled from 'styled-components'
import { generateBlock } from '../../../../utils/test'
import { BlockColor } from '../../color/color'
import { BlockType } from '../../constants'
import BlockCoreGroup from './group'

const paragraphBlock = generateBlock(null, {}, '<p>Test string</p>')

export default {
  title: 'Block/Core'
}

export const Group = () => (
  <BlockCoreGroup
    nested={boolean('Nested', false)}
    block={generateBlock(
      BlockType.CORE_GROUP,
      {
        backgroundColor: select(
          'Background color',
          BlockColor,
          BlockColor.SECONDARY
        ),
        textColor: select('Text color', BlockColor, BlockColor.BLACK)
      },
      null,
      [paragraphBlock]
    )}
  />
)
