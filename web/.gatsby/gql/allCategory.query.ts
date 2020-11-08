import { ID } from '../../src/types'
import {gql, QueryResult} from './utils'

type AllCategoryData = {
  allWordpressCategory: {
    edges: {
      node: {
        id: ID
        link: string
        name: string
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
                    name
                }
            }
        }
    }
`

export type AllCategoryQuery = QueryResult<AllCategoryData>


