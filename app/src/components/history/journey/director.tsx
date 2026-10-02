'use client'

import { useEffect } from 'react'

const GLYPHS = '0123456789?'

/**
 * Drives the sticky town from the scroll position. Renders nothing: it
 * watches every `[data-v1-step]` panel and, when one crosses the middle of
 * the viewport, writes that panel's step/focus/year onto the stage as CSS
 * custom properties (journey.module.css does the rest). Writing to the DOM
 * directly keeps the big server-rendered SVG out of React's re-renders.
 */
export function Director({ stageId, rootId }: { stageId: string; rootId: string }) {
  useEffect(() => {
    const stage = document.getElementById(stageId)
    const root = document.getElementById(rootId)
    if (!stage || !root) {
      return
    }

    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-v1-step]'))
    const dots = Array.from(stage.querySelectorAll<HTMLAnchorElement>('[data-v1-dot]'))
    const stamp = stage.querySelector<HTMLElement>('[data-v1-stamp]')
    const last = Number(stage.dataset.last ?? panels.length)
    let current: HTMLElement | null = null

    root.classList.add('js-journey')

    const activate = (panel: HTMLElement) => {
      if (panel === current) {
        return
      }
      current?.removeAttribute('data-active')
      panel.setAttribute('data-active', '')
      current = panel

      const step = Number(panel.dataset.v1Step)
      const style = stage.style
      style.setProperty('--step', String(step))
      style.setProperty('--fx', panel.dataset.fx ?? '500')
      style.setProperty('--fy', panel.dataset.fy ?? '450')
      style.setProperty('--zoom-on', panel.dataset.fx ? '1' : '0')
      style.setProperty('--progress', String(Math.min(step, last) / last))

      let reels = panel.dataset.reels ?? ''
      if (reels === 'now') {
        reels = String(new Date().getFullYear())
      }
      if (reels) {
        stage.removeAttribute('data-no-year')
        reels.split('').forEach((char, i) => style.setProperty(`--r${i}`, String(Math.max(0, GLYPHS.indexOf(char)))))
      } else {
        stage.setAttribute('data-no-year', '')
      }
      if (stamp) {
        stamp.textContent = panel.dataset.stamp ?? ''
        stamp.hidden = !panel.dataset.stamp
      }

      for (const dot of dots) {
        if (dot.dataset.v1Dot === panel.id) {
          dot.setAttribute('aria-current', 'step')
        } else {
          dot.removeAttribute('aria-current')
        }
      }
    }

    // The panel crossing a thin band across the viewport wins: just above the
    // middle on wide screens, lower on phones where the town covers the top.
    const line = window.matchMedia('(min-width: 41.75em)').matches ? 42 : 60
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((entry) => entry.isIntersecting).at(-1)
        if (hit) {
          activate(hit.target as HTMLElement)
        }
      },
      { rootMargin: `-${line}% 0px -${98 - line}% 0px` }
    )
    panels.forEach((panel) => observer.observe(panel))

    // Initial state (e.g. a reload halfway down the page, or a #chapter link).
    const mid = (window.innerHeight * (line + 1)) / 100
    const start = panels.find((panel) => {
      const rect = panel.getBoundingClientRect()
      return rect.top <= mid && rect.bottom >= mid
    })
    activate(start ?? panels[0])

    return () => {
      observer.disconnect()
      root.classList.remove('js-journey')
    }
  }, [stageId, rootId])

  return null
}
