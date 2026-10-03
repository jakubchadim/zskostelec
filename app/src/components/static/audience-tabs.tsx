'use client'

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { accentAt } from '@/components/ui/accent'

export type AudienceTab = {
  key: string
  label: string
  /** Rendered icon element (components can't cross the server/client boundary). */
  icon: ReactNode
  panel: ReactNode
}

/**
 * "Who are you?" switcher - Rodiče / Žáci / Učitelé - so each reader sees
 * only what concerns them. All panels are in the HTML (inactive ones are
 * `hidden`), so the content stays crawlable and works without JS.
 */
export function AudienceTabs({ tabs, label }: { tabs: AudienceTab[]; label: string }) {
  const [active, setActive] = useState(0)
  const uid = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!delta) {
      return
    }
    event.preventDefault()
    const next = (active + delta + tabs.length) % tabs.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label={label} className="mb-5 flex flex-wrap gap-2" onKeyDown={onKeyDown}>
        {tabs.map((tab, idx) => {
          const selected = idx === active
          return (
            <button
              key={tab.key}
              ref={(node) => {
                tabRefs.current[idx] = node
              }}
              id={`${uid}-tab-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${uid}-panel-${tab.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(idx)}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-full border-[2.5px] border-ink px-4 py-2 font-display font-bold transition-transform [&_svg]:size-5',
                selected ? cn(accentAt(idx).tint, 'shadow-pop-sm') : 'bg-paper hover:-translate-y-0.5'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab, idx) => (
        <div
          key={tab.key}
          id={`${uid}-panel-${tab.key}`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${tab.key}`}
          hidden={idx !== active}
          tabIndex={0}
          className="focus-visible:outline-none"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  )
}
