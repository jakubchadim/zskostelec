export function gql (query: TemplateStringsArray): string {
  return query.toString()
}

export type QueryResult<T> = {
  errors: string[]
  data: T
}
