'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, MapPin, Maximize2, Navigation, Users, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACCENT_HEX, type WorkplaceKey, type WorkplaceWithLive } from './data'

const TownScene = dynamic(() => import('./town-scene'), {
  ssr: false,
  loading: () => <SceneLoading />
})

function SceneLoading() {
  return (
    <div className="grid h-full place-items-center">
      <div className="flex flex-col items-center gap-3 font-display font-bold text-gray-7">
        <span className="size-10 animate-spin rounded-full border-4 border-sky-tint border-t-sky" />
        Stavíme Kostelec…
      </div>
    </div>
  )
}

// WebGL + reduced-motion detection (client only, SSR-safe defaults).
function subscribeNoop() {
  return () => {}
}
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}
function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

// The selected building lives in the URL hash (#palackeho), so a building can be linked/shared.
// replaceState doesn't fire `hashchange`, so local subscribers are notified by hand.
const hashListeners = new Set<() => void>()
function subscribeHash(cb: () => void) {
  hashListeners.add(cb)
  window.addEventListener('hashchange', cb)
  return () => {
    hashListeners.delete(cb)
    window.removeEventListener('hashchange', cb)
  }
}
function readHash(): string {
  return decodeURIComponent(window.location.hash.slice(1))
}
function writeHash(key: string | null) {
  const url = key ? `#${key}` : window.location.pathname + window.location.search
  window.history.replaceState(window.history.state, '', url)
  hashListeners.forEach((cb) => cb())
}

const ACCENT_TINT: Record<WorkplaceWithLive['accent'], string> = {
  berry: 'bg-berry-tint',
  sky: 'bg-sky-tint',
  grass: 'bg-grass-tint',
  grape: 'bg-grape-tint'
}

const ACCENT_TEXT: Record<WorkplaceWithLive['accent'], string> = {
  berry: 'text-[#b3164a]',
  sky: 'text-[#0f5fb3]',
  grass: 'text-[#16784a]',
  grape: 'text-[#5b2fc2]'
}

function staffLabel(count: number): string {
  if (count === 1) return '1 člověk'
  if (count >= 2 && count <= 4) return `${count} lidé`
  return `${count} lidí`
}

function mapyUrl(address: string): string {
  return `https://mapy.cz/zakladni?q=${encodeURIComponent(`${address}, Kostelec nad Orlicí`)}`
}

function InfoPanel({
  workplace,
  index,
  total,
  onClose,
  onStep
}: {
  workplace: WorkplaceWithLive
  index: number
  total: number
  onClose: () => void
  onStep: (dir: 1 | -1) => void
}) {
  const accent = ACCENT_HEX[workplace.accent]

  return (
    <article
      aria-labelledby={`pracoviste-${workplace.key}`}
      className="sticker relative flex max-h-full animate-pop-in flex-col overflow-hidden"
    >
      {workplace.photo ? (
        <div className="relative aspect-[16/9] shrink-0 overflow-hidden border-b-[2.5px] border-ink bg-gray-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- WP media, no image optimizer in front of this app */}
          <img
            src={workplace.photo}
            alt={`${workplace.name} – ${workplace.address}`}
            className="h-full w-full object-cover"
          />
          <span
            className="absolute top-3 left-3 grid size-9 place-items-center rounded-full border-2 border-ink font-display font-extrabold"
            style={{ background: accent }}
          >
            {index + 1}
          </span>
        </div>
      ) : (
        <div className={cn('h-3 shrink-0', ACCENT_TINT[workplace.accent])} />
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label="Zpět na celé město"
        className="absolute top-3 right-3 grid size-9 place-items-center rounded-full border-2 border-ink bg-paper shadow-pop-sm transition-transform hover:rotate-90"
      >
        <X className="size-5" aria-hidden />
      </button>

      <div className="min-h-0 overflow-y-auto p-5">
        <h2 id={`pracoviste-${workplace.key}`} className="text-2xl">
          {workplace.name}
        </h2>
        <p className="mt-1 mb-0 flex items-center gap-1.5 font-semibold text-gray-7">
          <MapPin className="size-4 shrink-0" aria-hidden />
          {workplace.address}
        </p>

        <ul className="m-0 mt-4 flex list-none flex-wrap gap-1.5 p-0">
          {workplace.roles.map((role) => (
            <li
              key={role}
              className={cn(
                'rounded-full border-2 border-ink px-3 py-0.5 text-sm font-extrabold',
                ACCENT_TINT[workplace.accent]
              )}
            >
              {role}
            </li>
          ))}
        </ul>

        {workplace.hours && (
          <p className="mt-4 mb-0 flex items-center gap-2 font-bold">
            <Clock className={cn('size-4', ACCENT_TEXT[workplace.accent])} aria-hidden />
            {workplace.hours}
          </p>
        )}

        <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
          {workplace.facts.map((fact) => (
            <li key={fact} className="flex gap-2.5 text-[0.95rem] leading-snug text-gray-8">
              <span
                aria-hidden
                className="mt-1.5 size-2.5 shrink-0 rounded-full border-2 border-ink"
                style={{ background: accent }}
              />
              {fact}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          {workplace.staffCount > 0 && (
            <Link
              href={workplace.buildingId != null ? `/zamestnanci/?pracoviste=${workplace.buildingId}` : '/zamestnanci/'}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-3 py-1.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
            >
              <Users className="size-4" aria-hidden />
              Kdo tu pracuje ({staffLabel(workplace.staffCount)})
            </Link>
          )}
          <a
            href={mapyUrl(workplace.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
          >
            <Navigation className="size-4" aria-hidden />
            Navigovat
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between border-t-2 border-dashed border-gray-3 px-5 py-3">
        <button
          type="button"
          onClick={() => onStep(-1)}
          className="inline-flex items-center gap-1 font-display font-bold hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Předchozí
        </button>
        <span className="text-sm font-bold text-gray-6">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={() => onStep(1)}
          className="inline-flex items-center gap-1 font-display font-bold hover:underline"
        >
          Další
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </article>
  )
}

/**
 * Interactive "where we are" page: a 3D toy model of Kostelec nad Orlicí
 * with the four school buildings, an info panel for the selected one, and
 * a card list underneath (which is also the accessible / no-WebGL way to
 * browse the buildings).
 */
export function WorkplacesExplorer({ workplaces, mapUrl }: { workplaces: WorkplaceWithLive[]; mapUrl: string | null }) {
  const hash = useSyncExternalStore(subscribeHash, readHash, () => '')
  const selected = workplaces.some((w) => w.key === hash) ? (hash as WorkplaceKey) : null
  const setSelected = (key: WorkplaceKey | null) => writeHash(key)
  const [showMap, setShowMap] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const webgl = useSyncExternalStore(subscribeNoop, hasWebGL, () => true)
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  )

  const index = workplaces.findIndex((w) => w.key === selected)
  const current = index === -1 ? null : workplaces[index]

  const select = (key: WorkplaceKey | null) => setSelected(key)
  const step = (dir: 1 | -1) => {
    const next = (Math.max(index, 0) + dir + workplaces.length) % workplaces.length
    setSelected(workplaces[next].key)
  }

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  const pickFromCard = (key: WorkplaceKey) => {
    setSelected(key)
    stage.current?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start'
    })
  }

  return (
    <div>
      <div ref={stage} className="relative scroll-mt-24">
        <div className="relative h-[60vh] min-h-[24rem] overflow-hidden rounded-[2rem] border-[2.5px] border-ink bg-sky-tint shadow-pop-lg md:h-[78vh] md:max-h-[50rem]">
          {webgl && !showMap ? (
            <TownScene workplaces={workplaces} selected={selected} onSelect={select} reducedMotion={reducedMotion} />
          ) : mapUrl ? (
            <div className="relative h-full overflow-auto bg-paper">
              <div className="relative min-w-[56rem]">
                {/* eslint-disable-next-line @next/next/no-img-element -- WP media */}
                <img
                  src={mapUrl}
                  alt="Mapa Kostelce nad Orlicí s vyznačenými budovami školy"
                  className="block w-full"
                />
                {workplaces.map((w, i) => (
                  <button
                    key={w.key}
                    type="button"
                    onClick={() => select(w.key)}
                    className="absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-ink font-display font-extrabold shadow-pop-sm transition-transform hover:scale-110"
                    style={{
                      left: `${w.mapX}%`,
                      top: `${w.mapY}%`,
                      background: ACCENT_HEX[w.accent]
                    }}
                    aria-label={`${w.name}, ${w.address}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Hint / controls overlay */}
          {!current && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-4">
              <p className="m-0 rounded-full border-2 border-ink bg-paper/95 px-4 py-2 text-center text-sm font-bold shadow-pop-sm">
                {webgl && !showMap ? (
                  <>
                    Klikněte na budovu
                    <span className="max-sm:hidden"> · tažením otáčíte · kolečkem přibližujete</span>
                  </>
                ) : (
                  'Klikněte na číslo budovy'
                )}
              </p>
            </div>
          )}

          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
            {current && (
              <button
                type="button"
                onClick={() => select(null)}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-bold shadow-pop-sm hover:-translate-y-0.5"
              >
                <Maximize2 className="size-4" aria-hidden />
                Celé město
              </button>
            )}
            {webgl && mapUrl && (
              <button
                type="button"
                onClick={() => setShowMap((value) => !value)}
                aria-pressed={showMap}
                className="rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-bold shadow-pop-sm hover:-translate-y-0.5"
              >
                {showMap ? '3D model' : 'Klasická mapa'}
              </button>
            )}
          </div>

          {/* Desktop: panel floats over the scene. */}
          {current && (
            <div className="absolute top-4 right-4 bottom-4 z-20 hidden w-[23rem] md:flex">
              <InfoPanel
                workplace={current}
                index={index}
                total={workplaces.length}
                onClose={() => select(null)}
                onStep={step}
              />
            </div>
          )}
        </div>

        {/* Mobile: panel under the scene. */}
        {current && (
          <div className="mt-5 md:hidden">
            <InfoPanel
              workplace={current}
              index={index}
              total={workplaces.length}
              onClose={() => select(null)}
              onStep={step}
            />
          </div>
        )}
      </div>

      <h2 className="mt-14 mb-6">Všechny naše budovy</h2>
      <ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {workplaces.map((w, i) => (
          <li key={w.key}>
            <button
              type="button"
              onClick={() => pickFromCard(w.key)}
              aria-pressed={selected === w.key}
              className={cn(
                'sticker hover-lift flex h-full w-full flex-col overflow-hidden text-left',
                selected === w.key && 'ring-4 ring-sky'
              )}
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden border-b-[2.5px] border-ink bg-gray-3">
                {w.photo && (
                  // eslint-disable-next-line @next/next/no-img-element -- WP media
                  <img src={w.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
                )}
                <span
                  className="absolute top-3 left-3 grid size-9 place-items-center rounded-full border-2 border-ink font-display font-extrabold"
                  style={{ background: ACCENT_HEX[w.accent] }}
                >
                  {i + 1}
                </span>
              </span>
              <span className="flex flex-1 flex-col p-4">
                <span className="font-display text-xl font-bold">{w.name}</span>
                <span className="text-sm font-semibold text-gray-7">{w.address}</span>
                <span className={cn('mt-3 text-sm font-extrabold', ACCENT_TEXT[w.accent])}>{w.roles.join(' · ')}</span>
                <span className="mt-auto pt-3 font-display font-bold">Ukázat na mapě →</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
