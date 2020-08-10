import React from 'react'
import { select } from '@storybook/addon-knobs'
import { BlockColor } from '../../block/color/color'
import { BlockCoreButtonType } from '../../block/core/button/constants'
import UiButton from './button'

export default {
  title: 'Ui/Button'
}

export const Default = () => (
  <div>
    <h4>Fill</h4>
    <UiButton>Default button</UiButton>
    <h4>Outline</h4>
    <UiButton themeType={BlockCoreButtonType.OUTLINE}>Default button</UiButton>
  </div>
)

export const Themed = () => (
  <>
    <h4>Fill</h4>
    <UiButton
      backgroundColor={select(
        'Background color',
        BlockColor,
        BlockColor.PRIMARY
      )}
      textColor={select('Text color', BlockColor, BlockColor.WHITE)}
    >
      Themed button
    </UiButton>
    <h4>Outline</h4>
    <UiButton
      themeType={BlockCoreButtonType.OUTLINE}
      backgroundColor={select(
        'Background color',
        BlockColor,
        BlockColor.PRIMARY
      )}
      textColor={select('Text color', BlockColor, BlockColor.WHITE)}
    >
      Themed button
    </UiButton>
  </>
)
