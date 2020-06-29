import { ID, Json, Nullable, RawHTML } from '../../types'
import { BlockType } from './constants'

export type RawBlock = {
  blockId: ID
  parentId: Nullable<ID>
  type: Nullable<BlockType>
  content: Nullable<RawHTML>
  attrs: Json
}

export type Block<Attrs = any> = {
  id: ID
  type: Nullable<BlockType>
  content: Nullable<RawHTML>
  attrs: Attrs
  blocks: Block[]
}

export function parseBlocks(
  rawBlocks: RawBlock[],
  parentId: Nullable<ID> = null
): Block[] {
  return rawBlocks
    .filter((rawBlock) => rawBlock.parentId === parentId)
    .map((rawBlock) => {
      return {
        id: rawBlock.blockId,
        type: rawBlock.type,
        content: rawBlock.content,
        attrs: JSON.parse(rawBlock.attrs),
        blocks: parseBlocks(rawBlocks, rawBlock.blockId)
      }
    })
}
