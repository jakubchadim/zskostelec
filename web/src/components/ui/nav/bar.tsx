import styled, { css } from 'styled-components'
import UiIcon from '../icon/icon'
import { createUiComponent } from '../utils'

const UiNavBar = styled.nav<{ transparent?: boolean }>`
  border-bottom: 0.1rem solid
    ${(p) => (p.transparent ? 'transparent' : p.theme.color.gray2)};
  background: ${(p) => (p.transparent ? 'transparent' : p.theme.color.white1)};
  color: ${(p) => (p.transparent ? p.theme.color.white1 : p.theme.color.gray7)};
  position: sticky;
  top: 0;
  z-index: 100;

  a:hover {
    color: ${(p) => (p.transparent ? 'inherit' : p.theme.color.primary1)};
    text-decoration: ${(p) => (p.transparent ? 'underline' : 'none')};
  }
`

const Container = styled.div`
  height: 8rem;
  display: flex;
  align-items: center;
`

const Submenu = styled.ul<{ last?: boolean }>`
  list-style: none;
  padding: ${(p) => p.theme.spacing(3, 2, 3, 1.5)};
  white-space: nowrap;
  background: ${(p) => p.theme.color.white1};
  color: ${(p) => p.theme.color.gray7};
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

  a:hover {
    color: ${(p) => p.theme.color.primary1};
    text-decoration: none;
  }
`

const Item = styled.li<{ important?: boolean }>`
  position: relative;
  cursor: default;
  padding: ${(p) => p.theme.spacing(0, 0.5)};
  font-weight: ${(p) => (p.important ? '300' : 'inherit')};
  color: ${(p) => (p.important ? p.theme.color.primary1 : 'inherit')};
  text-transform: ${(p) => (p.important ? 'uppercase' : 'inherit')};
  font-size: ${(p) => (p.important ? '.8em' : '1em')};

  &:hover {
    & > ${Submenu} {
      opacity: 1;
      visibility: visible;
      margin-top: 0;
    }
  }
`

type MenuItemProps = {
  withIcon?: boolean
}

const menuItemCss = css<MenuItemProps>`
  position: relative;
  padding: ${(p) =>
    p.withIcon ? p.theme.spacing(1, 6, 1, 3.5) : p.theme.spacing(1, 3.5)};

  ${UiIcon} {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.2rem;
    opacity: 0.7;
  }
`

const Text = styled.div<MenuItemProps>`
  ${menuItemCss};
`

const Link = styled.a<MenuItemProps>`
  ${menuItemCss};
  display: block;
  text-decoration: none;
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

const TextLogo = styled.h1<{ inverted?: boolean }>`
  font-size: 2.4rem;
  color: ${(p) => (p.inverted ? p.theme.color.white1 : p.theme.color.primary1)};
  margin: 0;

  a {
    text-decoration: none;
  }
`

export default createUiComponent(UiNavBar, {
  Container,
  List,
  Item,
  Link,
  Text,
  TextLogo,
  Submenu
})
