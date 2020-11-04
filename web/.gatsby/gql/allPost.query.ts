import { ID } from '../../src/types'
import {gql, QueryResult} from './utils'

type AllPostData = {
  allWordpressPost: {
    edges: {
      node: {
        id: ID
        slug: string
        status: string
        link: string
        categories: {
          id: ID
        }[]
      }
    }[]
  }
}

export const allPostQuery = gql`
    {
        allWordpressPost {
            edges {
                node {
                    id
                    title
                    slug
                    link
                    categories {
                        id
                    }
                }
            }
        }
    }
`

export type AllPostQuery = QueryResult<AllPostData>


