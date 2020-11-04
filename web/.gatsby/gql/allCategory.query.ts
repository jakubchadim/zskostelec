import {gql, QueryResult} from './utils'

type AllCategoryData = {
  allWordpressCategory: {
    edges: {
      node: {
        id: string
        link: string
      }
    }[]
  }
}

export const allCategoryQuery = gql`
    {
        allWordpressCategory {
            edges {
                node {
                    id
                    link
                }
            }
        }
    }
`

export type AllCategoryQuery = QueryResult<AllCategoryData>


