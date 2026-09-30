import { BlockContainer as Container } from '../../block-container'
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
 * Gutenberg image rendered via `<WpImage>` with an outlined, rounded frame.
 * A minimal media-like object is constructed from the block attrs (an
 * in-content image has no `media_details.sizes`), so `WpImage` degrades to
 * a single-source `<img>`.
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
    <div className={cn('my-6 max-w-full', alignClass, attrs.align === 'left' && 'mr-6', attrs.align === 'right' && 'ml-6')} style={attrs.width ? { width: `${attrs.width}px` } : undefined}>
      <div className="inline-block">
        <WpImage media={media} className={cn('max-w-full rounded-[1.25rem] border-[2.5px] border-ink shadow-pop', attrs.rounded && 'w-full! rounded-[2rem]')} />
        {attrs.fig != null && (
          <figcaption className="mt-2 text-center text-sm text-gray-7 italic">
            <Content content={attrs.fig} />
          </figcaption>
        )}
      </div>
    </div>
  )

  return nested ? image : <Container>{image}</Container>
}
