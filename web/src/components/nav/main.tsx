import { Link } from 'gatsby'
import React from 'react'
import { OpenInNew } from '@styled-icons/material/OpenInNew'
import UiNavBar from '../ui/nav/bar'
import UiNav from '../ui/nav/nav'
import UiContainer from '../ui/container/container'
import UiIcon from '../ui/icon/icon'
import { NavItem, useNavMainQuery } from './main.query'
import { isExternalLink } from './utils'

function renderMenuItem(item: NavItem): React.ReactNode {
  const externalLink = isExternalLink(item.url, item.target)

  if (!item.url) {
    return <UiNav.Text>{item.title}</UiNav.Text>
  }

  if (externalLink) {
    return (
      <UiNav.Link href={item.url} target={item.target} withIcon>
        {item.title}
        <UiIcon icon={OpenInNew} />
      </UiNav.Link>
    )
  }

  return (
    <UiNav.Link as={Link} to={item.url || '/'}>
      {item.title}
    </UiNav.Link>
  )
}

function renderSubmenuItems(items: NavItem[]): React.ReactNode {
  if (!items.length) {
    return null
  }

  return (
    <>
      {items.map((item, idx) => (
        <React.Fragment key={`${item.slug}/${idx}`}>
          <UiNav.Item important={!!item.items.length}>
            {renderMenuItem(item)}
          </UiNav.Item>
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
            <UiNav transparent={transparent} inline simple>
              {nav.items.map((item, idx) => (
                <UiNav.Item key={idx}>
                  {renderMenuItem(item)}
                  {item.items.length > 0 && (
                    <UiNav.Submenu last={nav.items.length === idx + 1}>
                      <UiNav simple>
                        {renderSubmenuItems(item.items)}
                      </UiNav>
                    </UiNav.Submenu>
                  )}
                </UiNav.Item>
              ))}
            </UiNav>
          </UiNavBar.List>
        </UiNavBar.Container>
      </UiContainer>
    </UiNavBar>
  )
}

export default NavMain
