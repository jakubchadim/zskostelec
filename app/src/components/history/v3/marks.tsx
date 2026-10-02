import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/*
 * Trail furniture: the KČT paint mark, the "naučná stezka" mark, the
 * rubber stamp, the wooden year sign and the hidden shared <defs>.
 * All decorative (aria-hidden); the real text lives next to them.
 */

export const KCT_RED = '#d6262c'
export const WOOD = '#b9783f'
export const WOOD_DARK = '#8a5427'

/** Ink colours for rubber stamps (darker than the accents so they read as ink). */
export const STAMP_INKS = ['#c62f3a', '#0f5fb3', '#16784a', '#5b2fc2', '#b35300', '#b3164a']

export function stampInk(index: number) {
  return STAMP_INKS[index % STAMP_INKS.length]
}

/** Slight, stable rotation for stamp number `index`. */
export function stampTilt(index: number) {
  return ((index * 37) % 26) - 13
}

/**
 * Shared SVG defs (ink-texture filter, circular text path). Rendered once
 * per page; every stamp references them by id.
 */
export function TrailDefs() {
  return (
    <svg aria-hidden focusable={false} width="0" height="0" className="pointer-events-none absolute">
      <defs>
        <filter id="v3-ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.2 2.55" result="speckle" />
          <feComposite in="SourceGraphic" in2="speckle" operator="in" result="inked" />
          <feDisplacementMap in="inked" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <path id="v3-ring" d="M 14.5 60 A 45.5 45.5 0 1 1 105.5 60 A 45.5 45.5 0 1 1 14.5 60" />
      </defs>
    </svg>
  )
}

/** Czech hiking club mark: red stripe between two white ones. */
export function KctMark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 30 21" aria-hidden focusable={false} className={cn('block', className)} style={style}>
      <rect x="1.25" y="1.25" width="27.5" height="18.5" rx="2" fill="#fff" stroke="#1d2150" strokeWidth="2.5" />
      <rect x="2.5" y="7.6" width="25" height="5.8" fill={KCT_RED} />
    </svg>
  )
}

/** "Naučná stezka" (educational trail) mark: white square, green diagonal. */
export function NaucnaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable={false} className={cn('block', className)}>
      <rect x="1.25" y="1.25" width="21.5" height="21.5" rx="2.5" fill="#fff" stroke="#1d2150" strokeWidth="2.5" />
      <path d="M2.5 16.6 L16.6 2.5 H21.5 V7.4 L7.4 21.5 H2.5 Z" fill="#16784a" />
    </svg>
  )
}

type StampProps = {
  year: string
  /** 1-based stop number. */
  n: number
  color: string
  className?: string
  style?: CSSProperties
}

/** Round rubber "razítko" with an inky texture. */
export function Stamp({ year, n, color, className, style }: StampProps) {
  const yearSize = year.length <= 4 ? 31 : year.length <= 7 ? 21 : 16
  return (
    <svg viewBox="0 0 120 120" aria-hidden focusable={false} className={cn('block', className)} style={style}>
      <g filter="url(#v3-ink)">
        <circle cx="60" cy="60" r="55" fill="none" stroke={color} strokeWidth="4.5" />
        <circle cx="60" cy="60" r="38.5" fill="none" stroke={color} strokeWidth="2" />
        <text fill={color} fontSize="10.5" fontWeight="800" fontFamily="var(--font-body)" letterSpacing="0.5">
          <textPath href="#v3-ring" textLength="280" lengthAdjust="spacing">
            STEZKA ČASEM ✦ KOSTELEC N. O. ✦
          </textPath>
        </text>
        <text
          x="60"
          y={60 + yearSize * 0.32}
          textAnchor="middle"
          fill={color}
          fontSize={yearSize}
          fontWeight="800"
          fontFamily="var(--font-display)"
        >
          {year}
        </text>
        <path d="M44 41 H76" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
        <text x="60" y="88" textAnchor="middle" fill={color} fontSize="10" fontWeight="800" fontFamily="var(--font-body)">
          č. {n}
        </text>
      </g>
    </svg>
  )
}

/** Hanging wooden plank with a carved year. */
export function WoodSign({ year, className }: { year: string; className?: string }) {
  const long = year.length > 5
  return (
    <span aria-hidden className={cn('relative inline-block', className)}>
      {/* the two ropes */}
      <span className="absolute -top-3 left-[22%] h-4 w-[2.5px] -rotate-12 rounded bg-ink" />
      <span className="absolute -top-3 right-[22%] h-4 w-[2.5px] rotate-12 rounded bg-ink" />
      <span
        className={cn(
          'relative block rounded-[10px] border-[2.5px] border-ink px-4 pt-0.5 pb-0 font-display leading-[1.25] font-extrabold tracking-wide text-[#fff6e6] shadow-pop-sm',
          long ? 'text-[1.35rem]' : 'text-[1.75rem]'
        )}
        style={{
          backgroundColor: WOOD,
          backgroundImage:
            'repeating-linear-gradient(176deg, transparent 0 7px, rgba(90,50,15,0.22) 7px 8.5px, transparent 8.5px 15px), linear-gradient(180deg, rgba(255,255,255,0.18), transparent 40%)',
          textShadow: '0 2px 0 rgba(70,35,8,0.55)'
        }}
      >
        {year}
        {/* nail heads */}
        <span className="absolute top-1.5 left-1.5 size-[5px] rounded-full bg-[#5a3412]" />
        <span className="absolute top-1.5 right-1.5 size-[5px] rounded-full bg-[#5a3412]" />
      </span>
    </span>
  )
}
