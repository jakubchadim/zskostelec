export type WpMediaSize = {
  source_url: string
  width: number
  height?: number
}

export type WpMediaLike = {
  source_url: string
  alt_text?: string
  alt?: string
  media_details?: {
    width?: number
    height?: number
    sizes?: Record<string, WpMediaSize>
  }
}

export type WpImageVariant = {
  source_url: string
  width: number
  height?: number
}

/**
 * Merge a WP media object's `media_details.sizes` map with its full-size
 * source into a single list of srcset candidates, de-duplicated by URL and
 * sorted ascending by width. The full-size source is only included when its
 * width is known (`media_details.width`) — an entry without a width can't
 * produce a valid `w` descriptor.
 */
export function buildSrcSet(media: WpMediaLike): WpImageVariant[] {
  const variants = new Map<string, WpImageVariant>()

  if (media.media_details?.sizes) {
    for (const size of Object.values(media.media_details.sizes)) {
      if (size?.source_url && size.width) {
        variants.set(size.source_url, {
          source_url: size.source_url,
          width: size.width,
          height: size.height
        })
      }
    }
  }

  const fullWidth = media.media_details?.width
  if (media.source_url && fullWidth && !variants.has(media.source_url)) {
    variants.set(media.source_url, {
      source_url: media.source_url,
      width: fullWidth,
      height: media.media_details?.height
    })
  }

  return Array.from(variants.values()).sort((a, b) => a.width - b.width)
}

type WpImageProps = {
  media: WpMediaLike
  /** The HTML `sizes` attribute, used together with the generated `srcSet`. */
  sizes?: string
  className?: string
  /** Marks this as an above-the-fold image: eager loading + high fetch priority. */
  priority?: boolean
  /** Overrides `media.alt_text`/`media.alt`. */
  alt?: string
}

/**
 * Renders a WP media object as a plain `<img>` with a `srcset` built from its
 * `media_details.sizes`. No `next/image` — WP already generates the size
 * variants we need, and there's no image transformation service in front of
 * this app (see MIGRATION_PLAN.md).
 */
export function WpImage({ media, sizes = '100vw', className, priority, alt }: WpImageProps) {
  const variants = buildSrcSet(media)
  const largest = variants[variants.length - 1]
  const src = largest?.source_url ?? media.source_url
  const width = largest?.width ?? media.media_details?.width
  const height = largest?.height ?? media.media_details?.height

  return (
    <img
      src={src}
      srcSet={variants.length > 1 ? variants.map((v) => `${v.source_url} ${v.width}w`).join(', ') : undefined}
      sizes={variants.length > 1 ? sizes : undefined}
      width={width}
      height={height}
      alt={alt ?? media.alt_text ?? media.alt ?? ''}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={className}
    />
  )
}
