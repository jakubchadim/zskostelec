import { Link } from 'gatsby'
import React from 'react'
import { OpenInNew } from '@styled-icons/material/OpenInNew'
import UiNavBar from '../ui/nav/bar'
import UiContainer from '../ui/container/container'
import UiIcon from '../ui/icon/icon'
import { NavItem, useNavMainQuery } from './main.query'
import { isExternalLink } from './utils'

const NavLink = UiNavBar.Link.withComponent(Link)

function renderMenuItem(item: NavItem): React.ReactNode {
  const externalLink = isExternalLink(item.url, item.target)

  if (!item.url) {
    return <UiNavBar.Text>{item.title}</UiNavBar.Text>
  }

  if (externalLink) {
    return (
      <UiNavBar.Link href={item.url} target={item.target} withIcon>
        {item.title}
        <UiIcon icon={OpenInNew} />
      </UiNavBar.Link>
    )
  }

  return <NavLink to={item.url || '/'}>{item.title}</NavLink>
}

function renderSubmenuItems(items: NavItem[]): React.ReactNode {
  if (!items.length) {
    return null
  }

  return (
    <>
      {items.map((item, idx) => (
        <React.Fragment key={`${item.slug}/${idx}`}>
          <UiNavBar.Item important={!!item.items.length}>
            {renderMenuItem(item)}
          </UiNavBar.Item>
          {renderSubmenuItems(item.items)}
        </React.Fragment>
      ))}
    </>
  )
}

type NavMainProps = {
  transparent?: boolean
}

const NavMain: React.FC<NavMainProps> = ({ transparent }) => {
  const nav = useNavMainQuery()

  return (
    <UiNavBar transparent={transparent}>
      <UiContainer>
        <UiNavBar.Container>
          <UiNavBar.TextLogo inverted={transparent}>
            <Link to='/'>ZŠ Kostelec</Link>
          </UiNavBar.TextLogo>
          <UiNavBar.List>
            {nav.items.map((item, idx) => (
              <UiNavBar.Item key={idx}>
                {renderMenuItem(item)}
                {item.items.length > 0 && (
                  <UiNavBar.Submenu last={nav.items.length === idx + 1}>
                    {renderSubmenuItems(item.items)}
                  </UiNavBar.Submenu>
                )}
              </UiNavBar.Item>
            ))}
          </UiNavBar.List>
        </UiNavBar.Container>
      </UiContainer>
    </UiNavBar>
  )
}

export default NavMain
