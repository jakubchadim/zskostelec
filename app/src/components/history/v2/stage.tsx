'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import styles from './comic.module.css'

/**
 * The comic "book": arms the pop-in animation and flags each [data-panel]
 * with [data-in] as it scrolls into view. Server-rendered children stay
 * fully visible without JS, and with prefers-reduced-motion the book is
 * never armed at all.
 */
export function ComicStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      return
    }

    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-panel]'))
    // Whatever is already on screen stays put (no flash); the rest waits.
    for (const panel of panels) {
      if (panel.getBoundingClientRect().top < window.innerHeight * 0.85) {
        panel.setAttribute('data-in', '')
      }
    }
    root.setAttribute('data-armed', '')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-in', '')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    )
    for (const panel of panels) {
      if (!panel.hasAttribute('data-in')) {
        observer.observe(panel)
      }
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={styles.book}>
      {children}
    </div>
  )
}
