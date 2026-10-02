'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { Printer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SchoolMark } from '@/components/ui/school-logo'
import { CHAPTERS } from '../story'
import { KctMark, Stamp, stampInk, stampTilt } from './marks'
import { getServerTrailSnapshot, getTrailSnapshot, mountedStore, subscribeTrail } from './store'
import s from './trail.module.css'

const TOTAL = CHAPTERS.length
const CONFETTI_COLORS = ['#ffcf33', '#ff5c8a', '#3a9bff', '#2fbf71', '#8a5cf6', '#ff8a00', '#d6262c']

/**
 * "Certifikát poutníka" at the end of the trail. Locked (faded, with a
 * list of the missing stops) until every stamp is in the passport; then
 * it unlocks with confetti, takes the walker's name and can be printed.
 * Without JS it simply renders in full.
 */
export function Certificate() {
  const mounted = useSyncExternalStore(...mountedStore)
  const { visited } = useSyncExternalStore(subscribeTrail, getTrailSnapshot, getServerTrailSnapshot)
  const [name, setName] = useState('')
  const [party, setParty] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputId = useId()

  const complete = visited.length === TOTAL
  const locked = mounted && !complete
  const missing = CHAPTERS.filter((c) => !visited.includes(c.id))

  // Throw the confetti when the finished certificate scrolls into view.
  useEffect(() => {
    const node = ref.current
    if (!node || !complete) {
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setParty(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [complete])

  const shownName = name.trim()

  return (
    <div ref={ref} className="relative">
      {party && <Confetti />}

      {mounted && (
        <div className="mx-auto mb-6 flex max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:items-end print:hidden">
          <label htmlFor={inputId} className="flex-1">
            <span className="mb-1 block font-display font-bold">Jak se jmenuješ, poutníku?</span>
            <input
              id={inputId}
              type="text"
              value={name}
              maxLength={40}
              autoComplete="off"
              disabled={locked}
              onChange={(e) => setName(e.target.value)}
              placeholder="Napiš své jméno"
              className="w-full rounded-full border-[2.5px] border-ink bg-paper px-5 py-2.5 text-lg font-bold shadow-pop-sm outline-none placeholder:font-semibold placeholder:text-gray-5 focus-visible:shadow-pop disabled:opacity-50"
            />
          </label>
          <button
            type="button"
            disabled={locked}
            onClick={() => window.print()}
            className="btn bg-sun disabled:pointer-events-none disabled:opacity-50"
          >
            <Printer aria-hidden className="size-5" />
            Vytisknout
          </button>
        </div>
      )}

      <div className={cn(s.certificate, locked && s.certificateLocked)}>
        <div className={s.certificateInner}>
          <div className="flex items-center justify-center gap-3">
            <KctMark className="hidden w-9 shrink-0 xs:block" />
            <span className="text-center text-xs font-extrabold tracking-[0.2em] text-gray-7 uppercase sm:text-sm">Stezka časem · Kostelec nad Orlicí</span>
            <KctMark className="hidden w-9 shrink-0 xs:block" />
          </div>
          <h3 className="mt-3 text-center font-display text-[clamp(2rem,6vw,3.25rem)] leading-none font-extrabold text-primary-3">
            Certifikát poutníka
          </h3>
          <p className="mt-4 text-center text-gray-8">Tímto se potvrzuje, že</p>
          <p className={s.certName}>
            {shownName || <span className="font-sans text-base font-semibold text-gray-5 italic">sem patří tvoje jméno</span>}
          </p>
          <p className="mx-auto max-w-lg text-center text-gray-8">
            prošel(a) celou <strong className="text-ink">Stezkou časem</strong> – všech {TOTAL} zastávek z historie kosteleckých
            škol, od fary ve 14. století až po dnešní školu, která nese jméno pana Gutha-Jarkovského.
          </p>

          <ul aria-label="Sebraná razítka" className="mx-auto mt-6 grid max-w-xl grid-cols-6 gap-1 sm:grid-cols-9">
            {CHAPTERS.map((c, i) => (
              <li key={c.id} className="aspect-square">
                <span className="sr-only">
                  {c.year} – {c.title}
                </span>
                <Stamp year={c.year} n={i + 1} color={stampInk(i)} style={{ rotate: `${stampTilt(i)}deg` }} className={cn(locked && !visited.includes(c.id) && 'opacity-15 grayscale')} />
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div className="text-sm text-gray-7">
              <div className="font-display text-lg font-extrabold text-ink">40 km · {TOTAL} razítek</div>
              ZŠ Gutha-Jarkovského, Kostelec nad Orlicí
            </div>
            <div className="flex flex-col items-center">
              <SchoolMark outline="#1d2150" className="size-14 -rotate-6 sm:size-16" />
              <span className="mt-1 text-xs font-bold text-gray-7">pan Guth, průvodce</span>
            </div>
          </div>
        </div>

        {locked && (
          <div className={s.lockNote}>
            <p className="font-display text-xl font-extrabold">
              Chybí ještě {missing.length} {missing.length === 1 ? 'razítko' : missing.length < 5 ? 'razítka' : 'razítek'}
            </p>
            <p className="mt-1 text-sm text-gray-8">Projdi tyto zastávky a certifikát se odemkne:</p>
            <ul className="mt-2 flex flex-wrap justify-center gap-1.5">
              {missing.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="inline-block rounded-full border-2 border-ink bg-sun-tint px-2.5 py-0.5 text-sm font-bold hover:bg-sun">
                    {c.year}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {mounted && complete ? 'Certifikát poutníka je odemčený. Napiš své jméno a můžeš ho vytisknout.' : ''}
      </p>
    </div>
  )
}

function Confetti() {
  return (
    <div aria-hidden className={s.confetti}>
      {Array.from({ length: 60 }, (_, i) => {
        const style = {
          '--x': `${(i * 53) % 100}%`,
          '--d': `${(i % 7) * 0.12}s`,
          '--t': `${2.4 + ((i * 7) % 10) / 6}s`,
          '--r': `${((i * 97) % 720) - 360}deg`,
          '--drift': `${((i * 31) % 120) - 60}px`,
          background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          borderRadius: i % 3 === 0 ? '50%' : '2px'
        } as CSSProperties
        return <span key={i} style={style} />
      })}
    </div>
  )
}
