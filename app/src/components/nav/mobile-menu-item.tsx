'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { accentAt } from '@/components/ui/accent'
import { NavLink } from './nav-link'
import type { NavItem } from './types'

type MobileMenuItemProps = {
  item: NavItem
  accentIndex: number
  /** Nested level - rendered as simple rows instead of big colour tiles. */
  nested?: boolean
}

/** Expandable item for the mobile menu: top level renders as a big colourful tile. */
export function MobileMenuItem({ item, accentIndex, nested }: MobileMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.items.length > 0
  const accent = accentAt(accentIndex)

  if (nested) {
    if (hasChildren) {
      return (
        <li className="pt-2">
          <span className="block px-3 text-xs font-extrabold tracking-wider text-gray-6 uppercase">{item.title}</span>
          <ul className="m-0 list-none p-0">
            {item.items.map((child, idx) => (
              <MobileMenuItem key={`${child.slug ?? child.url}-${idx}`} item={child} accentIndex={accentIndex} nested />
            ))}
          </ul>
        </li>
      )
    }

    return (
      <li>
        <NavLink item={item} className="flex items-center rounded-xl px-3 py-2.5 font-semibold active:bg-cream" />
      </li>
    )
  }

  const tile = cn(
    'flex w-full items-center justify-between rounded-2xl border-[2.5px] border-ink px-4 py-3 text-left font-display text-xl font-bold shadow-pop-sm',
    accent.tint
  )

  if (!hasChildren) {
    return (
      <li>
        <NavLink item={item} className={tile} />
      </li>
    )
  }

  return (
    <li>
      <button type="button" onClick={() => setIsOpen((open) => !open)} className={tile} aria-expanded={isOpen}>
        {item.title}
        <span className={cn('grid size-8 place-items-center rounded-full border-2 border-ink bg-paper transition-transform duration-300', isOpen && 'rotate-180')}>
          <ChevronDown className="size-5" aria-hidden />
        </span>
      </button>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden" inert={!isOpen}>
          <ul className="m-0 mt-2 ml-3 list-none rounded-2xl border-2 border-dashed border-gray-4 bg-paper p-2">
            {item.items.map((child, idx) => (
              <MobileMenuItem key={`${child.slug ?? child.url}-${idx}`} item={child} accentIndex={accentIndex} nested />
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}
