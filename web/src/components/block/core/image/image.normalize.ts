import { JSDOM } from 'jsdom'
import { NormalizeFunc } from '../../types'
import { Json } from '../../../../types'

export const blockCoreImageNormalize: NormalizeFunc = (rawBlock) => {
  if (!rawBlock.content) {
    return null
  }

  const content = JSDOM.fragment(rawBlock.content)
  const image = content.querySelector('img')
  const fig = content.querySelector('figcaption')?.innerHTML

  if (!image?.src) {
    return null
  }

  return {
    ...rawBlock,
    content: null,
    attrs: <Json>JSON.stringify({
      ...(JSON.parse(rawBlock.attrs) || {}),
      src: image.getAttribute('src'),
      alt: image.getAttribute('alt') || fig,
      rounded: rawBlock.attrs.indexOf('is-style-rounded') !== -1,
      fig
    })
  }
}
