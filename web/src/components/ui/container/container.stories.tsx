import React from 'react'
import styled from 'styled-components'
import UiContainer from './container'

const PreviewBlock = styled.div`
  height: 200px;
  background: ${(p) => p.theme.color.gray4};
`

export default {
  title: 'Ui/Container'
}

export const Regular = () => (
  <UiContainer>
    <PreviewBlock />
  </UiContainer>
)

export const Fluid = () => (
  <UiContainer fluid>
    <PreviewBlock />
  </UiContainer>
)
