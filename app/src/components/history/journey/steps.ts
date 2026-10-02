import { CHAPTERS, type Chapter, type SceneKey } from '../story'

/*
 * Scroll "steps" of the Cesta časem story: 0 = the opening hero (empty dawn
 * valley), chapter i = step i + 1, so the last chapter is also the final,
 * fully built town. Every drawn element of the town declares the step it
 * appears at (and optionally the last step it stays for) - see town.tsx.
 */

export const LAST_STEP = CHAPTERS.length

/** Step at which a chapter's scene first shows up. */
export function stepOf(scene: SceneKey): number {
  const index = CHAPTERS.findIndex((chapter) => chapter.scene === scene)
  return index < 0 ? LAST_STEP : index + 1
}

/** Step of a chapter by its id (for scenes shared by several chapters, e.g. the boy). */
export function stepOfId(id: string): number {
  const index = CHAPTERS.findIndex((chapter) => chapter.id === id)
  return index < 0 ? LAST_STEP : index + 1
}

/**
 * Where the "camera" looks (viewBox units of the 1000x800 town) when a
 * scene is active, so the newly drawn bit stays in frame on small screens.
 */
export const FOCUS: Record<SceneKey, [number, number]> = {
  church: [535, 540],
  brethren: [360, 590],
  cantor: [540, 600],
  firstSchool: [430, 590],
  lhota: [95, 520],
  mainSchool: [710, 580],
  boy: [520, 720],
  square45: [300, 640],
  olympics: [800, 250],
  realka: [140, 620],
  skala: [815, 620],
  castle: [250, 470],
  trail: [820, 560],
  masaryk: [450, 660],
  dream: [650, 620],
  today: [650, 650]
}

/**
 * The four odometer reels for a chapter's year: real years roll to their
 * digits, eras get honest question marks ("13??" = the 1300s = 14th century),
 * and "Dnes" is resolved to the current year on the client.
 */
export function reelsFor(chapter: Chapter): string {
  if (/^\d{4}$/.test(chapter.year)) {
    return chapter.year
  }
  if (chapter.scene === 'today') {
    return 'now'
  }
  if (/stol/.test(chapter.year)) {
    return `${String(chapter.sortYear).slice(0, 2)}??`
  }
  return '????'
}

/** The chapter's year as a short stamp under the odometer, for eras that aren't a plain year. */
export function stampFor(chapter: Chapter): string {
  return /^\d{4}$/.test(chapter.year) ? '' : chapter.year
}
