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
