import React from 'react'
import styled from 'styled-components'
import { createUiComponent } from '../utils'

const UiNav = styled.nav`
  border-bottom: 0.1rem solid ${(p) => p.theme.color.gray2};
  background: ${(p) => p.theme.color.white1};
  color: ${(p) => p.theme.color.gray7};
`

const Container = styled.div`
  height: 8rem;
  display: flex;
  align-items: center;
`

const List = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0 0 0 auto;
`

const Item = styled.li`
  & + & {
    margin-left: ${(p) => p.theme.spacing(8)};
  }
`

const Link = styled.a`
  text-decoration: none;
`

const TextLogo = styled.h1`
  font-size: 2.4rem;
  color: ${(p) => p.theme.color.primary1};
  margin: 0;

  a {
    text-decoration: none;
  }
`

export default createUiComponent(UiNav, {
  Container,
  List,
  Item,
  Link,
  TextLogo
})
