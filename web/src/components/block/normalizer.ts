import { v4 } from 'uuid'
import { ID, Json, Nullable, RawHTML } from '../../types'
import { NormalizerFc } from '../../utils/normalizer'
import { BlockType } from './constants'
import { blockCoreGroupNormalize } from './core/group/group.normalize'
import { NormalizeFunc, RawBlock, TransformedBlock } from './types'
import { blockCoreButtonNormalize } from './core/button/button.normalize'

const normalizeByType: Partial<{ [type in BlockType]: NormalizeFunc }> = {
  [BlockType.CORE_GROUP]: blockCoreGroupNormalize,
  [BlockType.CORE_BUTTON]: blockCoreButtonNormalize
}

type InputEntity = {
  blocks: RawBlock[]
  __type: string
}

export function transformBlocks(
  blocks: RawBlock[],
  parentId: Nullable<ID>
): TransformedBlock[] {
  const transformedBlocks: TransformedBlock[] = []

  blocks.forEach((block) => {
    const blockResult: TransformedBlock = {
      blockId: <ID>v4(),
      parentId,
      type: block.blockName,
      attrs: <Json>JSON.stringify(block.attrs),
      content: <Nullable<RawHTML>>(
        (block.innerHTML || '').replace(/(\r\n|\n|\r)/gm, '').trim()
      )
    }

    if (block.innerBlocks && block.innerBlocks.length > 0) {
      transformedBlocks.push(
        ...transformBlocks(block.innerBlocks, blockResult.blockId)
      )
    }

    if (blockResult.type != null || blockResult.content !== '') {
      transformedBlocks.push(blockResult)
    }
  })

  return transformedBlocks
}

function normalizeBlocks(rawBlocks?: TransformedBlock[]): TransformedBlock[] {
  return <TransformedBlock[]>(rawBlocks || [])
    .map((rawBlock) => {
      const normalize = rawBlock.type && normalizeByType[rawBlock.type]

      return normalize ? normalize(rawBlock) : rawBlock
    })
    .filter((rawBlock) => rawBlock != null)
}

const normalizer: NormalizerFc<InputEntity> = ({ entities }) => {
  return entities.map((entity) => {
    if (
      entity.__type === 'wordpress__POST' ||
      entity.__type === 'wordpress__PAGE'
    ) {
      return {
        ...entity,
        blocks: normalizeBlocks(transformBlocks(entity.blocks, null))
      }
    }

    return entity
  })
}

export default normalizer
