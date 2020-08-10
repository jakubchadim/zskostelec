import React from 'react'
import { select } from '@storybook/addon-knobs'
import { BlockColor } from '../../block/color/color'
import { BlockCoreButtonType } from '../../block/core/button/constants'
import UiButton from './button'

export default {
  title: 'Ui'
}

export const Button = () => (
  <UiButton
    themeType={select('Type', BlockCoreButtonType, BlockCoreButtonType.FILL)}
    backgroundColor={select('Background color', BlockColor, BlockColor.PRIMARY)}
    textColor={select('Text color', BlockColor, BlockColor.WHITE)}
  >
    Themed button
  </UiButton>
)
