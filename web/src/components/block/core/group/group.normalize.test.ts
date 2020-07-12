import { blockCoreGroupNormalize } from './group.normalize'

const rawBlock: any = {
  blockId: 'foo',
  parentId: null,
  type: 'core/group',
  content: '<div>Some html content</div>',
  attrs: JSON.stringify({ backgroundColor: 'white', textColor: 'black' }),
  blocks: []
}

describe('Normalize', () => {
  it('blockCoreGroupNormalize', () => {
    expect(blockCoreGroupNormalize(rawBlock)).toStrictEqual({
      ...rawBlock,
      content: null
    })
  })
})
