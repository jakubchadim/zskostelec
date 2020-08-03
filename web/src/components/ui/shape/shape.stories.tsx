import { select } from '@storybook/addon-knobs'
import React from 'react'
import styled from 'styled-components'
import { BlockColor } from '../../block/color/color'
import UiShape from './shape'

const Block = styled.div`
  height: 10rem;
  background: ${(p) => p.theme.color.gray5};
`

export default {
  title: 'Ui'
}

export const Shape = () => (
  <>
    <Block />
    <UiShape color={select('Color', BlockColor, BlockColor.MEDIUM_GRAY)} />
  </>
)
