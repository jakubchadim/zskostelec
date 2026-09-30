'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import type { ID } from '@/lib/wp'
import { cn } from '@/lib/utils'

type ChipGroupProps = {
  legend: string
  items: { id: ID; name: string }[]
  selected: ID[]
  onToggle: (id: ID) => void
  /** Collapse to this many chips with a "show more" toggle. */
  collapseAfter?: number
  /** Tint for selected chips. */
  activeClassName?: string
}

/** Multi-select filter as toggle chips (a `<fieldset>` of checkboxes styled as pills). */
export function ChipGroup({ legend, items, selected, onToggle, collapseAfter, activeClassName = 'bg-sun' }: ChipGroupProps) {
  const [expanded, setExpanded] = useState(false)
  const collapsible = collapseAfter != null && items.length > collapseAfter
  // Selected chips always stay visible, even when collapsed.
  const visible =
    collapsible && !expanded ? items.filter((item, idx) => idx < collapseAfter || selected.includes(item.id)) : items

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-2 font-display text-sm font-extrabold tracking-wider text-gray-7 uppercase">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {visible.map((item) => {
          const active = selected.includes(item.id)
          return (
            <label
              key={item.id}
              className={cn(
                'inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-sm font-bold transition-all select-none has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sky',
                active ? cn(activeClassName, 'shadow-pop-sm') : 'bg-paper hover:bg-cream'
              )}
            >
              <input type="checkbox" checked={active} onChange={() => onToggle(item.id)} className="sr-only" />
              {active && <Check className="size-3.5" aria-hidden />}
              {item.name}
            </label>
          )
        })}
        {collapsible && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="rounded-full px-3 py-1 text-sm font-bold text-secondary-3 underline underline-offset-4"
          >
            {expanded ? 'Méně' : `+ ${items.length - collapseAfter} dalších`}
          </button>
        )}
      </div>
    </fieldset>
  )
}
