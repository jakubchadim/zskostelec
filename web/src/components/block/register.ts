import { BlockType } from './constants'
import BlockCoreButton from './core/button/button'
import BlockCoreButtonGroup from './core/button/group'
import BlockCoreFile from './core/file/file'
import BlockCoreGroup from './core/group/group'
import BlockCoreList from './core/list/list'
import BlockCoreParagraph from './core/paragraph/paragraph'
import BlockCoreQuote from './core/quote/paragraph'
import { BlockFC } from './types'

export const componentByType: Partial<{ [type in BlockType]: BlockFC }> = {
  [BlockType.CORE_BUTTON]: BlockCoreButton,
  [BlockType.CORE_BUTTONS]: BlockCoreButtonGroup,
  [BlockType.CORE_GROUP]: BlockCoreGroup,
  [BlockType.CORE_LIST]: BlockCoreList,
  [BlockType.CORE_PARAGRAPH]: BlockCoreParagraph,
  [BlockType.CORE_QUOTE]: BlockCoreQuote,
  [BlockType.CORE_FILE]: BlockCoreFile
}
