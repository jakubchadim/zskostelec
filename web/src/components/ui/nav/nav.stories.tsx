import { boolean } from '@storybook/addon-knobs'
import React from 'react'
import styled from 'styled-components'
import { OpenInNew } from '@styled-icons/material/OpenInNew'
import UiIcon from '../icon/icon'
import UiNav from './nav'

const ColoredBg = styled.div<{ colored?: boolean }>`
  height: 25rem;
  background: ${(p) => (p.colored ? p.theme.color.primary1 : undefined)};
  color: ${(p) => (p.colored ? p.theme.color.white1 : undefined)};
`

export default {
  title: 'Ui/Nav'
}

const submenu = (
  <UiNav simple>
    <UiNav.Item>
      <UiNav.Link href='#' withIcon>
        Submenu item 1
        <UiIcon icon={OpenInNew} />
      </UiNav.Link>
    </UiNav.Item>
    <UiNav.Item>
      <UiNav.Link href='#'>Submenu item 2</UiNav.Link>
    </UiNav.Item>
    <UiNav.Item>
      <UiNav.Text>Submenu item 3</UiNav.Text>
    </UiNav.Item>
    <UiNav.Item>
      <UiNav.Text>Submenu item 4</UiNav.Text>
    </UiNav.Item>
  </UiNav>
)

export const Nav = () => {
  const transparent = boolean('Transparent', false)

  return (
    <ColoredBg colored={transparent}>
      <UiNav
        simple={boolean('Simple', false)}
        inline={boolean('Inline', false)}
        fill={boolean('Fill', false)}
        transparent={transparent}
      >
        <UiNav.Item>
          <UiNav.Link href='#' withIcon>
            Item 1
            <UiIcon icon={OpenInNew} />
          </UiNav.Link>
        </UiNav.Item>
        <UiNav.Item>
          <UiNav.Link href='#'>Item 2</UiNav.Link>
          <UiNav.Submenu>{submenu}</UiNav.Submenu>
        </UiNav.Item>
        <UiNav.Item>
          <UiNav.Text>Item 3</UiNav.Text>
        </UiNav.Item>
        <UiNav.Item>
          <UiNav.Text>Item 4</UiNav.Text>
          <UiNav.Submenu last>{submenu}</UiNav.Submenu>
        </UiNav.Item>
      </UiNav>
    </ColoredBg>
  )
}
