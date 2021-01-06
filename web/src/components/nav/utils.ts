export function isExternalLink(url?: string, target?: string): boolean {
  return (url && url.startsWith('http')) || target === '_blank'
}

type RawNavItem = {
  title: string
  url: string
  target: string
  object_slug: string
  wordpress_parent: number
  wordpress_id: number
}

export type NavData = {
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

export function transformNavData(data: NavData): TransformedNavData {
  return {
    items: parseNavItems(data.wordpressWpApiMenusMenusItems.items, 0)
  }
}
