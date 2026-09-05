/**
 * SEO helpers for the catch-all route's `generateMetadata`, plus
 * `sitemap.ts`/`robots.ts`. Kept out of `lib/wp/**` (that's the data
 * layer's own territory) even though a couple of these mirror something
 * over there (`pathFromSlug` vs. `route/resolve.ts`'s private
 * `normalizePath`) - duplicating a few lines here is cheaper than coupling
 * this module to an internal helper that isn't exported.
 */

/** Mirrors the site identity `app/src/app/layout.tsx` already hardcodes. */
export const SITE_NAME = 'ZŠ Kostelec nad Orlicí'
export const SITE_DEFAULT_DESCRIPTION = 'Základní škola Gutha Jarkovského Kostelec nad Orlicí'

/**
 * Absolute site origin with no trailing slash, or `null` when `SITE_URL`
 * isn't set. Returns `null` rather than throwing (unlike `lib/wp/env.ts`'s
 * `getWpUrl`) so callers can degrade gracefully - an empty sitemap, a
 * robots.txt with no `Sitemap:` line, metadata with no canonical/`og:url` -
 * instead of every caller needing its own try/catch for this one case.
 */
export function getSiteUrl(): string | null {
  const raw = process.env.SITE_URL
  return raw ? raw.replace(/\/+$/, '') : null
}

/** Rebuilds the site-relative path `resolveRoute` matched against, with the same trailing-slash convention (`trailingSlash: true` in `next.config.ts`) every WP `link` field already uses. */
export function pathFromSlug(slug: string[] | undefined): string {
  const segments = slug ?? []
  return segments.length ? `/${segments.join('/')}/` : '/'
}

/**
 * The named entities WP REST output actually contains in title/excerpt
 * text (plain prose, never rich markup) - not a general HTML-entity
 * decoder. Numeric entities (decimal and hex) are handled separately in
 * `decodeEntities` since they cover everything else (curly quotes,
 * en/em-dashes, etc. all come through as `&#8217;`-style numeric refs).
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–'
}

/**
 * Decodes the handful of HTML entities WP REST's `title`/`excerpt`/`name`
 * fields actually use. No decoding library exists in `app/` and none may
 * be installed for this task, so this is a small, deliberately narrow
 * decoder rather than a general-purpose one.
 */
export function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match)
}

/** WP-rendered HTML (a title, or an excerpt's `<p>…</p>`) -> plain text suitable for a `<meta>` `content` attribute. */
export function htmlToPlainText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

/** `"Page title" -> "Page title | ZŠ Kostelec nad Orlicí"`, matching the legacy Gatsby SEO component's `titleTemplate`. */
export function buildTitle(pageTitle: string): string {
  return `${pageTitle} | ${SITE_NAME}`
}
