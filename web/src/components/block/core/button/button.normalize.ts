import { JSDOM } from 'jsdom'
import { NormalizeFunc } from '../../types'
import { RawHTML, Json } from '../../../../types'
import { BlockCoreButtonType } from './constants'

export const blockCoreButtonNormalize: NormalizeFunc = (rawBlock) => {
  if (!rawBlock.content) {
    return null
  }

  const content = JSDOM.fragment(rawBlock.content)
  const link = content.querySelector('.wp-block-button__link')

  if (!link?.innerHTML) {
    return null
  }

  const type = rawBlock.attrs.includes('is-style-outline')
    ? BlockCoreButtonType.OUTLINE
    : BlockCoreButtonType.FILL

  return {
    ...rawBlock,
    content: <RawHTML>link?.innerHTML,
    attrs: <Json>JSON.stringify({
      ...(JSON.parse(rawBlock.attrs) || {}),
      type,
      href: link.getAttribute('href'),
      target: link.getAttribute('target'),
      rel: link.getAttribute('rel')
    })
  }
}
