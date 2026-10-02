'use client'

import { useSyncExternalStore } from 'react'

const MINUTE = 60_000

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 15_000)
  return () => clearInterval(timer)
}

// Rounded to the minute so the snapshot stays referentially stable between ticks.
const getSnapshot = () => Math.floor(Date.now() / MINUTE) * MINUTE
const getServerSnapshot = () => null

/**
 * The visitor's current time (ms, minute precision), or `null` during SSR
 * and hydration - deadline/countdown widgets depend on the client clock, so
 * they render a placeholder until this is known.
 */
export function useNow(): Date | null {
  const ms = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return ms === null ? null : new Date(ms)
}
