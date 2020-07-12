import React from 'react'
import { select } from '@storybook/addon-knobs'
import { generateParagraph } from '../../../utils/storiesUtils'
import { BlockColor } from '../../block/color/color'
import UiGroup from './group'

export default {
  title: 'Ui/Group'
}

const firstParagraph = generateParagraph()
const secondParagraph = generateParagraph()

export const Simple = () => (
  <UiGroup>
    <p>{firstParagraph}</p>
    <p>{secondParagraph}</p>
  </UiGroup>
)

export const Themed = () => (
  <UiGroup
    backgroundColor={select('Background color', BlockColor, BlockColor.PRIMARY)}
    textColor={select('Text color', BlockColor, BlockColor.WHITE)}
  >
    <p>{firstParagraph}</p>
    <p>{secondParagraph}</p>
  </UiGroup>
)
