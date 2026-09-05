import { BlockType } from './constants'
import { BlockCoreButton } from './core/button/button'
import { BlockCoreButtonGroup } from './core/button/group'
import { BlockCoreFile } from './core/file/file'
import { BlockCoreGroup } from './core/group/group'
import { BlockCoreImage } from './core/image/image'
import { BlockCoreList } from './core/list/list'
import { BlockCoreParagraph } from './core/paragraph/paragraph'
import { BlockCoreQuote } from './core/quote/quote'
import { BlockCoreTable } from './core/table/table'
import type { BlockFC } from './types'

/**
 * Ported from `web/src/components/block/register.ts`. Each component is
 * cast to the generic `BlockFC` (unknown attrs) when inserted here: this
 * app's `Block<Attrs = unknown>` is stricter than legacy's `Block<Attrs =
 * any>`, so a heterogeneous map of concretely-typed components isn't
 * directly assignable to `Record<BlockType, BlockFC>` without it (a
 * contravariance mismatch on each component's `block` parameter type) -
 * same escape hatch legacy got for free from `any`.
 */
export const componentByType: Partial<Record<BlockType, BlockFC>> = {
  [BlockType.CORE_BUTTON]: BlockCoreButton as BlockFC,
  [BlockType.CORE_BUTTONS]: BlockCoreButtonGroup as BlockFC,
  [BlockType.CORE_GROUP]: BlockCoreGroup as BlockFC,
  [BlockType.CORE_LIST]: BlockCoreList as BlockFC,
  [BlockType.CORE_PARAGRAPH]: BlockCoreParagraph as BlockFC,
  [BlockType.CORE_QUOTE]: BlockCoreQuote as BlockFC,
  [BlockType.CORE_FILE]: BlockCoreFile as BlockFC,
  [BlockType.CORE_IMAGE]: BlockCoreImage as BlockFC,
  [BlockType.CORE_TABLE]: BlockCoreTable as BlockFC
}
