import { JSDOM } from 'jsdom'
import type { RawHTML } from '../types'
import type { TransformedBlock } from './types'

export type SearchAndReplace = { sourceUrl: string; replacementUrl: string }

/** Media/asset paths, the one thing that must keep an absolute URL: nothing serves wp-content from this app. */
const MEDIA_PATH = /^\/wp-(?:content|includes)\//

/**
 * The configured origin with the opposite scheme, e.g. `http://host` for a
 * `https://host` source.
 *
 * WP content stores some URLs under the scheme that was configured when the
 * link was authored, so a site now served over https still has `http://`
 * links (and image/file URLs) recorded in older content. Those miss the
 * exact-origin match, which leaves an internal link rendering as an external
 * one straight back to the API-only WP backend.
 */
function alternateSchemeOrigin(sourceUrl: string): string | null {
  if (sourceUrl.startsWith('https://')) {
    return `http://${sourceUrl.slice('https://'.length)}`
  }

  if (sourceUrl.startsWith('http://')) {
    return `https://${sourceUrl.slice('http://'.length)}`
  }

  return null
}

/**
 * Applies the same origin -> `replacementUrl` swap to the opposite-scheme
 * spelling of the source origin, but only for non-media URLs.
 *
 * Deliberately narrower than the exact-origin replacement it complements:
 * that one is a plain substring swap over every URL including media (its
 * long-standing behavior, which `normalizeGallery` and `normalizePost` work
 * around by carving media out before calling it), whereas this only ever
 * touches URLs that would otherwise be left absolute entirely. Media keeps
 * its absolute URL so images and file downloads still resolve.
 */
function replaceAlternateScheme(value: string, search: SearchAndReplace): string {
  const alternate = alternateSchemeOrigin(search.sourceUrl)

  if (!alternate || !value.includes(alternate)) {
    return value
  }

  const escaped = alternate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  return value.replace(new RegExp(`${escaped}(/[^\\s"'<>\\\\]*)?`, 'g'), (match, path?: string) =>
    path && MEDIA_PATH.test(path) ? match : `${search.replacementUrl}${path ?? ''}`
  )
}

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

    if (!href || !href.endsWith('/')) {
      return
    }

    if (href.includes(search.sourceUrl)) {
      link.setAttribute('href', href.replace(search.sourceUrl, search.replacementUrl))
      return
    }

    const alternate = replaceAlternateScheme(href, search)

    if (alternate !== href) {
      link.setAttribute('href', alternate)
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
    const exact = value.split(search.sourceUrl).join(search.replacementUrl)
    return replaceAlternateScheme(exact, search).split('&#8211;').join('-') as unknown as T
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
