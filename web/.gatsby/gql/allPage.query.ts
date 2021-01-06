import { ID, Nullable } from '../../src/types'
import {gql, QueryResult} from './utils'

export type PageInfo = {
  id: ID
  slug: string
  status: any
  template: string
  link: string
  acf: Nullable<{
    mainCategory: Nullable<{
      slug: string
    }>
    additionalCategoryFirst: Nullable<{
      slug: string
    }>
    additionalCategorySecond: Nullable<{
      slug: string
    }>
    mainPost: Nullable<ID>
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
                        mainCategory {
                            slug
                        }
                        additionalCategoryFirst {
                            slug
                        }
                        additionalCategorySecond {
                            slug
                        }
                        mainPost
                    }
                }
            }
        }
    }
`

export type AllPageQuery = QueryResult<AllPageData>
