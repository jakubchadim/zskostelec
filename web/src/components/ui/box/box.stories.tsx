import { select } from '@storybook/addon-knobs'
import React from 'react'
import styled from 'styled-components'
import { generateParagraph } from '../../../utils/storiesUtils'
import { BlockColor } from '../../block/color/color'
import UiBox from './box'

const Offset = styled.div`
  padding: 10rem;
`

export default {
  title: 'Ui'
}

const firstParagraph = generateParagraph()

export const Box = () => (
  <Offset>
    <UiBox
      backgroundColor={select('Background color', BlockColor, BlockColor.WHITE)}
      textColor={select('Text color', BlockColor, BlockColor.BLACK)}
    >
      <UiBox.Header>
        <h2>Title</h2>
        <h4>subtitle</h4>
      </UiBox.Header>
      <UiBox.Content>
        <p>{firstParagraph}</p>
      </UiBox.Content>
    </UiBox>
  </Offset>
)
