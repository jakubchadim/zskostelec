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
      if (!entity.acf) {
        return entity
      }

      const galleryNode = entity.acf.gallery___NODE
      const previewNode = entity.acf.preview___NODE || galleryNode?.[0]

      const acf = {
        ...entity.acf,
        preview___NODE: previewNode || null,
        gallery___NODE: galleryNode || null
      }

      delete acf.preview
      delete acf.gallery

      return {
        ...entity,
        acf
      }
    }

    return entity
  })
}

export default normalizer
