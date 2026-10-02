'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

const GAP = 14
/** Hover intent: the card only opens when the pointer rests on the word, not when it just passes over. */
const HOVER_DELAY = 350
const SM = 668 // the `sm` breakpoint (41.75em)

function subscribeNoop() {
  return () => {}
}

/**
 * Where the card goes: under the trigger when it fits, above it when there's room there,
 * otherwise as low as it can while staying fully on screen; a bottom sheet on phones.
 */
function placeCard(trigger: DOMRect, height: number, width: number): CSSProperties {
  const vw = window.innerWidth
  const vh = window.innerHeight
  if (vw < SM) {
    return { left: 16, right: 16, bottom: 16 }
  }
  const left = Math.min(Math.max(trigger.left + trigger.width / 2 - width / 2, 16), vw - 16 - width)
  if (trigger.bottom + GAP + height <= vh - 16) {
    return { left, top: trigger.bottom + GAP, width }
  }
  if (trigger.top - GAP - height >= 16) {
    return { left, top: trigger.top - GAP - height, width }
  }
  return { left, top: Math.max(16, vh - 16 - height), width }
}

type DoodlePopoverProps = {
  /** The inline trigger text. */
  children: ReactNode
  /** Card content (rendered inside a `sticker` frame). */
  card: ReactNode
  /** Accessible name of the card. */
  label: string
  /** Card width on tablets/desktop (px); phones get a bottom sheet. */
  width?: number
  triggerClassName?: string
}

/**
 * An inline word with a dotted underline that opens a little info card on
 * hover / focus / tap - "Kostelce nad Orlicí" in the hero, school buildings
 * in the text of the static pages. The card is portalled to <body> so
 * nothing (overflow, stacking, transforms) can clip or cover it; the
 * `town-card` / `is-open` classes drive the doodle animations in globals.css.
 */
export function DoodlePopover({ children, card, label, width = 352, triggerClassName }: DoodlePopoverProps) {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<CSSProperties>({})
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLSpanElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )

  const reposition = () => {
    if (trigger.current) {
      setStyle(placeCard(trigger.current.getBoundingClientRect(), cardRef.current?.offsetHeight || 520, width))
    }
  }
  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (openTimer.current) clearTimeout(openTimer.current)
    reposition()
    setOpen(true)
  }
  /** Mouse over the trigger: open after a short pause (instant if already open). */
  const showSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (open) return
    if (openTimer.current) clearTimeout(openTimer.current)
    openTimer.current = setTimeout(show, HOVER_DELAY)
  }
  const hideSoon = () => {
    if (openTimer.current) clearTimeout(openTimer.current)
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 160)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => {
      const target = e.target instanceof Node ? e.target : null
      if (target && !trigger.current?.contains(target) && !cardRef.current?.contains(target)) setOpen(false)
    }
    const onMove = () => {
      if (trigger.current) {
        setStyle(placeCard(trigger.current.getBoundingClientRect(), cardRef.current?.offsetHeight || 520, width))
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('resize', onMove)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onMove)
      window.removeEventListener('resize', onMove)
    }
  }, [open, width])

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? setOpen(false) : show())}
        onMouseEnter={showSoon}
        onMouseLeave={hideSoon}
        onFocus={show}
        onBlur={hideSoon}
        className={cn(
          'cursor-help text-left font-bold text-ink underline decoration-primary-1 decoration-dotted decoration-[3px] underline-offset-[5px] transition-colors hover:text-primary-3',
          triggerClassName
        )}
      >
        {children}
      </button>

      {mounted &&
        createPortal(
          <span
            ref={cardRef}
            id={id}
            role="dialog"
            aria-label={label}
            onMouseEnter={show}
            onMouseLeave={hideSoon}
            onFocus={show}
            onBlur={hideSoon}
            style={style}
            className={cn(
              'town-card fixed z-[60] block text-left text-base font-normal transition-[opacity,transform] duration-200',
              open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-2 opacity-0',
              open && 'is-open'
            )}
          >
            <span className="sticker block overflow-hidden">{card}</span>
          </span>,
          document.body
        )}
    </>
  )
}
