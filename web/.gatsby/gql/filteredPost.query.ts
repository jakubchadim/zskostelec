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

export const filteredPostQuery = (categorySlug: string, limit: number = 3, exceptWpId?: string) => `
  {
    allWordpressPost (filter: {status: {eq: "publish"}, categories: {elemMatch: {slug: {eq: "${categorySlug}"}}}${exceptWpId == null ? '' : `, wordpress_id: {ne: ${exceptWpId}}`}}, limit: ${limit}) {
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


