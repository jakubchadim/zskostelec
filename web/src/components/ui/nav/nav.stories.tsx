import React from 'react'
import UiContainer from '../container/container'
import UiNav from './nav'

export default {
  title: 'Ui/Nav'
}

export const Simple = () => (
  <UiNav>
    <UiContainer>
      <UiNav.Container>
        <UiNav.List>
          <UiNav.Item>Item 1</UiNav.Item>
          <UiNav.Item>Item 2</UiNav.Item>
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
          <UiNav.Item>Item 1</UiNav.Item>
          <UiNav.Item>Item 2</UiNav.Item>
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
          <UiNav.Item>Item 1</UiNav.Item>
          <UiNav.Item>
            Item 2
            <UiNav.Submenu>
              <UiNav.Item>Submenu item 1</UiNav.Item>
              <UiNav.Item>Submenu item 2</UiNav.Item>
              <UiNav.Item>Submenu item 3</UiNav.Item>
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
          <UiNav.Item>Item 1</UiNav.Item>
          <UiNav.Item>Item 2</UiNav.Item>
          <UiNav.Item>
            <UiNav.Link href='#'>Item 3</UiNav.Link>
            <UiNav.Submenu last>
              <UiNav.Item>Submenu item 1</UiNav.Item>
              <UiNav.Item>Submenu item 2</UiNav.Item>
              <UiNav.Item>Submenu item 3</UiNav.Item>
            </UiNav.Submenu>
          </UiNav.Item>
        </UiNav.List>
      </UiNav.Container>
    </UiContainer>
  </UiNav>
)
