import { NAV_MENUS } from './menu'
import type { NavMenus } from './types'

/**
 * Site menus. They live in code now (`./menu.ts`) instead of WP's
 * `wp-api-menus`; kept async so callers (layout, home template) don't
 * change if the source moves again.
 */
export async function getNavData(): Promise<NavMenus> {
  return NAV_MENUS
}
