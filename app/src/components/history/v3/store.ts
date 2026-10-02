/*
 * Tiny external store for the "Stezka časem" trail: which stops have been
 * stamped into the hiking passport and how far along the trail the hiker
 * is. The scroll controller writes, the passport and the certificate read
 * via `useSyncExternalStore`. Lives for the browser session only (no
 * storage), which is all a one-page walk needs.
 */
import { CHAPTERS } from '../story'

export type TrailSnapshot = {
  /** Stamped stop ids, always in trail order. */
  visited: readonly string[]
  /** The most recently stamped stop (for the aria-live announcement). */
  last: string | null
  /** Position on the trail mapped onto the real 40 km route. */
  km: number
}

const ORDER = new Map(CHAPTERS.map((c, i) => [c.id, i]))
const SERVER: TrailSnapshot = { visited: [], last: null, km: 0 }

let snapshot: TrailSnapshot = SERVER
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) {
    listener()
  }
}

export function subscribeTrail(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const getTrailSnapshot = () => snapshot
export const getServerTrailSnapshot = () => SERVER

/** Stamps every given stop that isn't stamped yet (stamps never come off). */
export function markVisited(ids: readonly string[]) {
  const fresh = ids.filter((id) => !snapshot.visited.includes(id))
  if (!fresh.length) {
    return
  }
  const visited = [...snapshot.visited, ...fresh].sort((a, b) => (ORDER.get(a) ?? 0) - (ORDER.get(b) ?? 0))
  snapshot = { ...snapshot, visited, last: fresh[fresh.length - 1] }
  emit()
}

export function setKm(km: number) {
  if (km === snapshot.km) {
    return
  }
  snapshot = { ...snapshot, km }
  emit()
}

const noop = () => () => {}
/** `true` once hydrated - for UI that only makes sense with JS. */
export const mountedStore = [noop, () => true, () => false] as const
