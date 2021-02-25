import { NormalizerFc } from '../../utils/normalizer'

type InputEntity = {
  acf?: {
    gallery?: {
      wordpress_id: number
    }[]
    link?: string
    file___NODE?: string
  }
  content?: string
  wordpress_id: number
  id: string
  __type: string
}

const normalizer: NormalizerFc<InputEntity> = ({ entities }) => {
  return entities.map((entity) => {
    if (entity.__type === 'wordpress__POST') {
      let normalized: any = entity

      if (entity?.acf) {
        const { gallery, link, file___NODE: fileId } = entity.acf
        if (gallery) {
          const galleries = gallery.map((galleryPage) => {
            const gallery = entities.find(
              (e) => e.wordpress_id === galleryPage.wordpress_id
            )

            return gallery
          })

          normalized = {
            ...normalized,
            galleries
          }
        }

        if (link) {
          normalized = {
            ...normalized,
            acf: {
              ...entity.acf,
              link: link.replace(
                `${process.env.ADMIN_PROTOCOL}://${process.env.ADMIN_URL}`,
                ''
              )
            }
          }
        }

        if (!entity.content) {

          if (link) {
            normalized.link = normalized.acf.link
          } else if (fileId) {
            const file: any = entities.find((e) => e.id === fileId)

            if (file) {
              normalized.link = file.source_url
            }
          }
        }
      }

      return normalized
    }

    return entity
  })
}

export default normalizer
