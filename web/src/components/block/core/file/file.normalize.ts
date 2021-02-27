import { JSDOM } from 'jsdom'
import { NormalizeFunc } from '../../types'
import { RawHTML, Json } from '../../../../types'

export const blockCoreFileNormalize: NormalizeFunc = (rawBlock) => {
  if (!rawBlock.content) {
    return null
  }

  const content = JSDOM.fragment(rawBlock.content)
  const link = content.querySelector('a')

  if (!link?.innerHTML) {
    return null
  }

  return {
    ...rawBlock,
    content: <RawHTML>link?.innerHTML,
    attrs: <Json>JSON.stringify({
      ...(JSON.parse(rawBlock.attrs) || {}),
      src: link.getAttribute('href')
    })
  }
}
