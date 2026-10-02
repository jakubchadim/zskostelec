'use client'

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { ChevronLeft, ChevronRight, Download, Pause, Play, X, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewerSlide } from './build-slides'
import css from './photo-viewer.module.css'

const SLIDE_MS = 4000
const SWIPE_PX = 60
const ZOOM = 2.4

type PhotoViewerProps = {
  slides: ViewerSlide[]
  /** Open photo (0-based) or null when closed. */
  index: number | null
  onIndexChange: (index: number | null) => void
}

type Motion = 'open' | 'next' | 'prev'

/**
 * The gallery's full-screen photo viewer, in the site's sticker style: the
 * photo sits in a polaroid on a dotted night backdrop, with chunky round
 * buttons and a film strip of thumbnails. Swipe / arrow keys / buttons to
 * move, click the photo to zoom (move the pointer to look around), optional
 * slideshow. A native modal <dialog>, so focus trapping, Escape and focus
 * return come from the browser.
 */
export function PhotoViewer({ slides, index, onIndexChange }: PhotoViewerProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const film = useRef<HTMLOListElement>(null)
  const [motion, setMotion] = useState<Motion>('open')
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const [playing, setPlaying] = useState(false)
  const [dragX, setDragX] = useState(0)
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null)

  const open = index !== null
  const count = slides.length
  const slide = open ? slides[index] : null

  const go = (to: number, how: Motion) => {
    setMotion(how)
    setZoom(null)
    onIndexChange((to + count) % count)
  }
  const next = () => index !== null && go(index + 1, 'next')
  const prev = () => index !== null && go(index - 1, 'prev')
  // Close by clearing the index; the effect below then closes the native dialog.
  const close = () => {
    setPlaying(false)
    setZoom(null)
    setMotion('open')
    onIndexChange(null)
  }

  // Open/close the native dialog with the `index` prop; lock page scroll meanwhile.
  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (open && !el.open) {
      el.showModal()
      document.documentElement.style.overflow = 'hidden'
    }
    if (!open && el.open) {
      el.close()
      document.documentElement.style.overflow = ''
    }
  }, [open])

  // Escape fires `cancel`: route it through the same close (native listener - always delivered).
  useEffect(() => {
    const el = dialog.current
    if (!el) return
    const onCancel = (e: Event) => {
      e.preventDefault()
      setPlaying(false)
      setZoom(null)
      setMotion('open')
      onIndexChange(null)
    }
    el.addEventListener('cancel', onCancel)
    return () => el.removeEventListener('cancel', onCancel)
  }, [onIndexChange])

  // Keep the active frame of the film strip in view.
  useEffect(() => {
    if (index === null) return
    film.current?.children[index]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [index])

  // Preload the neighbours so moving feels instant.
  useEffect(() => {
    if (index === null || count < 2) return
    for (const i of [index + 1, index - 1]) {
      const s = slides[(i + count) % count]
      const img = new Image()
      if (s.srcSet) {
        img.sizes = '100vw'
        img.srcset = s.srcSet
      }
      img.src = s.src
    }
  }, [index, slides, count])

  // Slideshow: advance every SLIDE_MS while playing (restarts on manual moves).
  useEffect(() => {
    if (!playing || index === null) return
    const timer = setTimeout(() => {
      setMotion('next')
      setZoom(null)
      onIndexChange((index + 1) % count)
    }, SLIDE_MS)
    return () => clearTimeout(timer)
  }, [playing, index, count, onIndexChange])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') next()
    else if (e.key === 'ArrowLeft') prev()
    else if (e.key === 'Home') go(0, 'prev')
    else if (e.key === 'End') go(count - 1, 'next')
    else return
    e.preventDefault()
  }

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return
    drag.current = { x: e.clientX, y: e.clientY, moved: false }
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (zoom) {
      // Zoomed in: the pointer position picks which part of the photo is magnified.
      const img = e.currentTarget.querySelector('img')
      if (img) {
        const r = img.getBoundingClientRect()
        setZoom({
          x: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
          y: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100))
        })
      }
      return
    }
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 6) drag.current.moved = true
    if (e.pointerType !== 'mouse') setDragX(dx)
  }
  const onPointerUp = (e: ReactPointerEvent) => {
    const d = drag.current
    drag.current = null
    setDragX(0)
    if (!d || zoom) return
    const dx = e.clientX - d.x
    if (e.pointerType !== 'mouse' && Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(e.clientY - d.y)) {
      if (dx < 0) next()
      else prev()
    }
  }

  const toggleZoom = (e: React.MouseEvent<HTMLImageElement>) => {
    if (drag.current?.moved) return
    if (zoom) return setZoom(null)
    const r = e.currentTarget.getBoundingClientRect()
    setPlaying(false)
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  const roundBtn =
    'grid shrink-0 cursor-pointer place-items-center rounded-full border-[2.5px] border-ink text-ink shadow-pop-sm transition-transform hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-4 focus-visible:outline-sky'

  return (
    <dialog
      ref={dialog}
      aria-label="Prohlížení fotografií"
      className={css.dialog}
      onClose={() => {
        // Fallback if the dialog gets closed some other way (e.g. form method=dialog).
        document.documentElement.style.overflow = ''
        if (index !== null) close()
      }}
      onKeyDown={onKeyDown}
    >
      {slide && index !== null && (
        // autoFocus: the dialog focuses this instead of the first button (no stray focus ring on open).
        <div className="flex h-full flex-col outline-none" tabIndex={-1} autoFocus>
          {/* Top bar: counter, slideshow, download, close. */}
          <div className="relative flex items-center gap-2 px-3 pt-3 sm:gap-3 sm:px-5 sm:pt-4">
            <span className="rounded-full border-[2.5px] border-ink bg-sun px-3 py-1 font-display text-base font-extrabold text-ink shadow-pop-sm sm:text-lg">
              {index + 1} <span className="font-bold opacity-60">/ {count}</span>
            </span>
            <span className="sr-only" aria-live="polite">
              Fotografie {index + 1} z {count}
            </span>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {count > 1 && (
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  className={cn(roundBtn, 'size-10 sm:size-11', playing ? 'bg-grass' : 'bg-paper')}
                  aria-label={playing ? 'Zastavit prezentaci' : 'Spustit prezentaci'}
                  aria-pressed={playing}
                >
                  {playing ? <Pause className="size-5" aria-hidden /> : <Play className="size-5 translate-x-px" aria-hidden />}
                </button>
              )}
              <button
                type="button"
                onClick={() => setZoom((z) => (z ? null : { x: 50, y: 50 }))}
                className={cn(roundBtn, 'hidden size-11 bg-paper sm:grid')}
                aria-label={zoom ? 'Oddálit' : 'Přiblížit'}
              >
                {zoom ? <ZoomOut className="size-5" aria-hidden /> : <ZoomIn className="size-5" aria-hidden />}
              </button>
              <a
                href={slide.src}
                target="_blank"
                rel="noopener noreferrer"
                download
                className={cn(roundBtn, 'size-10 bg-paper sm:size-11')}
                aria-label="Stáhnout fotografii"
              >
                <Download className="size-5" aria-hidden />
              </a>
              <button type="button" onClick={close} className={cn(roundBtn, 'size-10 bg-berry sm:size-11')} aria-label="Zavřít">
                <X className="size-6" aria-hidden />
              </button>
            </div>
            {playing && (
              <span
                key={index}
                aria-hidden
                className={cn(css.timer, 'absolute inset-x-3 -bottom-2 h-1 rounded-full bg-sun sm:inset-x-5')}
                style={{ '--slide-ms': `${SLIDE_MS}ms` } as React.CSSProperties}
              />
            )}
          </div>

          {/* Stage: the polaroid, prev/next, swipe area. */}
          <div
            className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-3 py-4 select-none sm:px-24"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              drag.current = null
              setDragX(0)
            }}
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            {count > 1 && (
              <button
                type="button"
                onClick={prev}
                className={cn(roundBtn, 'absolute top-1/2 left-2 z-10 hidden size-14 -translate-y-1/2 bg-paper sm:grid hover:-translate-y-[calc(50%+2px)]')}
                aria-label="Předchozí fotografie"
              >
                <ChevronLeft className="size-7" aria-hidden />
              </button>
            )}

            <figure
              key={index}
              className={cn(
                'm-0 flex max-h-full max-w-full flex-col rounded-[4px] border-[2.5px] border-ink bg-paper p-2 pb-0 shadow-[7px_7px_0_0_#000] sm:p-3 sm:pb-0',
                motion === 'next' ? css.photoNext : motion === 'prev' ? css.photoPrev : css.photoOpen
              )}
              style={{
                transform: dragX ? `translateX(${dragX}px) rotate(${dragX / 40}deg)` : index % 2 ? 'rotate(0.6deg)' : 'rotate(-0.6deg)',
                transition: dragX ? 'none' : 'transform 0.25s ease'
              }}
            >
              <ViewerImage slide={slide} index={index} zoom={zoom} onClick={toggleZoom} />
              <figcaption className="flex min-h-11 items-center justify-between gap-3 px-1 py-2 font-display text-sm font-bold text-ink sm:min-h-12 sm:text-base">
                <span className="truncate">{slide.alt || `Fotka č. ${index + 1}`}</span>
                <span className="shrink-0 text-xs font-semibold text-gray-6 sm:text-sm">
                  <span className="sm:hidden">klepni pro </span>
                  <span className="hidden sm:inline">klikni pro </span>
                  {zoom ? 'oddálení' : 'přiblížení'}
                </span>
              </figcaption>
            </figure>

            {count > 1 && (
              <button
                type="button"
                onClick={next}
                className={cn(roundBtn, 'absolute top-1/2 right-2 z-10 hidden size-14 -translate-y-1/2 bg-sun sm:grid hover:-translate-y-[calc(50%+2px)]')}
                aria-label="Další fotografie"
              >
                <ChevronRight className="size-7" aria-hidden />
              </button>
            )}
          </div>

          {/* Phones: prev/next under the photo, thumb-friendly. */}
          {count > 1 && (
            <div className="flex items-center justify-center gap-6 pb-2 sm:hidden">
              <button type="button" onClick={prev} className={cn(roundBtn, 'size-12 bg-paper')} aria-label="Předchozí fotografie">
                <ChevronLeft className="size-6" aria-hidden />
              </button>
              <span className="text-xs font-semibold text-white-1/60">nebo přejeďte prstem</span>
              <button type="button" onClick={next} className={cn(roundBtn, 'size-12 bg-sun')} aria-label="Další fotografie">
                <ChevronRight className="size-6" aria-hidden />
              </button>
            </div>
          )}

          {/* Film strip. */}
          {count > 1 && (
            <ol
              ref={film}
              aria-label="Všechny fotografie"
              className={cn(css.film, 'm-0 flex shrink-0 list-none gap-2 overflow-x-auto px-[50vw] py-4')}
            >
              {slides.map((s, i) => (
                <li key={`${s.src}-${i}`} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => go(i, i > index ? 'next' : 'prev')}
                    aria-label={`Fotografie ${i + 1}`}
                    aria-current={i === index ? 'true' : undefined}
                    className={cn(
                      'block size-12 cursor-pointer overflow-hidden rounded-md border-2 transition-all sm:size-14',
                      i === index ? 'scale-110 border-sun ring-2 ring-sun' : 'border-transparent opacity-55 hover:opacity-100'
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- WP-sized thumbs, already small */}
                    <img src={s.thumb} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </dialog>
  )
}

/** The big photo: shimmer until loaded, srcset for sharpness, CSS zoom around the pointer. */
function ViewerImage({
  slide,
  index,
  zoom,
  onClick
}: {
  slide: ViewerSlide
  index: number
  zoom: { x: number; y: number } | null
  onClick: (e: React.MouseEvent<HTMLImageElement>) => void
}) {
  const [loaded, setLoaded] = useState(false)
  const ratio = slide.width && slide.height ? slide.width / slide.height : 4 / 3

  return (
    <div
      className={cn('relative overflow-hidden', !loaded && css.shimmer)}
      // Fit the photo inside the stage: header (~4rem), caption, film strip, phone buttons.
      style={{
        aspectRatio: String(ratio),
        // 100vw minus stage padding, polaroid padding and borders.
        width: `min(calc(100vw - 4rem), calc((100dvh - var(--viewer-chrome, 15.5rem)) * ${ratio}))`,
        maxWidth: slide.width ? `${slide.width}px` : undefined
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- WP variants via srcset; next/image would re-encode them */}
      <img
        src={slide.src}
        srcSet={slide.srcSet}
        sizes="100vw"
        alt={slide.alt || `Fotografie ${index + 1}`}
        draggable={false}
        onLoad={() => setLoaded(true)}
        ref={(img) => {
          // Cached images can finish before React attaches onLoad.
          if (img?.complete && img.naturalWidth > 0 && !loaded) setLoaded(true)
        }}
        onClick={onClick}
        className={cn(
          'block h-full w-full object-contain transition-[opacity,transform] duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
        )}
        style={zoom ? { transform: `scale(${ZOOM})`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
      />
    </div>
  )
}
