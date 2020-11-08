export function gql (query: TemplateStringsArray): string {
  return query.toString()
}

export type QueryResult<T> = {
  errors: string[]
  data: T
}

export function extractNodes <T> (queryData: {edges: {node: T}[]}): T[] {
  return queryData.edges.map(({node}) => node)
}
