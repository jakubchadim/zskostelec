import { ID, Nullable } from '../../src/types'
import {gql, QueryResult} from './utils'

export type PageInfo = {
  id: ID
  slug: string
  status: any
  template: string
  link: string
  acf: Nullable<{
    displayCategory: Nullable<{
      slug: string
    }[]>
  }>
}


type AllPageData = {
  allWordpressPage: {
    edges: {
      node: PageInfo
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
                    acf {
                        displayCategory {
                            slug
                        }
                    }
                }
            }
        }
    }
`

export type AllPageQuery = QueryResult<AllPageData>
