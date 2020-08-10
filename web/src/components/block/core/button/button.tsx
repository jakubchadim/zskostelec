import React from 'react'
import { Link } from 'gatsby'
import Content from '../../../content/content'
import { BlockFC } from '../../types'
import { BlockColorPalette } from '../../color/color'
import UiButton from '../../../ui/button/button'
import { BlockCoreButtonType } from './constants'

export type BlockCoreButtonAttrs = BlockColorPalette & {
  type: BlockCoreButtonType
  href?: string
  target?: string
  rel?: string
}

const BlockCoreButton: BlockFC<BlockCoreButtonAttrs> = ({
  block: { attrs, content }
}) => {
  if (
    !attrs.href ||
    attrs.href.startsWith('http') ||
    attrs.target === '_blank'
  ) {
    return (
      <UiButton
        as={'a'}
        themeType={attrs.type}
        href={attrs.href}
        target={attrs.target}
        rel={attrs.rel}
        backgroundColor={attrs.backgroundColor}
        textColor={attrs.textColor}
      >
        <Content content={content} />
      </UiButton>
    )
  }

  return (
    <UiButton
      as={Link}
      themeType={attrs.type}
      to={attrs.href}
      target={attrs.target}
      backgroundColor={attrs.backgroundColor}
      textColor={attrs.textColor}
    >
      <Content content={content} />
    </UiButton>
  )
}

export default BlockCoreButton
