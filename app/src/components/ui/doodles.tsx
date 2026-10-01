import type { SVGProps } from 'react'

/**
 * Hand-drawn-looking decorative SVGs. All purely decorative (`aria-hidden`),
 * coloured via `currentColor` unless noted, sized via `className`.
 */

type DoodleProps = SVGProps<SVGSVGElement>

const base = { 'aria-hidden': true, focusable: false } as const

export function Star({ ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" {...base} {...props}>
      <path
        d="M24 3.5l5.8 12.9 14 1.4-10.5 9.4 3 13.8L24 34l-12.3 7 3-13.8L4.2 17.8l14-1.4z"
        fill="currentColor"
        stroke="var(--color-ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Sparkle({ ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path
        d="M20 2c1.5 9 4 13.5 16 18-12 4.5-14.5 9-16 18-1.5-9-4-13.5-16-18 12-4.5 14.5-9 16-18z"
        fill="currentColor"
        stroke="var(--color-ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Squiggle({ ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 24" fill="none" {...base} {...props}>
      <path
        d="M4 14c10-14 18 10 28 0s18-14 28 0 18 10 28 0 18-12 28 0"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Circle({ ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <circle cx="20" cy="20" r="16" fill="currentColor" stroke="var(--color-ink)" strokeWidth="2.5" />
    </svg>
  )
}

export function Zigzag({ ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 24" fill="none" {...base} {...props}>
      <path
        d="M3 18L15 6l12 12L39 6l12 12L63 6l12 12"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PaperPlane({ ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" {...base} {...props}>
      <path
        d="M5 29L58 7 46 55 31 40 5 29z"
        fill="var(--color-paper)"
        stroke="var(--color-ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M58 7L31 40l-2 16 9-11" fill="currentColor" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  )
}

export function Pencil({ ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" {...base} {...props}>
      <g stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M44 6l14 14-34 34-14 0 0-14z" fill="currentColor" />
        <path d="M10 40l14 14" fill="none" />
        <path d="M10 40L6 58l18-4" fill="var(--color-tangerine-tint)" />
        <path d="M6 58l3.5-7.5 4 4z" fill="var(--color-ink)" />
        <path d="M38 12l14 14" fill="none" />
        <path d="M44 6l14 14 3-3a4 4 0 000-6l-8-8a4 4 0 00-6 0z" fill="var(--color-berry)" />
      </g>
    </svg>
  )
}

export function Sun({ ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 80" {...base} {...props}>
      <g stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round">
        {Array.from({ length: 10 }, (_, i) => {
          const angle = (i * Math.PI * 2) / 10
          const x1 = 40 + Math.cos(angle) * 26
          const y1 = 40 + Math.sin(angle) * 26
          const x2 = 40 + Math.cos(angle) * 36
          const y2 = 40 + Math.sin(angle) * 36
          return <line key={i} x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)} />
        })}
        <circle cx="40" cy="40" r="19" fill="currentColor" />
      </g>
      <circle cx="33.5" cy="37" r="2.2" fill="var(--color-ink)" />
      <circle cx="46.5" cy="37" r="2.2" fill="var(--color-ink)" />
      <path d="M33 45q7 6 14 0" fill="none" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function Cloud({ ...props }: DoodleProps) {
  return (
    // Padded viewBox: the arcs of the outline poke above y=0, which clipped the cloud tops.
    <svg viewBox="-6 -16 132 82" overflow="visible" {...base} {...props}>
      <path
        d="M28 56h66a20 20 0 002-40 26 26 0 00-48-6 18 18 0 00-26 14A16 16 0 0028 56z"
        fill="currentColor"
        stroke="var(--color-ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Blob({ ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 200" {...base} {...props}>
      <path
        d="M45.3,-58.5C57.5,-47.2,65.1,-31.4,69.2,-14.3C73.3,2.8,73.9,21.2,65.6,34.5C57.4,47.8,40.2,56,22.6,62.7C5,69.4,-13.1,74.6,-30,70.2C-46.9,65.8,-62.7,51.8,-70.3,34.6C-77.9,17.4,-77.4,-3,-70.4,-19.9C-63.5,-36.8,-50.1,-50.2,-35.4,-60.9C-20.7,-71.6,-4.8,-79.6,9.8,-77.6C24.4,-75.6,33.1,-69.8,45.3,-58.5Z"
        transform="translate(100 100)"
        fill="currentColor"
      />
    </svg>
  )
}

export function Rocket({ ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" {...base} {...props}>
      <g stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M24 44l-8 12 14-4z" fill="var(--color-tangerine)" />
        <path d="M40 44l8 12-14-4z" fill="var(--color-tangerine)" />
        <path d="M32 4c10 8 14 22 10 42H22C18 26 22 12 32 4z" fill="currentColor" />
        <circle cx="32" cy="24" r="6" fill="var(--color-sky-tint)" />
        <path d="M27 46l5 12 5-12z" fill="var(--color-sun)" />
      </g>
    </svg>
  )
}

/** Wavy edge between sections. Colour = the section BELOW (via currentColor). */
export function WaveEdge({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden
      focusable={false}
      className={className}
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <path
        d="M0 32c120-26 240-26 360 0s240 26 360 0 240-26 360 0 240 26 360 0v28H0z"
        fill="currentColor"
      />
    </svg>
  )
}
