'use client'

import { useRef, useState } from 'react'
import { Headphones, Pause, Play, SkipBack, SkipForward, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHAPTERS } from '../story'
import manifest from './narration-audio.json'

type Segment = { id: string; src: string; duration: number | null }

const SEGMENTS = manifest.segments as Segment[]
const TOTAL = SEGMENTS.reduce((sum, s) => sum + (s.duration ?? 0), 0)

function titleFor(id: string): string {
  if (id === 'intro') return 'Úvod'
  if (id === 'outro') return 'Rady pana Gutha'
  const chapter = CHAPTERS.find((c) => c.id === id)
  return chapter ? `${chapter.year} · ${chapter.title}` : id
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/**
 * "Přehrát příběh": plays the narrated story segment by segment and scrolls
 * the page to each chapter as it starts, so the drawn town grows along with
 * the voice - you can just sit back and listen. `targets` maps segment ids
 * to element ids on the page (chapters use their own id).
 */
export function NarrationPlayer({ targets }: { targets: Record<string, string> }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [index, setIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const before = (i: number) => SEGMENTS.slice(0, i).reduce((sum, s) => sum + (s.duration ?? 0), 0)

  const scrollTo = (id: string) => {
    const el = document.getElementById(targets[id] ?? id)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  const start = (i: number) => {
    const el = audio.current
    if (!el || i < 0 || i >= SEGMENTS.length) return
    setIndex(i)
    el.src = SEGMENTS[i].src
    setElapsed(before(i))
    scrollTo(SEGMENTS[i].id)
    void el.play().then(
      () => setPlaying(true),
      () => setPlaying(false)
    )
  }

  const toggle = () => {
    const el = audio.current
    if (!el) return
    if (index === -1) return start(0)
    if (el.paused) {
      scrollTo(SEGMENTS[index].id)
      void el.play().then(() => setPlaying(true))
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  const stop = () => {
    audio.current?.pause()
    setPlaying(false)
    setIndex(-1)
    setElapsed(0)
  }

  const active = index !== -1
  const progress = TOTAL ? Math.min(1, elapsed / TOTAL) : 0

  return (
    <>
      <audio
        ref={audio}
        preload="none"
        onTimeUpdate={(e) => setElapsed(before(index) + e.currentTarget.currentTime)}
        onEnded={() => (index + 1 < SEGMENTS.length ? start(index + 1) : stop())}
      />

      {/* Big call to action in the hero. */}
      <button
        type="button"
        onClick={toggle}
        className="btn group mt-6 bg-sun py-3 pr-6 pl-3 text-lg"
        aria-label={playing ? 'Pozastavit vyprávění' : 'Přehrát celý příběh jako vyprávění'}
      >
        <span className="grid size-11 place-items-center rounded-full border-[2.5px] border-ink bg-paper transition-transform group-hover:scale-110">
          {playing ? <Pause className="size-5" aria-hidden /> : <Play className="size-5 translate-x-px" aria-hidden />}
        </span>
        <span className="text-left leading-tight">
          {playing ? 'Pozastavit vyprávění' : active ? 'Pokračovat ve vyprávění' : 'Přehrát příběh'}
          <span className="block text-sm font-semibold text-gray-7">
            <Headphones className="mr-1 inline size-4 align-[-3px]" aria-hidden />
            {fmt(TOTAL)} min · stačí poslouchat, stránka se posouvá sama
          </span>
        </span>
      </button>

      {/* Floating player while the story plays. */}
      <div
        role="region"
        aria-label="Přehrávač vyprávění"
        className={cn(
          'fixed inset-x-3 bottom-3 z-40 mx-auto max-w-xl transition-[opacity,transform] duration-300 sm:bottom-5',
          active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
        )}
        inert={!active}
      >
        <div className="sticker overflow-hidden bg-paper">
          <div className="flex items-center gap-2 p-2.5 sm:gap-3 sm:p-3">
            <button
              type="button"
              onClick={() => start(index - 1)}
              disabled={index <= 0}
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-ink bg-paper disabled:cursor-default disabled:opacity-40"
              aria-label="Předchozí kapitola"
            >
              <SkipBack className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={toggle}
              className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border-[2.5px] border-ink bg-sun shadow-pop-sm"
              aria-label={playing ? 'Pozastavit' : 'Přehrát'}
            >
              {playing ? <Pause className="size-5" aria-hidden /> : <Play className="size-5 translate-x-px" aria-hidden />}
            </button>
            <button
              type="button"
              onClick={() => start(index + 1)}
              disabled={index >= SEGMENTS.length - 1}
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-ink bg-paper disabled:cursor-default disabled:opacity-40"
              aria-label="Další kapitola"
            >
              <SkipForward className="size-4" aria-hidden />
            </button>
            <div className="min-w-0 flex-1" aria-live="polite">
              <p className="m-0 truncate font-display text-base leading-tight font-bold">
                {active ? titleFor(SEGMENTS[index].id) : ''}
              </p>
              <p className="m-0 text-xs font-semibold text-gray-6">
                {active ? `${index + 1} / ${SEGMENTS.length}` : ''} · {fmt(elapsed)} / {fmt(TOTAL)}
              </p>
            </div>
            <button
              type="button"
              onClick={stop}
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-cream"
              aria-label="Zavřít přehrávač"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="h-2 border-t-2 border-ink bg-gray-2">
            <div className="h-full bg-tangerine transition-[width] duration-300" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </>
  )
}
