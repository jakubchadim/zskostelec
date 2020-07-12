import { BlockType } from './constants'
import { blockCoreGroupNormalize } from './core/group/group.normalize'
import { NormalizeFunc, RawBlock } from './types'
import { blockCoreButtonNormalize } from './core/button/button.normalize'

const normalizeByType: Partial<{ [type in BlockType]: NormalizeFunc }> = {
  [BlockType.CORE_GROUP]: blockCoreGroupNormalize,
  [BlockType.CORE_BUTTON]: blockCoreButtonNormalize
}

type Entity = {
  blocks: RawBlock[]
  __type: string
}

function normalizeBlocks(rawBlocks?: RawBlock[]) {
  return (rawBlocks || [])
    .map((rawBlock) => {
      const normalize = rawBlock.type && normalizeByType[rawBlock.type]

      return normalize ? normalize(rawBlock) : rawBlock
    })
    .filter((rawBlock) => rawBlock != null)
}

function normalizer({ entities }: { entities: Entity[] }) {
  return entities.map((entity) => {
    if (
      entity.__type === 'wordpress__POST' ||
      entity.__type === 'wordpress__PAGE'
    ) {
      return {
        ...entity,
        blocks: normalizeBlocks(entity.blocks)
      }
    }

    return entity
  })
}

export default normalizer
