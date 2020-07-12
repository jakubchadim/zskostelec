import { NormalizeFunc } from '../../types'

export const blockCoreButtonNormalize: NormalizeFunc = (rawBlock) => {
  return {
    ...rawBlock,
    content: null
  }
}
