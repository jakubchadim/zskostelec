import { graphql, useStaticQuery } from 'gatsby'
import { NavData, transformNavData } from './utils'

const query = graphql`
  query topMenuQuery {
    wordpressWpApiMenusMenusItems(slug: { eq: "top-menu" }) {
      items {
        title
        url
        target
        object_slug
        wordpress_parent
        wordpress_id
      }
    }
  }
`

export function useNavMainQuery() {
  const data: NavData = useStaticQuery(query)

  return transformNavData(data)
}
