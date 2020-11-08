import { ID } from '../../src/types'
import { QueryResult } from './utils'

type FilteredPostData = {
  allWordpressPost: {
    edges: {
      node: {
        id: ID
        date: string
        title: string
        excerpt: string
        link: string
      }
    }[]
  }
}

export const filteredPostQuery = (categoryId: ID, limit: number = 3) => `
  {
    allWordpressPost (filter: {status: {eq: "publish"}, categories: {elemMatch: {id: {eq: "${categoryId}"}}}}, limit: ${limit}) {
      edges {
        node {
          id
          date(formatString: "DD.MM. YYYY")
          title
          excerpt
          link
        }
      }
    }
  }
`

export type FilteredPostQuery = QueryResult<FilteredPostData>


