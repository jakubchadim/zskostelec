import { BlockType } from './constants'
import BlockCoreButton from './core/button'
import BlockCoreGroup from './core/group/group'
import { BlockFC } from './types'

export const componentByType: Partial<{ [type in BlockType]: BlockFC }> = {
  [BlockType.CORE_BUTTON]: BlockCoreButton,
  [BlockType.CORE_GROUP]: BlockCoreGroup
}
