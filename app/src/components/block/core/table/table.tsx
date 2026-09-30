import { BlockContainer as Container } from '../../block-container'
import { cn } from '@/lib/utils'
import type { Nullable, RawHTML } from '@/lib/wp'
import { Content } from '../../html-content'
import type { BlockFC } from '../../types'

type BlockCoreTableAttrs = {
  hasFixedLayout?: boolean
  stripes?: boolean
  fig?: Nullable<RawHTML>
}

/**
 * Gutenberg table inside an outlined sticker card (horizontal scroll on
 * narrow screens). Cell/stripe rules that need descendant selectors live in
 * `../../blocks.css` under the `block-table*` classes applied here.
 */
export const BlockCoreTable: BlockFC<BlockCoreTableAttrs> = ({ block, nested }) => {
  const table = (
    <div className="max-w-full">
      <div className="my-6 overflow-hidden rounded-[1.25rem] border-[2.5px] border-ink bg-paper text-ink shadow-pop">
        <figure
          className={cn(
            'block-table m-0 overflow-x-auto',
            block.attrs.stripes && 'block-table--stripes',
            block.attrs.hasFixedLayout && 'block-table--fixed'
          )}
        >
          <Content content={block.content} />
          {block.attrs.fig != null && (
            <figcaption className="border-t-2 border-ink/10 p-3 text-center text-sm text-gray-7">
              <Content content={block.attrs.fig} />
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  )

  return nested ? table : <Container>{table}</Container>
}
