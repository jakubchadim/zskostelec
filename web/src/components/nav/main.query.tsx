import { graphql, useStaticQuery } from 'gatsby'

type NavMainData = {
  wordpressWpApiMenusMenusItems: {
    items: {
      title: string
      url: string
      target: string
      object_slug: string
      wordpress_children: {
        title: string
        url: string
        target: string
      }[]
    }[]
  }
}

const query = graphql`
  query layoutQuery {
    wordpressWpApiMenusMenusItems(slug: {eq: "top-menu"}) {
      items {
        title
        url
        target
        object_slug
        wordpress_children {
          url
          target
          title
        }
      }
    }
  }
`

export function useNavMainQuery (): NavMainData {
  return useStaticQuery(query)
}
