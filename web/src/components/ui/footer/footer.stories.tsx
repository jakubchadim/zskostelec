import React from 'react'
import styled from 'styled-components'
import UiContainer from '../container/container'
import UiFooter from './footer'

const Offset = styled.div`
  padding-top: 10rem;
`

export default {
  title: 'Ui'
}

export const Footer = () => (
  <Offset>
    <UiFooter>
      <UiContainer>
        <UiFooter.Container>ZŠ Kostelec</UiFooter.Container>
      </UiContainer>
    </UiFooter>
  </Offset>
)
