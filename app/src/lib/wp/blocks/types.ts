import type { ID, Json, Nullable, RawHTML } from '../types'

/** A single Gutenberg block as returned by the WP REST `blocks` field (`admin/theme/inc/blocks.php`'s `parse_blocks()` passthrough). */
export type RawBlock = {
  blockName: string | null
  attrs: unknown
  innerHTML: string | null
  innerBlocks: RawBlock[]
}

/** The flattened, dispatch-normalized representation - still-stringified `attrs`, still-HTML-string `content`. Same shape the per-block-type normalizers (owned by T3) operate on. */
export type TransformedBlock = {
  blockId: ID
  parentId: Nullable<ID>
  type: Nullable<string>
  attrs: Json
  content: Nullable<RawHTML>
}

/** The unflattened tree, with parsed `attrs` - what a renderer walks. */
export type Block<Attrs = unknown> = {
  id: ID
  type: Nullable<string>
  content: Nullable<RawHTML>
  attrs: Attrs
  blocks: Block[]
}

export type NormalizeFunc = (rawBlock: TransformedBlock) => TransformedBlock | null
