import { JSDOM } from 'jsdom'
import { fromJson, toJson, type NormalizeFunc, type RawHTML } from '@/lib/wp'
import { BlockCoreButtonType } from './constants'

/**
 * Ported verbatim from `web/src/components/block/core/button/button.normalize.ts`:
 * unwraps the `.wp-block-button` wrapper down to just the inner
 * `.wp-block-button__link`'s content, and lifts its href/target/rel plus
 * the fill-vs-outline style variant into `attrs`.
 */
export const blockCoreButtonNormalize: NormalizeFunc = (rawBlock) => {
  if (!rawBlock.content) {
    return null
  }

  const content = JSDOM.fragment(rawBlock.content)
  const link = content.querySelector('.wp-block-button__link')

  if (!link?.innerHTML) {
    return null
  }

  const type = rawBlock.attrs.includes('is-style-outline') ? BlockCoreButtonType.OUTLINE : BlockCoreButtonType.FILL

  return {
    ...rawBlock,
    content: link.innerHTML as RawHTML,
    attrs: toJson({
      ...(fromJson(rawBlock.attrs) ?? {}),
      type,
      href: link.getAttribute('href'),
      target: link.getAttribute('target'),
      rel: link.getAttribute('rel')
    })
  }
}
