import { describe, expect, it } from 'vitest'
import { toJson } from '@/lib/wp'
import type { TransformedBlock } from '@/lib/wp'
import { blockCoreTableNormalize } from './table.normalize'

function rawBlock(overrides: Partial<TransformedBlock> = {}): TransformedBlock {
  return {
    blockId: 'block-1' as TransformedBlock['blockId'],
    parentId: null,
    type: 'core/table',
    attrs: toJson({}),
    content: '<figure class="wp-block-table"><table class="has-fixed-layout"><tbody><tr><td>a</td></tr></tbody></table></figure>' as TransformedBlock['content'],
    ...overrides
  }
}

describe('blockCoreTableNormalize', () => {
  it('returns null when there is no content', () => {
    expect(blockCoreTableNormalize(rawBlock({ content: null }))).toBeNull()
  })

  it('extracts the <table> outerHTML, stripped of its classList', () => {
    // jsdom leaves an empty `class=""` attribute behind rather than removing
    // it entirely when `className` is set to `''` - matches real JSDOM
    // behavior (and legacy's own `table.className = ''`), not a stray class.
    const result = blockCoreTableNormalize(rawBlock())
    expect(result?.content).toBe('<table class=""><tbody><tr><td>a</td></tr></tbody></table>')
  })

  it('reads hasFixedLayout from the table classList', () => {
    const result = blockCoreTableNormalize(rawBlock())
    expect(JSON.parse(result?.attrs ?? '{}').hasFixedLayout).toBe(true)

    const withoutFixed = rawBlock({
      content: '<figure><table><tbody><tr><td>a</td></tr></tbody></table></figure>' as TransformedBlock['content']
    })
    expect(JSON.parse(blockCoreTableNormalize(withoutFixed)?.attrs ?? '{}').hasFixedLayout).toBe(false)
  })

  it('extracts the trailing figcaption as fig', () => {
    const withCaption = rawBlock({
      content:
        '<figure><table><tbody><tr><td>a</td></tr></tbody></table><figcaption>Caption text</figcaption></figure>' as TransformedBlock['content']
    })
    expect(JSON.parse(blockCoreTableNormalize(withCaption)?.attrs ?? '{}').fig).toBe('Caption text')
  })

  it('returns null when the fragment has no <table>', () => {
    expect(blockCoreTableNormalize(rawBlock({ content: '<figure></figure>' as TransformedBlock['content'] }))).toBeNull()
  })

  it('pins the ported stripes quirk: a table with no className evaluates to stripes: true', () => {
    // See the doc comment on `blockCoreTableNormalize`: `attrs.className?.indexOf(...) !== -1`
    // short-circuits to `undefined !== -1` (true) when `attrs.className` is absent. This is a
    // faithful port of a likely pre-existing legacy bug, not a deliberate default - pinned here
    // so it can't be silently "fixed" (or silently regressed further) without this test failing
    // and forcing an explicit decision.
    const result = blockCoreTableNormalize(rawBlock({ attrs: toJson({}) }))
    expect(JSON.parse(result?.attrs ?? '{}').stripes).toBe(true)

    // A className that plainly doesn't include the stripes style should NOT be striped.
    const withOtherClassName = blockCoreTableNormalize(rawBlock({ attrs: toJson({ className: 'some-other-class' }) }))
    expect(JSON.parse(withOtherClassName?.attrs ?? '{}').stripes).toBe(false)

    // The intended case still works correctly.
    const withStripesClassName = blockCoreTableNormalize(rawBlock({ attrs: toJson({ className: 'is-style-stripes' }) }))
    expect(JSON.parse(withStripesClassName?.attrs ?? '{}').stripes).toBe(true)
  })
})
