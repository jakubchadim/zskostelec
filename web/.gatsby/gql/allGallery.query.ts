import {gql, QueryResult} from './utils'

type AllGalleryData = {
  allWordpressWpGallery: {
    edges: {
      node: {
        id: string
        slug: string
        status: any
        link: string
      }
    }[]
  }
}

export const allGalleryQuery = gql`
    {
        allWordpressWpGallery (filter: { acf: { preview: { link: { ne: null } } } }) {
            edges {
                node {
                    id
                    title
                    slug
                    link
                }
            }
        }
    }
`

export type AllGalleryQuery = QueryResult<AllGalleryData>


