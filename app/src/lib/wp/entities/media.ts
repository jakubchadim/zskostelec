import { wpFetchOrNull, WP_CACHE_TAGS } from '../client'
import { asId, type ID, type WpImageSize, type WpMediaLike } from '../types'

export type WpMedia = WpMediaLike

const MEDIA_FIELDS = ['id', 'source_url', 'alt_text', 'caption', 'media_details']

export async function getMediaById(id: ID | number): Promise<WpMedia | null> {
  return wpFetchOrNull<WpMedia>(`wp/v2/media/${id}`, {
    fields: MEDIA_FIELDS,
    tags: [WP_CACHE_TAGS.media, `media-${id}`]
  })
}

/**
 * Unwraps a `{ source_url }`-shaped value, or passes a plain string
 * through as-is. Some ACF sub-fields on this WP install (e.g. document/
 * gutak "file" `url`) come back nested like this in the Gatsby-era schema,
 * which is evidence of gatsby-source-wordpress auto-linking a raw URL
 * string into a full media node - see T1 plan risk #2.
 */
export function extractUrl(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (value != null && typeof value === 'object' && 'source_url' in value) {
    return String((value as { source_url: unknown }).source_url)
  }

  return ''
}

/**
 * ACF image/file fields are configured with different `return_format`s
 * across this WP install (`array` on gallery/employee/gutak/document,
 * `url` on the POST "article" group's `file` field) - and Gatsby's own
 * schema customization suggests at least one `url`-format field may still
 * return a raw media attachment id over REST (T1 plan risk #2). Handle
 * every shape defensively:
 *  - already a hydrated media object (has `source_url`) -> use as-is
 *  - a numeric id (or numeric string) -> resolve via `/wp/v2/media/{id}`
 *  - any other string -> treat as a bare URL
 */
export async function resolveAcfMedia(value: unknown): Promise<WpMedia | null> {
  if (value == null) {
    return null
  }

  if (typeof value === 'object' && 'source_url' in value) {
    return value as WpMedia
  }

  if (typeof value === 'string') {
    if (value === '') {
      return null
    }

    if (/^\d+$/.test(value)) {
      return getMediaById(asId(value))
    }

    return { id: asId(value), source_url: value }
  }

  if (typeof value === 'number') {
    return getMediaById(value)
  }

  return null
}

type RawAcfImage = {
  ID?: number
  id?: number
  url?: string
  alt?: string
  filename?: string
  sizes?: Record<string, string | number>
}

/**
 * ACF's documented "array" return format for an `image`-type field
 * (`gallery.preview`/`gallery.gallery[]`, `employee.photo`, `gutak.preview`
 * - all confirmed `"type": "image"`, `"return_format": "array"` in
 * `admin/theme/inc/page-types/*.json`) is a FLAT shape, distinct from the
 * `/wp/v2/media` endpoint's shape: a top-level `url` string (not
 * `source_url`), and a flat `sizes` map where `sizes.medium` is a URL
 * string and `sizes['medium-width']`/`sizes['medium-height']` are separate
 * numeric keys (no nested `media_details`). Reshapes that into the
 * `WpMediaLike`/`media_details.sizes` contract the rest of this data layer
 * (and T2's `<WpImage>`) expects.
 */
export function normalizeAcfImage(value: unknown): WpMediaLike | null {
  if (value == null) {
    return null
  }

  // Already the media-endpoint shape (or an already-normalized WpMediaLike) - pass through.
  if (typeof value === 'object' && 'source_url' in value) {
    return value as WpMediaLike
  }

  if (typeof value !== 'object') {
    return null
  }

  const raw = value as RawAcfImage

  if (typeof raw.url !== 'string') {
    return null
  }

  const sizes: Record<string, WpImageSize> = {}

  for (const [key, sizeUrl] of Object.entries(raw.sizes ?? {})) {
    if (key.endsWith('-width') || key.endsWith('-height') || typeof sizeUrl !== 'string') {
      continue
    }

    sizes[key] = {
      source_url: sizeUrl,
      width: Number(raw.sizes?.[`${key}-width`]) || 0,
      height: Number(raw.sizes?.[`${key}-height`]) || 0
    }
  }

  const id = raw.id ?? raw.ID

  return {
    id: asId(id ?? raw.url),
    source_url: raw.url,
    filename: raw.filename,
    alt_text: raw.alt,
    media_details: Object.keys(sizes).length ? { sizes } : undefined
  }
}
