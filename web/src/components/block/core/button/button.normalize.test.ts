import { blockCoreButtonNormalize } from './button.normalize'

const rawBlock: any = {
  blockId: '5f0ebc4b77b94',
  parentId: null,
  type: 'core/button',
  content:
    '<div class="wp-block-button"><a class="wp-block-button__link has-text-color has-black-color has-background has-white-background-color" style="border-radius:28px">Test button</a></div>',
  attrs: JSON.stringify({
    backgroundColor: 'white',
    textColor: 'black',
    borderRadius: 28
  }),
  blocks: []
}

const rawBlockHtml: any = {
  ...rawBlock,
  content:
    '<div class="wp-block-button"><a class="wp-block-button__link has-text-color has-black-color has-background has-white-background-color" style="border-radius:28px"><b>Test button</b></a></div>'
}

const rawBlockAttrs: any = {
  ...rawBlock,
  content:
    '<div class="wp-block-button"><a class="wp-block-button__link has-text-color has-black-color has-background has-white-background-color" href="http://google.com" target="_blank" rel="noreferrer noopener" style="border-radius:28px">Test button</a></div>'
}

const rawBlockAttrsOutline: any = {
  ...rawBlockAttrs,
  attrs: JSON.stringify({
    className: 'is-style-outline'
  })
}

describe('Normalize', () => {
  describe('blockCoreButtonNormalize', () => {
    it('simple text', () => {
      expect(blockCoreButtonNormalize(rawBlock)?.content).toBe('Test button')
    })
    it('inner html', () => {
      expect(blockCoreButtonNormalize(rawBlockHtml)?.content).toBe(
        '<b>Test button</b>'
      )
    })
    it('attrs', () => {
      expect(
        JSON.parse(blockCoreButtonNormalize(rawBlockAttrs)?.attrs || '')
      ).toStrictEqual({
        ...JSON.parse(rawBlockHtml.attrs),
        href: 'http://google.com',
        target: '_blank',
        rel: 'noreferrer noopener',
        type: 'fill'
      })

      expect(
        JSON.parse(blockCoreButtonNormalize(rawBlockAttrsOutline)?.attrs || '')
          .type
      ).toBe('outline')
    })
  })
})
