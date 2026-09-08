import type { ReactNode } from 'react'
import './blocks.css'
import { normalizeBlocks, parseBlocks, type Block, type TransformedBlock } from '@/lib/wp'
import type { BlockColorPalette } from './color/color'
import { BlockList } from './list'
import { registerCoreBlockNormalizers } from './register-normalizers'
import { Section } from './section'
import { getBlockSections } from './utils'

export type BlockContentProps = {
  blocks: TransformedBlock[]
  /** Rendered inside the first section, ahead of its blocks - e.g. the page's `<h1>`. */
  title?: ReactNode
  /** Rendered inside the last section, after its blocks. */
  footer?: ReactNode
}

/**
 * Renders a post/page's Gutenberg body: groups top-level blocks into
 * color-runs (`getBlockSections`) and renders one `<Section>` per run, each
 * walking its blocks via `<BlockList>`. Ported from
 * `web/src/components/block/content.tsx`.
 *
 * IMPORTANT (see the T3 plan's "Architecture finding"): `blocks` here are
 * the entity layer's (`@/lib/wp`'s `getPostBySlug`/`getPageBySlug`/etc.)
 * output - already link-rewritten, but NOT yet per-type-normalized. Those
 * entity fetchers call `normalizeBlocks` at fetch time, before this
 * module's `registerCoreBlockNormalizers()` has ever run, so that call is
 * currently a no-op for per-type logic (button href extraction, image src,
 * table fixed-layout, file href, group content-nulling). This is the pass
 * where per-type normalization actually happens - `normalizeBlocks` is
 * called again here, deliberately with no `search` arg (link rewriting
 * already happened once and doesn't need repeating - re-running it would
 * be a no-op anyway since hrefs are already relative). Any future
 * non-`BlockContent` consumer of raw `post.blocks`/`page.blocks` needs to
 * know per-type normalization hasn't happened yet at that point.
 */
export function BlockContent({ blocks, title, footer }: BlockContentProps) {
  registerCoreBlockNormalizers()

  const normalized = normalizeBlocks(blocks)
  const tree = parseBlocks(normalized) as Block<BlockColorPalette>[]
  const sections = getBlockSections(tree)

  if (!sections.length) {
    return null
  }

  return (
    <>
      {sections.map((section, index) => (
        <Section key={index} backgroundColor={section.backgroundColor} textColor={section.textColor}>
          {index === 0 && title}
          <BlockList blocks={section.blocks} />
          {index === sections.length - 1 && footer}
        </Section>
      ))}
    </>
  )
}
