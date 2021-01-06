import React from 'react'
import UiNav from '../ui/nav/nav'
import NavSubmenu from './submenu'
import { NavItem } from './utils'
import { renderMenuItem } from './submenu'

type NavSubmenuProps = {
  items: NavItem[]
  transparent?: boolean
  inline?: boolean
  simple?: boolean
  fill?: boolean
}

const NavSimple: React.FC<NavSubmenuProps> = ({ items, ...props }) => {
  return (
    <UiNav {...props}>
      {items.map((item, idx) => (
        <UiNav.Item key={idx}>
          {renderMenuItem(item)}
          {item.items.length > 0 && (
            <UiNav.Submenu last={items.length === idx + 1}>
              <UiNav simple>
                <NavSubmenu items={item.items} />
              </UiNav>
            </UiNav.Submenu>
          )}
        </UiNav.Item>
      ))}
    </UiNav>
  )
}

export default React.memo(NavSimple)
