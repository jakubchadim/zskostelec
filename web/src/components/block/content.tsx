import React from 'react'
import UiSection from '../ui/section/section'
import BlockList from './list'
import { Block } from './types'
import { getBlockSections } from './utils'

type BlockListProps = {
  blocks?: Block[]
  title?: React.ReactNode
}

const BlockContent: React.FC<BlockListProps> = ({ blocks, title }) => {
  if (!blocks || !blocks.length) {
    return null
  }

  const sections = getBlockSections(blocks)

  return (
    <>
      {sections.map((section, sectionIdx) => (
        <UiSection
          key={sectionIdx}
          backgroundColor={section.backgroundColor}
          textColor={section.textColor}
        >
          {sectionIdx === 0 && title}
          <BlockList blocks={section.blocks} />
        </UiSection>
      ))}
    </>
  )
}

export default React.memo(BlockContent)
