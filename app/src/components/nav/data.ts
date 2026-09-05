import { getMenuBySlug, LEGACY_MENU_SLUGS } from '@/lib/wp'
import type { NavItem, NavMenus } from './types'

/** A menu fetch failing (WP unreachable, menu deleted, etc.) degrades to an
 * empty menu rather than throwing - every route renders `<Header>`/
 * `<Footer>` via `app/src/app/layout.tsx`, so one bad menu can't take down
 * the whole site shell. `getMenuBySlug` throws (not `wpFetchOrNull`) on
 * both its list-lookup and detail-lookup requests, so this is what makes
 * "WP unreachable -> empty menus, no crash" actually true. */
async function safeMenu(slug: string): Promise<NavItem[]> {
  try {
    const menu = await getMenuBySlug(slug)
    return menu?.items ?? []
  } catch (error) {
    console.warn(`[nav] failed to fetch menu "${slug}":`, error)
    return []
  }
}

/**
 * Real nav data, replacing the Wave-1 stub. Menu slugs are the legacy
 * `wp-api-menus` ones (`LEGACY_MENU_SLUGS` in `lib/wp/entities/menu.ts`),
 * verified against `web/src/components/nav/{main,fastFirst,fastSecond}.query.tsx`
 * (`top-menu`, `fast-menu-1`, `fast-menu-2`) and `admin/theme/inc/menu.php`.
 */
export async function getNavData(): Promise<NavMenus> {
  const [main, fastFirst, fastSecond] = await Promise.all(
    [LEGACY_MENU_SLUGS.main, LEGACY_MENU_SLUGS.fastFirst, LEGACY_MENU_SLUGS.fastSecond].map(safeMenu)
  )

  return { main, fastFirst, fastSecond }
}
