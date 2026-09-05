import { JSDOM } from 'jsdom'
import type { RawHTML } from '../types'
import type { TransformedBlock } from './types'

export type SearchAndReplace = { sourceUrl: string; replacementUrl: string }

/**
 * Rewrites absolute admin-origin links back to site-relative paths inside a
 * single block's rendered HTML content. Only touches `<a href>` values that
 * are absolute, end in a trailing slash, and contain the admin origin - the
 * same narrow condition the Gatsby-era `blockLinkNormalize` used, so this
 * doesn't rewrite unrelated external links.
 */
export function rewriteBlockLinks(rawBlock: TransformedBlock, search: SearchAndReplace): TransformedBlock {
  if (!rawBlock.content) {
    return rawBlock
  }

  const fragment = JSDOM.fragment(rawBlock.content)

  fragment.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href')

    if (href && href.endsWith('/') && href.includes(search.sourceUrl)) {
      link.setAttribute('href', href.replace(search.sourceUrl, search.replacementUrl))
    }
  })

  let content = ''
  for (const child of Array.from(fragment.children)) {
    content += child.outerHTML
  }

  return { ...rawBlock, content: content as RawHTML }
}

/**
 * Recursively walks a parsed WP REST entity (or any JSON-shaped value),
 * replacing absolute admin-origin URLs with a site-relative origin
 * wherever they appear in string values, and fixing the `&#8211;` entity
 * WordPress sometimes leaves in title/excerpt text.
 *
 * This replaces the JSON.stringify/regex/`_.defaultsDeep` round-trip the
 * Gatsby-era `searchReplaceContentUrls` normalizer used in
 * `web/.gatsby/gatsby-config.ts` - that approach only existed to fit
 * gatsby-source-wordpress's string-in/string-out normalizer API, and its
 * `new RegExp(sourceUrl, 'g')` was fragile (an unescaped domain string used
 * directly as a regex pattern). Since we control real parsed objects here,
 * a direct recursive walk with plain substring replacement is simpler and
 * can't lose fields to a failed JSON.parse/merge, or misinterpret regex
 * metacharacters in the source URL.
 */
export function rewriteAdminUrls<T>(value: T, search: SearchAndReplace): T {
  if (typeof value === 'string') {
    return value.split(search.sourceUrl).join(search.replacementUrl).split('&#8211;').join('-') as unknown as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => rewriteAdminUrls(item, search)) as unknown as T
  }

  if (value != null && typeof value === 'object') {
    const result: Record<string, unknown> = {}

    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = rewriteAdminUrls(val, search)
    }

    return result as T
  }

  return value
}
