'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { accentAt } from '@/components/ui/accent'
import { useNow } from './use-now'

export type PriceBand = { label: string; ages: string; price: number }

/** "How old is your child?" -> big price. */
export function PricePicker({ bands }: { bands: PriceBand[] }) {
  const [selected, setSelected] = useState(0)
  const band = bands[selected]

  return (
    <div className="sticker grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
      <div>
        <p className="m-0 mb-3 font-bold" id="price-picker-label">
          Kolik je žákovi v tomto školním roce let?
        </p>
        <div role="radiogroup" aria-labelledby="price-picker-label" className="flex flex-wrap gap-2">
          {bands.map((b, idx) => (
            <button
              key={b.label}
              type="button"
              role="radio"
              aria-checked={idx === selected}
              onClick={() => setSelected(idx)}
              className={cn(
                'cursor-pointer rounded-full border-[2.5px] border-ink px-4 py-2 font-display text-lg font-bold transition-transform',
                idx === selected ? cn(accentAt(idx).bg, 'shadow-pop-sm', idx === 0 ? 'text-ink' : 'text-white-1') : 'bg-paper hover:-translate-y-0.5'
              )}
            >
              {b.ages}
            </button>
          ))}
        </div>
        <p className="mt-3 mb-0 text-sm text-gray-6">
          Rozhoduje věk, kterého žák dosáhne během školního roku (1. 9. – 31. 8.). Cena je včetně DPH.
        </p>
      </div>
      <div className={cn('grid min-w-44 place-items-center rounded-[var(--radius-large)] border-[2.5px] border-ink p-5 text-center', accentAt(selected).tint)}>
        <span className="text-sm font-extrabold tracking-wide uppercase">Oběd {band.label}</span>
        <span key={band.price} className="animate-pop-in font-display text-6xl leading-none font-extrabold">
          {band.price}&nbsp;Kč
        </span>
        <span className="text-sm text-gray-7">polévka + hlavní jídlo + nápoj</span>
      </div>
    </div>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Live check of the two ordering deadlines from the canteen rules:
 *  - cancel today's lunch by phone/e-mail until 8:00 the same day,
 *  - change the menu choice until 14:00 the day before (PrimiApp / terminal).
 * Rendered only after mount (depends on the visitor's clock).
 */
export function DeadlineHelper() {
  const now = useNow()

  if (!now) {
    return <div className="sticker h-40 animate-pulse bg-gray-2" aria-hidden />
  }

  const day = now.getDay()
  const weekend = day === 0 || day === 6
  const minutes = now.getHours() * 60 + now.getMinutes()
  const canCancelToday = !weekend && minutes < 8 * 60
  const canChangeTomorrow = minutes < 14 * 60
  // Sunday counts as "no": the safe deadline for Monday is Friday 14:00.
  const tomorrowIsSchoolDay = day >= 1 && day <= 4

  const rows = [
    {
      ok: canCancelToday,
      title: weekend ? 'Dnes se nevaří' : canCancelToday ? 'Dnešní oběd ještě zrušíte' : 'Dnešní oběd už zrušit nejde',
      text: weekend
        ? 'O víkendu je jídelna zavřená. Zrušit oběd na pondělí půjde v pondělí do 8:00.'
        : canCancelToday
          ? 'Zavolejte nebo napište do 8:00 – nejlépe hned.'
          : 'Zrušení platí jen do 8:00 ráno. První den nemoci si ale oběd můžete vyzvednout do jídlonosiče (11:00–11:15).'
    },
    {
      ok: canChangeTomorrow && tomorrowIsSchoolDay,
      title: !tomorrowIsSchoolDay
        ? day === 0
          ? 'Menu na pondělí'
          : 'Zítra se nevaří'
        : canChangeTomorrow
          ? 'Zítřejší menu ještě změníte'
          : 'Zítřejší menu už změnit nejde',
      text: !tomorrowIsSchoolDay
        ? 'Menu na pondělí změňte nejpozději v pátek do 14:00.'
        : canChangeTomorrow
          ? `Zbývá ${pad(Math.floor((14 * 60 - minutes) / 60))} h ${pad((14 * 60 - minutes) % 60)} min – v PrimiApp nebo na terminálu u jídelny.`
          : 'Změna je možná do 14:00 předchozího dne. Zítra ráno do 8:00 můžete oběd ještě zrušit.'
    }
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
      {rows.map((row) => {
        const Icon = row.ok ? CheckCircle2 : XCircle
        return (
          <div
            key={row.title}
            className={cn('sticker flex gap-3 p-5', row.ok ? 'bg-grass-tint' : 'bg-berry-tint')}
          >
            <Icon className={cn('size-8 shrink-0', row.ok ? 'text-[#16784a]' : 'text-[#b3164a]')} aria-hidden />
            <div>
              <p className="m-0 font-display text-xl leading-tight font-bold">{row.title}</p>
              <p className="mt-1 mb-0 text-gray-8">{row.text}</p>
            </div>
          </div>
        )
      })}
      <p className="m-0 text-sm text-gray-6 sm:col-span-2">
        Podle hodin ve vašem zařízení ({pad(now.getHours())}:{pad(now.getMinutes())}). Státní svátky a prázdniny tady
        nepočítáme.
      </p>
    </div>
  )
}
