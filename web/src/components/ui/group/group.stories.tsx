import React from 'react'
import { generateParagraph } from '../../../utils/storiesUtils'
import { BlockColor } from '../../block/color/color'
import UiGroup from './group'

export default {
  title: 'Ui/Group'
}

export const Simple = () => (
  <UiGroup>
    <p>{generateParagraph()}</p>
    <p>{generateParagraph()}</p>
  </UiGroup>
)

export const Themed = () => (
  <UiGroup backgroundColor={BlockColor.PRIMARY} textColor={BlockColor.WHITE}>
    <p>{generateParagraph()}</p>
    <p>{generateParagraph()}</p>
  </UiGroup>
)
