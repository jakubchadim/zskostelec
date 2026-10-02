'use client'

import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { accentAt } from '@/components/ui/accent'
import { useNow } from './use-now'

export type Milestone = {
  label: string
  /** Human-readable range shown as the big value, e.g. "1. – 22. 2. 2027". */
  when: string
  /** ISO dates (YYYY-MM-DD), inclusive. */
  start: string
  end: string
}

const DAY = 24 * 60 * 60 * 1000

function daysWord(n: number): string {
  if (n === 1) return 'den'
  if (n >= 2 && n <= 4) return 'dny'
  return 'dní'
}

/** Key dates with a live "za N dní / právě probíhá / proběhlo" badge. */
export function Countdown({ milestones }: { milestones: Milestone[] }) {
  const now = useNow()
  const today = now ? new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() : null

  return (
    <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
      {milestones.map((m, idx) => {
        const accent = accentAt(idx + 2)
        const start = new Date(`${m.start}T00:00:00`).getTime()
        const end = new Date(`${m.end}T00:00:00`).getTime()
        let badge: string | null = null
        if (today !== null) {
          if (today < start) {
            const n = Math.round((start - today) / DAY)
            badge = `za ${n} ${daysWord(n)}`
          } else if (today <= end) {
            badge = 'právě probíhá'
          } else {
            badge = 'proběhlo'
          }
        }
        return (
          <li key={m.label} className={cn('sticker flex flex-col gap-2 p-5 sm:p-6', accent.tint)}>
            <span className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-extrabold tracking-wide uppercase">
                <CalendarDays className={cn('size-5', accent.text)} aria-hidden />
                {m.label}
              </span>
              {badge && (
                <span className="animate-pop-in rounded-full border-2 border-ink bg-paper px-2.5 py-0.5 text-sm font-extrabold whitespace-nowrap">
                  {badge}
                </span>
              )}
            </span>
            <span className="font-display text-3xl leading-tight font-extrabold">{m.when}</span>
          </li>
        )
      })}
    </ul>
  )
}
