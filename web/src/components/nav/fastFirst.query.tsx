import { graphql, useStaticQuery } from 'gatsby'
import { NavData, transformNavData } from './utils'

const query = graphql`
  query fastMenuFirstQuery {
    wordpressWpApiMenusMenusItems(slug: { eq: "fast-menu-1" }) {
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

export function useNavFastFirstQuery() {
  const data: NavData = useStaticQuery(query)

  return transformNavData(data)
}
