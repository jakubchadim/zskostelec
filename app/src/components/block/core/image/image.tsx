import { Container } from '@/components/ui/container'
import { WpImage } from '@/components/image/wp-image'
import { cn } from '@/lib/utils'
import type { Nullable, RawHTML } from '@/lib/wp'
import { Content } from '../../html-content'
import type { BlockFC } from '../../types'

type BlockCoreImageAttrs = {
  src: string
  alt?: string
  fig?: Nullable<RawHTML>
  rounded?: boolean
  width?: number
  align?: string
}

/**
 * Ported from `web/src/components/block/core/image/image.tsx`, rendering
 * via `<WpImage>` (`@/components/image/wp-image`) instead of a bare `<img>`
 * - see the T3 plan's image-block note for why a minimal constructed
 * media-like object is safe here (no real `media_details.sizes` exist for
 * an in-content image parsed out of raw HTML either way, so `WpImage`
 * degrades to the same single-source `<img>` legacy always rendered).
 *
 * `rounded` (`is-style-rounded`) forces full width with `!important` in
 * legacy (`img { width: 100% !important; border-radius: radius.large }`) -
 * ported as Tailwind's `w-full!` important-modifier + `rounded-large`
 * (legacy `radius.large` = 8px, matching this app's existing `rounded-large`
 * token exactly).
 */
export const BlockCoreImage: BlockFC<BlockCoreImageAttrs> = ({ block, nested }) => {
  const { attrs } = block

  const alignClass =
    attrs.align === 'left' ? 'float-left' : attrs.align === 'center' ? 'text-center' : attrs.align === 'right' ? 'float-right' : undefined

  const media = {
    source_url: attrs.src,
    alt_text: attrs.alt,
    media_details: attrs.width ? { width: attrs.width } : undefined
  }

  const image = (
    <div className={cn('max-w-full', alignClass)} style={attrs.width ? { width: `${attrs.width}px` } : undefined}>
      <div className="inline-block">
        <WpImage media={media} className={cn('max-w-full', attrs.rounded && 'w-full! rounded-large')} />
        {attrs.fig != null && (
          <figcaption className="text-center text-[12px] text-gray-6">
            <Content content={attrs.fig} />
          </figcaption>
        )}
      </div>
    </div>
  )

  return nested ? image : <Container>{image}</Container>
}
