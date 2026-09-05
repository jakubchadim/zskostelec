import { describe, expect, it } from 'vitest'
import { toJson, type TransformedBlock } from '@/lib/wp'
import { blockCoreButtonNormalize } from './button.normalize'

const rawBlock: TransformedBlock = {
  blockId: '5f0ebc4b77b94' as TransformedBlock['blockId'],
  parentId: null,
  type: 'core/button',
  content:
    '<div class="wp-block-button"><a class="wp-block-button__link has-text-color has-black-color has-background has-white-background-color" style="border-radius:28px">Test button</a></div>' as TransformedBlock['content'],
  attrs: toJson({ backgroundColor: 'white', textColor: 'black', borderRadius: 28 })
}

const rawBlockHtml: TransformedBlock = {
  ...rawBlock,
  content:
    '<div class="wp-block-button"><a class="wp-block-button__link has-text-color has-black-color has-background has-white-background-color" style="border-radius:28px"><b>Test button</b></a></div>' as TransformedBlock['content']
}

const rawBlockAttrs: TransformedBlock = {
  ...rawBlock,
  content:
    '<div class="wp-block-button"><a class="wp-block-button__link has-text-color has-black-color has-background has-white-background-color" href="http://google.com" target="_blank" rel="noreferrer noopener" style="border-radius:28px">Test button</a></div>' as TransformedBlock['content']
}

const rawBlockAttrsOutline: TransformedBlock = {
  ...rawBlockAttrs,
  attrs: toJson({ className: 'is-style-outline' })
}

// Ported from web/src/components/block/core/button/button.normalize.test.ts.
describe('blockCoreButtonNormalize', () => {
  it('simple text', () => {
    expect(blockCoreButtonNormalize(rawBlock)?.content).toBe('Test button')
  })

  it('inner html', () => {
    expect(blockCoreButtonNormalize(rawBlockHtml)?.content).toBe('<b>Test button</b>')
  })

  it('attrs', () => {
    expect(JSON.parse(blockCoreButtonNormalize(rawBlockAttrs)?.attrs || '{}')).toStrictEqual({
      ...JSON.parse(rawBlockHtml.attrs),
      href: 'http://google.com',
      target: '_blank',
      rel: 'noreferrer noopener',
      type: 'fill'
    })

    expect(JSON.parse(blockCoreButtonNormalize(rawBlockAttrsOutline)?.attrs || '{}').type).toBe('outline')
  })
})
