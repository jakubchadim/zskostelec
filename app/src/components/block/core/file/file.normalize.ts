import { JSDOM } from 'jsdom'
import { fromJson, toJson, type NormalizeFunc, type RawHTML } from '@/lib/wp'

/**
 * Ported verbatim from `web/src/components/block/core/file/file.normalize.ts`:
 * extracts the file's display name (the link's inner HTML) and its URL
 * (the link's `href`) out of the WP-rendered `core/file` markup.
 */
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
    content: link.innerHTML as RawHTML,
    attrs: toJson({
      ...(fromJson(rawBlock.attrs) ?? {}),
      src: link.getAttribute('href')
    })
  }
}
