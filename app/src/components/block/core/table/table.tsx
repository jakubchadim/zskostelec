import { Container } from '@/components/ui/container'
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
 * Ported from `web/src/components/block/core/table/table.tsx`. The
 * white-card wrapper replicates legacy's `UiBox` (background/shadow/radius/
 * offset margins) inline rather than via a shared primitive - see the T3
 * plan (no new `ui/` components are in scope for this task). Cell
 * padding/border rules that need descendant selectors (`td`/`th`, striped
 * `tbody tr:nth-child(odd)`) live in `../../blocks.css` under the
 * `block-table`/`block-table--stripes`/`block-table--fixed` classes applied
 * here - not cleanly expressible as Tailwind utilities.
 *
 * Pixel conversions: `UiBox`'s `spacing(2)` offset margins = 10px = `my-2`;
 * cell padding `spacing(4)` = 20px = `p-4` (both clean 5px-unit multiples,
 * see `blocks.css`); figcaption `1.2rem`/`spacing(2)` = 12px/10px real.
 */
export const BlockCoreTable: BlockFC<BlockCoreTableAttrs> = ({ block, nested }) => {
  const table = (
    <div className="inline-block max-w-full">
      <div className="my-2 rounded-medium bg-white-1 text-black-1 shadow-lift">
        <figure
          className={cn(
            'block-table m-0 overflow-x-auto',
            block.attrs.stripes && 'block-table--stripes',
            block.attrs.hasFixedLayout && 'block-table--fixed'
          )}
        >
          <Content content={block.content} />
          {block.attrs.fig != null && (
            <figcaption className="p-2 text-center text-[12px] text-gray-6">
              <Content content={block.attrs.fig} />
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  )

  return nested ? table : <Container>{table}</Container>
}
