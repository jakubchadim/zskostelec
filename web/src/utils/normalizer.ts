type CommonEntity = { __type: string }
export type NormalizerFc<
  IEntity extends CommonEntity,
  OEntity extends CommonEntity = any
> = (data: { entities: IEntity[] }) => OEntity[]

export function composeNormalizers(
  ...normalizers: NormalizerFc<any>[]
): NormalizerFc<any> {
  return (data) => {
    return normalizers.reduce(
      (entities, normalizer) => normalizer({ entities }),
      data.entities
    )
  }
}

type AcfInputEntity = {
  acf?: Record<string, unknown>
  __type: string
}

export function getAcfImageNormalizer(
  type: string,
  fieldName: string
): NormalizerFc<AcfInputEntity> {
  return ({ entities }) => {
    return entities.map((entity) => {
      if (entity.__type === type) {
        if (!entity.acf) {
          return entity
        }

        const nodeFieldName = `${fieldName}___NODE`

        if (entity.acf[nodeFieldName] != null) {
          return entity
        }

        const item = {
          ...entity,
          acf: {
            ...entity.acf,
            [nodeFieldName]: null
          }
        }

        delete item.acf[fieldName]

        return item
      }

      return entity
    })
  }
}
