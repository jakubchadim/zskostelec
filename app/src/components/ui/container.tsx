import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ContainerProps = {
  children: ReactNode
  className?: string
}

/** Centered max-width wrapper with a comfortable phone gutter. */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn('mx-auto w-full max-w-site px-4 sm:px-6', className)}>{children}</div>
}
