import { graphql, useStaticQuery } from 'gatsby'
import { FluidObject } from 'gatsby-image'
import { Nullable } from '../../types'

type ImagePostData = {
  allWordpressWpMedia: {
    edges: {
      node: {
        source_url: string
        localFile: {
          publicURL: string
          childImageSharp: Nullable<{
            fluid: FluidObject
          }>
        }
      }
    }[]
  }
}

const query = graphql`
  query allWordpressWpMedia {
    allWordpressWpMedia {
      edges {
        node {
          source_url
          localFile {
            publicURL
            childImageSharp {
              fluid(maxWidth: 800) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`

export function useImagePostQuery(): ImagePostData {
  return useStaticQuery(query)
}
