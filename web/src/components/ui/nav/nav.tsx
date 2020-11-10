import React from 'react'
import styled, { css } from 'styled-components'
import UiIcon from '../icon/icon'
import { createUiComponent } from '../utils'

const Item = styled.li<{ important?: boolean }>`
  position: relative;
  cursor: default;
  padding: 0;
  font-weight: ${(p) => (p.important ? '300' : 'inherit')};
  color: ${(p) => (p.important ? p.theme.color.primary1 : 'inherit')};
  text-transform: ${(p) => (p.important ? 'uppercase' : 'inherit')};
  font-size: ${(p) => (p.important ? '.8em' : '1em')};
`

const Submenu = styled.div<{ last?: boolean }>`
  padding: ${(p) => p.theme.spacing(3)};
  white-space: nowrap;
  background: ${(p) => p.theme.color.white1};
  color: ${(p) => p.theme.color.gray7};
  position: absolute;
  border-radius: ${(p) => p.theme.radius.medium};
  box-shadow: ${(p) => p.theme.shadow.large};
  opacity: 0.5;
  transition: opacity 0.3s, margin 0.2s ease-in-out;
  user-select: none;
  visibility: hidden;
  margin-top: 0.5rem;
`

type MenuItemProps = {
  withIcon?: boolean
}

const menuItemCss = css<MenuItemProps>`
  position: relative;
  padding: ${(p) =>
    p.withIcon ? p.theme.spacing(1, 7, 1, 2) : p.theme.spacing(1, 2)};

  ${UiIcon} {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${(p) => p.theme.spacing(1)};
    opacity: 0.7;
  }
`

const Text = styled.div<MenuItemProps>`
  ${menuItemCss};
`

const Link = styled.a<MenuItemProps>`
  ${menuItemCss};
  display: block;
`

type UiNavProps = {
  inline?: boolean
  simple?: boolean
  transparent?: boolean
  fill?: boolean
}

const UiNav = styled.ul<UiNavProps>`
  list-style: none;
  padding: 0;
  display: ${(p) => (p.fill ? 'block' : 'inline-block')};
  margin: ${(p) =>
    p.inline ? p.theme.spacing(0, -2) : p.theme.spacing(p.simple ? 0 : -1, 0)};
  display: ${(p) => (p.inline ? 'flex' : undefined)};

  & > ${Item} {
    margin: ${(p) =>
      p.inline ? p.theme.spacing(0, 2) : p.theme.spacing(p.simple ? 0 : 1, 0)};

    & > ${Link} {
      text-decoration: ${(p) => (p.simple ? 'none' : undefined)};

      &:hover {
        color: ${(p) => (p.transparent ? 'inherit' : undefined)};
        text-decoration: ${(p) => (p.transparent ? 'underline' : undefined)};
      }
    }

    & > ${Submenu} {
      top: ${(p) => (p.inline ? '100%' : 0)};
      left: ${(p) => (p.inline ? '50%' : '100%')};
      transform: translateX(${(p) => (p.inline ? '-50%' : '0')});
    }

    &:last-child {
      & > ${Submenu} {
        left: ${(p) => (p.inline ? 'inherit' : undefined)};
        right: ${(p) => (p.inline ? 0 : undefined)};
        transform: ${(p) => (p.inline ? 'translateX(0)' : undefined)};
      }
    }

    &:hover {
      & > ${Submenu} {
        opacity: 1;
        visibility: visible;
        margin-top: 0;
      }
    }
  }
`

export default createUiComponent(UiNav, {
  Item,
  Link,
  Text,
  Submenu
})
