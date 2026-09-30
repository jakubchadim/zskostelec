/**
 * The playful accent palette, as literal Tailwind class sets so the static
 * scanner picks every one of them up. Cards/tiles cycle through these by
 * index (`accentAt(i)`) so lists feel colourful without any content-side
 * configuration.
 */
export type Accent = {
  name: string
  /** Solid fill. */
  bg: string
  /** Light tint background. */
  tint: string
  /** Text colour readable on `tint`/paper. */
  text: string
  /** Solid fill as a `currentColor` for doodles. */
  fg: string
}

export const ACCENTS: Accent[] = [
  { name: 'sun', bg: 'bg-sun', tint: 'bg-sun-tint', text: 'text-[#8a5a00]', fg: 'text-sun' },
  { name: 'sky', bg: 'bg-sky', tint: 'bg-sky-tint', text: 'text-[#0f5fb3]', fg: 'text-sky' },
  { name: 'berry', bg: 'bg-berry', tint: 'bg-berry-tint', text: 'text-[#b3164a]', fg: 'text-berry' },
  { name: 'grass', bg: 'bg-grass', tint: 'bg-grass-tint', text: 'text-[#16784a]', fg: 'text-grass' },
  { name: 'grape', bg: 'bg-grape', tint: 'bg-grape-tint', text: 'text-[#5b2fc2]', fg: 'text-grape' },
  { name: 'tangerine', bg: 'bg-tangerine', tint: 'bg-tangerine-tint', text: 'text-primary-3', fg: 'text-tangerine' }
]

export function accentAt(index: number): Accent {
  return ACCENTS[((index % ACCENTS.length) + ACCENTS.length) % ACCENTS.length]
}

/** Stable accent for a string (e.g. a category name), so it keeps its colour across pages. */
export function accentFor(key: string): Accent {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0
  }
  return accentAt(Math.abs(hash))
}

/** Small alternating tilts for "stuck on the wall" layouts. */
const TILTS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-0', '-rotate-[1.5deg]']

export function tiltAt(index: number): string {
  return TILTS[index % TILTS.length]
}
