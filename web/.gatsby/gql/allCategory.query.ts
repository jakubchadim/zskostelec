import { ID, Nullable } from '../../src/types'
import {gql, QueryResult} from './utils'

type AllCategoryData = {
  allWordpressCategory: {
    edges: {
      node: {
        id: ID
        link: string
        slug: string
        name: string
        parent_element: Nullable<{
          id: ID
        }>
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
                    slug
                    name
                    parent_element {
                        id
                    }
                }
            }
        }
    }
`

export type AllCategoryQuery = QueryResult<AllCategoryData>


