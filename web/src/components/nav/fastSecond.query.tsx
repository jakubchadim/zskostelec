import { graphql, useStaticQuery } from 'gatsby'
import { NavData, transformNavData } from './utils'

const query = graphql`
  query fastMenuSecondQuery {
    wordpressWpApiMenusMenusItems(slug: { eq: "fast-menu-2" }) {
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

export function useNavFastSecondQuery() {
  const data: NavData = useStaticQuery(query)

  return transformNavData(data)
}
