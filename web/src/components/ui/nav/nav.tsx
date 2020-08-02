import styled from 'styled-components'
import { createUiComponent } from '../utils'

const UiNav = styled.nav`
  border-bottom: 0.1rem solid ${(p) => p.theme.color.gray2};
  background: ${(p) => p.theme.color.white1};
  color: ${(p) => p.theme.color.gray7};
  position: sticky;
  top: 0;
  z-index: 100;
`

const Container = styled.div`
  height: 8rem;
  display: flex;
  align-items: center;
`

const Link = styled.a`
  text-decoration: none;
`

const Submenu = styled.ul<{ last?: boolean }>`
  list-style: none;
  padding: ${(p) => p.theme.spacing(3, 2)};
  white-space: nowrap;
  background: ${(p) => p.theme.color.white1};
  position: absolute;
  top: 100%;
  left: ${(p) => (p.last ? 'inherit' : '50%')};
  right: ${(p) => (p.last ? '0' : 'inherit')};
  transform: translateX(${(p) => (p.last ? '0' : '-50%')});
  border-radius: ${(p) => p.theme.radius.medium};
  box-shadow: ${(p) => p.theme.shadow.large};
  opacity: 0;
  transition: opacity 0.3s, margin 0.2s ease-in-out;
  user-select: none;
  visibility: hidden;
  margin-top: 0.5rem;
`

const Item = styled.li<{important?: boolean}>`
  position: relative;
  cursor: default;
  padding: ${(p) => p.theme.spacing(1, 4)};
  font-weight: ${p => p.important ? '300' : 'inherit'};
  color: ${p => p.important ? p.theme.color.primary1 : 'inherit'};
  text-transform: ${p => p.important ? 'uppercase' : 'inherit'};
  font-size: ${p => p.important ? '.8em' : '1em'};

  &:hover {
    & > ${Submenu} {
      opacity: 1;
      visibility: visible;
      margin-top: 0;
    }
  }
`

const List = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0 0 0 auto;

  /* & > ${Item} + ${Item} {
    margin-left: ${(p) => p.theme.spacing(8)};
  } */
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
  TextLogo,
  Submenu
})
