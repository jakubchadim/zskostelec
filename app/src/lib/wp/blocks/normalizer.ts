import { fromJson, toJson, type ID, type Nullable } from '../types'
import { rewriteBlockLinks, type SearchAndReplace } from './urls'
import type { Block, NormalizeFunc, RawBlock, TransformedBlock } from './types'

/**
 * Flattens a nested Gutenberg block tree (as returned by the WP `blocks`
 * REST field) into a flat array, each entry carrying a generated `blockId`
 * and its `parentId`. Direct port of the Gatsby-era `transformBlocks` -
 * kept flat (rather than emitting a tree directly) so the per-block-type
 * normalizers T3 ports keep working against the exact
 * `(rawBlock: TransformedBlock) => TransformedBlock | null` signature they
 * already have. Children are pushed before their parent, matching the
 * original ordering.
 */
export function transformBlocks(blocks: RawBlock[], parentId: Nullable<ID>): TransformedBlock[] {
  const result: TransformedBlock[] = []

  for (const block of blocks) {
    const blockId = crypto.randomUUID() as ID
    const content = (block.innerHTML ?? '').replace(/[\r\n]/g, '').trim()

    if (block.innerBlocks.length > 0) {
      result.push(...transformBlocks(block.innerBlocks, blockId))
    }

    if (block.blockName != null || content !== '') {
      result.push({
        blockId,
        parentId,
        type: block.blockName,
        attrs: toJson(block.attrs ?? []),
        content: content as TransformedBlock['content']
      })
    }
  }

  return result
}

const registry = new Map<string, NormalizeFunc>()

/**
 * Registers a per-block-type normalizer, keyed by the raw Gutenberg block
 * name (e.g. `"core/image"`). Idempotent - last write wins - so calling
 * this more than once for the same `blockName` is safe.
 *
 * This module never imports block-rendering code (that lives under
 * `app/src/components/block/`, a separate task's directory). Instead,
 * whatever owns those per-type normalizers must export an explicit,
 * idempotent registration function (e.g. `registerCoreBlockNormalizers()`)
 * that rendering entry points call before the pipeline runs. Do NOT rely
 * on side-effect-only imports to populate this registry - bundlers are
 * free to drop imports whose only effect is a top-level side effect, so an
 * un-called, unreferenced registration module can silently vanish from the
 * production bundle.
 */
export function registerBlockNormalizer(blockName: string, normalize: NormalizeFunc): void {
  registry.set(blockName, normalize)
}

/**
 * Applies link rewriting (when `search` is given) and per-block-type
 * normalization (via whatever's in the `registerBlockNormalizer` registry)
 * to a flat block array. A block whose normalizer returns `null` is
 * dropped.
 */
export function normalizeBlocks(rawBlocks: TransformedBlock[], search?: SearchAndReplace): TransformedBlock[] {
  const results: TransformedBlock[] = []

  for (const rawBlock of rawBlocks) {
    const linked = search ? rewriteBlockLinks(rawBlock, search) : rawBlock
    const normalize = linked.type != null ? registry.get(linked.type) : undefined
    const normalized = normalize ? normalize(linked) : linked

    if (normalized != null) {
      results.push(normalized)
    }
  }

  return results
}

/**
 * Unflattens a normalized `TransformedBlock[]` back into a `Block[]` tree,
 * parsing each block's JSON-encoded `attrs`. Direct port of
 * `web/src/components/block/utils.ts`'s `parseBlocks` (the color-section
 * grouping helper `getBlockSections` that lived alongside it is a
 * rendering concern and stays with T3).
 */
export function parseBlocks(rawBlocks: TransformedBlock[], parentId: Nullable<ID> = null): Block[] {
  return rawBlocks
    .filter((rawBlock) => rawBlock.parentId === parentId)
    .map((rawBlock) => ({
      id: rawBlock.blockId,
      type: rawBlock.type,
      content: rawBlock.content,
      attrs: fromJson(rawBlock.attrs),
      blocks: parseBlocks(rawBlocks, rawBlock.blockId)
    }))
}
