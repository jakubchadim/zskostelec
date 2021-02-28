import { v4 } from 'uuid'
import { JSDOM } from 'jsdom'
import { ID, Json, Nullable, RawHTML } from '../../types'
import { NormalizerFc } from '../../utils/normalizer'
import { BlockType } from './constants'
import { blockCoreFileNormalize } from './core/file/file.normalize'
import { blockCoreGroupNormalize } from './core/group/group.normalize'
import { blockCoreImageNormalize } from './core/image/image.normalize'
import { blockCoreTableNormalize } from './core/table/table.normalize'
import { NormalizeFunc, RawBlock, TransformedBlock } from './types'
import { blockCoreButtonNormalize } from './core/button/button.normalize'

const normalizeByType: Partial<{ [type in BlockType]: NormalizeFunc }> = {
  [BlockType.CORE_GROUP]: blockCoreGroupNormalize,
  [BlockType.CORE_BUTTON]: blockCoreButtonNormalize,
  [BlockType.CORE_FILE]: blockCoreFileNormalize,
  [BlockType.CORE_IMAGE]: blockCoreImageNormalize,
  [BlockType.CORE_TABLE]: blockCoreTableNormalize
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

type SearchAndReplace = {
  sourceUrl: string
  replacementUrl: string
}

const blockLinkNormalize: (
  rawBlock: TransformedBlock,
  search?: SearchAndReplace
) => TransformedBlock | null = (rawBlock, search) => {
  if (!rawBlock.content || !search) {
    return null
  }

  const content = JSDOM.fragment(rawBlock.content)

  content.querySelectorAll('a').forEach((link) => {
    const href = link.attributes.getNamedItem('href')

    if (
      href &&
      href.value.slice(-1) === '/' &&
      href.value.indexOf(search.sourceUrl) !== -1
    ) {
      href.value = href.value.replace(search.sourceUrl, search.replacementUrl)
    }
  })

  let newContent = ''

  for (let i = 0; i < content.children.length; i++) {
    newContent += content.children[i].outerHTML
  }

  return {
    ...rawBlock,
    content: <RawHTML>newContent
  }
}

function normalizeBlocks(
  rawBlocks?: TransformedBlock[],
  search?: SearchAndReplace
): TransformedBlock[] {
  return <TransformedBlock[]>(rawBlocks || [])
    .map((rawBlock) => {
      const updated = blockLinkNormalize(rawBlock, search) || rawBlock
      const normalize = rawBlock.type && normalizeByType[rawBlock.type]

      return normalize ? normalize(updated) : updated
    })
    .filter((rawBlock) => rawBlock != null)
}

const normalizer: (search: SearchAndReplace) => NormalizerFc<InputEntity> = (
  search
) => ({ entities }) => {
  return entities.map((entity) => {
    if (
      entity.__type === 'wordpress__POST' ||
      entity.__type === 'wordpress__PAGE'
    ) {
      return {
        ...entity,
        blocks: normalizeBlocks(transformBlocks(entity.blocks, null), search)
      }
    }

    return entity
  })
}

export default normalizer
