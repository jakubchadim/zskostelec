import { registerBlockNormalizer } from '@/lib/wp'
import { BlockType } from './constants'
import { blockCoreButtonNormalize } from './core/button/button.normalize'
import { blockCoreButtonGroupNormalize } from './core/button/group.normalize'
import { blockCoreFileNormalize } from './core/file/file.normalize'
import { blockCoreGroupNormalize } from './core/group/group.normalize'
import { blockCoreImageNormalize } from './core/image/image.normalize'
import { blockCoreTableNormalize } from './core/table/table.normalize'

/**
 * Registers every per-block-type normalizer this task owns with `@/lib/wp`'s
 * shared registry. Idempotent (the registry is last-write-wins - see
 * `registerBlockNormalizer`'s own doc comment), so calling this on every
 * `BlockContent` render is cheap and safe. Called explicitly (not via a
 * side-effect-only import) per `@/lib/wp`'s registration contract - see
 * that module's doc comment for why side-effect imports aren't reliable
 * here.
 */
export function registerCoreBlockNormalizers(): void {
  registerBlockNormalizer(BlockType.CORE_BUTTON, blockCoreButtonNormalize)
  registerBlockNormalizer(BlockType.CORE_BUTTONS, blockCoreButtonGroupNormalize)
  registerBlockNormalizer(BlockType.CORE_GROUP, blockCoreGroupNormalize)
  registerBlockNormalizer(BlockType.CORE_FILE, blockCoreFileNormalize)
  registerBlockNormalizer(BlockType.CORE_IMAGE, blockCoreImageNormalize)
  registerBlockNormalizer(BlockType.CORE_TABLE, blockCoreTableNormalize)
}
