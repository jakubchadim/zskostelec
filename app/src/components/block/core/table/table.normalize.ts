import { JSDOM } from 'jsdom'
import { fromJson, toJson, type NormalizeFunc, type RawHTML } from '@/lib/wp'

type ParsedTableAttrs = {
  className?: string
}

/**
 * Ported verbatim from `web/src/components/block/core/table/table.normalize.ts`.
 *
 * NOTE (flagged, not fixed - faithful port): `stripes` reads
 * `attrs.className?.indexOf('is-style-stripes') !== -1` from the block's
 * JSON `attrs`, not from the rendered HTML's classList the way
 * `hasFixedLayout` does two lines below. When `attrs.className` is
 * `undefined` (no custom class on the block), `undefined?.indexOf(...)`
 * short-circuits to `undefined`, and `undefined !== -1` is `true` - so a
 * plain table with no `className` at all evaluates to `stripes: true`.
 * This looks like a pre-existing legacy bug (a copy/paste that should
 * probably read the table's own classList, like `hasFixedLayout` does),
 * ported unchanged to match current site behavior exactly. Flagging for a
 * separate fix-or-keep decision rather than silently changing behavior
 * during the migration.
 */
export const blockCoreTableNormalize: NormalizeFunc = (rawBlock) => {
  if (!rawBlock.content) {
    return null
  }

  const content = JSDOM.fragment(rawBlock.content)
  const table = content.querySelector('table')
  const attrs = fromJson<ParsedTableAttrs>(rawBlock.attrs) ?? {}

  if (!table?.innerHTML) {
    return null
  }

  const hasFixedLayout = table.classList.contains('has-fixed-layout')
  table.className = ''

  return {
    ...rawBlock,
    content: table.outerHTML as RawHTML,
    attrs: toJson({
      ...attrs,
      hasFixedLayout,
      stripes: attrs.className?.indexOf('is-style-stripes') !== -1,
      fig: content.querySelector('table + figcaption')?.innerHTML
    })
  }
}
