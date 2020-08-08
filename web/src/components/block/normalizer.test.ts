import { transformBlocks } from './normalizer'
import { RawBlock } from './types'

describe('Block', () => {
  describe('Normalizer', () => {
    describe('transformBlocks', () => {
      const paragraphBlock: RawBlock = <any>{
        blockName: 'core/paragraph',
        attrs: [],
        innerBlocks: [],
        innerHTML: '\n<p>test</p>\n',
        innerContent: ['\n<p>test</p>\n']
      }
      const transformedParagraphBlock = transformBlocks(
        [paragraphBlock],
        null
      )[0]

      it('type', () => {
        expect(transformedParagraphBlock.type).toBe(paragraphBlock.blockName)
      })
      it('attrs', () => {
        expect(transformedParagraphBlock.attrs).toBe(
          JSON.stringify(paragraphBlock.attrs)
        )
      })
      it('content', () => {
        expect(transformedParagraphBlock.content).toBe('<p>test</p>')
      })
      it('parentId', () => {
        const nestedBlock = {
          ...paragraphBlock,
          innerBlocks: [paragraphBlock]
        }

        const transformedNestedBlocks = transformBlocks([nestedBlock], null)

        expect(transformedNestedBlocks.length).toBe(2)
        const parentBlock = transformedNestedBlocks.find(
          (b) => b.parentId === null
        )
        const childBlock = transformedNestedBlocks.find(
          (b) => b.parentId === parentBlock?.blockId
        )
        expect(parentBlock?.parentId).toBe(null)
        expect(childBlock?.parentId).toBe(parentBlock?.blockId)
      })
      it('empty', () => {
        const emptyBlock: RawBlock = <any>{
          blockName: null,
          attrs: [],
          innerBlocks: [],
          innerHTML: '',
          innerContent: ['']
        }

        expect(transformBlocks([emptyBlock], null).length).toBe(0)
      })
    })
  })
})
