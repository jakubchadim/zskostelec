import React from 'react'
import styled from 'styled-components'
import UiContainer from '../container/container'
import UiNav from './nav'

const PreviewBlock = styled.div`
  height: 200px;
  background: ${(p) => p.theme.color.gray4};
`

export default {
  title: 'Ui/Nav'
}

export const Simple = () => (
  <UiNav>
    <UiContainer>Menu</UiContainer>
  </UiNav>
)
