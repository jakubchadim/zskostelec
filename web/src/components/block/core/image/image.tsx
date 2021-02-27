import React from 'react'
import styled, { css } from 'styled-components'
import { BlockFC } from '../../types'
import UiContainer from '../../../ui/container/container'

const BlockContainer__left = css`
  float: left;
`

const BlockContainer__center = css`
  text-align: center;
`

const BlockContainer__right = css`
  float: right;
`

const BlockContainer__rounded = css`
  img {
    width: 100% !important;
    border-radius: ${(p) => p.theme.radius.large};
  }
`

const BlockContainer = styled.div<{ align?: string; rounded?: boolean }>`
  ${(p) => p.align === 'left' && BlockContainer__left};
  ${(p) => p.align === 'center' && BlockContainer__center};
  ${(p) => p.align === 'right' && BlockContainer__right};
  ${(p) => p.rounded && BlockContainer__rounded};
  max-width: 100%;
`

const BlockInner = styled.div`
  display: inline-block;
`

const BlockFig = styled.figcaption`
  text-align: center;
  font-size: 1.2rem;
  color: ${(p) => p.theme.color.gray6};
`

const BlockImage = styled.img`
  max-width: 100%;
`

type BlockCoreImageAttrs = {
  src: string
  alt?: string
  fig?: string
  rounded: boolean
  width?: number
  align?: string
}

const BlockCoreImage: BlockFC<BlockCoreImageAttrs> = ({ block, nested }) => {
  const image = (
    <BlockContainer
      align={block.attrs.align}
      rounded={block.attrs.rounded}
      style={
        block.attrs.width ? { width: `${block.attrs.width}px` } : undefined
      }
    >
      <BlockInner>
        <BlockImage
          src={block.attrs.src}
          alt={block.attrs.alt}
          width={block.attrs.width}
        />
        {!!block.attrs.fig && <BlockFig>{block.attrs.fig}</BlockFig>}
      </BlockInner>
    </BlockContainer>
  )

  return nested ? image : <UiContainer>{image}</UiContainer>
}

export default BlockCoreImage
