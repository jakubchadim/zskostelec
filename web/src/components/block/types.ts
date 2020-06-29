import React from 'react'
import { Block } from './utils'

type BlockCoreButtonProps<Attrs> = {
  block: Block<Attrs>
}

export type BlockFC<Attrs = any> = React.FC<BlockCoreButtonProps<Attrs>>
