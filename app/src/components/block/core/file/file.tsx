import { Container } from '@/components/ui/container'
import { FileCard } from '@/components/file/file-card'
import type { BlockFC } from '../../types'

type BlockCoreFileAttrs = {
  src?: string
}

/**
 * Ported from `web/src/components/block/core/file/file.tsx`. Legacy folded
 * this through a `File`/`UiFile`/`UiIcon`/`getFileIcon` chain (icon by
 * extension, name, extension badge, download button, wrapped in a white
 * `UiBox`) that another task (documents CPT) already ported in full as
 * `@/components/file/file-card`'s `FileCard` - reused here rather than
 * re-implementing the same icon-mapping/row layout a second time. This is a
 * deliberate cross-task read-only import (not a modification to that
 * directory); flagged in the final report as a coordination point since a
 * `FileCard` prop-signature change there would need a matching update here.
 *
 * `FileCard` itself has no vertical margin, so the legacy `UiBox`'s
 * `offsetTop`/`offsetBottom` (`spacing(2)` = 10px each) is restored here as
 * a `my-2` wrapper - otherwise a file block loses its breathing room
 * against surrounding blocks.
 */
export const BlockCoreFile: BlockFC<BlockCoreFileAttrs> = ({ block, nested }) => {
  if (!block.attrs.src) {
    return null
  }

  const file = (
    <div className="my-2">
      <FileCard name={block.content || 'Soubor'} href={block.attrs.src} />
    </div>
  )

  return nested ? file : <Container>{file}</Container>
}
