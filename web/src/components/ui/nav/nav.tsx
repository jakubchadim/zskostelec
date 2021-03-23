import React from 'react'
import styled, { css } from 'styled-components'
import UiIcon from '../icon/icon'
import { createUiComponent } from '../utils'

const Item__large = css`
  margin: 0 !important;
`

const Item = styled.li<{ important?: boolean; $large?: boolean }>`
  position: relative;
  cursor: default;
  padding: 0;
  font-weight: ${(p) => (p.important ? '300' : 'inherit')};
  color: ${(p) => (p.important ? p.theme.color.primary1 : 'inherit')};
  text-transform: ${(p) => (p.important ? 'uppercase' : 'inherit')};
  font-size: ${(p) => (p.important ? '.8em' : '1em')};
  ${(p) => p.$large && Item__large};
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

const ToggleMenu__open = css`
  max-height: 50rem;
  padding: ${(p) => p.theme.spacing(1, 0)};
`

const ToggleMenu = styled.div<{ isOpen?: boolean }>`
  max-height: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.05);
  transition: padding 0.3s, max-height 0.3s;

  ${(p) => p.isOpen && ToggleMenu__open};
`

type MenuItemProps = {
  withIcon?: boolean
  $large?: boolean
}

const menuItemCss__large = css<MenuItemProps>`
  padding-top: 0.625em;
  padding-bottom: 0.625em;
`

const menuItemCss__withIcon = css<MenuItemProps>`
  padding: 0.3125em 2.1875em 0.3125em 0.625em;
`

const menuItemCss = css<MenuItemProps>`
  position: relative;
  padding: 0.3125em 0.625em;

  ${(p) => p.withIcon && menuItemCss__withIcon};
  ${(p) => p.$large && menuItemCss__large};

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

const Button = styled.button<MenuItemProps>`
  border: none;
  background: none;
  display: block;
  margin: 0;
  font-size: inherit;
  color: inherit;
  width: 100%;
  text-align: inherit;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  ${menuItemCss};
`

type UiNavProps = {
  inline?: boolean
  simple?: boolean
  transparent?: boolean
  fill?: boolean
  large?: boolean
}

const UiNav__fill = css`
  display: block;
`

const UiNav__simple = css`
  margin: 0;

  & > ${Item} {
    margin: 0;

    & > ${Link} {
      text-decoration: none;
    }
  }
`

const UiNav__inline = css`
  display: flex !important;
  margin: ${(p) => p.theme.spacing(0, -2)};

  & > ${Item} {
    margin: ${(p) => p.theme.spacing(0, 2)};

    & > ${Submenu} {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
    }

    &:last-child {
      & > ${Submenu} {
        left: inherit;
        right: 0;
        transform: translateX(0);
      }
    }
  }
`

const UiNav__transparent = css`
  & > ${Item} {
    & > ${Link} {
      &:hover {
        color: inherit;
        text-decoration: underline;
      }
    }
  }
`

const UiNav__large = css`
  font-size: 2rem;
`

const UiNav = styled.ul<UiNavProps>`
  list-style: none;
  padding: 0;
  display: inline-block;
  margin: ${(p) => p.theme.spacing(-1, 0)};

  & > ${Item} {
    margin: ${(p) => p.theme.spacing(1, 0)};

    & > ${Submenu} {
      top: 0;
      left: 100%;
    }

    &:hover {
      & > ${Submenu} {
        opacity: 1;
        visibility: visible;
        margin-top: 0;
      }
    }
  }

  ${(p) => p.simple && UiNav__simple};
  ${(p) => p.fill && UiNav__fill};
  ${(p) => p.inline && UiNav__inline};
  ${(p) => p.transparent && UiNav__transparent};
  ${(p) => p.large && UiNav__large};
`

export default createUiComponent(UiNav, {
  Item,
  Link,
  Text,
  Button,
  Submenu,
  ToggleMenu
})
