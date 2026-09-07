import { wpFetch, WP_CACHE_TAGS } from '../client'
import { getUrlRewriteConfig } from '../env'
import { rewriteAdminUrls } from '../blocks/urls'

/** The legacy Gatsby-era menu slugs, kept for callers migrating web/src/components/nav/*.query.tsx. */
export const LEGACY_MENU_SLUGS = {
  main: 'top-menu',
  fastFirst: 'fast-menu-1',
  fastSecond: 'fast-menu-2'
} as const

type RawWpMenuListEntry = { ID?: number; id?: number; slug: string }

type RawWpMenuItem = {
  ID?: number
  id?: number
  title: string
  url: string
  target?: string
  object_slug?: string
  parent?: number
  wordpress_parent?: number
  children?: RawWpMenuItem[]
}

type RawWpMenuDetail = { items: RawWpMenuItem[] }

export type WpMenuItem = {
  title: string
  url: string
  target: string
  slug: string
  items: WpMenuItem[]
}

export type WpMenu = {
  slug: string
  items: WpMenuItem[]
}

type FlatItem = { id: number; parentId: number; title: string; url: string; target: string; slug: string }

function flattenRawItems(items: RawWpMenuItem[]): FlatItem[] {
  return items.flatMap((item) => {
    const flat: FlatItem = {
      id: item.ID ?? item.id ?? 0,
      parentId: item.parent ?? item.wordpress_parent ?? 0,
      title: item.title,
      url: item.url,
      target: item.target ?? '',
      slug: item.object_slug ?? ''
    }

    return item.children?.length ? [flat, ...flattenRawItems(item.children)] : [flat]
  })
}

function buildTree(flatItems: FlatItem[], parentId: number): WpMenuItem[] {
  return flatItems
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      title: item.title,
      url: item.url,
      target: item.target,
      slug: item.slug,
      items: buildTree(flatItems, item.id)
    }))
}

/**
 * Handles both a flat `wp-api-menus` response (items carrying `parent`)
 * and a nested one (items carrying `children`) - flattening an
 * already-flat list is a no-op, so this is safe either way. The raw shape
 * this plugin actually returns wasn't confirmed against a live host (see
 * T1 plan risk #3); this defensiveness covers both possibilities.
 */
export function normalizeMenuTree(items: RawWpMenuItem[]): WpMenuItem[] {
  return buildTree(flattenRawItems(items), 0)
}

export async function getMenuBySlug(slug: string): Promise<WpMenu | null> {
  const menus = await wpFetch<RawWpMenuListEntry[]>('wp-api-menus/v2/menus', {
    tags: [WP_CACHE_TAGS.menus]
  })

  const found = menus.find((menu) => menu.slug === slug)

  if (!found) {
    return null
  }

  const menuId = found.ID ?? found.id
  const detail = await wpFetch<RawWpMenuDetail>(`wp-api-menus/v2/menus/${menuId}`, {
    tags: [WP_CACHE_TAGS.menus, `menu-${slug}`]
  })

  // wp-api-menus returns absolute admin-origin URLs for every internal menu
  // item (confirmed against live data), not the site-relative paths every
  // other entity's `link` field already gets via `rewriteAdminUrls` - left
  // unrewritten, `NavLink`'s `isExternalLink` (`url.startsWith('http')`)
  // misclassifies every internal item as external and links straight to the
  // API-only WP backend instead of routing within this app.
  const items = rewriteAdminUrls(detail.items, getUrlRewriteConfig())

  return { slug, items: normalizeMenuTree(items) }
}
