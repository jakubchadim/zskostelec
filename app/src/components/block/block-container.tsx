import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Reading-width wrapper for top-level Gutenberg blocks (~75 characters per line). */
export function BlockContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('block-container mx-auto w-full max-w-[50rem] px-4 sm:px-6', className)}>{children}</div>
}
