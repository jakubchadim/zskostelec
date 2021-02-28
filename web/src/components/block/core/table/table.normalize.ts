import { JSDOM } from 'jsdom'
import { NormalizeFunc } from '../../types'
import { RawHTML, Json } from '../../../../types'

export const blockCoreTableNormalize: NormalizeFunc = (rawBlock) => {
  if (!rawBlock.content) {
    return null
  }

  const content = JSDOM.fragment(rawBlock.content)
  const table = content.querySelector('table')
  const attrs = JSON.parse(rawBlock.attrs) || {}

  if (!table?.innerHTML) {
    return null
  }

  const hasFixedLayout = table.classList.contains('has-fixed-layout')
  table.className = ''

  return {
    ...rawBlock,
    content: <RawHTML>table?.outerHTML,
    attrs: <Json>JSON.stringify({
      ...attrs,
      hasFixedLayout,
      stripes: attrs.className?.indexOf('is-style-stripes') !== -1,
      fig: content.querySelector('table + figcaption')?.innerHTML
    })
  }
}
