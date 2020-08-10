import React from 'react'
import styled from 'styled-components'
import { boolean } from '@storybook/addon-knobs'
import UiContainer from './container'

const PreviewBlock = styled.div`
  height: 200px;
  background: ${(p) => p.theme.color.gray4};
`

export default {
  title: 'Ui'
}

export const Container = () => (
  <UiContainer fluid={boolean('Fluid', false)}>
    <PreviewBlock />
  </UiContainer>
)
