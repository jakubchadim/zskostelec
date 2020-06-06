import { ID, Json, Nullable, Opaque, RawHTML } from '../../types'

type BlockType = Opaque<'BlockType', string>

export type RawBlock = {
  blockId: ID
  parentId: Nullable<ID>
  type: Nullable<BlockType>
  content: Nullable<RawHTML>
  attrs: Json
}

export type Block = {
  id: ID
  type: Nullable<BlockType>
  content: Nullable<RawHTML>
  attrs: any
  blocks: Block[]
}

export function parseBlocks (rawBlocks: RawBlock[], parentId: Nullable<ID> = null): Block[] {
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

