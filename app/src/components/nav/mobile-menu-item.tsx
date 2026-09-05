'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavLink } from './nav-link'
import type { NavItem } from './types'

type MobileMenuItemProps = {
  item: NavItem
}

/** Expandable item for the mobile nav Dialog. Mirrors the legacy
 * `MobileMenuItem` in web/src/components/nav/main.tsx. */
export function MobileMenuItem({ item }: MobileMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.items.length > 0

  if (!hasChildren) {
    return (
      <li>
        <NavLink item={item} className="block py-2 text-lg" />
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between py-2 text-left text-lg"
        aria-expanded={isOpen}
      >
        {item.title}
        <ChevronDown
          className={cn('size-5 shrink-0 transition-transform', isOpen && 'rotate-180')}
          aria-hidden
        />
      </button>
      {isOpen && (
        <ul className="m-0 ml-4 list-none border-l border-gray-3 p-0 pl-4">
          {item.items.map((child, idx) => (
            <MobileMenuItem key={`${child.slug ?? child.url}-${idx}`} item={child} />
          ))}
        </ul>
      )}
    </li>
  )
}
