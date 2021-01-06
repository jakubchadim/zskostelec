import { NormalizerFc } from '../../utils/normalizer'

type InputEntity = {
  acf?: {
    mainPost?: {
      wordpress_id: string
    }
  }
  template: string
  __type: string
}

const normalizer: NormalizerFc<InputEntity> = ({ entities }) => {
  return entities.map((entity) => {
    if (
      entity.__type === 'wordpress__PAGE' &&
      entity.template === 'page-home.php'
    ) {
      return {
        ...entity,
        acf: {
          ...(entity?.acf || {}),
          mainPost: entity?.acf?.mainPost?.wordpress_id || null
        }
      }
    }

    return entity
  })
}

export default normalizer
