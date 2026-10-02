'use client'

import { useId, useState, useSyncExternalStore } from 'react'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHAPTERS } from '../story'
import { Stamp, stampInk, stampTilt } from './marks'
import { getServerTrailSnapshot, getTrailSnapshot, mountedStore, subscribeTrail } from './store'
import s from './trail.module.css'

const TOTAL = CHAPTERS.length

function announce(last: string | null, count: number) {
  const chapter = CHAPTERS.find((c) => c.id === last)
  if (!chapter) {
    return ''
  }
  if (count === TOTAL) {
    return `Poslední razítko: ${chapter.year} – ${chapter.title}. Máš všech ${TOTAL} razítek, v cíli tě čeká certifikát!`
  }
  return `Nové razítko: ${chapter.year} – ${chapter.title}. Máš ${count} z ${TOTAL}.`
}

/**
 * "Turistický deník" - the hiking passport that sticks to the bottom of
 * the screen while you walk the trail. Every stop you pass gets a rubber
 * stamp; each slot is a link that jumps to its stop. Collapsed it shows
 * the count (and a mini strip on wide screens), expanded a stamp grid.
 */
export function Passport() {
  const mounted = useSyncExternalStore(...mountedStore)
  const { visited, last, km } = useSyncExternalStore(subscribeTrail, getTrailSnapshot, getServerTrailSnapshot)
  const [open, setOpen] = useState(false)
  const panelId = useId()

  // Interactive-only: without JS the stops are just a list, no passport.
  if (!mounted) {
    return null
  }

  const count = visited.length
  const done = count === TOTAL
  const nextStop = CHAPTERS.find((c) => !visited.includes(c.id))

  return (
    <aside aria-label="Turistický deník" className="sticky bottom-2 z-30 mx-auto mt-10 w-full max-w-[1100px] px-2 sm:bottom-4 sm:px-4 print:hidden">
      <div className={cn('sticker overflow-hidden bg-paper !rounded-[1.25rem] sm:!rounded-[1.5rem]', s.passport, done && s.passportDone)}>
        <div className="flex items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
            className="group flex shrink-0 items-center gap-2 rounded-full py-1 pr-1 font-display text-base leading-none font-extrabold sm:text-lg"
          >
            <span aria-hidden className={s.booklet}>
              <span>KČT</span>
            </span>
            <span className="text-left">
              Turistický deník
              <span className="block text-xs font-bold tracking-wide text-gray-7 uppercase">
                {open ? 'zavřít' : 'otevřít'}
              </span>
            </span>
            <ChevronUp aria-hidden className={cn('size-5 transition-transform', !open && 'rotate-180')} />
          </button>

          {/* mini stamp strip - wide screens */}
          <ol className="hidden min-w-0 flex-1 items-center justify-center gap-[3px] md:flex" aria-label="Razítka">
            {CHAPTERS.map((c, i) => {
              const has = visited.includes(c.id)
              return (
                <li key={c.id} className="shrink-0">
                  <a
                    href={`#${c.id}`}
                    title={`${c.year} – ${c.title}`}
                    aria-label={`Zastávka ${i + 1}: ${c.year} – ${c.title}${has ? ' (orazítkováno)' : ''}`}
                    className={cn('block size-[26px] rounded-full transition-transform hover:scale-125 min-[1100px]:size-[34px]', !has && s.slot)}
                  >
                    {has ? (
                      <Stamp year={c.year} n={i + 1} color={stampInk(i)} className={s.stampIn} style={{ rotate: `${stampTilt(i)}deg` }} />
                    ) : (
                      <span aria-hidden className="grid size-full place-items-center text-[0.65rem] font-extrabold text-gray-6">
                        {i + 1}
                      </span>
                    )}
                  </a>
                </li>
              )
            })}
          </ol>

          <div className="ml-auto shrink-0 text-right leading-tight md:ml-0">
            <div className="font-display text-xl font-extrabold sm:text-2xl">
              {count}
              <span className="text-base text-gray-7">/{TOTAL}</span>
            </div>
            <div className="text-xs font-bold text-gray-7">{km.toLocaleString('cs-CZ', { minimumFractionDigits: 1 })} km z 40</div>
          </div>
        </div>
        {/* progress: a little red-marked trail */}
        <div aria-hidden className="relative mx-3 mb-2 h-2.5 rounded-full border-2 border-ink bg-cream sm:mx-4">
          <div className={s.progress} style={{ width: `${(count / TOTAL) * 100}%` }} />
        </div>

        <div id={panelId} hidden={!open} className="max-h-[55vh] overflow-y-auto border-t-2 border-dashed border-ink/25 px-3 pt-3 pb-4 sm:px-4">
          <p className="mb-3 text-sm text-gray-8">
            {done ? (
              <>Hotovo! Všech {TOTAL} razítek je v deníku. Dojdi do cíle pro certifikát.</>
            ) : (
              <>
                Razítko dostaneš na každé zastávce, kolem které projdeš. Klikni na razítko a vrátíš se k zastávce.
                {nextStop && <> Další zastávka: <strong>{nextStop.year}</strong>.</>}
              </>
            )}
          </p>
          <ol className="grid grid-cols-3 gap-x-2 gap-y-3 xs:grid-cols-4 sm:grid-cols-6 lg:grid-cols-9">
            {CHAPTERS.map((c, i) => {
              const has = visited.includes(c.id)
              return (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    onClick={() => setOpen(false)}
                    className="group flex flex-col items-center gap-1 rounded-xl p-1 text-center transition-colors hover:bg-sun-tint"
                  >
                    <span className={cn('block size-14 rounded-full sm:size-16', !has && s.slot)}>
                      {has ? (
                        <Stamp year={c.year} n={i + 1} color={stampInk(i)} style={{ rotate: `${stampTilt(i)}deg` }} />
                      ) : (
                        <span aria-hidden className="grid size-full place-items-center font-display text-lg font-extrabold text-gray-5">
                          ?
                        </span>
                      )}
                    </span>
                    <span className="text-[0.7rem] leading-tight font-bold text-gray-8">
                      <span className="block font-extrabold text-ink">{c.year}</span>
                      <span className="line-clamp-2">{c.title}</span>
                      <span className="sr-only">{has ? ' – orazítkováno' : ' – zatím bez razítka'}</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {announce(last, count)}
      </p>
    </aside>
  )
}
