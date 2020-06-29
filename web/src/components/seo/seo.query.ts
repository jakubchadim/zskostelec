import { graphql, useStaticQuery } from 'gatsby'

type SEOData = {
  site: {
    siteMetadata: {
      title: string
      description: string
    }
  }
  wordpressSiteMetadata: {
    name: string
    description: string
  }
}

const query = graphql`
  query seoQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
    wordpressSiteMetadata {
      name
      description
    }
  }
`

export function useSEOQuery(): SEOData {
  return useStaticQuery(query)
}
