import { graphql, useStaticQuery } from 'gatsby'

type RawNavItem = {
  title: string
  url: string
  target: string
  object_slug: string
  wordpress_parent: number
  wordpress_id: number
}

type NavMainData = {
  wordpressWpApiMenusMenusItems: {
    items: RawNavItem[]
  }
}

export type NavItem = {
  title: string
  url: string
  target: string
  slug: string
  items: NavItem[]
}

type TransformedNavData = {
  items: NavItem[]
}

const query = graphql`
  query layoutQuery {
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

export function parseNavItems(
  rawNavItems: RawNavItem[],
  parentId: number
): NavItem[] {
  return rawNavItems
    .filter((rawItem) => rawItem.wordpress_parent === parentId)
    .map((rawItem) => {
      return {
        title: rawItem.title,
        url: rawItem.url,
        target: rawItem.target,
        slug: rawItem.object_slug,
        items: parseNavItems(rawNavItems, rawItem.wordpress_id)
      }
    })
}

export function useNavMainQuery(): TransformedNavData {
  const data: NavMainData = useStaticQuery(query)

  return {
    items: parseNavItems(data.wordpressWpApiMenusMenusItems.items, 0)
  }
}
