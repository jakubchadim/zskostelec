import { select } from '@storybook/addon-knobs'
import React from 'react'
import { generateBlock } from '../../../../utils/test'
import { BlockColor } from '../../color/color'
import { BlockType } from '../../constants'
import BlockCoreButton from './button'
import { BlockCoreButtonType } from './constants'

export default {
  title: 'Block/Core'
}

export const Button = () => (
  <BlockCoreButton
    block={generateBlock(
      BlockType.CORE_BUTTON,
      {
        backgroundColor: select(
          'Background color',
          BlockColor,
          BlockColor.PRIMARY
        ),
        textColor: select('Text color', BlockColor, BlockColor.WHITE),
        type: select('Type', BlockCoreButtonType, BlockCoreButtonType.FILL)
      },
      'Button text'
    )}
  />
)
