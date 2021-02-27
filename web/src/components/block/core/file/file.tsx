import React from 'react'
import { BlockColor } from '../../color/color'
import { BlockFC } from '../../types'
import UiContainer from '../../../ui/container/container'
import UiBox from '../../../ui/box/box'
import File from '../../../file/file'

type BlockCoreFileAttrs = {
  src?: string
}

const BlockCoreFile: BlockFC<BlockCoreFileAttrs> = ({ block, nested }) => {
  if (!block.attrs.src) {
    return null
  }

  const file = (
    <UiBox backgroundColor={BlockColor.WHITE} offsetTop offsetBottom>
      <File name={block.content || 'Soubor'} href={block.attrs.src} />
    </UiBox>
  )

  return nested ? file : <UiContainer>{file}</UiContainer>
}

export default BlockCoreFile
