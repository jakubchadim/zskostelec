import { Container } from '@/components/ui/container'
import { Content } from '../../html-content'
import type { BlockFC } from '../../types'

/**
 * Ported from `web/src/components/block/core/list/list.tsx`. The nested
 * bullet-color rules (`ul > li:before`, two/three levels deep) are 3-level
 * HTML-authored descendant selectors Tailwind utilities can't express -
 * they live in `../../blocks.css` scoped under the `wp-block-list` class
 * applied here.
 */
export const BlockCoreList: BlockFC = ({ block, nested }) => {
  const list = (
    <div className="wp-block-list">
      <Content content={block.content} />
    </div>
  )

  return nested ? list : <Container>{list}</Container>
}
