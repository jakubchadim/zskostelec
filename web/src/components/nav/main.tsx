import { Link } from 'gatsby'
import React from 'react'
import { KeyboardArrowDown } from '@styled-icons/material/KeyboardArrowDown'
import { KeyboardArrowUp } from '@styled-icons/material/KeyboardArrowUp'
import { Navicon } from '@styled-icons/evil/Navicon'
import UiNavBar from '../ui/nav/bar'
import UiNav from '../ui/nav/nav'
import UiContainer from '../ui/container/container'
import UiIcon from '../ui/icon/icon'
import { useNavMainQuery } from './main.query'
import { NavItem } from './nav.query'
import NavSubmenu, { renderMenuItem } from './submenu'

type MobileMenuItemProps = {
  item: NavItem
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <UiNav.Item>
      {item.items.length === 0 ? (
        renderMenuItem(item)
      ) : (
        <>
          <UiNav.Button onClick={() => setIsOpen(!isOpen)} withIcon>
            {item.title}
            <UiIcon icon={isOpen ? KeyboardArrowUp : KeyboardArrowDown} />
          </UiNav.Button>
          <UiNav.ToggleMenu isOpen={isOpen}>
            <UiNav simple fill>
              <NavSubmenu items={item.items} />
            </UiNav>
          </UiNav.ToggleMenu>
        </>
      )}
    </UiNav.Item>
  )
}

type NavMainProps = {
  transparent?: boolean
}

function canBeTransparent(): boolean {
  return window.scrollY <= 10
}

const NavMain: React.FC<NavMainProps> = ({ transparent }) => {
  const nav = useNavMainQuery()
  const [isTransparent, setIsTransparent] = React.useState(transparent || false)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (!transparent) {
      if (isTransparent) {
        setIsTransparent(false)
      }

      return
    }

    if (canBeTransparent() !== isTransparent) {
      setIsTransparent(true)

      return
    }

    const scroll = () => {
      if (canBeTransparent() !== isTransparent) {
        setIsTransparent(canBeTransparent())
      }
    }

    document.addEventListener('scroll', scroll)

    return () => document.removeEventListener('scroll', scroll)
  }, [transparent, isTransparent])

  return (
    <UiNavBar transparent={isTransparent}>
      <UiContainer>
        <UiNavBar.Container>
          <UiNavBar.TextLogo>
            <Link to='/'>ZŠ Kostelec</Link>
          </UiNavBar.TextLogo>
          <UiNavBar.List>
            <UiNav transparent inline simple>
              {nav.items.map((item, idx) => (
                <UiNav.Item key={idx}>
                  {renderMenuItem(item)}
                  {item.items.length > 0 && (
                    <UiNav.Submenu last={nav.items.length === idx + 1}>
                      <UiNav simple>
                        <NavSubmenu items={item.items} />
                      </UiNav>
                    </UiNav.Submenu>
                  )}
                </UiNav.Item>
              ))}
            </UiNav>
          </UiNavBar.List>

          <UiNavBar.MobileList isOpen={isOpen}>
            <UiNav>
              {nav.items.map((item, idx) => (
                <MobileMenuItem key={idx} item={item} />
              ))}
            </UiNav>
          </UiNavBar.MobileList>

          <UiNavBar.Toggle onClick={() => setIsOpen(!isOpen)}>
            <UiNavBar.ToggleIcon as={Navicon} />
          </UiNavBar.Toggle>
        </UiNavBar.Container>
      </UiContainer>
    </UiNavBar>
  )
}

export default NavMain
