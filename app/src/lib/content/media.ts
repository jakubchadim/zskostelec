import { asId, type WpImageSize, type WpMediaLike } from '@/lib/wp'
import type { Media } from '@/payload-types'

type SizeKey = 'thumb' | 'medium' | 'large'
const SIZE_KEYS: SizeKey[] = ['thumb', 'medium', 'large']

/**
 * A Payload media doc in the shape the site's image components already
 * take (`WpMediaLike`: `source_url` + `media_details.sizes`), so <WpImage>,
 * the gallery viewer and the cards work unchanged.
 */
export function toMediaLike(doc: Media | number | null | undefined): WpMediaLike | null {
  if (!doc || typeof doc === 'number' || !doc.url) return null
  const sizes: Record<string, WpImageSize> = {}
  for (const key of SIZE_KEYS) {
    const size = doc.sizes?.[key]
    if (size?.url && size.width) sizes[key] = { source_url: size.url, width: size.width, height: size.height ?? 0 }
  }
  return {
    id: asId(String(doc.id)),
    source_url: doc.url,
    alt_text: doc.alt ?? '',
    media_details: { width: doc.width ?? undefined, height: doc.height ?? undefined, sizes }
  }
}

export function mediaUrl(doc: Media | number | null | undefined): string | null {
  return doc && typeof doc !== 'number' ? (doc.url ?? null) : null
}
