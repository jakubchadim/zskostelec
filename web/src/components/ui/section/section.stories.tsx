import React from 'react'
import { select } from '@storybook/addon-knobs'
import { generateParagraph } from '../../../utils/storiesUtils'
import { BlockColor } from '../../block/color/color'
import UiContainer from '../container/container'
import UiSection from './section'

export default {
  title: 'Ui'
}

const firstParagraph = generateParagraph()
const secondParagraph = generateParagraph()

export const Section = () => (
  <>
    <UiSection>
      <UiContainer>
        <h3>Simple section</h3>
        <p>{firstParagraph}</p>
      </UiContainer>
    </UiSection>
    <UiSection
      backgroundColor={select(
        'Background color',
        BlockColor,
        BlockColor.PRIMARY
      )}
      textColor={select('Text color', BlockColor, BlockColor.WHITE)}
    >
      <UiContainer>
        <h3>Themed section</h3>
        <p>{firstParagraph}</p>
        <p>{secondParagraph}</p>
      </UiContainer>
    </UiSection>
  </>
)
