import { select } from '@storybook/addon-knobs'
import React from 'react'
import { generateBlock } from '../../../../utils/test'
import { UiButtonGroupAlign } from '../../../ui/button/group'
import { BlockType } from '../../constants'
import BlockCoreButtonGroup from './group'

export default {
  title: 'Block/Core'
}

export const ButtonGroup = () => (
  <>
    <BlockCoreButtonGroup
      block={generateBlock(
        BlockType.CORE_BUTTONS,
        {
          align: select('Align', UiButtonGroupAlign, UiButtonGroupAlign.CENTER)
        },
        null,
        [
          generateBlock(BlockType.CORE_BUTTON, {}, 'First button'),
          generateBlock(BlockType.CORE_BUTTON, {}, 'Second button')
        ]
      )}
    />
  </>
)
