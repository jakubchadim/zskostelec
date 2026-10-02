'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { accentAt } from '@/components/ui/accent'
import { Reveal } from '@/components/ui/reveal'

export type TimelineEvent = {
  year: string
  title: string
  /** Always visible one-liner. */
  summary: ReactNode
  /** Longer text revealed on "Číst víc". */
  detail?: ReactNode
}

/** Vertical timeline with a coloured year badge per event and expandable detail. */
export function Timeline({ events }: { events: TimelineEvent[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set())

  const toggle = (idx: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })

  return (
    <ol className="relative m-0 list-none p-0 before:absolute before:top-2 before:bottom-2 before:left-[2.6rem] before:w-1 before:rounded-full before:bg-ink/15 sm:before:left-1/2 sm:before:-translate-x-1/2">
      {events.map((event, idx) => {
        const accent = accentAt(idx)
        const isOpen = open.has(idx)
        const right = idx % 2 === 1
        return (
          <li key={`${event.year}-${idx}`} className="relative mb-6 last:mb-0 sm:grid sm:grid-cols-2 sm:gap-14">
            <span
              className={cn(
                'absolute top-3 left-0 z-10 grid h-11 w-[5.2rem] place-items-center rounded-full border-[2.5px] border-ink font-display text-base font-extrabold shadow-pop-sm sm:left-1/2 sm:-translate-x-1/2',
                accent.bg,
                accent.name === 'sun' || accent.name === 'tangerine' ? 'text-ink' : 'text-white-1'
              )}
            >
              {event.year}
            </span>
            <Reveal className={cn('pl-24 sm:pl-0', right ? 'sm:col-start-2' : 'sm:col-start-1 sm:text-right')} delay={60}>
              <article className={cn('sticker p-5', accent.tint)}>
                <h3 className="font-display text-xl leading-tight">{event.title}</h3>
                <div className="mt-2 text-gray-8">{event.summary}</div>
                {event.detail && (
                  <>
                    <div
                      className={cn(
                        'grid transition-[grid-template-rows] duration-300',
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      )}
                    >
                      <div aria-hidden={!isOpen} className="overflow-hidden text-left text-gray-8 [&_p]:mt-3">
                        {event.detail}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(idx)}
                      aria-expanded={isOpen}
                      className="mt-3 cursor-pointer rounded-full border-2 border-ink bg-paper px-3 py-0.5 text-sm font-bold"
                    >
                      {isOpen ? 'Méně' : 'Číst víc'}
                    </button>
                  </>
                )}
              </article>
            </Reveal>
          </li>
        )
      })}
    </ol>
  )
}
