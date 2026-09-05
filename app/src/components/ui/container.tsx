import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ContainerProps = {
  children: ReactNode
  className?: string
}

/** Centered max-width wrapper, ported from web/src/components/ui/container/container.tsx. */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn('mx-auto w-full max-w-site px-2', className)}>{children}</div>
}
