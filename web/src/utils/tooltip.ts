'use strict'

import React, { MutableRefObject } from 'react'

export function useTooltip<T extends HTMLElement>(): [
  boolean,
  () => void,
  MutableRefObject<T | null>
] {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const tooltip = React.useRef<T>(null)

  React.useEffect(() => {
    if (!isOpen) {
      return
    }

    const hideTooltip = (e: any) => {
      if (tooltip.current && e.target && tooltip.current.contains(e.target)) {
        return
      }

      setIsOpen(false)
    }

    window.addEventListener('click', hideTooltip)

    return () => window.removeEventListener('click', hideTooltip)
  }, [isOpen, tooltip])

  return [isOpen, () => setIsOpen(!isOpen), tooltip]
}
