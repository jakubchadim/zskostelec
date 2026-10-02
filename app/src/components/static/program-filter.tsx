'use client'

import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { cn } from '@/lib/utils'
import { accentAt } from '@/components/ui/accent'

export type Audience = '1' | '2'

export type Program = {
  title: string
  text: string
  /** Who it's for; both stupně when it lists both. */
  audience: Audience[]
  /** Short tag like "2.–3. ročník". */
  tag?: string
}

const FILTERS: { key: 'all' | Audience; label: string }[] = [
  { key: 'all', label: 'Vše' },
  { key: '1', label: '1. stupeň' },
  { key: '2', label: '2. stupeň' }
]

/** Prevention programmes as cards, filterable by stupeň. */
export function ProgramFilter({ programs }: { programs: Program[] }) {
  const [filter, setFilter] = useState<'all' | Audience>('all')
  const [listRef] = useAutoAnimate<HTMLUListElement>()
  const visible = filter === 'all' ? programs : programs.filter((p) => p.audience.includes(filter))

  return (
    <div>
      <div role="group" aria-label="Pro koho" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f, idx) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'cursor-pointer rounded-full border-[2.5px] border-ink px-4 py-1.5 font-display font-bold transition-transform',
              filter === f.key ? cn(accentAt(idx).bg, 'shadow-pop-sm') : 'bg-paper hover:-translate-y-0.5'
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="self-center text-sm text-gray-6" aria-live="polite">
          {visible.length} programů
        </span>
      </div>
      <ul ref={listRef} className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => {
          const accent = accentAt(programs.indexOf(p))
          return (
            <li key={p.title} className="sticker flex flex-col gap-2 p-5">
              <div className="flex flex-wrap gap-1.5">
                {(p.tag ? [p.tag] : p.audience.map((a) => `${a}. stupeň`)).map((t) => (
                  <span key={t} className={cn('rounded-full px-2.5 py-0.5 text-xs font-extrabold', accent.tint, accent.text)}>
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="font-display text-lg leading-tight">{p.title}</h3>
              <p className="m-0 text-gray-8">{p.text}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
