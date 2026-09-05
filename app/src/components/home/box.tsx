import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BoxProps = {
  children: ReactNode
  className?: string
  /** Fills its grid cell, clipping overflow - ports the `fullHeight`
   * variant of `web/src/components/ui/box/box.tsx`. */
  fullHeight?: boolean
}

/**
 * Local card primitive (background/shadow/rounding), ported from
 * `web/src/components/ui/box/box.tsx`. Kept local to `home/` rather than
 * added to the shared `ui/` primitives (out of this task's scope) or
 * imported from `article/` (T4 is in flight there) - worth revisiting as a
 * shared primitive once both land.
 */
export function Box({ children, className, fullHeight }: BoxProps) {
  return (
    <div
      className={cn(
        'rounded-medium bg-white-1 text-black-1 shadow-lift',
        fullHeight && 'relative h-full overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  )
}

export function BoxHeader({ children }: { children: ReactNode }) {
  return <div className="px-4 pt-3 xs:px-6 xs:pt-5">{children}</div>
}

export function BoxContent({ children }: { children: ReactNode }) {
  return <div className="px-4 pb-3 xs:px-6 xs:pb-5">{children}</div>
}
