import type { ReactNode } from 'react'
import type { Block } from '@/lib/wp'

/** A rendering component for one block type. Mirrors `web/src/components/block/types.ts`'s `BlockFC`. */
export type BlockFC<Attrs = unknown> = (props: { block: Block<Attrs>; nested?: boolean }) => ReactNode
