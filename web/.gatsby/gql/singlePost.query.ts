import { ID } from '../../src/types'
import { QueryResult } from './utils'

type SinglePostData = {
  wordpressPost: {
    id: ID
    date: string
    title: string
    excerpt: string
    link: string
  }
}

export const singlePostQuery = (id: string) => `
  {
    wordpressPost(status: {eq: "publish"}, wordpress_id: {eq: ${id}}) {
      id
      date(formatString: "DD.MM. YYYY")
      title
      excerpt
      link
    }
  }
`

export type SinglePostQuery = QueryResult<SinglePostData>


