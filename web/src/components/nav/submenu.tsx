import { Link } from 'gatsby'
import React from 'react'
import { OpenInNew } from '@styled-icons/material/OpenInNew'
import UiNav from '../ui/nav/nav'
import UiIcon from '../ui/icon/icon'
import { NavItem } from './nav.query'
import { isExternalLink } from './utils'

export function renderMenuItem(
  item: NavItem,
  large?: boolean
): React.ReactNode {
  const externalLink = isExternalLink(item.url, item.target)

  if (!item.url) {
    return <UiNav.Text $large={large}>{item.title}</UiNav.Text>
  }

  if (externalLink) {
    return (
      <UiNav.Link href={item.url} target={item.target} $large={large} withIcon>
        {item.title}
        <UiIcon icon={OpenInNew} />
      </UiNav.Link>
    )
  }

  return (
    <UiNav.Link as={Link} to={item.url || '/'} $large={large}>
      {item.title}
    </UiNav.Link>
  )
}

function renderSubmenuItems(
  items: NavItem[],
  large?: boolean
): React.ReactNode {
  if (!items.length) {
    return null
  }

  return (
    <>
      {items.map((item, idx) => (
        <React.Fragment key={`${item.slug}/${idx}`}>
          <UiNav.Item important={!!item.items.length} $large={large}>
            {renderMenuItem(item, large)}
          </UiNav.Item>
          {renderSubmenuItems(item.items, large)}
        </React.Fragment>
      ))}
    </>
  )
}

type NavSubmenuProps = {
  items: NavItem[]
  large?: boolean
}

const NavSubmenu: React.FC<NavSubmenuProps> = ({ items, large }) => {
  return <>{renderSubmenuItems(items, large)}</>
}

export default React.memo(NavSubmenu)
