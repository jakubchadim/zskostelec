'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger delay in ms. */
  delay?: number
}

/**
 * Fades/slides its children in the first time they scroll into view.
 * The hidden state is applied from JS only (the `reveal` class is added on
 * mount), so without JS - or for crawlers - the content is simply visible.
 * `prefers-reduced-motion` is handled in globals.css.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    // Already on screen at mount (above the fold) - don't hide it at all.
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.9) {
      return
    }

    node.classList.add('reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn(className)} style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}>
      {children}
    </div>
  )
}
