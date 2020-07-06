import { NormalizeFunc } from '../../types'

export const blockCoreGroupNormalize: NormalizeFunc = (rawBlock) => {
  return {
    ...rawBlock,
    content: null
  }
}
