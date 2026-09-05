import type { NormalizeFunc } from '@/lib/wp'

/**
 * Ported verbatim from `web/src/components/block/core/group/group.normalize.ts`.
 * A group's own `innerHTML` isn't needed for rendering (its children render
 * via the block tree instead), so this just clears `content` to avoid
 * double-rendering it.
 */
export const blockCoreGroupNormalize: NormalizeFunc = (rawBlock) => ({
  ...rawBlock,
  content: null
})
