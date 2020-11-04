import styled from 'styled-components'
import { createUiComponent } from '../utils'

const UiNavBar = styled.nav<{ transparent?: boolean }>`
  border-bottom: 0.1rem solid
    ${(p) => (p.transparent ? 'transparent' : p.theme.color.gray2)};
  background: ${(p) => (p.transparent ? 'transparent' : p.theme.color.white1)};
  color: ${(p) => (p.transparent ? p.theme.color.white1 : p.theme.color.gray7)};
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
`

const Container = styled.div`
  height: 8rem;
  display: flex;
  align-items: center;
`

const List = styled.div`
  margin: 0 0 0 auto;
`

const TextLogo = styled.h1<{ inverted?: boolean }>`
  font-size: 2.4rem;
  color: ${(p) => (p.inverted ? p.theme.color.white1 : p.theme.color.primary1)};
  margin: 0;

  a {
    text-decoration: none;

    &:hover {
      color: ${(p) => (p.inverted ? 'inherit' : undefined)};
    }
  }
`

export default createUiComponent(UiNavBar, {
  Container,
  List,
  TextLogo
})
