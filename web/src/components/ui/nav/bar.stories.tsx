import { boolean } from '@storybook/addon-knobs'
import React from 'react'
import styled from 'styled-components'
import { OpenInNew } from '@styled-icons/material/OpenInNew'
import { KeyboardArrowDown } from '@styled-icons/material/KeyboardArrowDown'
import { KeyboardArrowUp } from '@styled-icons/material/KeyboardArrowUp'
import { Navicon } from '@styled-icons/evil/Navicon'
import UiContainer from '../container/container'
import UiIcon from '../icon/icon'
import UiNavBar from './bar'
import UiNav from './nav'

const ColoredBg = styled.div`
  height: 25rem;
  background: ${(p) => p.theme.color.primary1};
`

export default {
  title: 'Ui/Nav'
}

export const Bar = () => {
  const transparent = boolean('Transparent', false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [submenuIsOpen, setSubmenuIsOpen] = React.useState(false)

  return (
    <ColoredBg>
      <UiNavBar transparent={transparent}>
        <UiContainer>
          <UiNavBar.Container>
            <UiNavBar.TextLogo>
              <a href='#'>Logo</a>
            </UiNavBar.TextLogo>
            <UiNavBar.List>
              <UiNav transparent inline simple>
                <UiNav.Item>
                  <UiNav.Text>Item 1</UiNav.Text>
                </UiNav.Item>
                <UiNav.Item>
                  <UiNav.Text>Item 2</UiNav.Text>
                  <UiNav.Submenu>
                    <UiNav simple>
                      <UiNav.Item>
                        <UiNav.Link href='#' withIcon>
                          Submenu item 1
                          <UiIcon icon={OpenInNew} />
                        </UiNav.Link>
                      </UiNav.Item>
                      <UiNav.Item>
                        <UiNav.Text>Submenu item 2</UiNav.Text>
                      </UiNav.Item>
                      <UiNav.Item>
                        <UiNav.Text>Submenu item 3</UiNav.Text>
                      </UiNav.Item>
                    </UiNav>
                  </UiNav.Submenu>
                </UiNav.Item>
                <UiNav.Item>
                  <UiNav.Link href='#'>Item 3</UiNav.Link>
                  <UiNav.Submenu last>
                    <UiNav simple>
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
                    </UiNav>
                  </UiNav.Submenu>
                </UiNav.Item>
              </UiNav>
            </UiNavBar.List>
            <UiNavBar.MobileList isOpen={isOpen}>
              <UiNav>
                <UiNav.Item>
                  <UiNav.Text>Item 1</UiNav.Text>
                </UiNav.Item>
                <UiNav.Item>
                  <UiNav.Button
                    onClick={() => setSubmenuIsOpen(!submenuIsOpen)}
                    withIcon
                  >
                    Item 2
                    <UiIcon
                      icon={submenuIsOpen ? KeyboardArrowUp : KeyboardArrowDown}
                    />
                  </UiNav.Button>
                  <UiNav.ToggleMenu isOpen={submenuIsOpen}>
                    <UiNav simple>
                      <UiNav.Item>
                        <UiNav.Link href='#' withIcon>
                          Submenu item 1
                          <UiIcon icon={OpenInNew} />
                        </UiNav.Link>
                      </UiNav.Item>
                      <UiNav.Item>
                        <UiNav.Text>Submenu item 2</UiNav.Text>
                      </UiNav.Item>
                      <UiNav.Item>
                        <UiNav.Text>Submenu item 3</UiNav.Text>
                      </UiNav.Item>
                    </UiNav>
                  </UiNav.ToggleMenu>
                </UiNav.Item>
                <UiNav.Item>
                  <UiNav.Link href='#'>Item 3</UiNav.Link>
                  <UiNav.ToggleMenu>
                    <UiNav simple>
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
                    </UiNav>
                  </UiNav.ToggleMenu>
                </UiNav.Item>
              </UiNav>
            </UiNavBar.MobileList>
            <UiNavBar.Toggle onClick={() => setIsOpen(!isOpen)}>
              <UiNavBar.ToggleIcon as={Navicon} />
            </UiNavBar.Toggle>
          </UiNavBar.Container>
        </UiContainer>
      </UiNavBar>
    </ColoredBg>
  )
}
