import { blockCoreButtonNormalize } from './group.normalize'

const rawBlock: any = {
  blockId: 'foo',
  parentId: null,
  type: 'core/buttons',
  content: '<div>Some html content</div>',
  attrs: JSON.stringify({ backgroundColor: 'white', textColor: 'black' }),
  blocks: []
}

describe('Normalize', () => {
  it('blockCoreGroupNormalize', () => {
    expect(blockCoreButtonNormalize(rawBlock)).toStrictEqual({
      ...rawBlock,
      content: null
    })
  })
})
