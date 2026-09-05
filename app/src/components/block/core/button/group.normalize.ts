import type { NormalizeFunc } from '@/lib/wp'

/**
 * Ported from `web/src/components/block/core/button/group.normalize.ts`.
 * Renamed from legacy's `blockCoreButtonNormalize` (which collided with the
 * single-button normalizer's own export name in the same folder) to
 * `blockCoreButtonGroupNormalize` - no behavior change, just a clearer name.
 * A button group's own `innerHTML` isn't needed for rendering (its children
 * render via the block tree instead), so this just clears `content`.
 */
export const blockCoreButtonGroupNormalize: NormalizeFunc = (rawBlock) => ({
  ...rawBlock,
  content: null
})
