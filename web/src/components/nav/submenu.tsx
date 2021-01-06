import { Link } from 'gatsby'
import React from 'react'
import { OpenInNew } from '@styled-icons/material/OpenInNew'
import UiNav from '../ui/nav/nav'
import UiIcon from '../ui/icon/icon'
import { NavItem } from './nav.query'
import { isExternalLink } from './utils'

export function renderMenuItem(item: NavItem): React.ReactNode {
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

type NavSubmenuProps = {
  items: NavItem[]
}

const NavSubmenu: React.FC<NavSubmenuProps> = ({ items }) => {
  return <>{renderSubmenuItems(items)}</>
}

export default React.memo(NavSubmenu)
