import React from 'react'
import styled from 'styled-components'
import { OpenInNew } from '@styled-icons/material/OpenInNew'
import UiContainer from '../container/container'
import UiIcon from '../icon/icon'
import UiNav from './nav'

const ColoredBg = styled.div`
  height: 25rem;
  background: ${(p) => p.theme.color.primary1};
`

export default {
  title: 'Ui/Nav'
}

export const Simple = () => (
  <UiNav>
    <UiContainer>
      <UiNav.Container>
        <UiNav.List>
          <UiNav.Item>
            <UiNav.Text>Item 1</UiNav.Text>
          </UiNav.Item>
          <UiNav.Item>
            <UiNav.Text>Item 2</UiNav.Text>
          </UiNav.Item>
          <UiNav.Item>
            <UiNav.Link href='#'>Item 3</UiNav.Link>
          </UiNav.Item>
        </UiNav.List>
      </UiNav.Container>
    </UiContainer>
  </UiNav>
)

export const WithTextLogo = () => (
  <UiNav>
    <UiContainer>
      <UiNav.Container>
        <UiNav.TextLogo>
          <a href='#'>Logo</a>
        </UiNav.TextLogo>
        <UiNav.List>
          <UiNav.Item>
            <UiNav.Text>Item 1</UiNav.Text>
          </UiNav.Item>
          <UiNav.Item>
            <UiNav.Text>Item 2</UiNav.Text>
          </UiNav.Item>
          <UiNav.Item>
            <UiNav.Link href='#'>Item 3</UiNav.Link>
          </UiNav.Item>
        </UiNav.List>
      </UiNav.Container>
    </UiContainer>
  </UiNav>
)

export const WithSubmenu = () => (
  <UiNav>
    <UiContainer>
      <UiNav.Container>
        <UiNav.TextLogo>
          <a href='#'>Logo</a>
        </UiNav.TextLogo>
        <UiNav.List>
          <UiNav.Item>
            <UiNav.Text>Item 1</UiNav.Text>
          </UiNav.Item>
          <UiNav.Item>
            <UiNav.Text>Item 2</UiNav.Text>
            <UiNav.Submenu>
              <UiNav.Item>
                <UiNav.Text withIcon>
                  Submenu item 1
                  <UiIcon icon={OpenInNew} />
                </UiNav.Text>
              </UiNav.Item>
              <UiNav.Item>
                <UiNav.Text>Submenu item 2</UiNav.Text>
              </UiNav.Item>
              <UiNav.Item>
                <UiNav.Text>Submenu item 3</UiNav.Text>
              </UiNav.Item>
            </UiNav.Submenu>
          </UiNav.Item>
          <UiNav.Item>
            <UiNav.Link href='#'>Item 3</UiNav.Link>
          </UiNav.Item>
        </UiNav.List>
      </UiNav.Container>
    </UiContainer>
  </UiNav>
)

export const WithSubmenuForLastItem = () => (
  <UiNav>
    <UiContainer>
      <UiNav.Container>
        <UiNav.TextLogo>
          <a href='#'>Logo</a>
        </UiNav.TextLogo>
        <UiNav.List>
          <UiNav.Item>
            <UiNav.Text>Item 1</UiNav.Text>
          </UiNav.Item>
          <UiNav.Item>
            <UiNav.Text>Item 2</UiNav.Text>
          </UiNav.Item>
          <UiNav.Item>
            <UiNav.Link href='#'>Item 3</UiNav.Link>
            <UiNav.Submenu last>
              <UiNav.Item>
                <UiNav.Text>Submenu item 1</UiNav.Text>
              </UiNav.Item>
              <UiNav.Item>
                <UiNav.Text>Submenu item 2</UiNav.Text>
              </UiNav.Item>
              <UiNav.Item>
                <UiNav.Text>Submenu item 3</UiNav.Text>
              </UiNav.Item>
            </UiNav.Submenu>
          </UiNav.Item>
        </UiNav.List>
      </UiNav.Container>
    </UiContainer>
  </UiNav>
)

export const Transparent = () => (
  <ColoredBg>
    <UiNav transparent>
      <UiContainer>
        <UiNav.Container>
          <UiNav.TextLogo inverted>
            <a href='#'>Logo</a>
          </UiNav.TextLogo>
          <UiNav.List>
            <UiNav.Item>
              <UiNav.Text>Item 1</UiNav.Text>
            </UiNav.Item>
            <UiNav.Item>
              <UiNav.Text>Item 2</UiNav.Text>
              <UiNav.Submenu>
                <UiNav.Item>
                  <UiNav.Link href='#'>Submenu item 1</UiNav.Link>
                </UiNav.Item>
                <UiNav.Item>
                  <UiNav.Text>Submenu item 2</UiNav.Text>
                </UiNav.Item>
                <UiNav.Item>
                  <UiNav.Text>Submenu item 3</UiNav.Text>
                </UiNav.Item>
              </UiNav.Submenu>
            </UiNav.Item>
            <UiNav.Item>
              <UiNav.Link href='#'>Item 3</UiNav.Link>
            </UiNav.Item>
          </UiNav.List>
        </UiNav.Container>
      </UiContainer>
    </UiNav>
  </ColoredBg>
)
