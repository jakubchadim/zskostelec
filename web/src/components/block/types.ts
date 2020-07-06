import React from 'react'
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

type BlockCoreButtonProps<Attrs> = {
  block: Block<Attrs>
}

export type BlockFC<Attrs = any> = React.FC<BlockCoreButtonProps<Attrs>>

export type NormalizeFunc = (rawBlock: RawBlock) => RawBlock
