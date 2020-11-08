import { ID } from '../../src/types'
import {gql, QueryResult} from './utils'

type AllPageData = {
  allWordpressPage: {
    edges: {
      node: {
        id: ID
        slug: string
        status: any
        template: string
        link: string
      }
    }[]
  }
}

export const allPageQuery = gql`
    {
        allWordpressPage {
            edges {
                node {
                    id
                    slug
                    status
                    template
                    link
                }
            }
        }
    }
`

export type AllPageQuery = QueryResult<AllPageData>
