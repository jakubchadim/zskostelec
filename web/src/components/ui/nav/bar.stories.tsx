import { boolean } from '@storybook/addon-knobs'
import React from 'react'
import styled from 'styled-components'
import { OpenInNew } from '@styled-icons/material/OpenInNew'
import UiContainer from '../container/container'
import UiIcon from '../icon/icon'
import UiNavBar from './bar'

const ColoredBg = styled.div`
  height: 25rem;
  background: ${(p) => p.theme.color.primary1};
`

export default {
  title: 'Ui/Nav'
}

export const Bar = () => {
  const transparent = boolean('Transparent', false)

  return (
    <ColoredBg>
      <UiNavBar transparent={transparent}>
        <UiContainer>
          <UiNavBar.Container>
            <UiNavBar.TextLogo inverted={transparent}>
              <a href='#'>Logo</a>
            </UiNavBar.TextLogo>
            <UiNavBar.List>
              <UiNavBar.Item>
                <UiNavBar.Text>Item 1</UiNavBar.Text>
              </UiNavBar.Item>
              <UiNavBar.Item>
                <UiNavBar.Text>Item 2</UiNavBar.Text>
                <UiNavBar.Submenu>
                  <UiNavBar.Item>
                    <UiNavBar.Link href='#' withIcon>
                      Submenu item 1
                      <UiIcon icon={OpenInNew} />
                    </UiNavBar.Link>
                  </UiNavBar.Item>
                  <UiNavBar.Item>
                    <UiNavBar.Text>Submenu item 2</UiNavBar.Text>
                  </UiNavBar.Item>
                  <UiNavBar.Item>
                    <UiNavBar.Text>Submenu item 3</UiNavBar.Text>
                  </UiNavBar.Item>
                </UiNavBar.Submenu>
              </UiNavBar.Item>
              <UiNavBar.Item>
                <UiNavBar.Link href='#'>Item 3</UiNavBar.Link>
                <UiNavBar.Submenu last>
                  <UiNavBar.Item>
                    <UiNavBar.Text withIcon>
                      Submenu item 1
                      <UiIcon icon={OpenInNew} />
                    </UiNavBar.Text>
                  </UiNavBar.Item>
                  <UiNavBar.Item>
                    <UiNavBar.Text>Submenu item 2</UiNavBar.Text>
                  </UiNavBar.Item>
                  <UiNavBar.Item>
                    <UiNavBar.Text>Submenu item 3</UiNavBar.Text>
                  </UiNavBar.Item>
                </UiNavBar.Submenu>
              </UiNavBar.Item>
            </UiNavBar.List>
          </UiNavBar.Container>
        </UiContainer>
      </UiNavBar>
    </ColoredBg>
  )
}
