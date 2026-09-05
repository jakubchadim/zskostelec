import { JSDOM } from 'jsdom'
import { fromJson, toJson, type NormalizeFunc } from '@/lib/wp'

/**
 * Ported verbatim from `web/src/components/block/core/image/image.normalize.ts`:
 * lifts `src`/`alt`/`fig`(caption)/`rounded` out of the WP-rendered
 * `core/image` markup into `attrs`, then clears `content` (the component
 * rebuilds the `<img>` itself from those attrs).
 */
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
    attrs: toJson({
      ...(fromJson(rawBlock.attrs) ?? {}),
      src: image.getAttribute('src'),
      alt: image.getAttribute('alt') || fig,
      rounded: rawBlock.attrs.indexOf('is-style-rounded') !== -1,
      fig
    })
  }
}
