'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WpCategory } from '@/lib/wp'

type CategorySwitcherProps = {
  /** The category currently being viewed. */
  current: WpCategory
  /** Every subcategory under the same root (including `current`, if it's one of them). */
  siblings: WpCategory[]
  /** Root category link, shown as "Zobrazit vše" when set (i.e. `current` is a subcategory). */
  rootLink: string | null
}

/**
 * Ports the inline `ChooseCategory*` dropdown from
 * `web/src/templates/category.tsx`: a small toggle next to the category
 * heading that lists sibling subcategories, dismissed on an outside click
 * (the legacy `useTooltip` hook, inlined here as this is its only caller).
 */
export function CategorySwitcher({ current, siblings, rootLink }: CategorySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)
  const isLeaf = current.parent != null

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleClick(event: MouseEvent) {
      if (containerRef.current && event.target instanceof Node && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <span ref={containerRef} className="relative z-10 inline-block pl-6 text-base font-normal">
      <ChevronDown
        className={cn(
          'pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 transition-transform',
          isOpen && 'rotate-180'
        )}
        aria-hidden
      />
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="cursor-pointer text-gray-6 underline hover:text-secondary-2"
      >
        {isLeaf ? current.name : 'vyberte kategorii'}
      </button>
      <div
        className={cn(
          'absolute top-full left-1/2 z-10 mt-4 -translate-x-1/2 rounded-medium bg-white-1 p-3 text-sm text-black-1 shadow-dark-large transition-opacity',
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        {rootLink && (
          <div className="px-1 py-1 text-center whitespace-nowrap">
            <Link href={rootLink} className="hover:text-secondary-2">
              Zobrazit vše
            </Link>
          </div>
        )}
        {siblings.map((sibling) => (
          <div key={sibling.id} className="px-1 py-1 text-center whitespace-nowrap">
            <Link href={sibling.link} className="hover:text-secondary-2">
              {sibling.name}
            </Link>
          </div>
        ))}
      </div>
    </span>
  )
}
