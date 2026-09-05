// TODO: replace with lib/wp types (T1) once the WP REST data layer lands.
// These mirror the shape gatsby-source-wordpress exposed for the
// wp-api-menus v2 plugin (see web/src/components/nav/utils.ts), which is the
// closest available reference for what `/wp-json/wp-api-menus/v2/menus`
// returns. Reconcile field names against T1's real types once it lands.

/** A single flat menu item as returned by the WP menus REST endpoint. */
export type WpMenuItem = {
  id: number
  parentId: number
  title: string
  url: string
  target?: string
  slug?: string
}

/** A menu item after a flat `WpMenuItem[]` has been assembled into a tree. */
export type NavItem = {
  title: string
  url: string
  target?: string
  slug?: string
  items: NavItem[]
}

export type NavMenus = {
  main: NavItem[]
  fastFirst: NavItem[]
  fastSecond: NavItem[]
}
