import { NormalizerFc } from '../../utils/normalizer'

type InputEntity = {
  acf?: {
    preview?: boolean
    preview___NODE?: string
    gallery?: boolean
    gallery___NODE?: string[]
  }
  __type: string
}

const normalizer: NormalizerFc<InputEntity> = ({ entities }) => {
  return entities.map((entity) => {
    if (entity.__type === 'wordpress__wp_gallery') {
      if (entity?.acf?.preview___NODE || !entity?.acf?.gallery___NODE?.length) {
        return entity
      }

      const acf = {
        ...(entity.acf || {}),
        preview___NODE: entity?.acf?.gallery___NODE?.[0]
      }

      delete acf.preview

      return {
        ...entity,
        acf
      }
    }

    return entity
  })
}

export default normalizer
