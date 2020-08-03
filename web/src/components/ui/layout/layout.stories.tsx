import React from 'react'
import styled from 'styled-components'
import UiLayout from './layout'

export default {
  title: 'Ui'
}

const Header = styled.div`
  padding: 2rem 1rem;
  background: ${(p) => p.theme.color.primary1};
`

const Content = styled.div`
  padding: 2rem 1rem;
`

const Footer = styled.div`
  padding: 2rem 1rem;
  background: ${(p) => p.theme.color.gray9};
  color: #fff;
`

export const Layout = () => (
  <UiLayout>
    <Header>Header</Header>
    <UiLayout.Content>
      <Content>Content</Content>
    </UiLayout.Content>
    <Footer>Footer</Footer>
  </UiLayout>
)
