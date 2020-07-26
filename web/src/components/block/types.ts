import React from 'react'
import { ID, Json, Nullable, RawHTML } from '../../types'
import { BlockType } from './constants'

export type RawBlock = {
  blockName: BlockType
  innerBlocks: RawBlock[]
  innerHTML: Nullable<RawHTML>
  innerContent: [Nullable<RawHTML>]
  attrs: any[]
}

export type TransformedBlock = {
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

type BlockCoreButtonProps<Attrs> = {
  block: Block<Attrs>
  nested?: boolean
}

export type BlockFC<Attrs = any> = React.FC<BlockCoreButtonProps<Attrs>>

export type NormalizeFunc = (rawBlock: TransformedBlock) => TransformedBlock | null
